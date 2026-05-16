import { beforeEach, describe, expect, it, vi } from "vitest";

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

vi.mock("@/lib/resume/generator", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/resume/generator",
  ),
);

vi.mock("@/lib/resume/pdf", () => ({
  generateResumeHTML: vi.fn(() => "<article>Resume</article>"),
  TEMPLATES: [{ id: "classic", name: "Classic", description: "Classic" }],
}));

vi.mock("@/lib/resume/templates", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/resume/templates",
  ),
);

vi.mock("@/lib/billing/ai-gate", async () => {
  const { NextResponse } = await import("next/server");
  return {
    gateOptionalAiFeature: aiGateMocks.gateOptionalAiFeature,
    isAiGateResponse: (value: unknown) => value instanceof NextResponse,
  };
});

vi.mock("fs/promises", () => {
  const mocked = {
    mkdir: vi.fn(),
    writeFile: vi.fn(),
  };
  return { ...mocked, default: mocked };
});

vi.mock("@/lib/utils", () => ({
  generateId: vi.fn(() => "id-1"),
}));

vi.mock("@/lib/constants", () => ({
  PATHS: { RESUMES_OUTPUT: "/tmp/resumes" },
}));

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

import { GET, POST } from "./route";
import { getJob } from "@/lib/db/jobs";
import { getProfile } from "@/lib/db";
import { generateTailoredResume } from "@/lib/resume/generator";
import {
  invokeRouteHandler,
  jsonRequest,
  representativeBody,
  resetContractMocks,
  routeContext,
  setAuthSuccess,
} from "@/test/contract";

describe("opportunity resume generation route", () => {
  beforeEach(() => {
    resetContractMocks();
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

  it("serves resume templates from the new opportunities action path", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      templates: expect.arrayContaining([
        expect.objectContaining({ id: "classic", name: expect.any(String) }),
      ]),
    });
  });

  it("does not leak raw error messages on 500", async () => {
    const probe = "INTERNAL_LEAK_PROBE_OPPORTUNITY_GENERATE_4A30A145";
    setAuthSuccess();
    vi.mocked(getJob).mockImplementationOnce(() => {
      throw new Error(probe);
    });

    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/opportunities/item-1/generate",
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
    expect(body.error).toBe("Failed to generate resume");
  });

  it("falls back to deterministic resume generation when the configured provider is unavailable", async () => {
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
      keywords: ["React", "PostgreSQL"],
      createdAt: "2026-05-16T00:00:00.000Z",
    });
    vi.mocked(getProfile).mockReturnValueOnce({
      id: "profile-1",
      contact: { name: "Riley Chen", email: "riley@example.com" },
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
    vi.mocked(generateTailoredResume)
      .mockRejectedValueOnce(new TypeError("fetch failed"))
      .mockResolvedValueOnce({
        contact: { name: "Riley Chen", email: "riley@example.com" },
        summary: "Product engineer",
        experiences: [],
        skills: ["React", "PostgreSQL"],
        education: [],
      });

    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/opportunities/job-1/generate",
        { templateId: "classic" },
        "POST",
      ),
      routeContext({ id: "job-1" }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      pdfUrl: "/resumes/resume-exampleworks-id-1.html",
      fallbackUsed: true,
      providerError: {
        code: "provider_unavailable",
        provider: "ollama",
        model: "llama3.2",
      },
      resume: {
        summary: "Product engineer",
        skills: ["React", "PostgreSQL"],
      },
    });
    expect(generateTailoredResume).toHaveBeenNthCalledWith(
      2,
      expect.any(Object),
      expect.any(Object),
      null,
    );
    expect(aiGateMocks.refund).toHaveBeenCalledOnce();
  });
});
