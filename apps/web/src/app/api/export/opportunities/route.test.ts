import { beforeEach, describe, expect, it, vi } from "vitest";

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
