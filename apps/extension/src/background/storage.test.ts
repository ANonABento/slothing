import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AUTH_CACHE_TTL_MS,
  clearSessionAuthCache,
  getSessionAuthCache,
  isSessionLost,
  SESSION_LOST_WINDOW_MS,
  setSessionAuthCache,
} from "./storage";

describe("isSessionLost", () => {
  const now = new Date("2026-05-12T12:00:00.000Z").getTime();

  it("returns false when an authToken is present (signed in)", () => {
    const result = isSessionLost(
      {
        authToken: "abc",
        lastSeenAuthAt: new Date(now - 60_000).toISOString(),
      },
      now,
    );
    expect(result).toBe(false);
  });

  it("returns true when authToken is missing but lastSeenAuthAt is recent", () => {
    // Simulates the SW-state-loss scenario: authToken cleared by storage
    // corruption but we know we had a working session within the 24h window.
    const recent = new Date(now - 5 * 60 * 1000).toISOString();
    const result = isSessionLost(
      { authToken: undefined, lastSeenAuthAt: recent },
      now,
    );
    expect(result).toBe(true);
  });

  it("returns false when lastSeenAuthAt is older than the 24h window", () => {
    // Stale prompts are worse than no prompt; treat this as a true logout.
    const stale = new Date(now - SESSION_LOST_WINDOW_MS - 60_000).toISOString();
    const result = isSessionLost(
      { authToken: undefined, lastSeenAuthAt: stale },
      now,
    );
    expect(result).toBe(false);
  });

  it("returns false when lastSeenAuthAt has never been recorded (fresh install)", () => {
    const result = isSessionLost(
      { authToken: undefined, lastSeenAuthAt: undefined },
      now,
    );
    expect(result).toBe(false);
  });

  it("returns false when lastSeenAuthAt is an unparseable string", () => {
    const result = isSessionLost(
      { authToken: undefined, lastSeenAuthAt: "not-a-date" },
      now,
    );
    expect(result).toBe(false);
  });

  it("returns true exactly at the 24h boundary", () => {
    const onBoundary = new Date(now - SESSION_LOST_WINDOW_MS).toISOString();
    const result = isSessionLost(
      { authToken: undefined, lastSeenAuthAt: onBoundary },
      now,
    );
    // <= window is the inclusive check we want; one millisecond beyond falls
    // through to the unauthenticated hero.
    expect(result).toBe(true);
  });
});

/**
 * Session-scoped auth verdict cache (#30). Uses chrome.storage.session
 * (NOT local) so the verdict is wiped on browser restart. Tests stub the
 * chrome global with an in-memory map matching the chrome.storage.session
 * shape.
 */
describe("session auth cache (#30)", () => {
  let store: Record<string, unknown>;

  beforeEach(() => {
    store = {};
    vi.stubGlobal("chrome", {
      storage: {
        session: {
          get: (key: string, cb: (result: Record<string, unknown>) => void) => {
            cb({ [key]: store[key] });
          },
          set: (entries: Record<string, unknown>, cb: () => void) => {
            Object.assign(store, entries);
            cb();
          },
          remove: (key: string, cb: () => void) => {
            delete store[key];
            cb();
          },
        },
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null when nothing has been cached yet", async () => {
    const result = await getSessionAuthCache();
    expect(result).toBeNull();
  });

  it("round-trips a fresh authenticated verdict", async () => {
    await setSessionAuthCache(true);
    const result = await getSessionAuthCache();
    expect(result?.authenticated).toBe(true);
    expect(typeof result?.at).toBe("string");
  });

  it("round-trips a fresh unauthenticated verdict", async () => {
    await setSessionAuthCache(false);
    const result = await getSessionAuthCache();
    expect(result?.authenticated).toBe(false);
  });

  it("returns null once the TTL has elapsed", async () => {
    const stale = new Date(Date.now() - AUTH_CACHE_TTL_MS - 1000).toISOString();
    store["columbus_auth_cache"] = { authenticated: true, at: stale };
    const result = await getSessionAuthCache();
    expect(result).toBeNull();
  });

  it("returns the entry when it is exactly at the TTL boundary", async () => {
    const now = Date.now();
    const onBoundary = new Date(now - AUTH_CACHE_TTL_MS).toISOString();
    store["columbus_auth_cache"] = { authenticated: true, at: onBoundary };
    const result = await getSessionAuthCache(now);
    expect(result?.authenticated).toBe(true);
  });

  it("returns null for an unparseable timestamp (defensive)", async () => {
    store["columbus_auth_cache"] = { authenticated: true, at: "not-iso" };
    const result = await getSessionAuthCache();
    expect(result).toBeNull();
  });

  it("clearSessionAuthCache drops the entry so subsequent reads return null", async () => {
    await setSessionAuthCache(true);
    expect(await getSessionAuthCache()).not.toBeNull();
    await clearSessionAuthCache();
    expect(await getSessionAuthCache()).toBeNull();
  });

  it("returns null when chrome.storage.session is unavailable (older browsers)", async () => {
    vi.stubGlobal("chrome", { storage: {} });
    const result = await getSessionAuthCache();
    expect(result).toBeNull();
  });
});
