import { db, generatedResumes, eq, and, desc } from '../index';
import { generateId } from '@/lib/utils';

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
export async function saveGeneratedResume(
  userId: string,
  jobId: string,
  profileId: string,
  templateId: string,
  content: unknown,
  htmlPath: string,
  matchScore?: number
): Promise<GeneratedResume> {
  const id = generateId();
  const now = new Date();
  const contentJson = JSON.stringify(content);

  await db.insert(generatedResumes).values({
    id,
    userId,
    jobId,
    profileId,
    contentJson,
    pdfPath: htmlPath,
    matchScore: matchScore ?? null,
    createdAt: now,
  });

  return {
    id,
    jobId,
    profileId,
    templateId,
    contentJson,
    htmlPath,
    matchScore,
    createdAt: now.toISOString(),
  };
}

// Get all generated resumes for a job
export async function getGeneratedResumes(userId: string, jobId: string): Promise<GeneratedResume[]> {
  const rows = await db.select().from(generatedResumes)
    .where(and(eq(generatedResumes.userId, userId), eq(generatedResumes.jobId, jobId)))
    .orderBy(desc(generatedResumes.createdAt));

  return rows.map((row) => ({
    id: row.id,
    jobId: row.jobId,
    profileId: row.profileId,
    templateId: '',
    contentJson: row.contentJson,
    htmlPath: row.pdfPath ?? '',
    matchScore: row.matchScore ?? undefined,
    createdAt: row.createdAt?.toISOString() ?? '',
  }));
}

// Get a specific generated resume
export async function getGeneratedResume(userId: string, resumeId: string): Promise<GeneratedResume | null> {
  const rows = await db.select().from(generatedResumes)
    .where(and(eq(generatedResumes.id, resumeId), eq(generatedResumes.userId, userId)));

  if (rows.length === 0) return null;
  const row = rows[0];

  return {
    id: row.id,
    jobId: row.jobId,
    profileId: row.profileId,
    templateId: '',
    contentJson: row.contentJson,
    htmlPath: row.pdfPath ?? '',
    matchScore: row.matchScore ?? undefined,
    createdAt: row.createdAt?.toISOString() ?? '',
  };
}

// Delete a generated resume
export async function deleteGeneratedResume(userId: string, resumeId: string): Promise<void> {
  await db.delete(generatedResumes)
    .where(and(eq(generatedResumes.id, resumeId), eq(generatedResumes.userId, userId)));
}

// Get all generated resumes for a user
export async function getAllGeneratedResumes(userId: string): Promise<GeneratedResume[]> {
  const rows = await db.select().from(generatedResumes)
    .where(eq(generatedResumes.userId, userId))
    .orderBy(desc(generatedResumes.createdAt));

  return rows.map((row) => ({
    id: row.id,
    jobId: row.jobId,
    profileId: row.profileId,
    templateId: '',
    contentJson: row.contentJson,
    htmlPath: row.pdfPath ?? '',
    matchScore: row.matchScore ?? undefined,
    createdAt: row.createdAt?.toISOString() ?? '',
  }));
}

// Get count of generated resumes for a user
export async function getGeneratedResumeCount(userId: string): Promise<number> {
  const rows = await db.select().from(generatedResumes)
    .where(eq(generatedResumes.userId, userId));

  return rows.length;
}
