import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  let row: Record<string, unknown> | null = null;
  let unlocks: Record<string, unknown>[] = [];
  let id = 0;

  function applyStatement(sql: string, args: unknown[]) {
    if (sql.includes("INSERT INTO user_activity")) {
      row = {
        id: args[0],
        user_id: args[1],
        current_streak: args[2],
        longest_streak: args[3],
        last_activity_day: args[4],
        total_opps_created: args[5],
        total_opps_applied: args[6],
        total_resumes_tailored: args[7],
        total_cover_letters: args[8],
        total_emails_sent: args[9],
        total_interviews_started: args[10],
        updated_at: args[11],
      };
      return;
    }

    if (sql.includes("UPDATE user_activity")) {
      row = {
        ...row,
        current_streak: args[0],
        longest_streak: args[1],
        last_activity_day: args[2],
        total_opps_created:
          Number(row?.total_opps_created ?? 0) +
          (sql.includes("total_opps_created =") ? 1 : 0),
        total_opps_applied:
          Number(row?.total_opps_applied ?? 0) +
          (sql.includes("total_opps_applied =") ? 1 : 0),
        total_resumes_tailored:
          Number(row?.total_resumes_tailored ?? 0) +
          (sql.includes("total_resumes_tailored =") ? 1 : 0),
        total_cover_letters:
          Number(row?.total_cover_letters ?? 0) +
          (sql.includes("total_cover_letters =") ? 1 : 0),
        total_emails_sent:
          Number(row?.total_emails_sent ?? 0) +
          (sql.includes("total_emails_sent =") ? 1 : 0),
        total_interviews_started:
          Number(row?.total_interviews_started ?? 0) +
          (sql.includes("total_interviews_started =") ? 1 : 0),
        updated_at: args[3],
      };
      return;
    }

    if (sql.includes("INSERT OR IGNORE INTO achievement_unlocks")) {
      const achievementId = args[2];
      if (!unlocks.some((item) => item.achievement_id === achievementId)) {
        unlocks.push({
          id: args[0],
          user_id: args[1],
          achievement_id: achievementId,
          unlocked_at: args[3],
        });
      }
    }
  }

  return {
    execute: vi.fn(async (statement: string | { sql: string }) => {
      const sql = typeof statement === "string" ? statement : statement.sql;
      if (sql.includes("FROM user_activity")) return { rows: row ? [row] : [] };
      if (sql.includes("FROM achievement_unlocks")) return { rows: unlocks };
      return { rows: [] };
    }),
    batch: vi.fn(
      async (statements: Array<{ sql: string; args?: unknown[] }>) => {
        for (const statement of statements) {
          applyStatement(statement.sql, statement.args ?? []);
        }
        return [];
      },
    ),
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

vi.mock("./client", () => ({
  getClient: () => ({
    execute: mocks.execute,
    batch: mocks.batch,
  }),
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

  it("increments counters but not streak for multiple same-day actions", async () => {
    const now = new Date("2026-05-10T12:00:00.000Z");

    await trackActivity("user-1", "opp_created", { now });
    await trackActivity("user-1", "opp_created", { now });

    const state = await getStreakState("user-1", { now });
    expect(state.currentStreak).toBe(1);
    expect(state.longestStreak).toBe(1);
    expect(state.lifetime.opportunitiesCreated).toBe(2);
  });

  it("increments consecutive days and resets after a missed day", async () => {
    await trackActivity("user-1", "email_sent", {
      now: new Date("2026-05-10T12:00:00.000Z"),
    });
    await trackActivity("user-1", "email_sent", {
      now: new Date("2026-05-11T12:00:00.000Z"),
    });
    await trackActivity("user-1", "email_sent", {
      now: new Date("2026-05-13T12:00:00.000Z"),
    });

    const state = await getStreakState("user-1", {
      now: new Date("2026-05-13T12:00:00.000Z"),
    });
    expect(state.currentStreak).toBe(1);
    expect(state.longestStreak).toBe(2);
  });

  it("reports stale streaks as broken on read", async () => {
    await trackActivity("user-1", "interview_started", {
      now: new Date("2026-05-10T12:00:00.000Z"),
    });

    const state = await getStreakState("user-1", {
      now: new Date("2026-05-12T12:00:00.000Z"),
    });
    expect(state.currentStreak).toBe(0);
    expect(state.longestStreak).toBe(1);
  });
});
