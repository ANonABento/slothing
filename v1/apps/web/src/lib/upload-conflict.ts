import { DEFAULT_LOCALE, formatAbsolute, parseToDate } from "@/lib/format/time";
export interface UploadConflictExisting {
  id?: string;
  filename: string;
  uploaded_at?: string;
  uploadedAt?: string;
}

export interface UploadConflictResponse {
  existing: UploadConflictExisting;
}

export function getExistingUploadTimestamp(
  existing: UploadConflictExisting,
): string | undefined {
  return existing.uploadedAt ?? existing.uploaded_at;
}

export function formatExistingUploadDate(
  timestamp?: string,
  locale = DEFAULT_LOCALE,
): string {
  if (!timestamp) return "an earlier date";

  const date = parseToDate(timestamp)!;
  if (Number.isNaN(date.getTime())) return "an earlier date";

  return formatAbsolute(date, { locale });
}
