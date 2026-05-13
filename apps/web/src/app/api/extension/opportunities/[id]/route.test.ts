import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireExtensionAuth: vi.fn(),
  getJob: vi.fn(),
}));

vi.mock("@/lib/extension-auth", () => ({
  requireExtensionAuth: mocks.requireExtensionAuth,
}));

vi.mock("@/lib/db/queries/jobs", () => ({
  getJob: mocks.getJob,
}));

import { GET } from "./route";

function getRequest(id: string) {
  return new NextRequest(`http://localhost/api/extension/opportunities/${id}`, {
    method: "GET",
  });
}

describe("GET /api/extension/opportunities/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireExtensionAuth.mockReturnValue({
      success: true,
      userId: "user-1",
    });
  });

  it("returns the opportunity when found", async () => {
    mocks.getJob.mockResolvedValueOnce({
      id: "j1",
      title: "Eng",
      company: "Acme",
      status: "pending",
    });

    const response = await GET(getRequest("j1"), {
      params: Promise.resolve({ id: "j1" }),
    });
    await expect(response.json()).resolves.toEqual({
      id: "j1",
      title: "Eng",
      company: "Acme",
      status: "pending",
    });
    expect(mocks.getJob).toHaveBeenCalledWith("user-1", "j1");
  });

  it("returns 404 when no opportunity matches", async () => {
    mocks.getJob.mockResolvedValueOnce(null);
    const response = await GET(getRequest("missing"), {
      params: Promise.resolve({ id: "missing" }),
    });
    expect(response.status).toBe(404);
  });

  it("returns the auth error response when token is missing", async () => {
    const failResponse = { failed: true } as unknown as Response;
    mocks.requireExtensionAuth.mockReturnValueOnce({
      success: false,
      response: failResponse,
    });

    const response = await GET(getRequest("j1"), {
      params: Promise.resolve({ id: "j1" }),
    });
    expect(response).toBe(failResponse);
    expect(mocks.getJob).not.toHaveBeenCalled();
  });
});
