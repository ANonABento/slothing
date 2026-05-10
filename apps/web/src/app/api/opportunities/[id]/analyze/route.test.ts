import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/jobs", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db/jobs"),
);

vi.mock("@/lib/db", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db"),
);

vi.mock("@/lib/llm/client", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/llm/client"),
);

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

import { POST } from "./route";
import { getJob } from "@/lib/db/jobs";
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
});
