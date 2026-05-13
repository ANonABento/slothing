import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireExtensionAuth: vi.fn(),
  getJobs: vi.fn(),
}));

vi.mock("@/lib/extension-auth", () => ({
  requireExtensionAuth: mocks.requireExtensionAuth,
}));

vi.mock("@/lib/db/queries/jobs", () => ({
  getJobs: mocks.getJobs,
}));

import { GET } from "./route";

function getRequest(query: string = "") {
  const url = `http://localhost/api/extension/opportunities${query}`;
  return new NextRequest(url, { method: "GET" });
}

describe("GET /api/extension/opportunities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireExtensionAuth.mockReturnValue({
      success: true,
      userId: "user-1",
    });
  });

  it("returns all opportunities for the authenticated user", async () => {
    mocks.getJobs.mockResolvedValueOnce([
      { id: "j1", title: "Eng", company: "Acme", status: "pending" },
      { id: "j2", title: "PM", company: "Beta", status: "applied" },
    ]);

    const response = await GET(getRequest());
    await expect(response.json()).resolves.toEqual({
      opportunities: [
        { id: "j1", title: "Eng", company: "Acme", status: "pending" },
        { id: "j2", title: "PM", company: "Beta", status: "applied" },
      ],
      total: 2,
    });
    expect(mocks.getJobs).toHaveBeenCalledWith("user-1");
  });

  it("filters by comma-separated status list", async () => {
    mocks.getJobs.mockResolvedValueOnce([
      { id: "j1", title: "A", company: "X", status: "pending" },
      { id: "j2", title: "B", company: "X", status: "applied" },
      { id: "j3", title: "C", company: "X", status: "rejected" },
    ]);

    const response = await GET(getRequest("?status=pending,applied"));
    const body = (await response.json()) as { opportunities: { id: string }[] };
    expect(body.opportunities.map((o) => o.id)).toEqual(["j1", "j2"]);
  });

  it("caps limit to the requested value", async () => {
    mocks.getJobs.mockResolvedValueOnce(
      Array.from({ length: 30 }, (_, i) => ({
        id: `j${i}`,
        title: "x",
        company: "y",
        status: "pending",
      })),
    );

    const response = await GET(getRequest("?limit=5"));
    const body = (await response.json()) as { opportunities: unknown[] };
    expect(body.opportunities).toHaveLength(5);
  });

  it("returns the auth error response when token is missing", async () => {
    const failResponse = { failed: true } as unknown as Response;
    mocks.requireExtensionAuth.mockReturnValueOnce({
      success: false,
      response: failResponse,
    });

    const response = await GET(getRequest());
    expect(response).toBe(failResponse);
    expect(mocks.getJobs).not.toHaveBeenCalled();
  });
});
