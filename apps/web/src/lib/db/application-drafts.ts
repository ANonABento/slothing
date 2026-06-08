/**
 * Persistence for drafted applications (docs/agent-overnight-apply-spec.md, P2).
 *
 * Self-bootstrapping: created on first access with `CREATE TABLE IF NOT EXISTS`
 * and reconciled additively via `PRAGMA table_info` + `ALTER TABLE ADD COLUMN`.
 * One *open* draft per (user, job) — a new push for a job that already has a
 * pending/approved draft updates it in place instead of piling up duplicates.
 */
import { getClient } from "./client";
import { generateId } from "@/lib/utils";
import { nowIso } from "@/lib/format/time";
import {
  type ApplicationDraft,
  type DraftAnswer,
  type DraftQuestion,
  type DraftStatus,
  type DraftUpsertInput,
  OPEN_DRAFT_STATUSES,
  isDraftStatus,
} from "@/lib/agent/draft";

const DEFAULT_USER_ID = "default";

let schemaEnsured = false;

export async function ensureApplicationDraftsSchema(): Promise<void> {
  if (schemaEnsured) return;
  try {
    await getClient().execute(`
      CREATE TABLE IF NOT EXISTS application_drafts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL DEFAULT '${DEFAULT_USER_ID}',
        job_id TEXT NOT NULL,
        questions_json TEXT NOT NULL DEFAULT '[]',
        answers_json TEXT NOT NULL DEFAULT '[]',
        status TEXT NOT NULL DEFAULT 'pending_review',
        authored_by TEXT,
        created_at TEXT,
        reviewed_at TEXT,
        submitted_at TEXT,
        submit_result_json TEXT
      )
    `);
    await getClient().execute(
      "CREATE INDEX IF NOT EXISTS idx_application_drafts_user_id ON application_drafts(user_id)",
    );
    await getClient().execute(
      "CREATE INDEX IF NOT EXISTS idx_application_drafts_user_status ON application_drafts(user_id, status)",
    );

    const columns = await getClient().execute(
      "PRAGMA table_info(application_drafts)",
    );
    const names = new Set(
      (columns.rows as unknown as Array<{ name: string }>).map((c) => c.name),
    );
    const additive: Array<[string, string]> = [
      ["job_id", "TEXT NOT NULL DEFAULT ''"],
      ["questions_json", "TEXT NOT NULL DEFAULT '[]'"],
      ["answers_json", "TEXT NOT NULL DEFAULT '[]'"],
      ["status", "TEXT NOT NULL DEFAULT 'pending_review'"],
      ["authored_by", "TEXT"],
      ["created_at", "TEXT"],
      ["reviewed_at", "TEXT"],
      ["submitted_at", "TEXT"],
      ["submit_result_json", "TEXT"],
    ];
    for (const [col, ddl] of additive) {
      if (!names.has(col)) {
        await getClient().execute(
          `ALTER TABLE application_drafts ADD COLUMN ${col} ${ddl}`,
        );
      }
    }
    schemaEnsured = true;
  } catch {
    // First-boot / test environments may lack the DB.
  }
}

interface DraftRow {
  id: string;
  job_id: string;
  questions_json: string | null;
  answers_json: string | null;
  status: string | null;
  authored_by: string | null;
  created_at: string | null;
  reviewed_at: string | null;
  submitted_at: string | null;
  submit_result_json: string | null;
}

function parseArray<T>(json: string | null): T[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json) as unknown;
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function rowToDraft(row: DraftRow): ApplicationDraft {
  return {
    id: row.id,
    jobId: row.job_id,
    questions: parseArray<DraftQuestion>(row.questions_json),
    answers: parseArray<DraftAnswer>(row.answers_json),
    status: isDraftStatus(row.status) ? row.status : "pending_review",
    authoredBy: row.authored_by ?? "agent",
    createdAt: row.created_at ?? "",
    reviewedAt: row.reviewed_at,
    submittedAt: row.submitted_at,
    submitResult: row.submit_result_json
      ? (JSON.parse(row.submit_result_json) as unknown)
      : null,
  };
}

const SELECT_COLUMNS =
  "id, job_id, questions_json, answers_json, status, authored_by, created_at, reviewed_at, submitted_at, submit_result_json";

/** Find the open (pending_review/approved) draft for a job, if any. */
async function findOpenDraft(
  userId: string,
  jobId: string,
): Promise<ApplicationDraft | null> {
  const placeholders = OPEN_DRAFT_STATUSES.map(() => "?").join(", ");
  const result = await getClient().execute({
    sql: `SELECT ${SELECT_COLUMNS} FROM application_drafts WHERE user_id = ? AND job_id = ? AND status IN (${placeholders}) ORDER BY created_at DESC LIMIT 1`,
    args: [userId, jobId, ...OPEN_DRAFT_STATUSES],
  });
  const row = result.rows[0] as unknown as DraftRow | undefined;
  return row ? rowToDraft(row) : null;
}

