import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  let row: Record<string, unknown> | null = null;
  let unlocks: Record<string, unknown>[] = [];
  let id = 0;

  return {
    exec: vi.fn(),
    prepare: vi.fn((sql: string) => {
      if (sql.includes("FROM user_activity")) {
        return { get: vi.fn(() => row) };
      }
      if (sql.includes("FROM achievement_unlocks")) {
        return { all: vi.fn(() => unlocks) };
      }
      if (sql.includes("INSERT INTO user_activity")) {
        return {
          run: vi.fn(
            (
              activityId,
              userId,
              currentStreak,
              longestStreak,
              lastActivityDay,
              totalOppsCreated,
              totalOppsApplied,
              totalResumesTailored,
              totalCoverLetters,
              totalEmailsSent,
              totalInterviewsStarted,
              updatedAt,
            ) => {
              row = {
                id: activityId,
                user_id: userId,
                current_streak: currentStreak,
                longest_streak: longestStreak,
                last_activity_day: lastActivityDay,
                total_opps_created: totalOppsCreated,
                total_opps_applied: totalOppsApplied,
                total_resumes_tailored: totalResumesTailored,
                total_cover_letters: totalCoverLetters,
                total_emails_sent: totalEmailsSent,
                total_interviews_started: totalInterviewsStarted,
                updated_at: updatedAt,
              };
            },
          ),
        };
      }
      if (sql.includes("UPDATE user_activity")) {
        return {
          run: vi.fn((currentStreak, longestStreak, lastActivityDay, ...rest) => {
            const updatedAt = rest.at(-2);
            const typeSql = sql;
            row = {
              ...row,
              current_streak: currentStreak,
              longest_streak: longestStreak,
              last_activity_day: lastActivityDay,
              total_opps_created:
                Number(row?.total_opps_created ?? 0) +
                (typeSql.includes("total_opps_created =") ? 1 : 0),
              total_opps_applied:
                Number(row?.total_opps_applied ?? 0) +
                (typeSql.includes("total_opps_applied =") ? 1 : 0),
              total_resumes_tailored:
                Number(row?.total_resumes_tailored ?? 0) +
                (typeSql.includes("total_resumes_tailored =") ? 1 : 0),
              total_cover_letters:
                Number(row?.total_cover_letters ?? 0) +
                (typeSql.includes("total_cover_letters =") ? 1 : 0),
              total_emails_sent:
                Number(row?.total_emails_sent ?? 0) +
                (typeSql.includes("total_emails_sent =") ? 1 : 0),
              total_interviews_started:
                Number(row?.total_interviews_started ?? 0) +
                (typeSql.includes("total_interviews_started =") ? 1 : 0),
              updated_at: updatedAt,
            };
          }),
        };
      }
      if (sql.includes("INSERT OR IGNORE INTO achievement_unlocks")) {
        return {
          run: vi.fn((unlockId, userId, achievementId, unlockedAt) => {
            if (!unlocks.some((item) => item.achievement_id === achievementId)) {
              unlocks.push({
                id: unlockId,
                user_id: userId,
                achievement_id: achievementId,
                unlocked_at: unlockedAt,
              });
            }
          }),
        };
      }
      return { run: vi.fn(), get: vi.fn(), all: vi.fn() };
    }),
    reset() {
      row = null;
      unlocks = [];
      id = 0;
    },
    nextId() {
      id += 1;
      return `id-${id}`;
    },
  };
});

vi.mock("./legacy", () => ({
  default: {
    exec: mocks.exec,
    prepare: mocks.prepare,
  },
}));

vi.mock("@/lib/utils", () => ({
  generateId: mocks.nextId,
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

import { getStreakState, trackActivity } from "./streak";

describe("streak database helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.reset();
  });

  it("increments counters but not streak for multiple same-day actions", () => {
    const now = new Date("2026-05-10T12:00:00.000Z");

    trackActivity("user-1", "opp_created", { now });
    trackActivity("user-1", "opp_created", { now });

    const state = getStreakState("user-1", { now });
    expect(state.currentStreak).toBe(1);
    expect(state.longestStreak).toBe(1);
    expect(state.lifetime.opportunitiesCreated).toBe(2);
  });

  it("increments consecutive days and resets after a missed day", () => {
    trackActivity("user-1", "email_sent", {
      now: new Date("2026-05-10T12:00:00.000Z"),
    });
    trackActivity("user-1", "email_sent", {
      now: new Date("2026-05-11T12:00:00.000Z"),
    });
    trackActivity("user-1", "email_sent", {
      now: new Date("2026-05-13T12:00:00.000Z"),
    });

    const state = getStreakState("user-1", {
      now: new Date("2026-05-13T12:00:00.000Z"),
    });
    expect(state.currentStreak).toBe(1);
    expect(state.longestStreak).toBe(2);
  });

  it("reports stale streaks as broken on read", () => {
    trackActivity("user-1", "interview_started", {
      now: new Date("2026-05-10T12:00:00.000Z"),
    });

    const state = getStreakState("user-1", {
      now: new Date("2026-05-12T12:00:00.000Z"),
    });
    expect(state.currentStreak).toBe(0);
    expect(state.longestStreak).toBe(1);
  });
});
