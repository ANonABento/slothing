import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getSetting: vi.fn(),
  setSetting: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  getSetting: mocks.getSetting,
  setSetting: mocks.setSetting,
}));

import {
  CALENDAR_LAST_PULLED_AT_SETTING_KEY,
  CALENDAR_PULL_ENABLED_SETTING_KEY,
  getCalendarLastPulledAt,
  getCalendarPullEnabled,
  setCalendarLastPulledAt,
  setCalendarPullEnabled,
} from "./calendar-sync";

describe("calendar sync settings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("defaults pull enabled to off", () => {
    mocks.getSetting.mockReturnValue(null);

    expect(getCalendarPullEnabled("user-1")).toBe(false);
  });

  it("parses stored true and false values", () => {
    mocks.getSetting.mockReturnValueOnce("true").mockReturnValueOnce("false");

    expect(getCalendarPullEnabled("user-1")).toBe(true);
    expect(getCalendarPullEnabled("user-1")).toBe(false);
  });

  it("persists the enabled flag with the expected key", () => {
    setCalendarPullEnabled(true, "user-1");

    expect(mocks.setSetting).toHaveBeenCalledWith(
      CALENDAR_PULL_ENABLED_SETTING_KEY,
      "true",
      "user-1",
    );
  });

  it("reads and writes the last pulled timestamp", () => {
    mocks.getSetting.mockReturnValue("2026-05-10T00:00:00.000Z");

    expect(getCalendarLastPulledAt("user-1")).toBe("2026-05-10T00:00:00.000Z");
    setCalendarLastPulledAt("2026-05-10T00:30:00.000Z", "user-1");
    expect(mocks.setSetting).toHaveBeenCalledWith(
      CALENDAR_LAST_PULLED_AT_SETTING_KEY,
      "2026-05-10T00:30:00.000Z",
      "user-1",
    );
  });
});
