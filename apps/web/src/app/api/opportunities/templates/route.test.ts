import { beforeEach, describe, expect, it, vi } from "vitest";

const storeMocks = vi.hoisted(() => ({
  listResumeTemplates: vi.fn(),
  migrateV4ToCollapsed: vi.fn(),
}));

vi.mock("@/lib/resume/pdf", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/resume/pdf"),
);

vi.mock("@/lib/db/resume-templates", () => storeMocks);

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

import { GET } from "./route";
import {
  expectRouteResponseContract,
  getRequest,
  invokeRouteHandler,
  resetContractMocks,
  routeContext,
  setAuthFailure,
  setAuthSuccess,
} from "@/test/contract";

describe("/api/opportunities/templates route contract", () => {
  beforeEach(() => {
    resetContractMocks();
    storeMocks.listResumeTemplates.mockReturnValue([]);
    storeMocks.migrateV4ToCollapsed.mockReturnValue({
      migrated: 0,
      skipped: 0,
    });
  });

  it("invokes the real GET handler and returns an HTTP response contract", async () => {
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/opportunities/templates", {
        "x-extension-token": "test-token",
      }),
      routeContext(),
    );
    await expectRouteResponseContract(response);
  });

  it("returns the shared auth failure contract", async () => {
    setAuthFailure();
    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/opportunities/templates", {
        "x-extension-token": "test-token",
      }),
      routeContext(),
    );
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.any(String),
    });
  });

  it("lists built-in templates plus imported custom templates", async () => {
    setAuthSuccess();
    storeMocks.listResumeTemplates.mockReturnValueOnce([
      {
        id: "imp-1",
        name: "Imported Resume",
        description: null,
        sourceFilename: "resume.pdf",
        sourceType: "pdf",
        template: { id: "imp-1", grammar: { columns: "single" }, tokens: {} },
      },
    ]);

    const response = await invokeRouteHandler(
      GET,
      getRequest("http://localhost/api/opportunities/templates", {
        "x-extension-token": "test-token",
      }),
      routeContext(),
    );
    const body = (await response.json()) as {
      templates: Array<{ id: string; type: string }>;
    };

    expect(response.status).toBe(200);
    expect(body.templates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "imp-1", type: "custom" }),
      ]),
    );
  });
});