/** Create a draft, or update the existing open draft for the same job. */
export async function upsertDraft(
  userId: string,
  input: DraftUpsertInput,
): Promise<ApplicationDraft> {
  await ensureApplicationDraftsSchema();
  const now = nowIso();
  const questionsJson = JSON.stringify(input.questions);
  const answersJson = JSON.stringify(input.answers);
  const authoredBy = input.authoredBy ?? "agent";

  const existing = await findOpenDraft(userId, input.jobId);
  if (existing) {
    await getClient().execute({
      sql: "UPDATE application_drafts SET questions_json = ?, answers_json = ?, authored_by = ?, status = 'pending_review', reviewed_at = NULL WHERE id = ? AND user_id = ?",
      args: [questionsJson, answersJson, authoredBy, existing.id, userId],
    });
    return (await getDraft(existing.id, userId))!;
  }

  const id = generateId();
  await getClient().execute({
    sql: `INSERT INTO application_drafts (id, user_id, job_id, questions_json, answers_json, status, authored_by, created_at) VALUES (?, ?, ?, ?, ?, 'pending_review', ?, ?)`,
    args: [
      id,
      userId,
      input.jobId,
      questionsJson,
      answersJson,
      authoredBy,
      now,
    ],
  });
  return (await getDraft(id, userId))!;
}

export async function listDrafts(
  userId: string,
  opts: { status?: DraftStatus; limit?: number } = {},
): Promise<ApplicationDraft[]> {
  await ensureApplicationDraftsSchema();
  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 200);
  try {
    const result = opts.status
      ? await getClient().execute({
          sql: `SELECT ${SELECT_COLUMNS} FROM application_drafts WHERE user_id = ? AND status = ? ORDER BY created_at DESC LIMIT ?`,
          args: [userId, opts.status, limit],
        })
      : await getClient().execute({
          sql: `SELECT ${SELECT_COLUMNS} FROM application_drafts WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
          args: [userId, limit],
        });
    return (result.rows as unknown as DraftRow[]).map(rowToDraft);
  } catch {
    return [];
  }
}

export async function getDraft(
  id: string,
  userId: string,
): Promise<ApplicationDraft | null> {
  await ensureApplicationDraftsSchema();
  try {
    const result = await getClient().execute({
      sql: `SELECT ${SELECT_COLUMNS} FROM application_drafts WHERE id = ? AND user_id = ?`,
      args: [id, userId],
    });
    const row = result.rows[0] as unknown as DraftRow | undefined;
    return row ? rowToDraft(row) : null;
  } catch {
    return null;
  }
}

/** Edit answers and/or move status (approve/reject) from the review UI. */
export async function reviewDraft(
  id: string,
  userId: string,
  patch: { answers?: DraftAnswer[]; status?: DraftStatus },
): Promise<ApplicationDraft | null> {
  await ensureApplicationDraftsSchema();
  const existing = await getDraft(id, userId);
  if (!existing) return null;

  const sets: string[] = [];
  const args: string[] = [];
  if (patch.answers !== undefined) {
    sets.push("answers_json = ?");
    args.push(JSON.stringify(patch.answers));
  }
  if (patch.status !== undefined) {
    sets.push("status = ?");
    args.push(patch.status);
    if (patch.status === "approved" || patch.status === "rejected") {
      sets.push("reviewed_at = ?");
      args.push(nowIso());
    }
  }
  if (sets.length === 0) return existing;

  args.push(id, userId);
  await getClient().execute({
    sql: `UPDATE application_drafts SET ${sets.join(", ")} WHERE id = ? AND user_id = ?`,
    args,
  });
  return getDraft(id, userId);
}

/** Count submissions recorded at or after `sinceIso` — drives the daily cap. */
export async function countSubmittedSince(
  userId: string,
  sinceIso: string,
): Promise<number> {
  await ensureApplicationDraftsSchema();
  try {
    const result = await getClient().execute({
      sql: "SELECT COUNT(*) AS n FROM application_drafts WHERE user_id = ? AND status = 'submitted' AND submitted_at >= ?",
      args: [userId, sinceIso],
    });
    const row = result.rows[0] as unknown as { n: number } | undefined;
    return Number(row?.n ?? 0);
  } catch {
    return 0;
  }
}

export interface SubmissionRecord {
  ok: boolean;
  atsRef?: string;
  error?: string;
}

/**
 * Record a submission outcome from an executor. The per-application approval
 * gate is enforced here: only an `approved` draft may transition to
 * `submitted`/`failed`. Returns `{ gated: true }` if the draft was not approved.
 */
export async function recordSubmission(
  id: string,
  userId: string,
  result: SubmissionRecord,
): Promise<{ draft: ApplicationDraft | null; gated: boolean }> {
  await ensureApplicationDraftsSchema();
  const existing = await getDraft(id, userId);
  if (!existing) return { draft: null, gated: false };
  if (existing.status !== "approved") return { draft: existing, gated: true };

  const status: DraftStatus = result.ok ? "submitted" : "failed";
  await getClient().execute({
    sql: "UPDATE application_drafts SET status = ?, submitted_at = ?, submit_result_json = ? WHERE id = ? AND user_id = ? AND status = 'approved'",
    args: [status, nowIso(), JSON.stringify(result), id, userId],
  });
  return { draft: await getDraft(id, userId), gated: false };
}
