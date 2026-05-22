import { getClient } from "./client";
import { generateId } from "@/lib/utils";
import type { ABOutcome, ABTrackingEntry } from "@/lib/resume/compare";

import { nowIso } from "@/lib/format/time";
interface TrackingRow {
  id: string;
  resume_id: string;
  job_id: string;
  outcome: ABOutcome;
  sent_at: string;
  updated_at: string;
  notes: string | null;
}

function rowToEntry(row: TrackingRow): ABTrackingEntry {
  return {
    id: row.id,
    resumeId: row.resume_id,
    jobId: row.job_id,
    outcome: row.outcome,
    sentAt: row.sent_at,
    updatedAt: row.updated_at,
    notes: row.notes || undefined,
  };
}

// Log which resume version was sent to which job
export async function trackResumeSent(
  resumeId: string,
  jobId: string,
  userId: string,
  notes?: string,
): Promise<ABTrackingEntry> {
  const id = generateId();
  const now = nowIso();

  const result = await getClient().execute({
    sql: `
      INSERT INTO resume_ab_tracking (id, resume_id, job_id, user_id, outcome, sent_at, updated_at, notes)
      SELECT ?, ?, ?, ?, 'applied', ?, ?, ?
      WHERE EXISTS (SELECT 1 FROM generated_resumes WHERE id = ? AND user_id = ?)
        AND EXISTS (SELECT 1 FROM jobs WHERE id = ? AND user_id = ?)
    `,
    args: [
      id,
      resumeId,
      jobId,
      userId,
      now,
      now,
      notes || null,
      resumeId,
      userId,
      jobId,
      userId,
    ],
  });

  if (result.rowsAffected === 0) {
    throw new Error("Resume or job not found");
  }

  return {
    id,
    resumeId,
    jobId,
    outcome: "applied",
    sentAt: now,
    updatedAt: now,
    notes,
  };
}

// Update the outcome for a tracking entry
export async function updateTrackingOutcome(
  id: string,
  outcome: ABOutcome,
  userId: string,
): Promise<boolean> {
  const now = nowIso();
  const result = await getClient().execute({
    sql: `
      UPDATE resume_ab_tracking
      SET outcome = ?, updated_at = ?
      WHERE id = ? AND user_id = ?
    `,
    args: [outcome, now, id, userId],
  });

  return result.rowsAffected > 0;
}

// Get all tracking entries for a user
export async function getTrackingEntries(
  userId: string,
): Promise<ABTrackingEntry[]> {
  const result = await getClient().execute({
    sql: `
      SELECT id, resume_id, job_id, outcome, sent_at, updated_at, notes
      FROM resume_ab_tracking
      WHERE user_id = ?
      ORDER BY sent_at DESC
    `,
    args: [userId],
  });

  return (result.rows as unknown as TrackingRow[]).map(rowToEntry);
}

// Get tracking entries for a specific resume
export async function getTrackingEntriesByResume(
  resumeId: string,
  userId: string,
): Promise<ABTrackingEntry[]> {
  const result = await getClient().execute({
    sql: `
      SELECT id, resume_id, job_id, outcome, sent_at, updated_at, notes
      FROM resume_ab_tracking
      WHERE resume_id = ? AND user_id = ?
      ORDER BY sent_at DESC
    `,
    args: [resumeId, userId],
  });

  return (result.rows as unknown as TrackingRow[]).map(rowToEntry);
}

// Get distinct resume IDs that have been tracked
export async function getTrackedResumeIds(userId: string): Promise<string[]> {
  const result = await getClient().execute({
    sql: `
      SELECT DISTINCT resume_id
      FROM resume_ab_tracking
      WHERE user_id = ?
    `,
    args: [userId],
  });

  const rows = result.rows as unknown as Array<{ resume_id: string }>;
  return rows.map((row) => row.resume_id);
}

// Delete a tracking entry
export async function deleteTrackingEntry(
  id: string,
  userId: string,
): Promise<boolean> {
  const result = await getClient().execute({
    sql: "DELETE FROM resume_ab_tracking WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
  return result.rowsAffected > 0;
}
