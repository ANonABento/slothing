import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

vi.mock("@/lib/db/prompt-variants", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/db/prompt-variants",
  ),
);

import { PATCH, DELETE } from "./route";
import { updatePromptVariant } from "@/lib/db/prompt-variants";
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

describe("/api/prompts/[id] route contract", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("invokes the real PATCH handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      PATCH,
      jsonRequest(
        "http://localhost/api/prompts/item-1",
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
        "http://localhost/api/prompts/item-1",
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
        "http://localhost/api/prompts/item-1",
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
      invalidJsonRequest("http://localhost/api/prompts/item-1", "PATCH"),
      routeContext(),
    );

    await expectRouteResponseContract(response);
  });

  it("does not leak raw error messages on 500", async () => {
    const probe = "INTERNAL_LEAK_PROBE_PROMPTS_UPDATE_4A30A145";
    setAuthSuccess();
    vi.mocked(updatePromptVariant).mockImplementationOnce(() => {
      throw new Error(probe);
    });

    const response = await invokeRouteHandler(
      PATCH,
      jsonRequest(
        "http://localhost/api/prompts/item-1",
        { name: "Updated prompt" },
        "PATCH",
        { "x-extension-token": "test-token" },
      ),
      routeContext({ id: "item-1" }),
    );

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(JSON.stringify(body)).not.toContain(probe);
    expect(body).not.toHaveProperty("details");
    expect(body.error).toBe("Failed to update prompt variant");
  });
});
