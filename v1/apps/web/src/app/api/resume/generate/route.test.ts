import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

vi.mock("@/lib/db/queries", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db/queries"),
);

vi.mock("@/lib/db/resumes", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db/resumes"),
);

vi.mock("@/lib/knowledge/retrieval", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/knowledge/retrieval",
  ),
);

import { POST } from "./route";
import { getLLMConfig } from "@/lib/db/queries";
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

describe("/api/resume/generate route contract", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("invokes the real POST handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/resume/generate",
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
        "http://localhost/api/resume/generate",
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
      invalidJsonRequest("http://localhost/api/resume/generate", "POST"),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("does not leak raw error messages on 500", async () => {
    const probe = "INTERNAL_LEAK_PROBE_RESUME_GENERATE_4A30A145";
    setAuthSuccess();
    vi.mocked(getLLMConfig).mockImplementationOnce(() => {
      throw new Error(probe);
    });

    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/resume/generate",
        { jobDescription: "Build polished user interfaces." },
        "POST",
        { "x-extension-token": "test-token" },
      ),
      routeContext(),
    );

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(JSON.stringify(body)).not.toContain(probe);
    expect(body).not.toHaveProperty("details");
    expect(body.error).toBe("Failed to generate resume");
  });
});
