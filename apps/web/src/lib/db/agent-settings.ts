/**
 * Persistence for the per-user agent autonomy policy
 * (docs/agent-overnight-apply-spec.md, P1).
 *
 * Self-bootstrapping: the table is created on first access with
 * `CREATE TABLE IF NOT EXISTS` and columns are reconciled additively via
 * `PRAGMA table_info` + `ALTER TABLE ... ADD COLUMN`, so existing dev DBs pick
 * it up without a destructive migration.
 */
import { getClient } from "./client";
import { generateId } from "@/lib/utils";
import { nowIso } from "@/lib/format/time";
import {
  type AgentPolicy,
  type AgentPolicyUpdate,
  DEFAULT_AGENT_POLICY,
  applyPolicyUpdate,
  clampThreshold,
  isAutonomyLevel,
  normalizeBlocklist,
} from "@/lib/agent/policy";

const DEFAULT_USER_ID = "default";

let schemaEnsured = false;

export async function ensureAgentSettingsSchema(): Promise<void> {
  if (schemaEnsured) return;
  try {
    await getClient().execute(`
      CREATE TABLE IF NOT EXISTS agent_settings (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL DEFAULT '${DEFAULT_USER_ID}' UNIQUE,
        autonomy TEXT NOT NULL DEFAULT 'source',
        match_threshold REAL NOT NULL DEFAULT 0.15,
        salary_floor INTEGER,
        company_blocklist_json TEXT NOT NULL DEFAULT '[]',
        daily_submit_cap INTEGER NOT NULL DEFAULT 10,
        dry_run INTEGER NOT NULL DEFAULT 1,
        schedule_cron TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `);
    await getClient().execute(
      "CREATE INDEX IF NOT EXISTS idx_agent_settings_user_id ON agent_settings(user_id)",
    );

    const columns = await getClient().execute(
      "PRAGMA table_info(agent_settings)",
    );
    const names = new Set(
      (columns.rows as unknown as Array<{ name: string }>).map((c) => c.name),
    );
    const additive: Array<[string, string]> = [
      ["autonomy", "TEXT NOT NULL DEFAULT 'source'"],
      ["match_threshold", "REAL NOT NULL DEFAULT 0.15"],
      ["salary_floor", "INTEGER"],
      ["company_blocklist_json", "TEXT NOT NULL DEFAULT '[]'"],
      ["daily_submit_cap", "INTEGER NOT NULL DEFAULT 10"],
      ["dry_run", "INTEGER NOT NULL DEFAULT 1"],
      ["schedule_cron", "TEXT"],
      ["created_at", "TEXT"],
      ["updated_at", "TEXT"],
    ];
    for (const [col, ddl] of additive) {
      if (!names.has(col)) {
        await getClient().execute(
          `ALTER TABLE agent_settings ADD COLUMN ${col} ${ddl}`,
        );
      }
    }
    schemaEnsured = true;
  } catch {
    // First-boot / test environments may not have a DB; callers fall back to
    // DEFAULT_AGENT_POLICY.
  }
}

interface AgentSettingsRow {
  autonomy: string | null;
  match_threshold: number | null;
  salary_floor: number | null;
  company_blocklist_json: string | null;
  daily_submit_cap: number | null;
  dry_run: number | null;
  schedule_cron: string | null;
  updated_at: string | null;
}

function rowToPolicy(row: AgentSettingsRow): AgentPolicy {
  let blocklist: string[] = [];
  if (row.company_blocklist_json) {
    try {
      const parsed = JSON.parse(row.company_blocklist_json) as unknown;
      if (Array.isArray(parsed)) {
        blocklist = normalizeBlocklist(parsed.map((v) => String(v)));
      }
    } catch {
      blocklist = [];
    }
  }
  return {
    autonomy: isAutonomyLevel(row.autonomy)
      ? row.autonomy
      : DEFAULT_AGENT_POLICY.autonomy,
    matchThreshold:
      row.match_threshold === null
        ? DEFAULT_AGENT_POLICY.matchThreshold
        : clampThreshold(row.match_threshold),
    salaryFloor: row.salary_floor ?? null,
    companyBlocklist: blocklist,
    dailySubmitCap: row.daily_submit_cap ?? DEFAULT_AGENT_POLICY.dailySubmitCap,
    dryRun:
      row.dry_run === null ? DEFAULT_AGENT_POLICY.dryRun : row.dry_run !== 0,
    scheduleCron: row.schedule_cron ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

/** Users whose agent is switched on (autonomy != off) — drives the hosted runner. */
export async function listUsersWithActiveAgent(): Promise<
  Array<{ userId: string; autonomy: string }>
> {
  await ensureAgentSettingsSchema();
  try {
    const result = await getClient().execute({
      sql: "SELECT user_id, autonomy FROM agent_settings WHERE autonomy IS NOT NULL AND autonomy != 'off'",
      args: [],
    });
    return (
      result.rows as unknown as Array<{ user_id: string; autonomy: string }>
    ).map((r) => ({ userId: r.user_id, autonomy: r.autonomy }));
  } catch {
    return [];
  }
}

/** Resolve the user's policy, or safe defaults when none has been saved. */
export async function getAgentSettings(userId: string): Promise<AgentPolicy> {
  await ensureAgentSettingsSchema();
  try {
    const result = await getClient().execute({
      sql: "SELECT autonomy, match_threshold, salary_floor, company_blocklist_json, daily_submit_cap, dry_run, schedule_cron, updated_at FROM agent_settings WHERE user_id = ?",
      args: [userId],
    });
    const row = result.rows[0] as unknown as AgentSettingsRow | undefined;
    return row ? rowToPolicy(row) : { ...DEFAULT_AGENT_POLICY };
  } catch {
    return { ...DEFAULT_AGENT_POLICY };
  }
}

/** Apply a validated partial update and persist it; returns the new policy. */
export async function saveAgentSettings(
  userId: string,
  patch: AgentPolicyUpdate,
): Promise<AgentPolicy> {
  await ensureAgentSettingsSchema();
  const current = await getAgentSettings(userId);
  const next = applyPolicyUpdate(current, patch);
  const now = nowIso();

  await getClient().execute({
    sql: `
      INSERT INTO agent_settings (
        id, user_id, autonomy, match_threshold, salary_floor,
        company_blocklist_json, daily_submit_cap, dry_run, schedule_cron,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        autonomy = excluded.autonomy,
        match_threshold = excluded.match_threshold,
        salary_floor = excluded.salary_floor,
        company_blocklist_json = excluded.company_blocklist_json,
        daily_submit_cap = excluded.daily_submit_cap,
        dry_run = excluded.dry_run,
        schedule_cron = excluded.schedule_cron,
        updated_at = excluded.updated_at
    `,
    args: [
      generateId(),
      userId,
      next.autonomy,
      next.matchThreshold,
      next.salaryFloor,
      JSON.stringify(next.companyBlocklist),
      next.dailySubmitCap,
      next.dryRun ? 1 : 0,
      next.scheduleCron,
      now,
      now,
    ],
  });

  return { ...next, updatedAt: now };
}
