/**
 * Additive `match_score` column on the `jobs` table — the persisted output of
 * rank-on-push (docs/agent-overnight-apply-spec.md, P1). Kept in its own module
 * so the central jobs mapping/types stay untouched: ranking is an additive,
 * optional signal, not a change to the core opportunity contract.
 */
import { getClient } from "./client";

let columnEnsured = false;

export async function ensureJobMatchScoreColumn(): Promise<void> {
  if (columnEnsured) return;
  try {
    const columns = await getClient().execute("PRAGMA table_info(jobs)");
    const names = new Set(
      (columns.rows as unknown as Array<{ name: string }>).map((c) => c.name),
    );
    if (!names.has("match_score")) {
      await getClient().execute("ALTER TABLE jobs ADD COLUMN match_score REAL");
    }
    columnEnsured = true;
  } catch {
    // Table may not exist yet in first-boot/test environments.
  }
}

/** Persist a [0,1] match score for an opportunity the agent pushed. */
export async function setJobMatchScore(
  jobId: string,
  userId: string,
  score: number,
): Promise<void> {
  await ensureJobMatchScoreColumn();
  try {
    await getClient().execute({
      sql: "UPDATE jobs SET match_score = ? WHERE id = ? AND user_id = ?",
      args: [score, jobId, userId],
    });
  } catch {
    // Non-fatal: ranking is best-effort and must never block an import.
  }
}

/** Read a persisted match score (used by tests + future review-queue sort). */
export async function getJobMatchScore(
  jobId: string,
  userId: string,
): Promise<number | null> {
  await ensureJobMatchScoreColumn();
  try {
    const result = await getClient().execute({
      sql: "SELECT match_score FROM jobs WHERE id = ? AND user_id = ?",
      args: [jobId, userId],
    });
    const row = result.rows[0] as unknown as
      | { match_score: number | null }
      | undefined;
    return row?.match_score ?? null;
  } catch {
    return null;
  }
}
