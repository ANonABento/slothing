import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/jobs", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db/jobs"),
);

vi.mock("@/lib/db/reminders", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/db/reminders",
  ),
);

vi.mock("@/lib/db/interviews", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/db/interviews",
  ),
);

vi.mock("@/lib/calendar/ics-generator", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/calendar/ics-generator",
  ),
);

vi.mock("@/lib/calendar/feed-token", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/calendar/feed-token",
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

describe("/api/calendar/feed route contract", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("invokes the real GET handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/calendar/feed", {
        "x-extension-token": "test-token",
      }),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });
});
