import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/custom-templates", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/db/custom-templates",
  ),
);

vi.mock("@/lib/db/queries", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db/queries"),
);

vi.mock("@/lib/resume/templates", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/resume/templates",
  ),
);

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

vi.mock("@/lib/resume/template-analyzer", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/resume/template-analyzer",
  ),
);

import { GET, POST, DELETE, PATCH } from "./route";
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

describe("/api/templates route contract", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("invokes the real GET handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/templates", {
        "x-extension-token": "test-token",
      }),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("invokes the real POST handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/templates",
        representativeBody(),
        "POST",
        { "x-extension-token": "test-token" },
      ),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("invokes the real DELETE handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      DELETE,
      jsonRequest(
        "http://localhost/api/templates",
        representativeBody(),
        "DELETE",
        { "x-extension-token": "test-token" },
      ),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("invokes the real PATCH handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      PATCH,
      jsonRequest(
        "http://localhost/api/templates",
        representativeBody(),
        "PATCH",
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
        "http://localhost/api/templates",
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
      invalidJsonRequest("http://localhost/api/templates", "POST"),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });
});
