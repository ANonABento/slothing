import db from "./legacy";
import { ensureStreakSchema } from "./streak-schema";
import { ACHIEVEMENTS, getAchievement } from "@/lib/streak/achievements";
import {
  addDays as addDaysToDate,
  formatIsoDateOnly,
  nowIso,
  toIso,
} from "@/lib/format/time";
import { generateId } from "@/lib/utils";
import type {
  AchievementId,
  AchievementUnlock,
  ActivityType,
  LifetimeCounters,
  StreakState,
  TrackActivityResult,
  WeekDayActivity,
} from "@/lib/streak/types";

interface UserActivityRow {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_day: string | null;
  total_opps_created: number;
  total_opps_applied: number;
  total_resumes_tailored: number;
  total_cover_letters: number;
  total_emails_sent: number;
  total_interviews_started: number;
  updated_at: string | null;
}

interface AchievementUnlockRow {
  id: string;
  achievement_id: string;
  unlocked_at: string;
}

interface TrackActivityOptions {
  now?: Date;
}

const ACTIVITY_COUNTER_COLUMNS: Record<ActivityType, keyof UserActivityRow | null> =
  {
    opp_created: "total_opps_created",
    opp_status_changed: null,
    opp_applied: "total_opps_applied",
    tailor_generated: "total_resumes_tailored",
    cover_letter_generated: "total_cover_letters",
    email_sent: "total_emails_sent",
    interview_started: "total_interviews_started",
  };

function ensureSchema(): void {
  ensureStreakSchema(db);
}

function dayToUtcMs(day: string): number {
  return Date.parse(`${day}T00:00:00.000Z`);
}

function addUtcDays(day: string, amount: number): string {
  return formatIsoDateOnly(addDaysToDate(`${day}T00:00:00.000Z`, amount));
}

function daysBetween(fromDay: string, toDay: string): number {
  return Math.round((dayToUtcMs(toDay) - dayToUtcMs(fromDay)) / 86_400_000);
}

function utcDay(value?: Date): string {
  // Server-canonical UTC day keeps streak math deterministic across time zones.
  return formatIsoDateOnly(value ?? nowIso());
}

function rowToCounters(row?: UserActivityRow | null): LifetimeCounters {
  return {
    opportunitiesCreated: row?.total_opps_created ?? 0,
    opportunitiesApplied: row?.total_opps_applied ?? 0,
    resumesTailored: row?.total_resumes_tailored ?? 0,
    coverLetters: row?.total_cover_letters ?? 0,
    emailsSent: row?.total_emails_sent ?? 0,
    interviewsStarted: row?.total_interviews_started ?? 0,
  };
}

function mapUnlock(row: AchievementUnlockRow): AchievementUnlock {
  const definition = getAchievement(row.achievement_id as AchievementId);
  return {
    id: row.id,
    achievementId: definition.id,
    title: definition.title,
    description: definition.description,
    emoji: definition.emoji,
    colorToken: definition.colorToken,
    unlockedAt: row.unlocked_at,
  };
}

function getActivityRow(userId: string): UserActivityRow | null {
  return (
    (db
      .prepare(
        `
        SELECT id, user_id, current_streak, longest_streak, last_activity_day,
               total_opps_created, total_opps_applied, total_resumes_tailored,
               total_cover_letters, total_emails_sent, total_interviews_started,
               updated_at
        FROM user_activity
        WHERE user_id = ?
      `,
      )
      .get(userId) as UserActivityRow | undefined) ?? null
  );
}

function getUnlockRows(userId: string): AchievementUnlockRow[] {
  return db
    .prepare(
      `
      SELECT id, achievement_id, unlocked_at
      FROM achievement_unlocks
      WHERE user_id = ?
      ORDER BY unlocked_at ASC
    `,
    )
    .all(userId) as AchievementUnlockRow[];
}

function buildWeekDays(
  today: string,
  lastActivityDay: string | null,
  currentStreak: number,
): WeekDayActivity[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addUtcDays(today, index - 6);
    const distanceFromLastActivity = lastActivityDay
      ? daysBetween(date, lastActivityDay)
      : Number.POSITIVE_INFINITY;

    return {
      date,
      today: date === today,
      active:
        Boolean(lastActivityDay) &&
        distanceFromLastActivity >= 0 &&
        distanceFromLastActivity < currentStreak,
    };
  });
}

