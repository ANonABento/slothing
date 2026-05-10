import { z } from "zod";
import db from "@/lib/db/legacy";
import { nowIso } from "@/lib/format/time";

export const welcomeSeriesStateSchema = z
  .object({
    day1SentAt: z.string().optional(),
    day3SentAt: z.string().optional(),
    day3SkippedAt: z.string().optional(),
    day3SkipReason: z.string().optional(),
    day7SentAt: z.string().optional(),
    day7SkippedAt: z.string().optional(),
    day7SkipReason: z.string().optional(),
    day14SentAt: z.string().optional(),
    day14SkippedAt: z.string().optional(),
    day14SkipReason: z.string().optional(),
    unsubscribedAt: z.string().optional(),
  })
  .passthrough();

export type WelcomeSeriesState = z.infer<typeof welcomeSeriesStateSchema>;

interface WelcomeSeriesRow {
  welcome_series_state: string | null;
}

let welcomeSeriesSchemaEnsured = false;

export function resetWelcomeSeriesSchemaForTest(): void {
  welcomeSeriesSchemaEnsured = false;
}

export function ensureWelcomeSeriesSchema(): void {
  if (welcomeSeriesSchemaEnsured) return;

  addColumnIfMissing(
    "ALTER TABLE `user` ADD COLUMN `welcome_series_state` TEXT",
  );
  addColumnIfMissing("ALTER TABLE `user` ADD COLUMN `created_at` TEXT");
  db.prepare(
    `
      UPDATE \`user\`
      SET created_at = COALESCE(
        (
          SELECT MIN(created_at)
          FROM jobs
          WHERE jobs.user_id = \`user\`.id
        ),
        CURRENT_TIMESTAMP
      )
      WHERE created_at IS NULL
    `,
  ).run();

  welcomeSeriesSchemaEnsured = true;
}

export function getWelcomeSeriesState(userId: string): WelcomeSeriesState {
  ensureWelcomeSeriesSchema();
  const row = db
    .prepare(
      "SELECT welcome_series_state FROM `user` WHERE id = ? LIMIT 1",
    )
    .get(userId) as WelcomeSeriesRow | undefined;

  return parseWelcomeSeriesState(row?.welcome_series_state);
}

export function parseWelcomeSeriesState(
  raw: string | null | undefined,
): WelcomeSeriesState {
  if (!raw) return {};

  try {
    return welcomeSeriesStateSchema.parse(JSON.parse(raw));
  } catch (error) {
    console.warn("[welcome-series] Invalid state JSON; treating as empty", {
      error,
    });
    return {};
  }
}

export function setWelcomeSeriesState(
  userId: string,
  partial: WelcomeSeriesState,
): WelcomeSeriesState {
  ensureWelcomeSeriesSchema();
  const nextState = { ...getWelcomeSeriesState(userId), ...partial };

  db.prepare("UPDATE `user` SET welcome_series_state = ? WHERE id = ?").run(
    JSON.stringify(nextState),
    userId,
  );

  return nextState;
}

export function markUnsubscribed(
  userId: string,
  unsubscribedAt: string = nowIso(),
): WelcomeSeriesState {
  return setWelcomeSeriesState(userId, { unsubscribedAt });
}

function addColumnIfMissing(sql: string): void {
  try {
    db.prepare(sql).run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("duplicate column name")) {
      throw error;
    }
  }
}
