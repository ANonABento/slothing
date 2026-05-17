import { z } from "zod";

// Theme options
export const THEMES = ["light", "dark", "system"] as const;

export type Theme = (typeof THEMES)[number];

export const themeSchema = z.enum(THEMES);

// Storage keys
export const STORAGE_KEYS = {
  ONBOARDING_COMPLETED: "get_me_job_onboarding_completed",
} as const;
