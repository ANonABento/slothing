import type Database from "libsql";

let ensured = false;

export function ensureStreakSchema(db: Database.Database): void {
  if (ensured) return;

  db.exec(`
    CREATE TABLE IF NOT EXISTS user_activity (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      current_streak INTEGER NOT NULL DEFAULT 0,
      longest_streak INTEGER NOT NULL DEFAULT 0,
      last_activity_day TEXT,
      total_opps_created INTEGER NOT NULL DEFAULT 0,
      total_opps_applied INTEGER NOT NULL DEFAULT 0,
      total_resumes_tailored INTEGER NOT NULL DEFAULT 0,
      total_cover_letters INTEGER NOT NULL DEFAULT 0,
      total_emails_sent INTEGER NOT NULL DEFAULT 0,
      total_interviews_started INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_user_activity_user_id
      ON user_activity(user_id);

    CREATE TABLE IF NOT EXISTS achievement_unlocks (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      achievement_id TEXT NOT NULL,
      unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_achievement_unlocks_user_achievement
      ON achievement_unlocks(user_id, achievement_id);
    CREATE INDEX IF NOT EXISTS idx_achievement_unlocks_user_unlocked
      ON achievement_unlocks(user_id, unlocked_at);
  `);

  ensured = true;
}
