export const DEFAULT_LOCALE = "en-US";
const NUMERIC_PARTS_LOCALE = `${DEFAULT_LOCALE}-u-nu-latn`;
export const LOCALE_COOKIE_NAME = "taida_locale";
export const LOCALE_CHANGE_EVENT = "taida:locale-change";

export const SUPPORTED_LOCALES = [
  { value: "en-US", label: "English (US)" },
  { value: "en-CA", label: "English (CA)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
  { value: "de", label: "German" },
  { value: "ja", label: "Japanese" },
  { value: "zh-CN", label: "Chinese (Simplified)" },
  { value: "pt", label: "Portuguese" },
  { value: "pt-BR", label: "Portuguese (Brazil)" },
  { value: "hi", label: "Hindi" },
  { value: "ko", label: "Korean" },
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]["value"];

export type TimeInput = Date | string | number | null | undefined;

export type DisplayTimeOptions = {
  locale?: string;
  includeTime?: boolean;
  timeZone?: string;
};

export type DateOnlyOptions = {
  locale?: string;
  timeZone?: string;
};

export type RelativeTimeOptions = {
  locale?: string;
  now?: TimeInput;
};

export function normalizeLocale(locale: string | null | undefined): string {
  if (!locale) return DEFAULT_LOCALE;

  const supported = SUPPORTED_LOCALES.find(
    (candidate) =>
      candidate.value.toLowerCase() === locale.toLowerCase() ||
      candidate.value.split("-")[0].toLowerCase() === locale.toLowerCase(),
  );

  return supported?.value ?? DEFAULT_LOCALE;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function nowDate(): Date {
  return new Date();
}

export function nowEpoch(): number {
  return Date.now();
}

export function parseToDate(value: TimeInput): Date | null {
  if (value === null || value === undefined || value === "") return null;

  const date =
    value instanceof Date ? new Date(value.getTime()) : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function toIso(value: Date | string | number): string {
  const date = parseToDate(value);
  if (!date) {
    throw new TypeError("Expected a valid date value");
  }

  return date.toISOString();
}

export function toNullableIso(value: TimeInput): string | null {
  return parseToDate(value)?.toISOString() ?? null;
}

export function toEpoch(value: Date | string | number): number {
  const date = parseToDate(value);
  if (!date) {
    throw new TypeError("Expected a valid date value");
  }

  return date.getTime();
}

export function toNullableEpoch(value: TimeInput): number | null {
  return parseToDate(value)?.getTime() ?? null;
}

export function getUserTimezone(): string {
  if (typeof Intl === "undefined") return "UTC";

  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function getDisplayTimezone(timeZone?: string): string {
  if (timeZone) return timeZone;
  return typeof window === "undefined" ? "UTC" : getUserTimezone();
}

export function formatAbsolute(
  value: TimeInput,
  opts: DisplayTimeOptions = {},
): string {
  const date = parseToDate(value);
  if (!date) return "Unknown date";

  const includeTime = opts.includeTime ?? true;
  const formatter = new Intl.DateTimeFormat(normalizeLocale(opts.locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(includeTime ? { hour: "numeric", minute: "2-digit" } : {}),
    timeZone: getDisplayTimezone(opts.timeZone),
  });
  const formatted = formatter.format(date);

  if (!includeTime) return formatted;

  const lastComma = formatted.lastIndexOf(",");

  if (lastComma === -1) return formatted;
  return `${formatted.slice(0, lastComma)} · ${formatted
    .slice(lastComma + 1)
    .trim()}`;
}

export function formatRelative(
  value: TimeInput,
  opts: RelativeTimeOptions = {},
): string {
  const date = parseToDate(value);
  const current = parseToDate(opts.now ?? nowIso());
  if (!date || !current) {
    return "Unknown date";
  }

  const diffMs = current.getTime() - date.getTime();
  const absMs = Math.abs(diffMs);
  const isFuture = diffMs < 0;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (absMs < minute) return "Just now";
  if (absMs < hour)
    return formatRelativeBucket(Math.floor(absMs / minute), "m", isFuture);
  if (absMs < day)
    return formatRelativeBucket(Math.floor(absMs / hour), "h", isFuture);
  if (absMs < 2 * day) return isFuture ? "Tomorrow" : "Yesterday";
  if (absMs < week)
    return formatRelativeBucket(Math.floor(absMs / day), "d", isFuture);
  if (absMs < month)
    return formatRelativeBucket(Math.floor(absMs / week), "w", isFuture);
  if (absMs < year)
    return formatRelativeBucket(Math.floor(absMs / month), "mo", isFuture);
  return formatRelativeBucket(Math.floor(absMs / year), "y", isFuture);
}

export function formatDateOnly(
  value: TimeInput,
  opts: DateOnlyOptions = {},
): string {
  const date = parseToDate(value);
  if (!date) return "Unknown date";

  return new Intl.DateTimeFormat(normalizeLocale(opts.locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: getDisplayTimezone(opts.timeZone),
  }).format(date);
}

export function formatTimeOnly(
  value: TimeInput,
  opts: DateOnlyOptions = {},
): string {
  const date = parseToDate(value);
  if (!date) return "Unknown time";

  return new Intl.DateTimeFormat(normalizeLocale(opts.locale), {
    hour: "numeric",
    minute: "2-digit",
    timeZone: getDisplayTimezone(opts.timeZone),
  }).format(date);
}

export function formatIsoDateOnly(value: TimeInput = nowIso()): string {
  return toIso(parseToDate(value) ?? nowIso()).slice(0, 10);
}

export function formatMonthYear(
  value: TimeInput,
  opts: DateOnlyOptions = {},
): string {
  const date = parseToDate(value);
  if (!date) return "";

  return new Intl.DateTimeFormat(normalizeLocale(opts.locale), {
    month: "short",
    year: "numeric",
    timeZone: getDisplayTimezone(opts.timeZone),
  }).format(date);
}

export function isPast(value: TimeInput, now: TimeInput = nowIso()): boolean {
  const date = parseToDate(value);
  const current = parseToDate(now);
  return Boolean(date && current && date.getTime() < current.getTime());
}

export function isFuture(value: TimeInput, now: TimeInput = nowIso()): boolean {
  const date = parseToDate(value);
  const current = parseToDate(now);
  return Boolean(date && current && date.getTime() > current.getTime());
}

export function diffSeconds(a: TimeInput, b: TimeInput): number {
  const first = parseToDate(a);
  const second = parseToDate(b);
  if (!first || !second) return Number.NaN;
  return Math.trunc((first.getTime() - second.getTime()) / 1000);
}

export function diffDays(a: TimeInput, b: TimeInput): number {
  const seconds = diffSeconds(a, b);
  return Number.isNaN(seconds) ? Number.NaN : seconds / 86_400;
}

export function addDays(value: TimeInput, days: number): Date {
  const date = parseToDate(value);
  if (!date) throw new TypeError("Expected a valid date value");
  return new Date(date.getTime() + days * 86_400_000);
}

export function addMinutes(value: TimeInput, minutes: number): Date {
  const date = parseToDate(value);
  if (!date) throw new TypeError("Expected a valid date value");
  return new Date(date.getTime() + minutes * 60_000);
}

export function startOfDay(value: TimeInput, timeZone = "UTC"): Date {
  const date = parseToDate(value);
  if (!date) throw new TypeError("Expected a valid date value");

  if (timeZone === "UTC") {
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
  }

  const parts = getZonedParts(date, timeZone);
  return zonedTimeToUtc(parts.year, parts.month, parts.day, 0, 0, 0, timeZone);
}

export function endOfDay(value: TimeInput, timeZone = "UTC"): Date {
  return addMinutes(addDays(startOfDay(value, timeZone), 1), -1 / 60_000);
}

export function toUserTz(value: TimeInput, timeZone = getUserTimezone()): Date {
  const date = parseToDate(value);
  if (!date) throw new TypeError("Expected a valid date value");
  const parts = getZonedParts(date, timeZone);
  return new Date(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
}

export function formatDateAbsolute(
  date: Date | string | number,
  locale = DEFAULT_LOCALE,
): string {
  return formatAbsolute(date, { locale });
}

export function formatDateRelative(
  date: Date | string | number,
  now: Date | string | number = nowIso(),
): string {
  return formatRelative(date, { now });
}

export function getBrowserDefaultLocale(): string {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  return normalizeLocale(navigator.language);
}

function formatRelativeBucket(
  value: number,
  unit: "m" | "h" | "d" | "w" | "mo" | "y",
  isFuture: boolean,
): string {
  return isFuture ? `in ${value}${unit}` : `${value}${unit} ago`;
}

function getZonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat(NUMERIC_PARTS_LOCALE, {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
}

function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string,
): Date {
  const utcGuess = new Date(
    Date.UTC(year, month - 1, day, hour, minute, second),
  );
  const parts = getZonedParts(utcGuess, timeZone);
  const offsetMs =
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    ) - utcGuess.getTime();

  return new Date(utcGuess.getTime() - offsetMs);
}
