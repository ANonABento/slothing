import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

vi.mock("@/lib/db/answer-bank", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/db/answer-bank",
  ),
);

vi.mock("@/lib/db/answer-bank-versions", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/db/answer-bank-versions",
  ),
);

import { GET } from "./route";
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

describe("/api/answer-bank/[id]/versions route contract", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("invokes the real GET handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/answer-bank/item-1/versions", {
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
      getRequest("http://localhost/api/answer-bank/item-1/versions", {
        "x-extension-token": "test-token",
      }),
      routeContext(),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.any(String),
    });
  });
});
