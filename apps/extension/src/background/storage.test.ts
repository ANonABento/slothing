import { describe, expect, it } from "vitest";
import { isSessionLost, SESSION_LOST_WINDOW_MS } from "./storage";

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
