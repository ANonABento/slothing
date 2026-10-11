import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

vi.mock("@/lib/db/answer-bank", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/db/answer-bank",
  ),
);

import { POST } from "./route";
import {
  expectRouteResponseContract,
  invokeRouteHandler,
  jsonRequest,
  representativeBody,
  resetContractMocks,
  routeContext,
  setAuthFailure,
} from "@/test/contract";

describe("/api/answer-bank/[id]/promote route contract", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("invokes the real POST handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/answer-bank/item-1/promote",
        representativeBody(),
        "POST",
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
        "http://localhost/api/answer-bank/item-1/promote",
        representativeBody(),
        "POST",
      ),
      routeContext(),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.any(String),
    });
  });
});