function buildState(
  row: UserActivityRow | null,
  unlockRows: AchievementUnlockRow[],
  today: string,
): StreakState {
  const stale =
    row?.last_activity_day != null && daysBetween(row.last_activity_day, today) > 1;
  const currentStreak = row ? (stale ? 0 : row.current_streak) : 0;

  return {
    currentStreak,
    longestStreak: row?.longest_streak ?? 0,
    lastActivityDay: row?.last_activity_day ?? null,
    weekDays: buildWeekDays(today, row?.last_activity_day ?? null, currentStreak),
    lifetime: rowToCounters(row),
    unlockedIds: unlockRows.map((row) => row.achievement_id as AchievementId),
    unlocked: unlockRows.map(mapUnlock),
  };
}

function calculateNextStreak(row: UserActivityRow | null, today: string): number {
  if (!row?.last_activity_day) return 1;
  if (row.last_activity_day === today) return row.current_streak;
  if (daysBetween(row.last_activity_day, today) === 1) {
    return row.current_streak + 1;
  }
  return 1;
}

function counterUpdateSql(type: ActivityType): string {
  const column = ACTIVITY_COUNTER_COLUMNS[type];
  return column ? `${column} = ${column} + 1,` : "";
}

export function getStreakState(
  userId: string,
  options: TrackActivityOptions = {},
): StreakState {
  ensureSchema();
  const today = utcDay(options.now);
  return buildState(getActivityRow(userId), getUnlockRows(userId), today);
}

export function getLifetimeCounters(userId: string): LifetimeCounters {
  return getStreakState(userId).lifetime;
}

export function trackActivity(
  userId: string,
  type: ActivityType,
  options: TrackActivityOptions = {},
): TrackActivityResult {
  ensureSchema();
  const today = utcDay(options.now);
  const timestamp = options.now ? toIso(options.now) : nowIso();
  const activityId = generateId();

  db.exec("BEGIN IMMEDIATE");
  try {
    const existing = getActivityRow(userId);
    const currentStreak = calculateNextStreak(existing, today);
    const longestStreak = Math.max(existing?.longest_streak ?? 0, currentStreak);

    if (existing) {
      db.prepare(
        `
        UPDATE user_activity
        SET current_streak = ?,
            longest_streak = ?,
            last_activity_day = ?,
            ${counterUpdateSql(type)}
            updated_at = ?
        WHERE user_id = ?
      `,
      ).run(currentStreak, longestStreak, today, timestamp, userId);
    } else {
      const counters = {
        total_opps_created: type === "opp_created" ? 1 : 0,
        total_opps_applied: type === "opp_applied" ? 1 : 0,
        total_resumes_tailored: type === "tailor_generated" ? 1 : 0,
        total_cover_letters: type === "cover_letter_generated" ? 1 : 0,
        total_emails_sent: type === "email_sent" ? 1 : 0,
        total_interviews_started: type === "interview_started" ? 1 : 0,
      };
      db.prepare(
        `
        INSERT INTO user_activity (
          id, user_id, current_streak, longest_streak, last_activity_day,
          total_opps_created, total_opps_applied, total_resumes_tailored,
          total_cover_letters, total_emails_sent, total_interviews_started,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      ).run(
        activityId,
        userId,
        currentStreak,
        longestStreak,
        today,
        counters.total_opps_created,
        counters.total_opps_applied,
        counters.total_resumes_tailored,
        counters.total_cover_letters,
        counters.total_emails_sent,
        counters.total_interviews_started,
        timestamp,
      );
    }

    const state = buildState(getActivityRow(userId), getUnlockRows(userId), today);
    const unlockedIds = new Set(state.unlockedIds);
    const newlyUnlocked = ACHIEVEMENTS.filter(
      (achievement) =>
        achievement.isUnlocked(state) && !unlockedIds.has(achievement.id),
    );
    const rows: AchievementUnlockRow[] = [];

    for (const achievement of newlyUnlocked) {
      const id = generateId();
      db.prepare(
        `
        INSERT OR IGNORE INTO achievement_unlocks (
          id, user_id, achievement_id, unlocked_at
        )
        VALUES (?, ?, ?, ?)
      `,
      ).run(id, userId, achievement.id, timestamp);

      rows.push({
        id,
        achievement_id: achievement.id,
        unlocked_at: timestamp,
      });
    }

    db.exec("COMMIT");
    return { unlocked: rows.map(mapUnlock) };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
