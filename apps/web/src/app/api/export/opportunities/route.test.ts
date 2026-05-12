import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/jobs", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db/jobs"),
);

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
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

describe("/api/export/opportunities route contract", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("invokes the real GET handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/export/opportunities", {
        "x-extension-token": "test-token",
      }),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });
});
