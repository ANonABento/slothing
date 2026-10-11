import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireExtensionAuth: vi.fn(),
  execute: vi.fn(),
  getProfile: vi.fn(),
  rankResumesByFit: vi.fn(),
}));

vi.mock("@/lib/extension-auth", () => ({
  requireExtensionAuth: mocks.requireExtensionAuth,
}));
vi.mock("@/lib/db/client", () => ({
  getClient: () => ({ execute: mocks.execute }),
}));
vi.mock("@/lib/db/queries/profile", () => ({
  getProfile: mocks.getProfile,
}));
vi.mock("@/lib/extension/best-fit", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/extension/best-fit")
  >("@/lib/extension/best-fit");
  return { ...actual, rankResumesByFit: mocks.rankResumesByFit };
});

import { POST } from "./route";

function post(body: unknown) {
  return POST(
    new NextRequest("http://localhost/api/extension/best-fit", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }),
  );
}

const validJob = {
  title: "Backend Engineer",
  company: "Acme",
  description: "Build APIs",
  keywords: ["go", "postgres"],
};

describe("POST /api/extension/best-fit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireExtensionAuth.mockReturnValue({
      success: true,
      userId: "user-1",
    });
    mocks.getProfile.mockResolvedValue({ contact: { name: "Jo" } });
    mocks.execute.mockResolvedValue({
      rows: [
        {
          id: "r1",
          content_json: "{}",
          job_title: "Backend",
          job_company: "X",
        },
      ],
    });
    mocks.rankResumesByFit.mockReturnValue([
      { id: "r1", name: "Backend · X", score: 71 },
    ]);
  });

  it("returns the ranked resumes for a valid job", async () => {
    const response = await post(validJob);
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.resumes).toEqual([
      { id: "r1", name: "Backend · X", score: 71 },
    ]);
    // Candidate name is derived from the joined job row.
    expect(mocks.rankResumesByFit).toHaveBeenCalledWith(
      expect.objectContaining({
        candidates: [{ id: "r1", name: "Backend · X", contentJson: "{}" }],
      }),
    );
  });

  it("returns an empty list when the user has no profile", async () => {
    mocks.getProfile.mockResolvedValue(null);
    const response = await post(validJob);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ resumes: [] });
    expect(mocks.execute).not.toHaveBeenCalled();
  });

  it("400s when title/company are missing", async () => {
    const response = await post({ description: "no title" });
    expect(response.status).toBe(400);
    expect(mocks.getProfile).not.toHaveBeenCalled();
  });

  it("propagates the auth failure response", async () => {
    mocks.requireExtensionAuth.mockReturnValue({
      success: false,
      response: new Response(JSON.stringify({ error: "No token provided" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    });
    const response = await post(validJob);
    expect(response.status).toBe(401);
  });

  it("returns 500 without leaking internals when ranking fails", async () => {
    mocks.rankResumesByFit.mockImplementation(() => {
      throw new Error("LEAKY_PROBE_8842");
    });
    const response = await post(validJob);
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(JSON.stringify(body)).not.toContain("LEAKY_PROBE_8842");
  });
});
