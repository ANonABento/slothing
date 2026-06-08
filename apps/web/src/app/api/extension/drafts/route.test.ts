import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireExtensionAuth: vi.fn(),
  listDrafts: vi.fn(),
  upsertDraft: vi.fn(),
}));

vi.mock("@/lib/extension-auth", () => ({
  requireExtensionAuth: mocks.requireExtensionAuth,
}));

vi.mock("@/lib/db/application-drafts", () => ({
  listDrafts: mocks.listDrafts,
  upsertDraft: mocks.upsertDraft,
}));

import { GET, POST } from "./route";

function postRequest(body: unknown) {
  return new NextRequest("http://localhost/api/extension/drafts", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("extension drafts route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireExtensionAuth.mockResolvedValue({
      success: true,
      userId: "user-1",
    });
  });

  it("rejects unauthenticated GET", async () => {
    mocks.requireExtensionAuth.mockResolvedValueOnce({
      success: false,
      response: NextResponse.json({ error: "no token" }, { status: 401 }),
    });
    const res = await GET(
      new NextRequest("http://localhost/api/extension/drafts"),
    );
    expect(res.status).toBe(401);
    expect(mocks.listDrafts).not.toHaveBeenCalled();
  });

  it("lists drafts filtered by status", async () => {
    mocks.listDrafts.mockResolvedValueOnce([{ id: "d1" }]);
    const res = await GET(
      new NextRequest("http://localhost/api/extension/drafts?status=approved"),
    );
    expect(res.status).toBe(200);
    expect(mocks.listDrafts).toHaveBeenCalledWith("user-1", {
      status: "approved",
      limit: undefined,
    });
  });

  it("creates a draft from a valid payload", async () => {
    mocks.upsertDraft.mockResolvedValueOnce({
      id: "d1",
      status: "pending_review",
    });
    const res = await POST(
      postRequest({
        jobId: "job-1",
        questions: [{ id: "q1", label: "Why us?" }],
        answers: [{ questionId: "q1", value: "Because" }],
        authoredBy: "agent:test",
      }),
    );
    expect(res.status).toBe(201);
    expect(mocks.upsertDraft).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({ jobId: "job-1" }),
    );
  });

  it("rejects an invalid payload (missing jobId)", async () => {
    const res = await POST(postRequest({ questions: [], answers: [] }));
    expect(res.status).toBe(400);
    expect(mocks.upsertDraft).not.toHaveBeenCalled();
  });
});
