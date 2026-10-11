import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/email-drafts", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/db/email-drafts",
  ),
);

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

import { GET, PUT, DELETE } from "./route";
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

describe("/api/email/drafts/[id] route contract", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("invokes the real GET handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/email/drafts/item-1", {
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
        "http://localhost/api/email/drafts/item-1",
        representativeBody(),
        "PUT",
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
        "http://localhost/api/email/drafts/item-1",
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
      PUT,
      jsonRequest(
        "http://localhost/api/email/drafts/item-1",
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
      invalidJsonRequest("http://localhost/api/email/drafts/item-1", "PUT"),
      routeContext(),
    );

    expect(response.status).toBe(400);
    await expectRouteResponseContract(response);
  });

  it("returns validation errors for missing update fields", async () => {
    const response = await invokeRouteHandler(
      PUT,
      jsonRequest("http://localhost/api/email/drafts/item-1", {}, "PUT"),
      routeContext(),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
    });
  });

  it("returns validation errors for wrong field types", async () => {
    const response = await invokeRouteHandler(
      PUT,
      jsonRequest(
        "http://localhost/api/email/drafts/item-1",
        { subject: 123 },
        "PUT",
      ),
      routeContext(),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
      errors: [{ field: "subject" }],
    });
  });
});
