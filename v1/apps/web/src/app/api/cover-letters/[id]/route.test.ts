import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  getCoverLetter: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: (value: unknown) => value instanceof Response,
}));

vi.mock("@/lib/db/cover-letters", () => ({
  getCoverLetter: mocks.getCoverLetter,
}));

import { GET } from "./route";

describe("GET /api/cover-letters/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
  });

  it("returns a saved cover letter for the owner", async () => {
    mocks.getCoverLetter.mockReturnValue({
      id: "cl-1",
      content: "Dear Acme...",
      highlights: [],
      version: 1,
      jobId: "job-1",
      createdAt: "2026-05-10T12:00:00.000Z",
    });

    const response = await GET(
      new NextRequest("http://localhost/api/cover-letters/cl-1"),
      { params: { id: "cl-1" } },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      coverLetter: { id: "cl-1", content: "Dear Acme..." },
    });
    expect(mocks.getCoverLetter).toHaveBeenCalledWith("cl-1", "user-1");
  });

  it("returns 404 for an unknown cover letter", async () => {
    mocks.getCoverLetter.mockReturnValue(null);

    const response = await GET(
      new NextRequest("http://localhost/api/cover-letters/missing"),
      { params: { id: "missing" } },
    );

    expect(response.status).toBe(404);
  });

  it("returns auth failures unchanged", async () => {
    mocks.requireAuth.mockResolvedValue(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    );

    const response = await GET(
      new NextRequest("http://localhost/api/cover-letters/cl-1"),
      { params: { id: "cl-1" } },
    );

    expect(response.status).toBe(401);
  });
});
