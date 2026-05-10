export const WELCOME_DAYS = [1, 3, 7, 14] as const;

export type WelcomeDay = (typeof WELCOME_DAYS)[number];
export type WelcomeStep = `day${WelcomeDay}`;

export const WELCOME_SKIP_REASONS = {
  alreadyApplied: "already-applied",
  alreadyInterviewed: "already-booked-interview",
  alreadyPro: "already-pro",
} as const;

export type WelcomeSkipReason =
  (typeof WELCOME_SKIP_REASONS)[keyof typeof WELCOME_SKIP_REASONS];
