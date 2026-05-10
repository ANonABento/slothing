import type { LucideIcon } from "lucide-react";

export type OnboardingTier = "basic" | "advanced";

export interface OnboardingStats {
  documentsCount: number;
  resumesGenerated: number;
  jobsByStatus: Record<string, number>;
}

export interface OnboardingStep {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  /** Determines if the step is complete based on dashboard stats. */
  isComplete: (stats: OnboardingStats) => boolean;
  /** Optional: which tier of onboarding this step belongs to. */
  tier?: OnboardingTier;
}
