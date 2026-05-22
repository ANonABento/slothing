import { randomUUID } from "crypto";
import { getClient } from "./client";

import { nowIso } from "@/lib/format/time";
export interface CoverLetter {
  id: string;
  jobId: string;
  profileId: string;
  content: string;
  highlights: string[];
  version: number;
  createdAt: string;
}

interface CoverLetterRow {
  id: string;
  job_id: string;
  profile_id: string;
  content: string;
  highlights_json: string | null;
  version: number;
  created_at: string;
}

function rowToCoverLetter(row: CoverLetterRow): CoverLetter {
  return {
    id: row.id,
    jobId: row.job_id,
    profileId: row.profile_id,
    content: row.content,
    highlights: row.highlights_json ? JSON.parse(row.highlights_json) : [],
    version: row.version,
    createdAt: row.created_at,
  };
}

export async function saveCoverLetter(
  jobId: string,
  content: string,
  highlights: string[] = [],
  userId: string,
): Promise<CoverLetter> {
  const id = randomUUID();

  // Get next version number for this job
  const existingResult = await getClient().execute({
    sql: "SELECT MAX(version) as max_version FROM cover_letters WHERE job_id = ? AND user_id = ?",
    args: [jobId, userId],
  });
  const existing = existingResult.rows[0] as unknown as
    | { max_version: number | null }
    | undefined;

  const version = (existing?.max_version || 0) + 1;

  const result = await getClient().execute({
    sql: `INSERT INTO cover_letters (id, user_id, job_id, profile_id, content, highlights_json, version)
      SELECT ?, ?, ?, ?, ?, ?, ?
      WHERE EXISTS (SELECT 1 FROM jobs WHERE id = ? AND user_id = ?)`,
    args: [
      id,
      userId,
      jobId,
      userId,
      content,
      JSON.stringify(highlights),
      version,
      jobId,
      userId,
    ],
  });

  if (result.rowsAffected === 0) {
    throw new Error("Job not found");
  }

  return {
    id,
    jobId,
    profileId: userId,
    content,
    highlights,
    version,
    createdAt: nowIso(),
  };
}

export async function getCoverLettersByJob(
  jobId: string,
  userId: string,
): Promise<CoverLetter[]> {
  const result = await getClient().execute({
    sql: "SELECT * FROM cover_letters WHERE job_id = ? AND user_id = ? ORDER BY version DESC",
    args: [jobId, userId],
  });
  const rows = result.rows as unknown as CoverLetterRow[];

  return rows.map(rowToCoverLetter);
}

export async function getLatestCoverLetter(
  jobId: string,
  userId: string,
): Promise<CoverLetter | null> {
  const result = await getClient().execute({
    sql: "SELECT * FROM cover_letters WHERE job_id = ? AND user_id = ? ORDER BY version DESC LIMIT 1",
    args: [jobId, userId],
  });
  const row = result.rows[0] as unknown as CoverLetterRow | undefined;

  return row ? rowToCoverLetter(row) : null;
}

export async function getCoverLetter(
  id: string,
  userId: string,
): Promise<CoverLetter | null> {
  const result = await getClient().execute({
    sql: "SELECT * FROM cover_letters WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
  const row = result.rows[0] as unknown as CoverLetterRow | undefined;

  return row ? rowToCoverLetter(row) : null;
}

export async function deleteCoverLetter(
  id: string,
  userId: string,
): Promise<boolean> {
  const result = await getClient().execute({
    sql: "DELETE FROM cover_letters WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
  return result.rowsAffected > 0;
}

export async function getCoverLetterCount(
  jobId: string,
  userId: string,
): Promise<number> {
  const result = await getClient().execute({
    sql: "SELECT COUNT(*) as count FROM cover_letters WHERE job_id = ? AND user_id = ?",
    args: [jobId, userId],
  });
  const row = result.rows[0] as unknown as { count: number } | undefined;
  return row?.count ?? 0;
}

export async function getAllCoverLetters(
  userId: string,
): Promise<CoverLetter[]> {
  const result = await getClient().execute({
    sql: "SELECT * FROM cover_letters WHERE user_id = ? ORDER BY created_at DESC",
    args: [userId],
  });
  const rows = result.rows as unknown as CoverLetterRow[];

  return rows.map(rowToCoverLetter);
}
