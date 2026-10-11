import { getSetting, setSetting } from "@/lib/db/queries";

export const DIGEST_ENABLED_SETTING_KEY = "digest_enabled";
export const DEFAULT_DIGEST_ENABLED = true;

export function parseDigestEnabled(value: string | null): boolean {
  if (value === null) {
    return DEFAULT_DIGEST_ENABLED;
  }

  return value === "true";
}

export function getDigestEnabled(userId: string): boolean {
  return parseDigestEnabled(getSetting(DIGEST_ENABLED_SETTING_KEY, userId));
}

export function setDigestEnabled(enabled: boolean, userId: string): void {
  setSetting(DIGEST_ENABLED_SETTING_KEY, String(enabled), userId);
}
