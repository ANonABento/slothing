import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

vi.mock("@/lib/db/learned-answers", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/db/learned-answers",
  ),
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

describe("/api/answer-bank/[id] route contract", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("invokes the real PATCH handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      PATCH,
      jsonRequest(
        "http://localhost/api/answer-bank/item-1",
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
        "http://localhost/api/answer-bank/item-1",
        representativeBody(),
        "DELETE",
        { "x-extension-token": "test-token" },
      ),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("returns the shared auth failure contract", async () => {
    setAuthFailure();

    const response = await invokeRouteHandler(
      PATCH,
      jsonRequest(
        "http://localhost/api/answer-bank/item-1",
        representativeBody(),
        "PATCH",
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
      PATCH,
      invalidJsonRequest("http://localhost/api/answer-bank/item-1", "PATCH"),
      routeContext(),
    );

    expect(response.status).toBe(400);
    await expectRouteResponseContract(response);
  });

  it("returns validation errors for missing update fields", async () => {
    const response = await invokeRouteHandler(
      PATCH,
      jsonRequest("http://localhost/api/answer-bank/item-1", {}, "PATCH"),
      routeContext(),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
    });
  });

  it("returns validation errors for wrong field types", async () => {
    const response = await invokeRouteHandler(
      PATCH,
      jsonRequest(
        "http://localhost/api/answer-bank/item-1",
        { question: 123 },
        "PATCH",
      ),
      routeContext(),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
      errors: [{ field: "question" }],
    });
  });
});
