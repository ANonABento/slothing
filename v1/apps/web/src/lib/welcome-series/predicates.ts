import { getClient } from "@/lib/db/client";

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

export async function hasUserApplied(userId: string): Promise<boolean> {
  const result = await getClient().execute({
    sql: "SELECT 1 AS found FROM jobs WHERE user_id = ? AND status = 'applied' LIMIT 1",
    args: [userId],
  });
  const row = result.rows[0] as unknown as ExistsRow | undefined;

  return Boolean(row?.found);
}

export async function hasUserBookedInterview(userId: string): Promise<boolean> {
  const result = await getClient().execute({
    sql: "SELECT 1 AS found FROM interview_sessions WHERE user_id = ? LIMIT 1",
    args: [userId],
  });
  const row = result.rows[0] as unknown as ExistsRow | undefined;

  return Boolean(row?.found);
}

export async function getUsageStats(userId: string): Promise<UsageStats> {
  const applicationResult = await getClient().execute({
    sql: "SELECT COUNT(*) AS count FROM jobs WHERE user_id = ? AND status = 'applied'",
    args: [userId],
  });
  const tailoredResult = await getClient().execute({
    sql: "SELECT COUNT(*) AS count FROM generated_resumes WHERE user_id = ?",
    args: [userId],
  });
  const applicationRow = applicationResult.rows[0] as unknown as
    | CountRow
    | undefined;
  const tailoredRow = tailoredResult.rows[0] as unknown as CountRow | undefined;

  return {
    applicationCount: applicationRow?.count ?? 0,
    tailoredResumeCount: tailoredRow?.count ?? 0,
  };
}
