import {
  DEFAULT_PLAN_TIER,
  FREE_TIER_TAILOR_MONTHLY_LIMIT,
  PRO_TIER_TAILOR_MONTHLY_LIMIT,
  STUDENT_TIER_TAILOR_MONTHLY_LIMIT,
  planTierSchema,
  type PlanTier,
} from "@/lib/constants";
import { getSetting, setSetting } from "@/lib/db/queries";

export const PLAN_TIER_SETTING_KEY = "plan_tier";

export function getUserTier(userId: string): PlanTier {
  const storedTier = getSetting(PLAN_TIER_SETTING_KEY, userId);
  const parsedTier = planTierSchema.safeParse(storedTier);

  return parsedTier.success ? parsedTier.data : DEFAULT_PLAN_TIER;
}

export function setUserTier(
  userId: string,
  tier: PlanTier,
): PlanTier {
  const parsedTier = planTierSchema.parse(tier);
  setSetting(PLAN_TIER_SETTING_KEY, parsedTier, userId);
  return parsedTier;
}

export function getTierLimits(tier: PlanTier) {
  switch (tier) {
    case "pro":
      return { tailorMonthlyLimit: PRO_TIER_TAILOR_MONTHLY_LIMIT };
    case "student":
      return { tailorMonthlyLimit: STUDENT_TIER_TAILOR_MONTHLY_LIMIT };
    case "free":
    default:
      return { tailorMonthlyLimit: FREE_TIER_TAILOR_MONTHLY_LIMIT };
  }
}
