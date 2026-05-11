import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { getSetting, setSetting } from "@/lib/db/queries";

export const GMAIL_AUTO_STATUS_ENABLED_SETTING_KEY =
  "gmail_auto_status_enabled";
export const GMAIL_LAST_SCANNED_AT_SETTING_KEY = "gmail_last_scanned_at";

export function parseGmailAutoStatusEnabled(value: string | null): boolean {
  return value === "true";
}

export function getGmailAutoStatusEnabled(
  userId: string,
): boolean {
  return parseGmailAutoStatusEnabled(
    getSetting(GMAIL_AUTO_STATUS_ENABLED_SETTING_KEY, userId),
  );
}

export function setGmailAutoStatusEnabled(
  enabled: boolean,
  userId: string,
): void {
  setSetting(GMAIL_AUTO_STATUS_ENABLED_SETTING_KEY, String(enabled), userId);
}

export function getGmailLastScannedAt(
  userId: string,
): string | null {
  return getSetting(GMAIL_LAST_SCANNED_AT_SETTING_KEY, userId);
}

export function setGmailLastScannedAt(
  iso: string,
  userId: string,
): void {
  setSetting(GMAIL_LAST_SCANNED_AT_SETTING_KEY, iso, userId);
}

export async function listGmailAutoStatusEnabledUserIds(): Promise<string[]> {
  const rows = await getDb()
    .select({ userId: settings.userId })
    .from(settings)
    .where(eq(settings.key, GMAIL_AUTO_STATUS_ENABLED_SETTING_KEY))
    .all();

  return rows
    .filter((row) => getGmailAutoStatusEnabled(row.userId))
    .map((row) => row.userId);
}
