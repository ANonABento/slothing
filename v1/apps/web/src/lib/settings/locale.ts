import { getSetting, setSetting } from "@/lib/db/queries";
import { DEFAULT_LOCALE, normalizeLocale } from "@/lib/format/time";

export const LOCALE_SETTING_KEY = "locale";

export function getStoredLocaleSetting(userId: string): string | null {
  const locale = getSetting(LOCALE_SETTING_KEY, userId);
  return locale ? normalizeLocale(locale) : null;
}

export function getLocaleSetting(userId: string): string {
  return getStoredLocaleSetting(userId) ?? DEFAULT_LOCALE;
}

export function setLocaleSetting(locale: string, userId: string): string {
  const normalized = normalizeLocale(locale || DEFAULT_LOCALE);
  setSetting(LOCALE_SETTING_KEY, normalized, userId);
  return normalized;
}
