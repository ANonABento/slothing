import { z } from "zod";
import { getClient } from "@/lib/db/client";
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

export async function ensureWelcomeSeriesSchema(): Promise<void> {
  if (welcomeSeriesSchemaEnsured) return;

  await addColumnIfMissing(
    "ALTER TABLE `user` ADD COLUMN `welcome_series_state` TEXT",
  );
  await addColumnIfMissing("ALTER TABLE `user` ADD COLUMN `created_at` TEXT");
  await getClient().execute(
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
  );

  welcomeSeriesSchemaEnsured = true;
}

export async function getWelcomeSeriesState(
  userId: string,
): Promise<WelcomeSeriesState> {
  await ensureWelcomeSeriesSchema();
  const result = await getClient().execute({
    sql: "SELECT welcome_series_state FROM `user` WHERE id = ? LIMIT 1",
    args: [userId],
  });
  const row = result.rows[0] as unknown as WelcomeSeriesRow | undefined;

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

export async function setWelcomeSeriesState(
  userId: string,
  partial: WelcomeSeriesState,
): Promise<WelcomeSeriesState> {
  await ensureWelcomeSeriesSchema();
  const nextState = { ...(await getWelcomeSeriesState(userId)), ...partial };

  await getClient().execute({
    sql: "UPDATE `user` SET welcome_series_state = ? WHERE id = ?",
    args: [JSON.stringify(nextState), userId],
  });

  return nextState;
}

export async function markUnsubscribed(
  userId: string,
  unsubscribedAt: string = nowIso(),
): Promise<WelcomeSeriesState> {
  return setWelcomeSeriesState(userId, { unsubscribedAt });
}

async function addColumnIfMissing(sql: string): Promise<void> {
  try {
    await getClient().execute(sql);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("duplicate column name")) {
      throw error;
    }
  }
}
