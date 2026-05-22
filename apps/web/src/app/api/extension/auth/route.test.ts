import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  EXTENSION_TOKEN_TTL_LOCALSTORAGE_MS,
  EXTENSION_TOKEN_TTL_RUNTIME_MS,
} from "@/lib/db/extension-sessions";

const mocks = vi.hoisted(() => ({
  requireAuth: vi.fn(),
  isAuthError: vi.fn(),
  nowEpoch: vi.fn(),
  createExtensionSession: vi.fn(),
  deleteExtensionSessionByToken: vi.fn(),
  deleteExtensionSessionsForUser: vi.fn(),
  ensureExtensionSessionsColumnsAsync: vi.fn(),
  trackActivationEvent: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: mocks.requireAuth,
  isAuthError: mocks.isAuthError,
}));

vi.mock("@/lib/format/time", () => ({
  nowEpoch: mocks.nowEpoch,
  toIso: (date: Date) => date.toISOString(),
}));

vi.mock("@/lib/db/extension-sessions", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/db/extension-sessions")>();
  return {
    ...actual,
    createExtensionSession: mocks.createExtensionSession,
    deleteExtensionSessionByToken: mocks.deleteExtensionSessionByToken,
    deleteExtensionSessionsForUser: mocks.deleteExtensionSessionsForUser,
    ensureExtensionSessionsColumnsAsync:
      mocks.ensureExtensionSessionsColumnsAsync,
  };
});

vi.mock("@/lib/db/product-analytics", () => ({
  trackActivationEvent: mocks.trackActivationEvent,
}));

import { POST } from "./route";

describe("extension auth route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAuth.mockResolvedValue({ userId: "user-1" });
    mocks.isAuthError.mockReturnValue(false);
    mocks.nowEpoch.mockReturnValue(Date.UTC(2026, 4, 9, 12, 0, 0));
  });

  it("creates a runtime token with the long TTL and stores both device labels", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/extension/auth", {
        method: "POST",
        body: JSON.stringify({
          deviceInfo: "Chrome 121 on macOS",
          userAgent: "raw user agent",
          transport: "runtime",
        }),
      }),
    );
    const body = await response.json();

    expect(body.expiresAt).toBe(
      new Date(
        Date.UTC(2026, 4, 9, 12, 0, 0) + EXTENSION_TOKEN_TTL_RUNTIME_MS,
      ).toISOString(),
    );
    expect(mocks.ensureExtensionSessionsColumnsAsync).toHaveBeenCalled();
    expect(mocks.createExtensionSession).toHaveBeenCalledWith({
      id: expect.any(String),
      userId: "user-1",
      token: body.token,
      deviceInfo: "Chrome 121 on macOS",
      userAgent: "raw user agent",
      expiresAt: body.expiresAt,
    });
  });

  it("creates a localStorage token with the short TTL", async () => {
    const response = await POST(
      new NextRequest("http://localhost/api/extension/auth", {
        method: "POST",
        body: JSON.stringify({
          transport: "localstorage",
        }),
      }),
    );
    const body = await response.json();

    expect(body.expiresAt).toBe(
      new Date(
        Date.UTC(2026, 4, 9, 12, 0, 0) + EXTENSION_TOKEN_TTL_LOCALSTORAGE_MS,
      ).toISOString(),
    );
    expect(mocks.createExtensionSession).toHaveBeenCalledWith({
      id: expect.any(String),
      userId: "user-1",
      token: body.token,
      deviceInfo: undefined,
      userAgent: undefined,
      expiresAt: body.expiresAt,
    });
  });
});
