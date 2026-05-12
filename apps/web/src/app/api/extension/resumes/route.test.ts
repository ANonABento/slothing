import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireExtensionAuth: vi.fn(),
  prepare: vi.fn(),
  all: vi.fn(),
}));

vi.mock("@/lib/extension-auth", () => ({
  requireExtensionAuth: mocks.requireExtensionAuth,
}));

vi.mock("@/lib/db/legacy", () => ({
  default: {
    prepare: mocks.prepare,
  },
}));

import { GET } from "./route";

describe("GET /api/extension/resumes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireExtensionAuth.mockReturnValue({
      success: true,
      userId: "user-1",
    });
    mocks.prepare.mockReturnValue({ all: mocks.all });
  });

  it("returns up to 5 tailored resumes for the authed user", async () => {
    mocks.all.mockReturnValue([
      {
        id: "resume-1",
        created_at: "2026-05-10T12:00:00.000Z",
        job_title: "Senior Backend Engineer",
        job_company: "Acme",
      },
      {
        id: "resume-2",
        created_at: "2026-05-09T12:00:00.000Z",
        job_title: "Frontend Engineer",
        job_company: "Globex",
      },
      {
        id: "resume-3",
        created_at: "2026-05-08T12:00:00.000Z",
        job_title: null,
        job_company: null,
      },
    ]);

    const response = await GET(
      new NextRequest("http://localhost/api/extension/resumes"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(mocks.all).toHaveBeenCalledWith("user-1", 5);
    expect(body.resumes).toEqual([
      {
        id: "resume-1",
        name: "Senior Backend Engineer · Acme",
        targetRole: "Senior Backend Engineer",
        updatedAt: "2026-05-10T12:00:00.000Z",
      },
      {
        id: "resume-2",
        name: "Frontend Engineer · Globex",
        targetRole: "Frontend Engineer",
        updatedAt: "2026-05-09T12:00:00.000Z",
      },
      {
        id: "resume-3",
        name: "Untitled resume",
        targetRole: "Untitled resume",
        updatedAt: "2026-05-08T12:00:00.000Z",
      },
    ]);
  });

  it("returns an empty array when the user has no saved resumes", async () => {
    mocks.all.mockReturnValue([]);

    const response = await GET(
      new NextRequest("http://localhost/api/extension/resumes"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ resumes: [] });
  });

  it("propagates the shared auth failure response when the token is missing", async () => {
    mocks.requireExtensionAuth.mockReturnValue({
      success: false,
      response: new Response(JSON.stringify({ error: "No token provided" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    });

    const response = await GET(
      new NextRequest("http://localhost/api/extension/resumes"),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "No token provided",
    });
    expect(mocks.prepare).not.toHaveBeenCalled();
  });

  it("returns 500 when the DB call fails (without leaking the message)", async () => {
    mocks.all.mockImplementation(() => {
      throw new Error("LEAKY_INTERNAL_PROBE_94CFE");
    });

    const response = await GET(
      new NextRequest("http://localhost/api/extension/resumes"),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(JSON.stringify(body)).not.toContain("LEAKY_INTERNAL_PROBE_94CFE");
    expect(body).toEqual({ error: "Failed to load resumes" });
  });
});
