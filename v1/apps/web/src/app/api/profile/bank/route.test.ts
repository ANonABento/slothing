import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/profile-bank", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/db/profile-bank",
  ),
);

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

import * as routeMod from "./route";
import { GET } from "./route";
import {
  expectRouteResponseContract,
  getRequest,
  invalidJsonRequest,
  invokeRouteHandler,
  resetContractMocks,
  routeContext,
  setAuthFailure,
} from "@/test/contract";

describe("/api/profile/bank route contract", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("invokes the real GET handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/profile/bank", {
        "x-extension-token": "test-token",
      }),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("returns the shared auth failure contract", async () => {
    setAuthFailure();

    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/profile/bank", {
        "x-extension-token": "test-token",
      }),
      routeContext(),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.any(String),
    });
  });

  it("does not export body-accepting handlers", () => {
    const exports = routeMod as typeof routeMod &
      Partial<Record<"POST" | "PUT" | "PATCH" | "DELETE", unknown>>;

    expect(exports.POST).toBeUndefined();
    expect(exports.PUT).toBeUndefined();
    expect(exports.PATCH).toBeUndefined();
    expect(exports.DELETE).toBeUndefined();
  });

  it("ignores malformed JSON sent to GET because the route has no body parser", async () => {
    const response = await invokeRouteHandler(
      GET,
      invalidJsonRequest("http://localhost/api/profile/bank", "GET"),
      routeContext(),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      entries: expect.any(Object),
    });
  });
});
