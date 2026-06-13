import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireExtensionAuth: vi.fn(),
  listDrafts: vi.fn(),
  upsertDraft: vi.fn(),
  getJob: vi.fn(),
}));

vi.mock("@/lib/extension-auth", () => ({
  requireExtensionAuth: mocks.requireExtensionAuth,
}));

vi.mock("@/lib/db/application-drafts", () => ({
  listDrafts: mocks.listDrafts,
  upsertDraft: mocks.upsertDraft,
}));

vi.mock("@/lib/db/jobs-async", () => ({
  getJob: mocks.getJob,
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
    mocks.getJob.mockResolvedValue(null);
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
    mocks.listDrafts.mockResolvedValueOnce([{ id: "d1", jobId: "job-1" }]);
    const res = await GET(
      new NextRequest("http://localhost/api/extension/drafts?status=approved"),
    );
    expect(res.status).toBe(200);
    expect(mocks.listDrafts).toHaveBeenCalledWith("user-1", {
      status: "approved",
      limit: undefined,
    });
  });

  it("enriches each draft with its job title/company/url for page matching", async () => {
    mocks.listDrafts.mockResolvedValueOnce([{ id: "d1", jobId: "job-1" }]);
    mocks.getJob.mockResolvedValueOnce({
      id: "job-1",
      title: "Staff Engineer",
      company: "Acme",
      url: "https://boards.greenhouse.io/acme/jobs/123",
    });
    const res = await GET(
      new NextRequest("http://localhost/api/extension/drafts?status=approved"),
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      drafts: Array<{ job: { title: string; company: string; url: string } }>;
    };
    expect(mocks.getJob).toHaveBeenCalledWith("job-1", "user-1");
    expect(body.drafts[0].job).toEqual({
      title: "Staff Engineer",
      company: "Acme",
      url: "https://boards.greenhouse.io/acme/jobs/123",
    });
  });

  it("sets job to null when the linked job is gone", async () => {
    mocks.listDrafts.mockResolvedValueOnce([{ id: "d1", jobId: "missing" }]);
    mocks.getJob.mockResolvedValueOnce(null);
    const res = await GET(
      new NextRequest("http://localhost/api/extension/drafts?status=approved"),
    );
    const body = (await res.json()) as {
      drafts: Array<{ job: unknown }>;
    };
    expect(body.drafts[0].job).toBeNull();
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
