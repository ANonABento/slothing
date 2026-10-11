import { z } from "zod";

export const PLAN_TIERS = ["free", "pro", "student"] as const;

export const planTierSchema = z.enum(PLAN_TIERS);

export type PlanTier = z.infer<typeof planTierSchema>;

export const DEFAULT_PLAN_TIER = "free" satisfies PlanTier;

export const FREE_TIER_TAILOR_MONTHLY_LIMIT = 5;
export const PRO_TIER_TAILOR_MONTHLY_LIMIT = Infinity;
export const STUDENT_TIER_TAILOR_MONTHLY_LIMIT = Infinity;

export const PLAN_TIER_LABELS = {
  free: "Free",
  pro: "Pro",
  student: "Student",
} satisfies Record<PlanTier, string>;
