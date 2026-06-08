import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(() => false),
  listServiceTokens: vi.fn(),
  createServiceToken: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));
vi.mock("@/lib/db/service-tokens", () => ({
  listServiceTokens: mocks.listServiceTokens,
  createServiceToken: mocks.createServiceToken,
}));

import { GET, POST } from "./route";

describe("agent tokens route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
  });

  it("lists the user's service tokens", async () => {
    mocks.listServiceTokens.mockResolvedValueOnce([{ id: "t1" }]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(mocks.listServiceTokens).toHaveBeenCalledWith("user-1");
  });

  it("creates a token and returns the secret once", async () => {
    mocks.createServiceToken.mockResolvedValueOnce({
      id: "t1",
      token: "svc-secret",
    });
    const res = await POST(
      new NextRequest("http://localhost/api/agent/tokens", {
        method: "POST",
        body: JSON.stringify({ label: "agent" }),
        headers: { "content-type": "application/json" },
      }),
    );
    expect(res.status).toBe(201);
    const body = (await res.json()) as { token: { token: string } };
    expect(body.token.token).toBe("svc-secret");
    expect(mocks.createServiceToken).toHaveBeenCalledWith("user-1", "agent");
  });

  it("rejects unauthenticated list", async () => {
    mocks.isAuthError.mockReturnValueOnce(true);
    mocks.requireAuth.mockResolvedValueOnce(
      new Response("no", { status: 401 }),
    );
    const res = await GET();
    expect(res.status).toBe(401);
  });
});
