import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(() => false),
  getDraft: vi.fn(),
  reviewDraft: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/db/application-drafts", () => ({
  getDraft: mocks.getDraft,
  reviewDraft: mocks.reviewDraft,
}));

import { GET, PATCH } from "./route";

function patchRequest(body: unknown) {
  return new NextRequest("http://localhost/api/applications/drafts/d1", {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

const ctx = { params: { id: "d1" } };

describe("applications draft [id] route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
  });

  it("returns 404 when the draft is missing", async () => {
    mocks.getDraft.mockResolvedValueOnce(null);
    const res = await GET(
      new NextRequest("http://localhost/api/applications/drafts/d1"),
      ctx,
    );
    expect(res.status).toBe(404);
  });

  it("approves a draft via PATCH", async () => {
    mocks.reviewDraft.mockResolvedValueOnce({ id: "d1", status: "approved" });
    const res = await PATCH(patchRequest({ status: "approved" }), ctx);
    expect(res.status).toBe(200);
    expect(mocks.reviewDraft).toHaveBeenCalledWith("d1", "user-1", {
      status: "approved",
    });
  });

  it("rejects a draft via PATCH (Pattern B status change)", async () => {
    mocks.reviewDraft.mockResolvedValueOnce({ id: "d1", status: "rejected" });
    const res = await PATCH(patchRequest({ status: "rejected" }), ctx);
    expect(res.status).toBe(200);
    expect(mocks.reviewDraft).toHaveBeenCalledWith("d1", "user-1", {
      status: "rejected",
    });
  });

  it("rejects an invalid status transition (e.g. submitted)", async () => {
    const res = await PATCH(patchRequest({ status: "submitted" }), ctx);
    expect(res.status).toBe(400);
    expect(mocks.reviewDraft).not.toHaveBeenCalled();
  });

  it("404s when reviewDraft finds nothing", async () => {
    mocks.reviewDraft.mockResolvedValueOnce(null);
    const res = await PATCH(patchRequest({ status: "approved" }), ctx);
    expect(res.status).toBe(404);
  });
});
