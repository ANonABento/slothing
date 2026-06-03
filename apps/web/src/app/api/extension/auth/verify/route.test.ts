import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  deleteExtensionSession: vi.fn(),
  getExtensionSessionByToken: vi.fn(),
  touchExtensionSession: vi.fn(),
  nowDate: vi.fn(),
  nowIso: vi.fn(),
}));

vi.mock("@/lib/db/extension-sessions", () => ({
  deleteExtensionSession: mocks.deleteExtensionSession,
  getExtensionSessionByToken: mocks.getExtensionSessionByToken,
  touchExtensionSession: mocks.touchExtensionSession,
}));

vi.mock("@/lib/format/time", () => ({
  nowDate: mocks.nowDate,
  nowIso: mocks.nowIso,
  parseToDate: (value: string) => new Date(value),
}));

import { GET } from "./route";

const validSession = {
  id: "session-1",
  user_id: "user-1",
  token: "known-token",
  expires_at: "2026-05-11T13:00:00.000Z",
  last_used_at: null,
};

function request(token?: string) {
  return new NextRequest("http://localhost/api/extension/auth/verify", {
    headers: token ? { "x-extension-token": token } : {},
  });
}

describe("/api/extension/auth/verify", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.nowDate.mockReturnValue(new Date("2026-05-11T12:00:00.000Z"));
    mocks.nowIso.mockReturnValue("2026-05-11T12:00:00.000Z");
  });

  it("returns 401 when the extension token header is missing", async () => {
    const response = await GET(request());

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "No token provided",
    });
    expect(mocks.getExtensionSessionByToken).not.toHaveBeenCalled();
  });

  it("returns 401 for an unknown token", async () => {
    mocks.getExtensionSessionByToken.mockResolvedValueOnce(null);

    const response = await GET(request("unknown-token"));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Invalid token" });
    expect(mocks.getExtensionSessionByToken).toHaveBeenCalledWith(
      "unknown-token",
    );
  });

  it("returns 401 and deletes an expired token", async () => {
    const expiredSession = {
      ...validSession,
      expires_at: "2026-05-11T11:59:59.000Z",
    };
    mocks.getExtensionSessionByToken.mockResolvedValueOnce(expiredSession);

    const response = await GET(request("expired-token"));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Token expired" });
    expect(mocks.getExtensionSessionByToken).toHaveBeenCalledWith(
      "expired-token",
    );
    expect(mocks.deleteExtensionSession).toHaveBeenCalledWith(
      "session-1",
      "user-1",
    );
  });

  it("returns 200 and updates last_used_at for a valid token", async () => {
    mocks.getExtensionSessionByToken.mockResolvedValueOnce(validSession);

    const response = await GET(request("known-token"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      valid: true,
      userId: "user-1",
      expiresAt: "2026-05-11T13:00:00.000Z",
    });
    expect(mocks.getExtensionSessionByToken).toHaveBeenCalledWith(
      "known-token",
    );
    expect(mocks.touchExtensionSession).toHaveBeenCalledWith(
      "session-1",
      "user-1",
      "2026-05-11T12:00:00.000Z",
    );
  });
});
