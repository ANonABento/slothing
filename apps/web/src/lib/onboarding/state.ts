import { BASIC_ONBOARDING_STEPS } from "./steps";
import type { OnboardingStats } from "./types";

export function computeOnboardingActive({
  dismissedAt,
  stats,
}: {
  dismissedAt: string | null;
  stats: OnboardingStats;
}): boolean {
  return (
    !dismissedAt &&
    BASIC_ONBOARDING_STEPS.some((step) => !step.isComplete(stats))
  );
}
