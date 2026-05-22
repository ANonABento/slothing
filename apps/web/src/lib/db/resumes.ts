import { getClient } from "./client";
import { generateId } from "@/lib/utils";

import { nowIso } from "@/lib/format/time";
export const STANDALONE_RESUME_JOB_ID = "standalone";

export interface GeneratedResume {
  id: string;
  jobId: string;
  profileId: string;
  templateId: string;
  contentJson: string;
  htmlPath: string;
  matchScore?: number;
  createdAt: string;
}

// Create a new generated resume record
export function saveGeneratedResume(
  jobId: string,
  templateId: string,
  content: unknown,
  htmlPath: string,
  matchScore: number | undefined,
  userId: string,
): Promise<GeneratedResume> {
  const id = generateId();
  const now = nowIso();
  const contentJson = JSON.stringify(content);
  const shouldCheckJobOwnership = jobId !== STANDALONE_RESUME_JOB_ID;

  return saveGeneratedResumeAsync(
    id,
    userId,
    jobId,
    templateId,
    contentJson,
    htmlPath,
    matchScore,
    now,
    shouldCheckJobOwnership,
  );
}

async function saveGeneratedResumeAsync(
  id: string,
  userId: string,
  jobId: string,
  templateId: string,
  contentJson: string,
  htmlPath: string,
  matchScore: number | undefined,
  now: string,
  shouldCheckJobOwnership: boolean,
): Promise<GeneratedResume> {
  const sql = `
    INSERT INTO generated_resumes (id, user_id, job_id, profile_id, content_json, pdf_path, match_score, created_at)
    SELECT ?, ?, ?, ?, ?, ?, ?, ?
    ${shouldCheckJobOwnership ? "WHERE EXISTS (SELECT 1 FROM jobs WHERE id = ? AND user_id = ?)" : ""}
  `;

  const args: Array<string | number | null> = [
    id,
    userId,
    jobId,
    userId,
    contentJson,
    htmlPath,
    matchScore ?? null,
    now,
  ];

  if (shouldCheckJobOwnership) {
    args.push(jobId, userId);
  }

  const result = await getClient().execute({ sql, args });

  if (result.rowsAffected === 0) {
    throw new Error("Job not found");
  }

  return {
    id,
    jobId,
    profileId: userId,
    templateId,
    contentJson,
    htmlPath,
    matchScore,
    createdAt: now,
  };
}

// Get all generated resumes for a job
export async function getGeneratedResumes(
  jobId: string,
  userId: string,
): Promise<GeneratedResume[]> {
  const result = await getClient().execute({
    sql: `
    SELECT id, job_id, profile_id, content_json, pdf_path, match_score, created_at
    FROM generated_resumes
    WHERE job_id = ? AND user_id = ?
    ORDER BY created_at DESC
  `,
    args: [jobId, userId],
  });
  const rows = result.rows as unknown as GeneratedResumeRow[];

  return rows.map(rowToGeneratedResume);
}

// Get a specific generated resume
export async function getGeneratedResume(
  id: string,
  userId: string,
): Promise<GeneratedResume | null> {
  const result = await getClient().execute({
    sql: `
    SELECT id, job_id, profile_id, content_json, pdf_path, match_score, created_at
    FROM generated_resumes
    WHERE id = ? AND user_id = ?
  `,
    args: [id, userId],
  });
  const row = result.rows[0] as unknown as GeneratedResumeRow | undefined;

  if (!row) return null;

  return rowToGeneratedResume(row);
}

// Delete a generated resume
export async function deleteGeneratedResume(
  id: string,
  userId: string,
): Promise<void> {
  await getClient().execute({
    sql: "DELETE FROM generated_resumes WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
}

// Get all generated resumes (for dashboard stats)
export async function getAllGeneratedResumes(
  userId: string,
): Promise<GeneratedResume[]> {
  const result = await getClient().execute({
    sql: `
    SELECT id, job_id, profile_id, content_json, pdf_path, match_score, created_at
    FROM generated_resumes
    WHERE user_id = ?
    ORDER BY created_at DESC
  `,
    args: [userId],
  });
  const rows = result.rows as unknown as GeneratedResumeRow[];

  return rows.map(rowToGeneratedResume);
}

// Get count of generated resumes
export async function getGeneratedResumeCount(userId: string): Promise<number> {
  const result = await getClient().execute({
    sql: "SELECT COUNT(*) as count FROM generated_resumes WHERE user_id = ?",
    args: [userId],
  });
  const row = result.rows[0] as unknown as { count: number } | undefined;
  return row?.count ?? 0;
}

interface GeneratedResumeRow {
  id: string;
  job_id: string;
  profile_id: string;
  content_json: string;
  pdf_path: string;
  match_score: number | null;
  created_at: string;
}

function rowToGeneratedResume(row: GeneratedResumeRow): GeneratedResume {
  return {
    id: row.id,
    jobId: row.job_id,
    profileId: row.profile_id,
    templateId: "",
    contentJson: row.content_json,
    htmlPath: row.pdf_path,
    matchScore: row.match_score ?? undefined,
    createdAt: row.created_at,
  };
}
