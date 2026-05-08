import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { __test } from "./client";

const { isAccessTokenExpired, ACCESS_TOKEN_REFRESH_LEEWAY_SECONDS } = __test;

describe("isAccessTokenExpired", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("treats null/undefined expiry as not expired (no expiry stored)", () => {
    expect(isAccessTokenExpired(null)).toBe(false);
    expect(isAccessTokenExpired(undefined)).toBe(false);
  });

  it("returns true when the token expires within the leeway window", () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    expect(
      isAccessTokenExpired(
        nowSeconds + ACCESS_TOKEN_REFRESH_LEEWAY_SECONDS - 1,
      ),
    ).toBe(true);
  });

  it("returns false when the token expires safely past the leeway window", () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    expect(
      isAccessTokenExpired(
        nowSeconds + ACCESS_TOKEN_REFRESH_LEEWAY_SECONDS + 60,
      ),
    ).toBe(false);
  });

  it("returns true for clearly stale tokens", () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    expect(isAccessTokenExpired(nowSeconds - 600)).toBe(true);
  });
});

describe("refreshGoogleAccessToken", () => {
  const originalFetch = global.fetch;
  const originalClientId = process.env.GOOGLE_CLIENT_ID;
  const originalClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  beforeEach(() => {
    process.env.GOOGLE_CLIENT_ID = "test-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-secret";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.GOOGLE_CLIENT_ID = originalClientId;
    process.env.GOOGLE_CLIENT_SECRET = originalClientSecret;
  });

  it("returns null when no refresh_token is present", async () => {
    const result = await __test.refreshGoogleAccessToken({
      userId: "user-1",
      access_token: "old",
      refresh_token: null,
      expires_at: 1,
      scope: null,
    });
    expect(result).toBeNull();
  });

  it("returns null when GOOGLE_CLIENT_ID/SECRET are missing", async () => {
    delete process.env.GOOGLE_CLIENT_ID;
    const result = await __test.refreshGoogleAccessToken({
      userId: "user-1",
      access_token: "old",
      refresh_token: "refresh-token",
      expires_at: 1,
      scope: null,
    });
    expect(result).toBeNull();
  });
});
