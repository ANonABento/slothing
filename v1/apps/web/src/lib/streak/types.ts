export type ActivityType =
  | "opp_created"
  | "opp_status_changed"
  | "opp_applied"
  | "tailor_generated"
  | "cover_letter_generated"
  | "email_sent"
  | "interview_started";

export type AchievementId =
  | "first_opp"
  | "first_apply"
  | "first_interview"
  | "first_tailored_resume"
  | "first_cover_letter"
  | "first_email"
  | "apps_10"
  | "apps_50"
  | "apps_100"
  | "streak_3"
  | "streak_7"
  | "streak_30";

export interface LifetimeCounters {
  opportunitiesCreated: number;
  opportunitiesApplied: number;
  resumesTailored: number;
  coverLetters: number;
  emailsSent: number;
  interviewsStarted: number;
}

export interface WeekDayActivity {
  date: string;
  active: boolean;
  today: boolean;
}

export interface AchievementDefinition {
  id: AchievementId;
  title: string;
  description: string;
  emoji: string;
  colorToken: "primary" | "success" | "accent" | "warning" | "info";
  isUnlocked: (state: StreakState) => boolean;
}

export interface AchievementUnlock {
  id: string;
  achievementId: AchievementId;
  title: string;
  description: string;
  emoji: string;
  colorToken: AchievementDefinition["colorToken"];
  unlockedAt: string;
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActivityDay: string | null;
  weekDays: WeekDayActivity[];
  lifetime: LifetimeCounters;
  unlockedIds: AchievementId[];
  unlocked: AchievementUnlock[];
}

export interface TrackActivityResult {
  unlocked: AchievementUnlock[];
}
