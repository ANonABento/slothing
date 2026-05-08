import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

const authMock = vi.fn();
const headersMock = vi.fn();

vi.mock("@/auth", () => ({
  auth: (...args: unknown[]) => authMock(...args),
  isNextAuthConfigured: () =>
    Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
}));

vi.mock("next/headers", () => ({
  headers: () => headersMock(),
}));

import { getCurrentUserId, isAuthError, requireAuth } from "./auth";

const ORIGINAL_GOOGLE_ID = process.env.GOOGLE_CLIENT_ID;
const ORIGINAL_GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET;

function configureNextAuth(enabled: boolean) {
  if (enabled) {
    process.env.GOOGLE_CLIENT_ID = "test-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-secret";
  } else {
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;
  }
}

beforeEach(() => {
  authMock.mockReset();
  headersMock.mockReset();
});

afterEach(() => {
  if (ORIGINAL_GOOGLE_ID === undefined) {
    delete process.env.GOOGLE_CLIENT_ID;
  } else {
    process.env.GOOGLE_CLIENT_ID = ORIGINAL_GOOGLE_ID;
  }
  if (ORIGINAL_GOOGLE_SECRET === undefined) {
    delete process.env.GOOGLE_CLIENT_SECRET;
  } else {
    process.env.GOOGLE_CLIENT_SECRET = ORIGINAL_GOOGLE_SECRET;
  }
});

describe("getCurrentUserId", () => {
  it("returns the local-dev fallback user when NextAuth is not configured", async () => {
    configureNextAuth(false);
    headersMock.mockReturnValue({ get: () => null });

    expect(await getCurrentUserId()).toBe("default");
    expect(authMock).not.toHaveBeenCalled();
  });

  it("honours the e2e header override in local-dev mode", async () => {
    configureNextAuth(false);
    headersMock.mockReturnValue({
      get: (name: string) =>
        name === "x-get-me-job-e2e-user" ? "e2e-tester" : null,
    });

    expect(await getCurrentUserId()).toBe("e2e-tester");
  });

  it("returns the NextAuth session user id when authenticated", async () => {
    configureNextAuth(true);
    authMock.mockResolvedValue({ user: { id: "user-123" } });

    expect(await getCurrentUserId()).toBe("user-123");
  });

  it("returns null when NextAuth has no active session", async () => {
    configureNextAuth(true);
    authMock.mockResolvedValue(null);

    expect(await getCurrentUserId()).toBeNull();
  });
});

describe("requireAuth", () => {
  it("returns the local-dev user when NextAuth is not configured", async () => {
    configureNextAuth(false);
    headersMock.mockReturnValue({ get: () => null });

    const result = await requireAuth();
    expect(isAuthError(result)).toBe(false);
    expect(result).toEqual({ userId: "default" });
  });

  it("returns the authenticated user when a NextAuth session exists", async () => {
    configureNextAuth(true);
    authMock.mockResolvedValue({ user: { id: "user-abc" } });

    const result = await requireAuth();
    expect(isAuthError(result)).toBe(false);
    expect(result).toEqual({ userId: "user-abc" });
  });

  it("returns a 401 NextResponse when no session exists", async () => {
    configureNextAuth(true);
    authMock.mockResolvedValue(null);

    const result = await requireAuth();
    expect(isAuthError(result)).toBe(true);
    if (isAuthError(result)) {
      expect(result.status).toBe(401);
      expect(await result.json()).toEqual({ error: "Unauthorized" });
    }
  });
});

describe("isAuthError", () => {
  it("identifies NextResponse instances as errors", () => {
    const response = NextResponse.json({ error: "nope" }, { status: 401 });
    expect(isAuthError(response)).toBe(true);
  });

  it("does not flag plain auth result objects", () => {
    expect(isAuthError({ userId: "user-1" })).toBe(false);
  });
});
