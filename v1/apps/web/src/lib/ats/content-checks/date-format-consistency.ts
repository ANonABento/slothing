// Date format consistency detector.
//
// Older ATS parsers (Taleo notably) can mis-extract dates when formats are
// mixed across roles — "Jan 2021 – Present" in one role and "01/2021 – 05/2023"
// in another. The fix is mechanical: pick one format and stick to it.

export type DateFormatKind =
  | "monthName" // Jan 2021 / January 2021
  | "numericSlash" // 01/2021 or 1/2021
  | "numericDash" // 01-2021 or 2021-01
  | "yearOnly" // 2021
  | "unknown";

export interface DateSample {
  raw: string;
  kind: DateFormatKind;
  location: string;
}

export interface DateFormatReport {
  samples: DateSample[];
  /** Distinct format kinds observed, excluding 'unknown' and 'yearOnly'. */
  distinctFormats: DateFormatKind[];
  inconsistent: boolean;
}

const MONTH_NAME_RE =
  /^(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{4}$/i;
const NUMERIC_SLASH_RE = /^\d{1,2}\/\d{4}$/;
const NUMERIC_DASH_RE = /^\d{1,2}-\d{4}$|^\d{4}-\d{1,2}$/;
const YEAR_ONLY_RE = /^\d{4}$/;

export function classifyDateString(raw: string): DateFormatKind {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return "unknown";
  if (trimmed.includes("present") || trimmed.includes("current"))
    return "unknown";
  if (MONTH_NAME_RE.test(trimmed)) return "monthName";
  if (NUMERIC_SLASH_RE.test(trimmed)) return "numericSlash";
  if (NUMERIC_DASH_RE.test(trimmed)) return "numericDash";
  if (YEAR_ONLY_RE.test(trimmed)) return "yearOnly";
  return "unknown";
}

export interface DateInput {
  raw: string;
  location: string;
}

export function analyzeDateFormatConsistency(
  inputs: DateInput[],
): DateFormatReport {
  const samples: DateSample[] = inputs
    .filter((input) => input.raw && input.raw.trim().length > 0)
    .map((input) => ({
      raw: input.raw,
      location: input.location,
      kind: classifyDateString(input.raw),
    }));

  const distinct = Array.from(
    new Set(
      samples
        .map((sample) => sample.kind)
        .filter((kind) => kind !== "unknown" && kind !== "yearOnly"),
    ),
  );

  return {
    samples,
    distinctFormats: distinct,
    inconsistent: distinct.length > 1,
  };
}
