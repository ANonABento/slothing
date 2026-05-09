import { Briefcase, FileText, Upload } from "lucide-react";
import { getPipelineTotal } from "@/lib/opportunities/pipeline";
import type { OnboardingStats, OnboardingStep } from "./types";

export const BASIC_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "upload-resume",
    icon: Upload,
    title: "Upload your resume",
    description: "We'll organize your experience and make it reusable.",
    href: "/bank",
    actionLabel: "Upload resume",
    isComplete: (stats) => stats.documentsCount > 0,
    tier: "basic",
  },
  {
    id: "add-opportunity",
    icon: Briefcase,
    title: "Add your first opportunity",
    description: "Track a role and see what documents you need.",
    href: "/opportunities",
    actionLabel: "Add opportunity",
    isComplete: (stats) => getPipelineTotal(stats.jobsByStatus) > 0,
    tier: "basic",
  },
  {
    id: "create-tailored-doc",
    icon: FileText,
    title: "Create a tailored document",
    description:
      "Use your resume and target role to draft a stronger application.",
    href: "/studio",
    actionLabel: "Open Studio",
    isComplete: (stats) => stats.resumesGenerated > 0,
    tier: "basic",
  },
];

// TODO: Populate with Cover Letter generator, Interview Prep, Salary research,
// Studio templates, and Calendar integration onboarding steps.
export const ADVANCED_ONBOARDING_STEPS: OnboardingStep[] = [];

export function getActiveStepIndex(
  steps: OnboardingStep[],
  stats: OnboardingStats,
): number {
  return steps.findIndex((step) => !step.isComplete(stats));
}

export function countCompletedSteps(
  steps: OnboardingStep[],
  stats: OnboardingStats,
): number {
  return steps.filter((step) => step.isComplete(stats)).length;
}
