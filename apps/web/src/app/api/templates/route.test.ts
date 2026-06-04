import { beforeEach, describe, expect, it, vi } from "vitest";

const storeMocks = vi.hoisted(() => ({
  listResumeTemplates: vi.fn(),
  deleteResumeTemplate: vi.fn(),
  updateResumeTemplateMetadata: vi.fn(),
  migrateV4ToCollapsed: vi.fn(),
}));

vi.mock("@/lib/db/resume-templates", () => storeMocks);

vi.mock("@/lib/resume/templates", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/resume/templates",
  ),
);

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

import { GET, POST, DELETE, PATCH } from "./route";
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

describe("/api/templates route contract", () => {
  beforeEach(() => {
    resetContractMocks();
    storeMocks.listResumeTemplates.mockReturnValue([]);
    storeMocks.deleteResumeTemplate.mockReturnValue(false);
    storeMocks.updateResumeTemplateMetadata.mockReturnValue(null);
    storeMocks.migrateV4ToCollapsed.mockReturnValue({
      migrated: 0,
      skipped: 0,
    });
  });

  it("invokes the real GET handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/templates", {
        "x-extension-token": "test-token",
      }),
      routeContext(),
    );
    await expectRouteResponseContract(response);
  });

  it("invokes the real POST handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/templates",
        representativeBody(),
        "POST",
        {
          "x-extension-token": "test-token",
        },
      ),
      routeContext(),
    );
    await expectRouteResponseContract(response);
  });

  it("invokes the real DELETE handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      DELETE,
      jsonRequest(
        "http://localhost/api/templates",
        representativeBody(),
        "DELETE",
        {
          "x-extension-token": "test-token",
        },
      ),
      routeContext(),
    );
    await expectRouteResponseContract(response);
  });

  it("invokes the real PATCH handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      PATCH,
      jsonRequest(
        "http://localhost/api/templates",
        representativeBody(),
        "PATCH",
        {
          "x-extension-token": "test-token",
        },
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
        "http://localhost/api/templates",
        representativeBody(),
        "POST",
        {
          "x-extension-token": "test-token",
        },
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
      invalidJsonRequest("http://localhost/api/templates", "POST"),
      routeContext(),
    );
    await expectRouteResponseContract(response);
  });

  it("lists imported custom templates from the collapsed store", async () => {
    setAuthSuccess();
    storeMocks.listResumeTemplates.mockReturnValueOnce([collapsedRow("imp-1")]);

    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/templates", {
        "x-extension-token": "test-token",
      }),
      routeContext(),
    );
    const body = (await response.json()) as {
      templates: Array<{ id: string; type: string; layout?: string }>;
    };

    expect(response.status).toBe(200);
    expect(storeMocks.migrateV4ToCollapsed).toHaveBeenCalled();
    expect(body.templates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "imp-1",
          type: "custom",
          layout: "two-column",
        }),
      ]),
    );
  });

  it("deletes a custom template from the collapsed store", async () => {
    setAuthSuccess();
    storeMocks.deleteResumeTemplate.mockReturnValueOnce(true);

    const response = await invokeRouteHandler(
      DELETE,
      jsonRequest("http://localhost/api/templates?id=imp-1", {}, "DELETE", {
        "x-extension-token": "test-token",
      }),
      routeContext(),
    );

    expect(response.status).toBe(200);
    expect(storeMocks.deleteResumeTemplate).toHaveBeenCalledWith(
      "imp-1",
      "user-1",
    );
  });

  it("updates custom template metadata in the collapsed store", async () => {
    setAuthSuccess();
    storeMocks.updateResumeTemplateMetadata.mockReturnValueOnce({
      id: "imp-1",
    });

    const response = await invokeRouteHandler(
      PATCH,
      jsonRequest(
        "http://localhost/api/templates",
        { id: "imp-1", name: "Renamed" },
        "PATCH",
        {
          "x-extension-token": "test-token",
        },
      ),
      routeContext(),
    );

    expect(response.status).toBe(200);
    expect(storeMocks.updateResumeTemplateMetadata).toHaveBeenCalledWith(
      "imp-1",
      "user-1",
      {
        name: "Renamed",
        description: undefined,
      },
    );
  });
});

function collapsedRow(id: string) {
  return {
    id,
    userId: "user-1",
    name: "Imported Sidebar",
    description: null,
    sourceFilename: "resume.pdf",
    sourceType: "pdf",
    template: {
      id,
      name: "Imported Sidebar",
      grammar: { columns: "left-sidebar" },
      tokens: {},
    },
    rdm: null,
    createdAt: "2026-05-20T00:00:00.000Z",
    updatedAt: "2026-05-20T00:00:00.000Z",
  };
}
