import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db"),
);

vi.mock("@/lib/db/prompt-variants", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/db/prompt-variants",
  ),
);

vi.mock("@/lib/db/profile-bank", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/db/profile-bank",
  ),
);

vi.mock("@/lib/db/jobs", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db/jobs"),
);

vi.mock("@/lib/opportunities", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/opportunities",
  ),
);

vi.mock("@/lib/tailor/analyze", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/tailor/analyze",
  ),
);

vi.mock("@/lib/tailor/generate", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/tailor/generate",
  ),
);

vi.mock("@/lib/resume/pdf", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/resume/pdf"),
);

vi.mock("@/lib/resume/templates", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/resume/templates",
  ),
);

vi.mock("@/lib/builder/tailored-resume-api", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/builder/tailored-resume-api",
  ),
);

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

import { GET, POST } from "./route";
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

describe("/api/tailor route contract", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("invokes the real GET handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/tailor", {
        "x-extension-token": "test-token",
      }),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("invokes the real POST handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest("http://localhost/api/tailor", representativeBody(), "POST", {
        "x-extension-token": "test-token",
      }),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("returns the shared auth failure contract", async () => {
    setAuthFailure();

    const response = await invokeRouteHandler(
      POST,
      jsonRequest("http://localhost/api/tailor", representativeBody(), "POST", {
        "x-extension-token": "test-token",
      }),
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
      invalidJsonRequest("http://localhost/api/tailor", "POST"),
      routeContext(),
    );

    expect(response.status).toBe(400);
    await expectRouteResponseContract(response);
  });

  it("returns validation errors for missing job description", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest("http://localhost/api/tailor", { action: "analyze" }, "POST"),
      routeContext(),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
      errors: [{ field: "jobDescription" }],
    });
  });

  it("returns validation errors for wrong field types", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/tailor",
        { action: "analyze", jobDescription: 123 },
        "POST",
      ),
      routeContext(),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
      errors: [{ field: "jobDescription" }],
    });
  });
});
