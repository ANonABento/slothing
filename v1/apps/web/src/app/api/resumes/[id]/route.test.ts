import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  getGeneratedResume: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: (value: unknown) => value instanceof Response,
}));

vi.mock("@/lib/db/resumes", () => ({
  getGeneratedResume: mocks.getGeneratedResume,
}));

import { GET } from "./route";

describe("GET /api/resumes/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
  });

  it("returns parsed resume content for the owner", async () => {
    mocks.getGeneratedResume.mockReturnValue({
      id: "resume-1",
      contentJson: JSON.stringify({ basics: { name: "Ada" } }),
      templateId: "modern",
      jobId: "job-1",
      matchScore: 91,
      createdAt: "2026-05-10T12:00:00.000Z",
    });

    const response = await GET(
      new NextRequest("http://localhost/api/resumes/resume-1"),
      { params: { id: "resume-1" } },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      resume: { id: "resume-1", content: { basics: { name: "Ada" } } },
    });
    expect(mocks.getGeneratedResume).toHaveBeenCalledWith("resume-1", "user-1");
  });

  it("returns 404 for an unknown resume", async () => {
    mocks.getGeneratedResume.mockReturnValue(null);

    const response = await GET(
      new NextRequest("http://localhost/api/resumes/missing"),
      { params: { id: "missing" } },
    );

    expect(response.status).toBe(404);
  });

  it("returns auth failures unchanged", async () => {
    mocks.requireAuth.mockResolvedValue(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    );

    const response = await GET(
      new NextRequest("http://localhost/api/resumes/resume-1"),
      { params: { id: "resume-1" } },
    );

    expect(response.status).toBe(401);
  });
});
