import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  createShare: vi.fn(),
  listSharesForUser: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: (value: unknown) => value instanceof Response,
}));

vi.mock("@/lib/db/shared-resumes", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/db/shared-resumes")
  >("@/lib/db/shared-resumes");
  return {
    ...actual,
    createShare: mocks.createShare,
    listSharesForUser: mocks.listSharesForUser,
  };
});

import { GET, POST } from "./route";

function makePost(body: unknown, init: RequestInit = {}): NextRequest {
  return new NextRequest("http://localhost/api/share", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "localhost",
      ...(init.headers || {}),
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/share", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
  });

  it("creates a share and returns {token, url, expiresAt, createdAt}", async () => {
    const createdAt = 1_700_000_000_000;
    const expiresAt = createdAt + 7 * 24 * 60 * 60 * 1000;
    mocks.createShare.mockReturnValue({
      id: "abc123token",
      userId: "user-1",
      documentHtml: "<h1>R</h1>",
      documentTitle: "Resume",
      createdAt,
      expiresAt,
      viewCount: 0,
    });

    const response = await POST(
      makePost({ html: "<h1>R</h1>", title: "Resume" }),
    );
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toEqual({
      token: "abc123token",
      url: "http://localhost/share/abc123token",
      createdAt,
      expiresAt,
    });
    expect(mocks.createShare).toHaveBeenCalledWith({
      userId: "user-1",
      html: "<h1>R</h1>",
      title: "Resume",
    });
  });

  it("rejects unauthenticated callers", async () => {
    mocks.requireAuth.mockResolvedValue(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    );

    const response = await POST(makePost({ html: "<p>x</p>", title: "x" }));
    expect(response.status).toBe(401);
    expect(mocks.createShare).not.toHaveBeenCalled();
  });

  it("rejects bodies missing html", async () => {
    const response = await POST(makePost({ title: "x" }));
    expect(response.status).toBe(400);
    expect(mocks.createShare).not.toHaveBeenCalled();
  });

  it("rejects empty-string html", async () => {
    const response = await POST(makePost({ html: "", title: "x" }));
    expect(response.status).toBe(400);
    expect(mocks.createShare).not.toHaveBeenCalled();
  });

  it("rejects invalid JSON bodies", async () => {
    const request = new NextRequest("http://localhost/api/share", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "not-json",
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
    expect(mocks.createShare).not.toHaveBeenCalled();
  });

  it("surfaces createShare errors as 400", async () => {
    mocks.createShare.mockImplementation(() => {
      throw new Error("Snapshot exceeds maximum share size");
    });

    const response = await POST(makePost({ html: "<p>x</p>", title: "x" }));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toMatch(/Snapshot exceeds maximum share size/);
  });
});

describe("GET /api/share", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
  });

  it("returns the user's share summaries", async () => {
    mocks.listSharesForUser.mockReturnValue([
      {
        id: "tok-1",
        documentTitle: "Resume",
        createdAt: 1,
        expiresAt: 2,
        viewCount: 0,
      },
    ]);

    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      shares: [
        {
          id: "tok-1",
          documentTitle: "Resume",
          createdAt: 1,
          expiresAt: 2,
          viewCount: 0,
        },
      ],
    });
    expect(mocks.listSharesForUser).toHaveBeenCalledWith("user-1");
  });

  it("rejects unauthenticated callers", async () => {
    mocks.requireAuth.mockResolvedValue(
      NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    );

    const response = await GET();
    expect(response.status).toBe(401);
    expect(mocks.listSharesForUser).not.toHaveBeenCalled();
  });
});
