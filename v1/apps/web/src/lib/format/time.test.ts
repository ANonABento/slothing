import { describe, expect, it } from "vitest";
import {
  addDays,
  diffSeconds,
  endOfDay,
  formatAbsolute,
  formatDateOnly,
  formatDateAbsolute,
  formatDateRelative,
  formatIsoDateOnly,
  formatMonthYear,
  formatRelative,
  formatTimeOnly,
  isFuture,
  isPast,
  normalizeLocale,
  parseToDate,
  startOfDay,
  toEpoch,
  toIso,
  toNullableIso,
} from "./time";

describe("time formatting", () => {
  it("formats absolute dates with the requested locale", () => {
    expect(formatDateAbsolute("2026-04-29T20:01:04.882Z", "en-US")).toContain(
      "2026",
    );
    expect(formatDateAbsolute("2026-04-29T20:01:04.882Z", "en-GB")).toContain(
      "2026",
    );
  });

  it("formats relative dates across expected buckets", () => {
    const now = "2026-05-04T12:00:00.000Z";

    expect(formatDateRelative("2026-05-04T11:59:30.000Z", now)).toBe(
      "Just now",
    );
    expect(formatDateRelative("2026-05-04T10:00:00.000Z", now)).toBe("2h ago");
    expect(formatDateRelative("2026-05-03T12:00:00.000Z", now)).toBe(
      "Yesterday",
    );
    expect(formatDateRelative("2026-05-01T12:00:00.000Z", now)).toBe("3d ago");
    expect(formatDateRelative("2026-04-13T12:00:00.000Z", now)).toBe("3w ago");
    expect(formatDateRelative("2026-02-04T12:00:00.000Z", now)).toBe("2mo ago");
    expect(formatDateRelative("2024-05-04T12:00:00.000Z", now)).toBe("2y ago");
  });

  it("formats future dates without labeling them as past dates", () => {
    const now = "2026-05-04T12:00:00.000Z";

    expect(formatDateRelative("2026-05-04T12:15:00.000Z", now)).toBe("in 15m");
    expect(formatDateRelative("2026-05-05T12:00:00.000Z", now)).toBe(
      "Tomorrow",
    );
    expect(formatDateRelative("2026-05-07T12:00:00.000Z", now)).toBe("in 3d");
  });

  it("normalizes supported and unsupported locales", () => {
    expect(normalizeLocale("fr")).toBe("fr");
    expect(normalizeLocale("en")).toBe("en-US");
    expect(normalizeLocale("zz-ZZ")).toBe("en-US");
  });

  it("parses mixed input types defensively", () => {
    const iso = "2026-02-28T12:34:56.789Z";

    expect(parseToDate(iso)?.toISOString()).toBe(iso);
    expect(parseToDate(new Date(iso))?.toISOString()).toBe(iso);
    expect(parseToDate(Date.parse(iso))?.toISOString()).toBe(iso);
    expect(parseToDate(null)).toBeNull();
    expect(parseToDate(undefined)).toBeNull();
    expect(parseToDate("not a date")).toBeNull();
  });

  it("converts to canonical UTC ISO and epoch values", () => {
    const iso = "2026-05-09T10:08:00.000Z";

    expect(toIso("2026-05-09T06:08:00-04:00")).toBe(iso);
    expect(toNullableIso(undefined)).toBeNull();
    expect(toEpoch(iso)).toBe(Date.parse(iso));
    expect(() => toIso("nope")).toThrow(TypeError);
  });

  it("formats display values with timezone overrides", () => {
    const iso = "2026-05-09T10:08:00.000Z";

    expect(
      formatAbsolute(iso, {
        locale: "en-US",
        timeZone: "UTC",
      }),
    ).toContain("10:08 AM");
    expect(formatDateOnly(iso, { locale: "en-US", timeZone: "UTC" })).toBe(
      "May 9, 2026",
    );
    expect(formatTimeOnly(iso, { locale: "en-US", timeZone: "UTC" })).toBe(
      "10:08 AM",
    );
    expect(formatMonthYear(iso, { locale: "en-US", timeZone: "UTC" })).toBe(
      "May 2026",
    );
  });

  it("handles leap day and UTC day boundaries", () => {
    const leapDay = "2024-02-29T23:30:00.000Z";

    expect(formatIsoDateOnly(leapDay)).toBe("2024-02-29");
    expect(addDays(leapDay, 1).toISOString()).toBe("2024-03-01T23:30:00.000Z");
    expect(startOfDay(leapDay).toISOString()).toBe("2024-02-29T00:00:00.000Z");
    expect(endOfDay(leapDay).toISOString()).toBe("2024-02-29T23:59:59.999Z");
  });

  it("calculates timezone day boundaries across DST", () => {
    expect(
      startOfDay("2026-03-08T16:00:00.000Z", "America/New_York").toISOString(),
    ).toBe("2026-03-08T05:00:00.000Z");
    expect(
      startOfDay("2026-11-01T16:00:00.000Z", "America/New_York").toISOString(),
    ).toBe("2026-11-01T04:00:00.000Z");
  });

  it("compares and diffs dates", () => {
    const now = "2026-05-09T10:08:00.000Z";

    expect(isPast("2026-05-09T10:07:59.000Z", now)).toBe(true);
    expect(isFuture("2026-05-09T10:08:01.000Z", now)).toBe(true);
    expect(diffSeconds("2026-05-09T10:08:30.000Z", now)).toBe(30);
    expect(formatRelative("2026-05-09T10:09:00.000Z", { now })).toBe("in 1m");
  });
});
