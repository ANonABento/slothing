import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireExtensionAuth: vi.fn(),
  recordSubmission: vi.fn(),
}));

vi.mock("@/lib/extension-auth", () => ({
  requireExtensionAuth: mocks.requireExtensionAuth,
}));

vi.mock("@/lib/db/application-drafts", () => ({
  recordSubmission: mocks.recordSubmission,
}));

import { POST } from "./route";

function postRequest(body: unknown) {
  return new NextRequest(
    "http://localhost/api/extension/drafts/d1/submit-result",
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    },
  );
}

const ctx = { params: { id: "d1" } };

describe("extension submit-result route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireExtensionAuth.mockResolvedValue({
      success: true,
      userId: "user-1",
    });
  });

  it("rejects unauthenticated requests", async () => {
    mocks.requireExtensionAuth.mockResolvedValueOnce({
      success: false,
      response: NextResponse.json({ error: "no token" }, { status: 401 }),
    });
    const res = await POST(postRequest({ ok: true }), ctx);
    expect(res.status).toBe(401);
    expect(mocks.recordSubmission).not.toHaveBeenCalled();
  });

  it("records a successful submission", async () => {
    mocks.recordSubmission.mockResolvedValueOnce({
      draft: { id: "d1", status: "submitted" },
      gated: false,
    });
    const res = await POST(postRequest({ ok: true, atsRef: "GH-1" }), ctx);
    expect(res.status).toBe(200);
    expect(mocks.recordSubmission).toHaveBeenCalledWith("d1", "user-1", {
      ok: true,
      atsRef: "GH-1",
    });
  });

  it("409s when the draft is not approved (gate)", async () => {
    mocks.recordSubmission.mockResolvedValueOnce({
      draft: { id: "d1", status: "pending_review" },
      gated: true,
    });
    const res = await POST(postRequest({ ok: true }), ctx);
    expect(res.status).toBe(409);
  });

  it("404s when the draft is missing", async () => {
    mocks.recordSubmission.mockResolvedValueOnce({ draft: null, gated: false });
    const res = await POST(postRequest({ ok: false, error: "x" }), ctx);
    expect(res.status).toBe(404);
  });

  it("400s on an invalid body", async () => {
    const res = await POST(postRequest({ notOk: 1 }), ctx);
    expect(res.status).toBe(400);
    expect(mocks.recordSubmission).not.toHaveBeenCalled();
  });
});
