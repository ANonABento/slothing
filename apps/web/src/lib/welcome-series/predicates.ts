import db from "@/lib/db/legacy";

interface ExistsRow {
  found: number;
}

interface CountRow {
  count: number;
}

export interface UsageStats {
  applicationCount: number;
  tailoredResumeCount: number;
}

export function hasUserApplied(userId: string): boolean {
  const row = db
    .prepare(
      "SELECT 1 AS found FROM jobs WHERE user_id = ? AND status = 'applied' LIMIT 1",
    )
    .get(userId) as ExistsRow | undefined;

  return Boolean(row?.found);
}

export function hasUserBookedInterview(userId: string): boolean {
  const row = db
    .prepare(
      "SELECT 1 AS found FROM interview_sessions WHERE user_id = ? LIMIT 1",
    )
    .get(userId) as ExistsRow | undefined;

  return Boolean(row?.found);
}

export function getUsageStats(userId: string): UsageStats {
  const applicationRow = db
    .prepare(
      "SELECT COUNT(*) AS count FROM jobs WHERE user_id = ? AND status = 'applied'",
    )
    .get(userId) as CountRow | undefined;
  const tailoredRow = db
    .prepare(
      "SELECT COUNT(*) AS count FROM generated_resumes WHERE user_id = ?",
    )
    .get(userId) as CountRow | undefined;

  return {
    applicationCount: applicationRow?.count ?? 0,
    tailoredResumeCount: tailoredRow?.count ?? 0,
  };
}
