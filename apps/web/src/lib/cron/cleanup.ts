import { getClient } from "@/lib/db/client";
import { ensureSharedResumesSchema } from "@/lib/db/shared-resumes";
import { ensureExtensionSessionsColumnsAsync } from "@/lib/db/extension-sessions";
import { nowEpoch, toIso } from "@/lib/format/time";

export interface CleanupCronResult {
  expiredShares: number;
  expiredAuthSessions: number;
  expiredVerificationTokens: number;
  expiredExtensionSessions: number;
  oldCronRuns: number;
  errors: string[];
}

export async function runCleanupCron(
  now: number = nowEpoch(),
): Promise<CleanupCronResult> {
  await ensureSharedResumesSchema();
  await ensureExtensionSessionsColumnsAsync();

  const result: CleanupCronResult = {
    expiredShares: 0,
    expiredAuthSessions: 0,
    expiredVerificationTokens: 0,
    expiredExtensionSessions: 0,
    oldCronRuns: 0,
    errors: [],
  };

  result.expiredShares = await safeDelete(
    "expiredShares",
    "DELETE FROM shared_resumes WHERE expires_at <= ?",
    [now],
    result.errors,
  );
  result.expiredAuthSessions = await safeDelete(
    "expiredAuthSessions",
    "DELETE FROM session WHERE expires <= ?",
    [now],
    result.errors,
  );
  result.expiredVerificationTokens = await safeDelete(
    "expiredVerificationTokens",
    "DELETE FROM verificationToken WHERE expires <= ?",
    [now],
    result.errors,
  );
  result.expiredExtensionSessions = await safeDelete(
    "expiredExtensionSessions",
    "DELETE FROM extension_sessions WHERE expires_at <= ?",
    [toIso(now)],
    result.errors,
  );
  result.oldCronRuns = await safeDelete(
    "oldCronRuns",
    "DELETE FROM cron_runs WHERE started_at < ?",
    [toIso(now - 30 * 24 * 60 * 60 * 1000)],
    result.errors,
  );

  return result;
}

async function safeDelete(
  label: string,
  sql: string,
  params: Array<string | number | null>,
  errors: string[],
): Promise<number> {
  try {
    const outcome = await getClient().execute({ sql, args: params });
    return outcome.rowsAffected;
  } catch (error) {
    errors.push(
      `${label}: ${error instanceof Error ? error.message : "unknown error"}`,
    );
    return 0;
  }
}
