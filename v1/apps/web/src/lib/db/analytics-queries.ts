import { getClient } from "./client";
import type { JobDescription } from "@/types";
import type { GeneratedResume } from "./resumes";

import { nowIso } from "@/lib/format/time";

export interface AnalyticsJobRow {
  id: string;
  title: string;
  company: string;
  type?: JobDescription["type"];
  status: JobDescription["status"];
  keywords: string[];
  appliedAt?: string;
  createdAt: string;
}

export interface ProfileAnalyticsView {
  contact: {
    name?: string;
    email?: string;
    phone?: string;
  };
  summary?: string | null;
  skills: Array<{ name: string; category: string }>;
  experienceCount: number;
  educationCount: number;
  projectCount: number;
  certificationCount: number;
}

export interface InterviewSessionStats {
  total: number;
  completed: number;
  inProgress: number;
}

function parseJsonArray(value?: string | null): string[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function parseContact(value?: string | null): ProfileAnalyticsView["contact"] {
  if (!value) return {};

  try {
    const parsed: unknown = JSON.parse(value);
    return parsed && typeof parsed === "object"
      ? (parsed as ProfileAnalyticsView["contact"])
      : {};
  } catch {
    return {};
  }
}

async function readCount(
  sql: string,
  ...args: Array<string | number | null>
): Promise<number> {
  const result = await getClient().execute({ sql, args });
  const row = result.rows[0] as unknown as { count?: number } | undefined;
  return row?.count ?? 0;
}

export async function getJobsAnalyticsView(
  userId: string,
): Promise<AnalyticsJobRow[]> {
  const result = await getClient().execute({
    sql: `
        SELECT id, title, company, type, status, keywords_json, applied_at, created_at
        FROM jobs
        WHERE user_id = ?
        ORDER BY created_at DESC
      `,
    args: [userId],
  });

  const rows = result.rows as unknown as Array<{
    id: string;
    title: string;
    company: string;
    type?: JobDescription["type"] | null;
    status?: JobDescription["status"] | null;
    keywords_json?: string | null;
    applied_at?: string | null;
    created_at?: string | null;
  }>;

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    company: row.company,
    type: row.type ?? undefined,
    status: row.status || "saved",
    keywords: parseJsonArray(row.keywords_json),
    appliedAt: row.applied_at ?? undefined,
    createdAt: row.created_at || nowIso(),
  }));
}

export async function getAnalyticsJobDescriptions(
  userId: string,
): Promise<JobDescription[]> {
  return (await getJobsAnalyticsView(userId)).map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    type: job.type,
    status: job.status,
    keywords: job.keywords,
    appliedAt: job.appliedAt,
    createdAt: job.createdAt,
    description: "",
    requirements: [],
    responsibilities: [],
    remote: false,
  }));
}

export async function getProfileAnalyticsView(
  userId: string,
): Promise<ProfileAnalyticsView | null> {
  const profileResult = await getClient().execute({
    sql: "SELECT id, contact_json, summary FROM profile WHERE id = ?",
    args: [userId],
  });
  const profile = profileResult.rows[0] as unknown as
    | { id: string; contact_json?: string | null; summary?: string | null }
    | undefined;

  if (!profile) return null;

  // Skills + the four section counts are all independent of each other (they
  // only needed the profile to exist, checked above). Run them concurrently
  // so a remote DB pays one round-trip instead of five stacked sequentially.
  const [
    skillsResult,
    experienceCount,
    educationCount,
    projectCount,
    certificationCount,
  ] = await Promise.all([
    getClient().execute({
      sql: `
        SELECT name, category
        FROM skills
        WHERE profile_id = ?
        ORDER BY name ASC
      `,
      args: [userId],
    }),
    readCount(
      "SELECT COUNT(*) as count FROM experiences WHERE profile_id = ?",
      userId,
    ),
    readCount(
      "SELECT COUNT(*) as count FROM education WHERE profile_id = ?",
      userId,
    ),
    readCount(
      "SELECT COUNT(*) as count FROM projects WHERE profile_id = ?",
      userId,
    ),
    readCount(
      "SELECT COUNT(*) as count FROM certifications WHERE profile_id = ?",
      userId,
    ),
  ]);
  const skills = skillsResult.rows as unknown as Array<{
    name: string;
    category?: string | null;
  }>;

  return {
    contact: parseContact(profile.contact_json),
    summary: profile.summary,
    skills: skills.map((skill) => ({
      name: skill.name,
      category: skill.category || "other",
    })),
    experienceCount,
    educationCount,
    projectCount,
    certificationCount,
  };
}

export async function getDocumentCount(userId: string): Promise<number> {
  return readCount(
    "SELECT COUNT(*) as count FROM documents WHERE user_id = ?",
    userId,
  );
}

export async function getInterviewSessionStats(
  userId: string,
): Promise<InterviewSessionStats> {
  const result = await getClient().execute({
    sql: `
        SELECT COALESCE(status, 'in_progress') as status, COUNT(*) as count
        FROM interview_sessions
        WHERE user_id = ?
        GROUP BY COALESCE(status, 'in_progress')
      `,
    args: [userId],
  });
  const rows = result.rows as unknown as Array<{
    status: string;
    count: number;
  }>;

  const byStatus = Object.fromEntries(
    rows.map((row) => [row.status, row.count]),
  ) as Record<string, number>;
  const total = rows.reduce((sum, row) => sum + row.count, 0);

  return {
    total,
    completed: byStatus.completed ?? 0,
    inProgress: byStatus.in_progress ?? 0,
  };
}

export async function getGeneratedResumeCount(userId: string): Promise<number> {
  return readCount(
    "SELECT COUNT(*) as count FROM generated_resumes WHERE user_id = ?",
    userId,
  );
}

export async function getGeneratedResumeAnalyticsView(
  userId: string,
): Promise<GeneratedResume[]> {
  const result = await getClient().execute({
    sql: `
        SELECT id, job_id, profile_id, pdf_path, match_score, created_at
        FROM generated_resumes
        WHERE user_id = ?
        ORDER BY created_at DESC
      `,
    args: [userId],
  });
  const rows = result.rows as unknown as Array<{
    id: string;
    job_id: string;
    profile_id: string;
    pdf_path?: string | null;
    match_score?: number | null;
    created_at?: string | null;
  }>;

  return rows.map((row) => ({
    id: row.id,
    jobId: row.job_id,
    profileId: row.profile_id,
    templateId: "",
    contentJson: "",
    htmlPath: row.pdf_path ?? "",
    matchScore: row.match_score ?? undefined,
    createdAt: row.created_at || nowIso(),
  }));
}
