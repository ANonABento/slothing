import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createCalendarFeedToken,
  verifyCalendarFeedToken,
} from "@/lib/calendar/feed-token";

describe("calendar feed tokens", () => {
  beforeEach(() => {
    vi.stubEnv("CALENDAR_FEED_SECRET", "test-calendar-secret");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("creates tokens that verify back to the originating user", () => {
    const token = createCalendarFeedToken("user_123");

    expect(verifyCalendarFeedToken(token)).toBe("user_123");
  });

  it("rejects tampered tokens", () => {
    const token = createCalendarFeedToken("user_123");
    const tamperedToken = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;

    expect(verifyCalendarFeedToken(tamperedToken)).toBeNull();
  });

  it("rejects malformed tokens", () => {
    expect(verifyCalendarFeedToken("not-a-valid-token")).toBeNull();
  });
});
