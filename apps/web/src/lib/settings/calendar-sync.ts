import { getSetting, setSetting } from "@/lib/db";

export const CALENDAR_PULL_ENABLED_SETTING_KEY = "google_calendar_pull_enabled";
export const CALENDAR_LAST_PULLED_AT_SETTING_KEY =
  "google_calendar_last_pulled_at";
export const DEFAULT_CALENDAR_PULL_ENABLED = false;

export function getCalendarPullEnabled(userId: string): boolean {
  const value = getSetting(CALENDAR_PULL_ENABLED_SETTING_KEY, userId);
  if (value === null) return DEFAULT_CALENDAR_PULL_ENABLED;
  return value === "true";
}

export function setCalendarPullEnabled(enabled: boolean, userId: string): void {
  setSetting(
    CALENDAR_PULL_ENABLED_SETTING_KEY,
    enabled ? "true" : "false",
    userId,
  );
}

export function getCalendarLastPulledAt(userId: string): string | null {
  return getSetting(CALENDAR_LAST_PULLED_AT_SETTING_KEY, userId);
}

export function setCalendarLastPulledAt(iso: string, userId: string): void {
  setSetting(CALENDAR_LAST_PULLED_AT_SETTING_KEY, iso, userId);
}
