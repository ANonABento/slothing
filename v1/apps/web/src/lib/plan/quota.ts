import { getClient } from "@/lib/db/client";
import type { PlanTier } from "@/lib/constants";
import { nowDate, nowIso, parseToDate, toIso } from "@/lib/format/time";
import { getTierLimits, getUserTier } from "./tier";

export interface TailorQuotaStatus {
  allowed: boolean;
  tier: PlanTier;
  used: number;
  limit: number;
  resetAt: string;
}

function getMonthWindow(now: string) {
  const current = parseToDate(now) ?? nowDate();
  const monthStart = parseToDate(current.getTime()) ?? nowDate();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const nextMonthStart = parseToDate(monthStart.getTime()) ?? nowDate();
  nextMonthStart.setUTCMonth(monthStart.getUTCMonth() + 1);

  return {
    startAt: toIso(monthStart),
    resetAt: toIso(nextMonthStart),
  };
}

export async function getMonthlyTailorCount(
  userId: string,
  now: string = nowIso(),
): Promise<number> {
  const { startAt } = getMonthWindow(now);
  const result = await getClient().execute({
    sql: `
        SELECT COUNT(*) as count
        FROM generated_resumes
        WHERE user_id = ? AND created_at >= ?
      `,
    args: [userId, startAt],
  });
  const row = result.rows[0] as unknown as { count?: number } | undefined;

  return row?.count ?? 0;
}

export async function checkTailorQuota(
  userId: string,
): Promise<TailorQuotaStatus> {
  const now = nowIso();
  const tier = getUserTier(userId);
  const { tailorMonthlyLimit } = getTierLimits(tier);
  const { resetAt } = getMonthWindow(now);
  const used = await getMonthlyTailorCount(userId, now);

  return {
    allowed: tailorMonthlyLimit === Infinity || used < tailorMonthlyLimit,
    tier,
    used,
    limit: tailorMonthlyLimit,
    resetAt,
  };
}
