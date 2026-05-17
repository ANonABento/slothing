import type Database from "libsql";

import { STREAK_BOOTSTRAP_SQL } from "./bootstrap-sql";

let ensured = false;

export function ensureStreakSchema(db: Database.Database): void {
  if (ensured) return;

  // DDL co-located with the Drizzle definitions in `schema.ts`
  // (`userActivity`, `achievementUnlocks`). See `bootstrap-sql.ts`.
  db.exec(STREAK_BOOTSTRAP_SQL);

  ensured = true;
}
