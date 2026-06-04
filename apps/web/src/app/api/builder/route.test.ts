import { beforeEach, describe, expect, it, vi } from "vitest";

const builderMocks = vi.hoisted(() => ({
  renderResumeHtmlForTemplate: vi.fn(),
}));

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

vi.mock("@/lib/db/profile-bank", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/db/profile-bank",
  ),
);

vi.mock("@/lib/resume/bank-to-resume", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/resume/bank-to-resume",
  ),
);

vi.mock("@/lib/builder/editor-document", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/builder/editor-document",
  ),
);

vi.mock("@/lib/resume/render-resume", () => ({
  renderResumeHtmlForTemplate: builderMocks.renderResumeHtmlForTemplate,
}));

import { POST } from "./route";
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

describe("/api/builder route contract", () => {
  beforeEach(() => {
    resetContractMocks();
    builderMocks.renderResumeHtmlForTemplate.mockResolvedValue(
      "<html>builder</html>",
    );
  });

  it("invokes the real POST handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/builder",
        representativeBody(),
        "POST",
        { "x-extension-token": "test-token" },
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
        "http://localhost/api/builder",
        representativeBody(),
        "POST",
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
      POST,
      invalidJsonRequest("http://localhost/api/builder", "POST"),
      routeContext(),
    );

    expect(response.status).toBe(400);
    await expectRouteResponseContract(response);
  });

  it("returns validation errors for missing build inputs", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest("http://localhost/api/builder", {}, "POST"),
      routeContext(),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
    });
  });

  it("returns validation errors for wrong field types", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/builder",
        { entryIds: "entry-1" },
        "POST",
      ),
      routeContext(),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: "Validation failed",
      errors: [{ field: "entryIds" }],
    });
  });

  it("renders a preview through the unified template dispatch", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/builder",
        {
          document: { sections: [{ id: "summary", title: "Summary" }] },
          contact: { name: "Mara Voss" },
          templateId: "imported-1",
        },
        "POST",
        { "x-extension-token": "test-token" },
      ),
      routeContext(),
    );

    expect(builderMocks.renderResumeHtmlForTemplate).toHaveBeenCalledWith(
      expect.any(Object),
      "imported-1",
      expect.any(String),
    );
    await expect(response.json()).resolves.toMatchObject({
      html: "<html>builder</html>",
    });
  });
});
