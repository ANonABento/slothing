import { STREAK_BOOTSTRAP_SQL } from "./bootstrap-sql";
import { getClient } from "./client";

let ensured = false;

export async function ensureStreakSchema(): Promise<void> {
  if (ensured) return;

  // DDL co-located with the Drizzle definitions in `schema.ts`
  // (`userActivity`, `achievementUnlocks`). See `bootstrap-sql.ts`.
  await getClient().batch(
    STREAK_BOOTSTRAP_SQL.split(";")
      .map((sql) => sql.trim())
      .filter(Boolean)
      .map((sql) => ({ sql, args: [] })),
    "write",
  );

  ensured = true;
}
