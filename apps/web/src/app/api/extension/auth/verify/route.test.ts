import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  prepare: vi.fn(),
  nowDate: vi.fn(),
  nowIso: vi.fn(),
}));

vi.mock("@/lib/db/legacy", () => ({
  default: {
    prepare: mocks.prepare,
  },
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
    expect(mocks.prepare).not.toHaveBeenCalled();
  });

  it("returns 401 for an unknown token", async () => {
    const get = vi.fn(() => undefined);
    mocks.prepare.mockReturnValue({ get });

    const response = await GET(request("unknown-token"));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Invalid token" });
    expect(mocks.prepare).toHaveBeenCalledWith(
      expect.stringContaining(
        "SELECT * FROM extension_sessions WHERE token = ?",
      ),
    );
    expect(get).toHaveBeenCalledWith("unknown-token");
  });

  it("returns 401 and deletes an expired token", async () => {
    const expiredSession = {
      ...validSession,
      expires_at: "2026-05-11T11:59:59.000Z",
    };
    const get = vi.fn(() => expiredSession);
    const deleteRun = vi.fn();
    mocks.prepare.mockImplementation((sql: string) => {
      if (sql.includes("SELECT * FROM extension_sessions")) {
        return { get };
      }

      if (sql.includes("DELETE FROM extension_sessions")) {
        return { run: deleteRun };
      }

      throw new Error(`Unexpected SQL: ${sql}`);
    });

    const response = await GET(request("expired-token"));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Token expired" });
    expect(get).toHaveBeenCalledWith("expired-token");
    expect(deleteRun).toHaveBeenCalledWith("session-1", "user-1");
  });

  it("returns 200 and updates last_used_at for a valid token", async () => {
    const get = vi.fn(() => validSession);
    const updateRun = vi.fn();
    mocks.prepare.mockImplementation((sql: string) => {
      if (sql.includes("SELECT * FROM extension_sessions")) {
        return { get };
      }

      if (sql.includes("UPDATE extension_sessions SET last_used_at")) {
        return { run: updateRun };
      }

      throw new Error(`Unexpected SQL: ${sql}`);
    });

    const response = await GET(request("known-token"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      valid: true,
      userId: "user-1",
      expiresAt: "2026-05-11T13:00:00.000Z",
    });
    expect(get).toHaveBeenCalledWith("known-token");
    expect(updateRun).toHaveBeenCalledWith(
      "2026-05-11T12:00:00.000Z",
      "session-1",
      "user-1",
    );
  });
});
