import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextResponse } from "next/server";

const authMock = vi.fn();
const headersMock = vi.fn();

vi.mock("@/auth", () => ({
  auth: (...args: unknown[]) => authMock(...args),
  DEV_AUTH_BYPASS_HEADER: {
    name: "X-Slothing-Dev-Auth",
    value: "default-user",
  },
  isDevAuthBypassAllowed: () =>
    process.env.NODE_ENV !== "production" &&
    process.env.SLOTHING_ALLOW_UNAUTHED_DEV === "1",
  isNextAuthConfigured: () =>
    Boolean(
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.NEXTAUTH_SECRET,
    ),
}));

vi.mock("next/headers", () => ({
  headers: () => headersMock(),
}));

import {
  __resetDevAuthBypassWarningForTests,
  getCurrentUserId,
  isAuthError,
  requireAuth,
} from "./auth";

const ORIGINAL_GOOGLE_ID = process.env.GOOGLE_CLIENT_ID;
const ORIGINAL_GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const ORIGINAL_NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
const ORIGINAL_ALLOW_UNAUTHED_DEV = process.env.SLOTHING_ALLOW_UNAUTHED_DEV;

function configureNextAuth(enabled: boolean) {
  if (enabled) {
    process.env.GOOGLE_CLIENT_ID = "test-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-secret";
    process.env.NEXTAUTH_SECRET = "test-nextauth-secret";
  } else {
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;
    delete process.env.NEXTAUTH_SECRET;
  }
}

beforeEach(() => {
  authMock.mockReset();
  headersMock.mockReset();
  __resetDevAuthBypassWarningForTests();
  delete process.env.SLOTHING_ALLOW_UNAUTHED_DEV;
  vi.stubEnv("NODE_ENV", "test");
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
  if (ORIGINAL_NEXTAUTH_SECRET === undefined) {
    delete process.env.NEXTAUTH_SECRET;
  } else {
    process.env.NEXTAUTH_SECRET = ORIGINAL_NEXTAUTH_SECRET;
  }
  if (ORIGINAL_ALLOW_UNAUTHED_DEV === undefined) {
    delete process.env.SLOTHING_ALLOW_UNAUTHED_DEV;
  } else {
    process.env.SLOTHING_ALLOW_UNAUTHED_DEV = ORIGINAL_ALLOW_UNAUTHED_DEV;
  }
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("getCurrentUserId", () => {
  it("returns null when NextAuth is not configured and dev bypass is off", async () => {
    configureNextAuth(false);
    headersMock.mockReturnValue({ get: () => null });

    expect(await getCurrentUserId()).toBeNull();
    expect(authMock).not.toHaveBeenCalled();
  });

  it("uses the local-dev fallback when dev bypass is explicitly enabled", async () => {
    process.env.SLOTHING_ALLOW_UNAUTHED_DEV = "1";
    configureNextAuth(false);
    headersMock.mockReturnValue({ get: () => null });

    expect(await getCurrentUserId()).toBe("default");
    expect(authMock).not.toHaveBeenCalled();
  });

  it("returns null when OAuth keys are present but NEXTAUTH_SECRET is missing", async () => {
    process.env.GOOGLE_CLIENT_ID = "test-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-secret";
    delete process.env.NEXTAUTH_SECRET;
    headersMock.mockReturnValue({ get: () => null });

    expect(await getCurrentUserId()).toBeNull();
    expect(authMock).not.toHaveBeenCalled();
  });

  it("honours the e2e header override when dev bypass is enabled", async () => {
    process.env.SLOTHING_ALLOW_UNAUTHED_DEV = "1";
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
  it("returns 503 when NextAuth is not configured and dev bypass is off", async () => {
    configureNextAuth(false);
    headersMock.mockReturnValue({ get: () => null });

    const result = await requireAuth();
    expect(isAuthError(result)).toBe(true);
    if (isAuthError(result)) {
      expect(result.status).toBe(503);
      expect(await result.json()).toEqual({
        error: "Authentication is not configured.",
      });
    }
    expect(authMock).not.toHaveBeenCalled();
  });

  it("returns the local-dev user and logs once when dev bypass is enabled", async () => {
    process.env.SLOTHING_ALLOW_UNAUTHED_DEV = "1";
    configureNextAuth(false);
    headersMock.mockReturnValue({ get: () => null });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const first = await requireAuth();
    const second = await requireAuth();

    expect(isAuthError(first)).toBe(false);
    expect(first).toEqual({ userId: "default" });
    expect(isAuthError(second)).toBe(false);
    expect(second).toEqual({ userId: "default" });
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      '[auth] DEV BYPASS: serving requests as userId="default"',
    );
    expect(authMock).not.toHaveBeenCalled();
  });

  it("does not allow the local-dev user fallback in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    process.env.SLOTHING_ALLOW_UNAUTHED_DEV = "1";
    configureNextAuth(false);
    headersMock.mockReturnValue({ get: () => null });

    const result = await requireAuth();

    expect(isAuthError(result)).toBe(true);
    if (isAuthError(result)) {
      expect(result.status).toBe(503);
    }
    expect(authMock).not.toHaveBeenCalled();
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
