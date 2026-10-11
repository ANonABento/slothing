import type { AchievementDefinition, AchievementId, StreakState } from "./types";

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first_opp",
    title: "First opportunity",
    description: "Saved your first opportunity.",
    emoji: "🎯",
    colorToken: "primary",
    isUnlocked: (state) => state.lifetime.opportunitiesCreated >= 1,
  },
  {
    id: "first_apply",
    title: "First application",
    description: "Moved your first opportunity to applied.",
    emoji: "📮",
    colorToken: "success",
    isUnlocked: (state) => state.lifetime.opportunitiesApplied >= 1,
  },
  {
    id: "first_interview",
    title: "Interview started",
    description: "Started your first interview prep session.",
    emoji: "🎙️",
    colorToken: "accent",
    isUnlocked: (state) => state.lifetime.interviewsStarted >= 1,
  },
  {
    id: "first_tailored_resume",
    title: "Tailored resume",
    description: "Generated your first tailored resume.",
    emoji: "🧵",
    colorToken: "info",
    isUnlocked: (state) => state.lifetime.resumesTailored >= 1,
  },
  {
    id: "first_cover_letter",
    title: "Cover letter",
    description: "Generated your first cover letter.",
    emoji: "✍️",
    colorToken: "accent",
    isUnlocked: (state) => state.lifetime.coverLetters >= 1,
  },
  {
    id: "first_email",
    title: "First send",
    description: "Recorded your first sent email.",
    emoji: "📨",
    colorToken: "success",
    isUnlocked: (state) => state.lifetime.emailsSent >= 1,
  },
  {
    id: "apps_10",
    title: "Ten applications",
    description: "Reached 10 submitted applications.",
    emoji: "🔟",
    colorToken: "primary",
    isUnlocked: (state) => state.lifetime.opportunitiesApplied >= 10,
  },
  {
    id: "apps_50",
    title: "Fifty applications",
    description: "Reached 50 submitted applications.",
    emoji: "🏁",
    colorToken: "warning",
    isUnlocked: (state) => state.lifetime.opportunitiesApplied >= 50,
  },
  {
    id: "apps_100",
    title: "One hundred applications",
    description: "Reached 100 submitted applications.",
    emoji: "💯",
    colorToken: "success",
    isUnlocked: (state) => state.lifetime.opportunitiesApplied >= 100,
  },
  {
    id: "streak_3",
    title: "Three-day streak",
    description: "Took action three days in a row.",
    emoji: "🔥",
    colorToken: "warning",
    isUnlocked: (state) => state.currentStreak >= 3,
  },
  {
    id: "streak_7",
    title: "Seven-day streak",
    description: "Kept the system moving for a full week.",
    emoji: "🌟",
    colorToken: "primary",
    isUnlocked: (state) => state.currentStreak >= 7,
  },
  {
    id: "streak_30",
    title: "Thirty-day streak",
    description: "Built a month-long application rhythm.",
    emoji: "🏆",
    colorToken: "success",
    isUnlocked: (state) => state.currentStreak >= 30,
  },
];

export function getAchievement(id: AchievementId): AchievementDefinition {
  const achievement = ACHIEVEMENTS.find((item) => item.id === id);
  if (!achievement) throw new Error(`Unknown achievement: ${id}`);
  return achievement;
}

export function getUnlockedAchievementIds(state: StreakState): AchievementId[] {
  return ACHIEVEMENTS.filter((achievement) =>
    achievement.isUnlocked(state),
  ).map((achievement) => achievement.id);
}
