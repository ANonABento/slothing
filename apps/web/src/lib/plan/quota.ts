import db from "@/lib/db/legacy";
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

export function getMonthlyTailorCount(
  userId: string,
  now: string = nowIso(),
): number {
  const { startAt } = getMonthWindow(now);
  const row = db
    .prepare(
      `
        SELECT COUNT(*) as count
        FROM generated_resumes
        WHERE user_id = ? AND created_at >= ?
      `,
    )
    .get(userId, startAt) as { count?: number } | undefined;

  return row?.count ?? 0;
}

export function checkTailorQuota(
  userId: string,
): TailorQuotaStatus {
  const now = nowIso();
  const tier = getUserTier(userId);
  const { tailorMonthlyLimit } = getTierLimits(tier);
  const { resetAt } = getMonthWindow(now);
  const used = getMonthlyTailorCount(userId, now);

  return {
    allowed: tailorMonthlyLimit === Infinity || used < tailorMonthlyLimit,
    tier,
    used,
    limit: tailorMonthlyLimit,
    resetAt,
  };
}
