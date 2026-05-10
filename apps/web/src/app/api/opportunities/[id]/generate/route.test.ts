import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/jobs", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db/jobs"),
);

vi.mock("@/lib/db", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock("@/lib/db"),
);

vi.mock("@/lib/resume/generator", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/resume/generator",
  ),
);

vi.mock("@/lib/resume/pdf", () => ({
  generateResumeHTML: vi.fn(() => "<article>Resume</article>"),
  TEMPLATES: [{ id: "classic", name: "Classic", description: "Classic" }],
}));

vi.mock("@/lib/resume/templates", () =>
  globalThis.__contractRouteMocks!.createContractModuleMock(
    "@/lib/resume/templates",
  ),
);

vi.mock("fs/promises", () => {
  const mocked = {
    mkdir: vi.fn(),
    writeFile: vi.fn(),
  };
  return { ...mocked, default: mocked };
});

vi.mock("@/lib/utils", () => ({
  generateId: vi.fn(() => "id-1"),
}));

vi.mock("@/lib/constants", () => ({
  PATHS: { RESUMES_OUTPUT: "/tmp/resumes" },
}));

vi.mock("@/lib/auth", () =>
  globalThis.__contractRouteMocks!.createAuthModuleMock(),
);

import { GET, POST } from "./route";
import { getJob } from "@/lib/db/jobs";
import {
  invokeRouteHandler,
  jsonRequest,
  representativeBody,
  resetContractMocks,
  routeContext,
  setAuthSuccess,
} from "@/test/contract";

describe("opportunity resume generation route", () => {
  beforeEach(() => {
    resetContractMocks();
  });

  it("serves resume templates from the new opportunities action path", async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      templates: expect.arrayContaining([
        expect.objectContaining({ id: "classic", name: expect.any(String) }),
      ]),
    });
  });

  it("does not leak raw error messages on 500", async () => {
    const probe = "INTERNAL_LEAK_PROBE_OPPORTUNITY_GENERATE_4A30A145";
    setAuthSuccess();
    vi.mocked(getJob).mockImplementationOnce(() => {
      throw new Error(probe);
    });

    const response = await invokeRouteHandler(
      POST,
      jsonRequest(
        "http://localhost/api/opportunities/item-1/generate",
        representativeBody(),
        "POST",
        { "x-extension-token": "test-token" },
      ),
      routeContext({ id: "item-1" }),
    );

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(JSON.stringify(body)).not.toContain(probe);
    expect(body).not.toHaveProperty("details");
    expect(body.error).toBe("Failed to generate resume");
  });
});
