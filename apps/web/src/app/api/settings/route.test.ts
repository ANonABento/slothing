import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db"),
);

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

vi.mock("@/lib/settings/opportunity-review", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/settings/opportunity-review",
  ),
);

vi.mock("@/lib/settings/digest", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/settings/digest",
  ),
);

vi.mock("@/lib/settings/locale", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/settings/locale",
  ),
);

vi.mock("@/lib/settings/gmail-auto-status", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/settings/gmail-auto-status",
  ),
);

import { GET, PUT, POST } from "./route";
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

describe("/api/settings route contract", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("invokes the real GET handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/settings", {
        "x-extension-token": "test-token",
      }),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("invokes the real PUT handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      PUT,
      jsonRequest(
        "http://localhost/api/settings",
        representativeBody(),
        "PUT",
        { "x-extension-token": "test-token" },
      ),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("invokes the real POST handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/settings",
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
      PUT,
      jsonRequest(
        "http://localhost/api/settings",
        representativeBody(),
        "PUT",
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
      PUT,
      invalidJsonRequest("http://localhost/api/settings", "PUT"),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });
});
