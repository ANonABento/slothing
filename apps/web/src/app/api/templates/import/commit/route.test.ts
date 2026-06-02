import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

import { DEFAULT_TEMPLATES } from "@slothing/shared/resume-template";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  saveResumeTemplate: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: (value: unknown) => value instanceof Response,
}));
vi.mock("@/lib/db/resume-templates", () => ({
  saveResumeTemplate: mocks.saveResumeTemplate,
}));

import { POST } from "./route";

function jsonReq(body: unknown): NextRequest {
  return {
    async json() {
      return body;
    },
  } as unknown as NextRequest;
}

describe("/api/templates/import/commit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.saveResumeTemplate.mockImplementation((_userId, input) => ({
      id: "tpl-1",
      userId: "user-1",
      name: input.name ?? input.template.name,
      template: input.template,
      rdm: input.rdm ?? null,
      createdAt: "t0",
      updatedAt: "t0",
    }));
  });

  it("commits a valid accepted template + RDM", async () => {
    const res = await POST(
      jsonReq({
        template: DEFAULT_TEMPLATES[0],
        rdm: { basics: { name: "Sam" }, work: [], education: [], skills: [] },
        name: "My Clone",
        sourceFilename: "resume.pdf",
        sourceType: "pdf",
      }),
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.id).toBe("tpl-1");
    expect(body.name).toBe("My Clone");
    expect(mocks.saveResumeTemplate).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({ name: "My Clone" }),
    );
  });

  it("rejects an invalid template payload", async () => {
    const res = await POST(
      jsonReq({ template: { id: "x", name: "bad", grammar: {}, tokens: {} } }),
    );
    expect(res.status).toBe(400);
    expect(mocks.saveResumeTemplate).not.toHaveBeenCalled();
  });
});
