import { describe, expect, it } from "vitest";
import { ACHIEVEMENTS, getUnlockedAchievementIds } from "./achievements";
import type { StreakState } from "./types";

function state(overrides: Partial<StreakState> = {}): StreakState {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDay: null,
    weekDays: [],
    lifetime: {
      opportunitiesCreated: 0,
      opportunitiesApplied: 0,
      resumesTailored: 0,
      coverLetters: 0,
      emailsSent: 0,
      interviewsStarted: 0,
    },
    unlockedIds: [],
    unlocked: [],
    ...overrides,
  };
}

describe("streak achievements", () => {
  it("defines the initial achievement set with display metadata", () => {
    expect(ACHIEVEMENTS).toHaveLength(12);
    expect(ACHIEVEMENTS.every((achievement) => achievement.emoji)).toBe(true);
    expect(ACHIEVEMENTS.every((achievement) => achievement.colorToken)).toBe(
      true,
    );
  });

  it("unlocks first-action achievements at their thresholds", () => {
    const unlocked = getUnlockedAchievementIds(
      state({
        lifetime: {
          opportunitiesCreated: 1,
          opportunitiesApplied: 1,
          resumesTailored: 1,
          coverLetters: 1,
          emailsSent: 1,
          interviewsStarted: 1,
        },
      }),
    );

    expect(unlocked).toEqual(
      expect.arrayContaining([
        "first_opp",
        "first_apply",
        "first_tailored_resume",
        "first_cover_letter",
        "first_email",
        "first_interview",
      ]),
    );
  });

  it("unlocks application and streak milestones only at threshold", () => {
    expect(
      getUnlockedAchievementIds(
        state({
          currentStreak: 6,
          lifetime: {
            opportunitiesCreated: 0,
            opportunitiesApplied: 49,
            resumesTailored: 0,
            coverLetters: 0,
            emailsSent: 0,
            interviewsStarted: 0,
          },
        }),
      ),
    ).not.toEqual(expect.arrayContaining(["apps_50", "streak_7"]));

    expect(
      getUnlockedAchievementIds(
        state({
          currentStreak: 7,
          lifetime: {
            opportunitiesCreated: 0,
            opportunitiesApplied: 50,
            resumesTailored: 0,
            coverLetters: 0,
            emailsSent: 0,
            interviewsStarted: 0,
          },
        }),
      ),
    ).toEqual(expect.arrayContaining(["apps_50", "streak_7"]));
  });
});
