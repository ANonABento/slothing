import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/extension-auth", () =>
  globalThis.__contractRouteMocks!.createExtensionAuthModuleMock(),
);

vi.mock("@/lib/db", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db"),
);

import { PATCH, DELETE } from "./route";
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

describe("/api/extension/learned-answers/[id] route contract", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("invokes the real PATCH handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      PATCH,
      jsonRequest(
        "http://localhost/api/extension/learned-answers/item-1",
        representativeBody(),
        "PATCH",
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
        "http://localhost/api/extension/learned-answers/item-1",
        representativeBody(),
        "DELETE",
        { "x-extension-token": "test-token" },
      ),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("returns an HTTP error response for malformed mutation input", async () => {
    setAuthSuccess();

    const response = await invokeRouteHandler(
      PATCH,
      invalidJsonRequest(
        "http://localhost/api/extension/learned-answers/item-1",
        "PATCH",
      ),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });
});
