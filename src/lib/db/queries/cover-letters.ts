import { db, coverLetters, eq, and, desc } from "../index";
import { generateId } from "@/lib/utils";

import { nowDate, toIso } from "@/lib/format/time";
export interface CoverLetter {
  id: string;
  jobId: string;
  profileId: string;
  content: string;
  highlights: string[];
  version: number;
  createdAt: string;
}

// Save a new cover letter
export async function saveCoverLetter(
  userId: string,
  jobId: string,
  profileId: string,
  content: string,
  highlights: string[] = [],
): Promise<CoverLetter> {
  const id = generateId();
  const now = nowDate();

  // Get next version number for this job
  const existingRows = await db
    .select()
    .from(coverLetters)
    .where(and(eq(coverLetters.userId, userId), eq(coverLetters.jobId, jobId)))
    .orderBy(desc(coverLetters.version));

  const version =
    existingRows.length > 0 ? (existingRows[0].version ?? 0) + 1 : 1;

  await db.insert(coverLetters).values({
    id,
    userId,
    jobId,
    profileId,
    content,
    highlightsJson: JSON.stringify(highlights),
    version,
    createdAt: toIso(now),
  });

  return {
    id,
    jobId,
    profileId,
    content,
    highlights,
    version,
    createdAt: toIso(now),
  };
}

// Get all cover letters for a job
export async function getCoverLettersByJob(
  userId: string,
  jobId: string,
): Promise<CoverLetter[]> {
  const rows = await db
    .select()
    .from(coverLetters)
    .where(and(eq(coverLetters.userId, userId), eq(coverLetters.jobId, jobId)))
    .orderBy(desc(coverLetters.version));

  return rows.map((row) => ({
    id: row.id,
    jobId: row.jobId,
    profileId: row.profileId,
    content: row.content,
    highlights: row.highlightsJson ? JSON.parse(row.highlightsJson) : [],
    version: row.version ?? 1,
    createdAt: row.createdAt ?? "",
  }));
}

// Get latest cover letter for a job
export async function getLatestCoverLetter(
  userId: string,
  jobId: string,
): Promise<CoverLetter | null> {
  const rows = await db
    .select()
    .from(coverLetters)
    .where(and(eq(coverLetters.userId, userId), eq(coverLetters.jobId, jobId)))
    .orderBy(desc(coverLetters.version))
    .limit(1);

  if (rows.length === 0) return null;
  const row = rows[0];

  return {
    id: row.id,
    jobId: row.jobId,
    profileId: row.profileId,
    content: row.content,
    highlights: row.highlightsJson ? JSON.parse(row.highlightsJson) : [],
    version: row.version ?? 1,
    createdAt: row.createdAt ?? "",
  };
}

// Get a specific cover letter
export async function getCoverLetter(
  userId: string,
  coverLetterId: string,
): Promise<CoverLetter | null> {
  const rows = await db
    .select()
    .from(coverLetters)
    .where(
      and(eq(coverLetters.id, coverLetterId), eq(coverLetters.userId, userId)),
    );

  if (rows.length === 0) return null;
  const row = rows[0];

  return {
    id: row.id,
    jobId: row.jobId,
    profileId: row.profileId,
    content: row.content,
    highlights: row.highlightsJson ? JSON.parse(row.highlightsJson) : [],
    version: row.version ?? 1,
    createdAt: row.createdAt ?? "",
  };
}

// Delete a cover letter
export async function deleteCoverLetter(
  userId: string,
  coverLetterId: string,
): Promise<boolean> {
  const result = await db
    .delete(coverLetters)
    .where(
      and(eq(coverLetters.id, coverLetterId), eq(coverLetters.userId, userId)),
    );

  return true;
}

// Get cover letter count for a job
export async function getCoverLetterCount(
  userId: string,
  jobId: string,
): Promise<number> {
  const rows = await db
    .select()
    .from(coverLetters)
    .where(and(eq(coverLetters.userId, userId), eq(coverLetters.jobId, jobId)));

  return rows.length;
}
