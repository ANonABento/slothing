import { PROMPT_VARIANTS_BOOTSTRAP_SQL } from "./bootstrap-sql";
import { getClient } from "./client";
import { generateId } from "@/lib/utils";

import { nowIso } from "@/lib/format/time";
export interface PromptVariant {
  id: string;
  name: string;
  version: number;
  content: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromptVariantResult {
  id: string;
  promptVariantId: string;
  jobId: string | null;
  resumeId: string | null;
  matchScore: number | null;
  createdAt: string;
}

export interface PromptVariantStats {
  variantId: string;
  variantName: string;
  version: number;
  active: boolean;
  resultCount: number;
  avgMatchScore: number | null;
}

interface PromptVariantRow {
  id: string;
  name: string;
  version: number;
  content: string;
  active: number;
  created_at: string;
  updated_at: string;
}

interface PromptVariantResultRow {
  id: string;
  prompt_variant_id: string;
  job_id: string | null;
  resume_id: string | null;
  match_score: number | null;
  created_at: string;
}

interface PromptVariantStatsRow {
  variant_id: string;
  variant_name: string;
  version: number;
  active: number;
  result_count: number;
  avg_match_score: number | null;
}

// Default prompt instructions seeded on first access
export const DEFAULT_PROMPT_CONTENT = `1. Write a professional summary (2-3 sentences) tailored to this job
2. Select the 2-3 most relevant experiences from the bank and rewrite bullet points
3. Each experience should have 2-4 bullet points maximum
4. Prioritize skills matching the job description
5. Include relevant achievements in experience bullet points
6. Use only facts, skills, tools, metrics, employers, degrees, certifications, and dates explicitly supported by the knowledge bank
7. Omit missing job keywords when the knowledge bank does not support them; never invent AWS, Kubernetes, GraphQL, metrics, tools, or credentials
8. Preserve contact details, education, employers, titles, and dates exactly
9. Keep everything concise - one page`;

/**
 * Add a `user_id` column to `prompt_variants` and `prompt_variant_results`
 * tables in dev DBs that pre-date the user-scoping migration. Idempotent.
 *
 * Why: the legacy schema had no user_id column, so a malicious authenticated
 * user could read or modify another user's prompt variants by guessing the id
 * (IDOR). This migration adds user_id with a backfill default of `default`,
 * matching the pattern used by other tables.
 */
let ensured = false;

async function ensurePromptVariantsUserSchema(): Promise<void> {
  if (ensured && process.env.NODE_ENV !== "test") return;

  // Bootstrap base tables for fresh DBs (build-time prerender, first run).
  // Drizzle schema lives in schema.ts but isn't applied to legacy DB
  // connections; the DDL is co-located in `bootstrap-sql.ts`.
  await getClient().batch(
    PROMPT_VARIANTS_BOOTSTRAP_SQL.split(";")
      .map((sql) => sql.trim())
      .filter(Boolean)
      .map((sql) => ({ sql, args: [] })),
    "write",
  );

  const promptCols = (
    await getClient().execute("PRAGMA table_info(prompt_variants)")
  ).rows as unknown as Array<{ name: string }>;
  if (!promptCols.some((c) => c.name === "user_id")) {
    await getClient().execute(
      "ALTER TABLE prompt_variants ADD COLUMN user_id TEXT NOT NULL DEFAULT 'default'",
    );
  }
  await getClient().execute(
    "CREATE INDEX IF NOT EXISTS idx_prompt_variants_user ON prompt_variants(user_id)",
  );

  const resultCols = (
    await getClient().execute("PRAGMA table_info(prompt_variant_results)")
  ).rows as unknown as Array<{ name: string }>;
  if (!resultCols.some((c) => c.name === "user_id")) {
    await getClient().execute(
      "ALTER TABLE prompt_variant_results ADD COLUMN user_id TEXT NOT NULL DEFAULT 'default'",
    );
  }
  await getClient().execute(
    "CREATE INDEX IF NOT EXISTS idx_prompt_variant_results_user ON prompt_variant_results(user_id)",
  );

  ensured = true;
}

function rowToVariant(row: PromptVariantRow): PromptVariant {
  return {
    id: row.id,
    name: row.name,
    version: row.version,
    content: row.content,
    active: row.active === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToResult(row: PromptVariantResultRow): PromptVariantResult {
  return {
    id: row.id,
    promptVariantId: row.prompt_variant_id,
    jobId: row.job_id,
    resumeId: row.resume_id,
    matchScore: row.match_score,
    createdAt: row.created_at,
  };
}

/**
 * Ensure at least one default variant exists for this user. Seeds the DB on
 * first call. Returns the seeded variant's id if created, otherwise null.
 */
export async function seedDefaultPromptVariant(
  userId: string,
): Promise<string | null> {
  await ensurePromptVariantsUserSchema();
  const existingResult = await getClient().execute({
    sql: "SELECT id FROM prompt_variants WHERE user_id = ? LIMIT 1",
    args: [userId],
  });
  const existing = existingResult.rows[0] as unknown as
    | { id: string }
    | undefined;

  if (existing) return null;

  const id = generateId();
  const now = nowIso();
  await getClient().execute({
    sql: `
    INSERT INTO prompt_variants (id, user_id, name, version, content, active, created_at, updated_at)
    VALUES (?, ?, ?, 1, ?, 1, ?, ?)
  `,
    args: [id, userId, "Default", DEFAULT_PROMPT_CONTENT, now, now],
  });

  return id;
}

export async function getAllPromptVariants(
  userId: string,
): Promise<PromptVariant[]> {
  await ensurePromptVariantsUserSchema();
  const result = await getClient().execute({
    sql: "SELECT * FROM prompt_variants WHERE user_id = ? ORDER BY version ASC, created_at ASC",
    args: [userId],
  });
  return (result.rows as unknown as PromptVariantRow[]).map(rowToVariant);
}

export async function getActivePromptVariant(
  userId: string,
): Promise<PromptVariant | null> {
  await ensurePromptVariantsUserSchema();
  await seedDefaultPromptVariant(userId);
  const result = await getClient().execute({
    sql: "SELECT * FROM prompt_variants WHERE user_id = ? AND active = 1 LIMIT 1",
    args: [userId],
  });
  const row = result.rows[0] as unknown as PromptVariantRow | undefined;
  return row ? rowToVariant(row) : null;
}

export async function getPromptVariantById(
  id: string,
  userId: string,
): Promise<PromptVariant | null> {
  await ensurePromptVariantsUserSchema();
  const result = await getClient().execute({
    sql: "SELECT * FROM prompt_variants WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
  const row = result.rows[0] as unknown as PromptVariantRow | undefined;
  return row ? rowToVariant(row) : null;
}

export async function createPromptVariant(
  userId: string,
  name: string,
  content: string,
  version?: number,
): Promise<PromptVariant> {
  await ensurePromptVariantsUserSchema();
  let resolvedVersion = version;
  if (resolvedVersion === undefined) {
    const maxResult = await getClient().execute({
      sql: "SELECT MAX(version) as max_v FROM prompt_variants WHERE user_id = ?",
      args: [userId],
    });
    const max = maxResult.rows[0] as unknown as { max_v: number | null };
    resolvedVersion = (max.max_v ?? 0) + 1;
  }

  const id = generateId();
  const now = nowIso();
  await getClient().execute({
    sql: `
    INSERT INTO prompt_variants (id, user_id, name, version, content, active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 0, ?, ?)
  `,
    args: [id, userId, name, resolvedVersion, content, now, now],
  });

  return {
    id,
    name,
    version: resolvedVersion,
    content,
    active: false,
    createdAt: now,
    updatedAt: now,
  };
}

export async function setActivePromptVariant(
  id: string,
  userId: string,
): Promise<boolean> {
  await ensurePromptVariantsUserSchema();
  const variant = await getPromptVariantById(id, userId);
  if (!variant) return false;

  const now = nowIso();
  const results = await getClient().batch(
    [
      {
        sql: "UPDATE prompt_variants SET active = 0, updated_at = ? WHERE user_id = ?",
        args: [now, userId],
      },
      {
        sql: "UPDATE prompt_variants SET active = 1, updated_at = ? WHERE id = ? AND user_id = ?",
        args: [now, id, userId],
      },
    ],
    "write",
  );
  return (results[1]?.rowsAffected ?? 0) > 0;
}

export async function updatePromptVariant(
  id: string,
  userId: string,
  fields: Partial<Pick<PromptVariant, "name" | "content">>,
): Promise<PromptVariant | null> {
  await ensurePromptVariantsUserSchema();
  const existing = await getPromptVariantById(id, userId);
  if (!existing) return null;

  const now = nowIso();
  const name = fields.name ?? existing.name;
  const content = fields.content ?? existing.content;

  await getClient().execute({
    sql: `
    UPDATE prompt_variants SET name = ?, content = ?, updated_at = ?
    WHERE id = ? AND user_id = ?
  `,
    args: [name, content, now, id, userId],
  });

  return { ...existing, name, content, updatedAt: now };
}

export async function deletePromptVariant(
  id: string,
  userId: string,
): Promise<boolean> {
  await ensurePromptVariantsUserSchema();
  const variant = await getPromptVariantById(id, userId);
  if (!variant) return false;
  if (variant.active) return false; // refuse to delete the active variant

  const result = await getClient().execute({
    sql: "DELETE FROM prompt_variants WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
  return result.rowsAffected > 0;
}

export async function logPromptVariantResult(
  userId: string,
  promptVariantId: string,
  jobId?: string,
  resumeId?: string,
  matchScore?: number,
): Promise<PromptVariantResult> {
  await ensurePromptVariantsUserSchema();
  const id = generateId();
  const now = nowIso();
  await getClient().execute({
    sql: `
    INSERT INTO prompt_variant_results (id, user_id, prompt_variant_id, job_id, resume_id, match_score, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
    args: [
      id,
      userId,
      promptVariantId,
      jobId ?? null,
      resumeId ?? null,
      matchScore ?? null,
      now,
    ],
  });

  return {
    id,
    promptVariantId,
    jobId: jobId ?? null,
    resumeId: resumeId ?? null,
    matchScore: matchScore ?? null,
    createdAt: now,
  };
}

export async function getPromptVariantResults(
  promptVariantId: string,
  userId: string,
): Promise<PromptVariantResult[]> {
  await ensurePromptVariantsUserSchema();
  const result = await getClient().execute({
    sql: "SELECT * FROM prompt_variant_results WHERE prompt_variant_id = ? AND user_id = ? ORDER BY created_at DESC",
    args: [promptVariantId, userId],
  });
  return (result.rows as unknown as PromptVariantResultRow[]).map(rowToResult);
}

export async function getPromptVariantStats(
  userId: string,
): Promise<PromptVariantStats[]> {
  await ensurePromptVariantsUserSchema();
  const result = await getClient().execute({
    sql: `
        SELECT
          pv.id AS variant_id,
          pv.name AS variant_name,
          pv.version,
          pv.active,
          COUNT(pvr.id) AS result_count,
          AVG(pvr.match_score) AS avg_match_score
        FROM prompt_variants pv
        LEFT JOIN prompt_variant_results pvr
          ON pvr.prompt_variant_id = pv.id AND pvr.user_id = pv.user_id
        WHERE pv.user_id = ?
        GROUP BY pv.id
        ORDER BY pv.version ASC
      `,
    args: [userId],
  });
  return (result.rows as unknown as PromptVariantStatsRow[]).map((row) => ({
    variantId: row.variant_id,
    variantName: row.variant_name,
    version: row.version,
    active: row.active === 1,
    resultCount: row.result_count,
    avgMatchScore: row.avg_match_score,
  }));
}
