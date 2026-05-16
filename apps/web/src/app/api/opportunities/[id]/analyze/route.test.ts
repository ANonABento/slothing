import { beforeEach, describe, expect, it, vi } from "vitest";

const llmMocks = vi.hoisted(() => ({
  complete: vi.fn(),
}));

const aiGateMocks = vi.hoisted(() => ({
  refund: vi.fn(),
  gateOptionalAiFeature: vi.fn(),
}));

vi.mock("@/lib/db/jobs", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db/jobs"),
);

vi.mock("@/lib/db", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db"),
);

vi.mock("@/lib/billing/ai-gate", async () => {
  const { NextResponse } = await import("next/server");
  return {
    gateOptionalAiFeature: aiGateMocks.gateOptionalAiFeature,
    isAiGateResponse: (value: unknown) => value instanceof NextResponse,
  };
});

vi.mock("@/lib/llm/client", () => ({
  LLMClient: class MockLLMClient {
    complete = llmMocks.complete;
  },
  parseJSONFromLLM: vi.fn((value: string) => JSON.parse(value)),
}));

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

import { POST } from "./route";
import { getJob } from "@/lib/db/jobs";
import { getProfile } from "@/lib/db";
import {
  expectRouteResponseContract,
  getRequest,
  invalidJsonRequest,
  invokeRouteHandler,
  jsonRequest,
  representativeBody,
  resetContractMocks,
  routeContext,
  setAuthFailure,
  setAuthSuccess,
} from "@/test/contract";

describe("/api/opportunities/[id]/analyze route contract", () => {
  beforeEach(() => {
    resetContractMocks();
    llmMocks.complete.mockReset();
    aiGateMocks.refund.mockReset();
    aiGateMocks.gateOptionalAiFeature.mockReturnValue({
      allowed: true,
      llmConfig: null,
      plan: "self-host",
      source: "self-host",
      transaction: null,
      refund: aiGateMocks.refund,
    });
  });

  it("invokes the real POST handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/opportunities/item-1/analyze",
        representativeBody(),
        "POST",
        { "x-extension-token": "test-token" },
      ),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("returns the shared auth failure contract", async () => {
    setAuthFailure();

    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/opportunities/item-1/analyze",
        representativeBody(),
        "POST",
        { "x-extension-token": "test-token" },
      ),
      routeContext(),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.any(String),
    });
  });

  it("returns an HTTP error response for malformed mutation input", async () => {
    setAuthSuccess();

    const response = await invokeRouteHandler(
      POST,
      invalidJsonRequest(
        "http://localhost/api/opportunities/item-1/analyze",
        "POST",
      ),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("does not leak raw error messages on 500", async () => {
    const probe = "INTERNAL_LEAK_PROBE_OPPORTUNITY_ANALYZE_4A30A145";
    setAuthSuccess();
    vi.mocked(getJob).mockImplementationOnce(() => {
      throw new Error(probe);
    });

    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/opportunities/item-1/analyze",
        representativeBody(),
        "POST",
        { "x-extension-token": "test-token" },
      ),
      routeContext({ id: "item-1" }),
    );

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(JSON.stringify(body)).not.toContain(probe);
    expect(body).not.toHaveProperty("details");
    expect(body.error).toBe("Failed to analyze opportunity match");
  });

  it("falls back to deterministic matching when the configured provider is unavailable", async () => {
    setAuthSuccess();
    aiGateMocks.gateOptionalAiFeature.mockReturnValueOnce({
      allowed: true,
      llmConfig: {
        provider: "ollama",
        model: "llama3.2",
        baseUrl: "http://localhost:11434",
      },
      plan: "self-host",
      source: "self-host",
      transaction: null,
      refund: aiGateMocks.refund,
    });
    vi.mocked(getJob).mockReturnValueOnce({
      id: "job-1",
      title: "Senior Product Engineer",
      company: "ExampleWorks",
      description: "Build React and PostgreSQL workflows.",
      requirements: [],
      responsibilities: [],
      keywords: ["React", "PostgreSQL", "Kubernetes"],
      createdAt: "2026-05-16T00:00:00.000Z",
    });
    vi.mocked(getProfile).mockReturnValueOnce({
      id: "profile-1",
      contact: { name: "Riley Chen" },
      summary: "Product engineer",
      experiences: [],
      education: [],
      projects: [],
      certifications: [],
      skills: [
        { id: "skill-1", name: "React", category: "technical" },
        { id: "skill-2", name: "PostgreSQL", category: "technical" },
      ],
    });
    llmMocks.complete.mockRejectedValueOnce(new TypeError("fetch failed"));

    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/opportunities/job-1/analyze",
        representativeBody(),
        "POST",
      ),
      routeContext({ id: "job-1" }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      fallbackUsed: true,
      providerError: {
        code: "provider_unavailable",
        provider: "ollama",
        model: "llama3.2",
      },
      analysis: {
        jobId: "job-1",
        profileId: "profile-1",
        overallScore: 67,
        gaps: ["kubernetes"],
      },
    });
    expect(aiGateMocks.refund).toHaveBeenCalledOnce();
  });
});
