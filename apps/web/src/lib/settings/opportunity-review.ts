import { getSetting, setSetting } from "@/lib/db/queries";

export const OPPORTUNITY_REVIEW_SETTING_KEY = "opportunity_review_enabled";
export const DEFAULT_OPPORTUNITY_REVIEW_ENABLED = true;

export function parseOpportunityReviewEnabled(value: string | null): boolean {
  if (value === null) {
    return DEFAULT_OPPORTUNITY_REVIEW_ENABLED;
  }

  return value === "true";
}

export function getOpportunityReviewEnabled(userId: string): boolean {
  return parseOpportunityReviewEnabled(
    getSetting(OPPORTUNITY_REVIEW_SETTING_KEY, userId),
  );
}

export function setOpportunityReviewEnabled(
  enabled: boolean,
  userId: string,
): void {
  setSetting(OPPORTUNITY_REVIEW_SETTING_KEY, String(enabled), userId);
}
