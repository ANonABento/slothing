import db from "./legacy";
import { generateId } from "@/lib/utils";
import type { JobDescription, JobStatus } from "@/types";

import { nowIso } from "@/lib/format/time";
interface JobRow {
  id: string;
  title: string;
  company: string;
  location?: string;
  type?: JobDescription["type"];
  remote?: number | boolean;
  salary?: string;
  description: string;
  requirements_json?: string;
  responsibilities_json?: string;
  keywords_json?: string;
  url?: string;
  status?: JobStatus;
  applied_at?: string;
  deadline?: string;
  notes?: string;
  created_at?: string;
}

export interface CreatedAtCursor {
  lastId: string;
  lastCreatedAt: string;
  lastSortValue?: string | null;
  sortBy?: JobListSort;
}

export type JobListSort = "createdAt" | "deadline" | "company" | "salary";

export interface ListJobsParams {
  userId: string;
  statuses?: JobStatus[];
  cursor?: CreatedAtCursor | null;
  limit: number;
  query?: string | null;
  remote?: boolean | null;
  type?: string | null;
  keyword?: string | null;
  sortBy?: JobListSort;
}

function parseJsonArray(value?: string): string[] {
  if (!value) {
    return [];
  }

  const parsed: unknown = JSON.parse(value);
  return Array.isArray(parsed)
    ? parsed.filter((item): item is string => typeof item === "string")
    : [];
}

function mapRowToJob(row: JobRow): JobDescription {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    type: row.type,
    remote: Boolean(row.remote),
    salary: row.salary,
    description: row.description,
    requirements: parseJsonArray(row.requirements_json),
    responsibilities: parseJsonArray(row.responsibilities_json),
    keywords: parseJsonArray(row.keywords_json),
    url: row.url,
    status: row.status || "saved",
    appliedAt: row.applied_at,
    deadline: row.deadline,
    notes: row.notes,
    createdAt: row.created_at || nowIso(),
  };
}

// Get all jobs
export function getJobs(userId: string): JobDescription[] {
  const rows = db
    .prepare("SELECT * FROM jobs WHERE user_id = ? ORDER BY created_at DESC")
    .all(userId) as JobRow[];
  return rows.map(mapRowToJob);
}

export function listJobsPaginated({
  userId,
  statuses,
  cursor,
  limit,
  query,
  remote,
  type,
  keyword,
  sortBy = "createdAt",
}: ListJobsParams): JobDescription[] {
  const whereClauses = ["user_id = ?"];
  const params: Array<string | number> = [userId];

  if (statuses?.length) {
    whereClauses.push(`status IN (${statuses.map(() => "?").join(", ")})`);
    params.push(...statuses);
  }

  const trimmedQuery = query?.trim();
  if (trimmedQuery) {
    const pattern = `%${escapeLikePattern(trimmedQuery)}%`;
    whereClauses.push(`(
      title LIKE ? ESCAPE '\\' OR
      company LIKE ? ESCAPE '\\' OR
      location LIKE ? ESCAPE '\\' OR
      description LIKE ? ESCAPE '\\' OR
      requirements_json LIKE ? ESCAPE '\\' OR
      responsibilities_json LIKE ? ESCAPE '\\' OR
      keywords_json LIKE ? ESCAPE '\\' OR
      notes LIKE ? ESCAPE '\\'
    )`);
    params.push(
      pattern,
      pattern,
      pattern,
      pattern,
      pattern,
      pattern,
      pattern,
      pattern,
    );
  }

  if (remote != null) {
    whereClauses.push("remote = ?");
    params.push(remote ? 1 : 0);
  }

  if (type?.trim()) {
    whereClauses.push("type = ?");
    params.push(type.trim());
  }

  if (keyword?.trim()) {
    whereClauses.push("keywords_json LIKE ? ESCAPE '\\'");
    params.push(`%${escapeLikePattern(keyword.trim())}%`);
  }

  if (cursor) {
    appendCursorPredicate(whereClauses, params, cursor, sortBy);
  }

  params.push(limit + 1);

  const rows = db
    .prepare(
      `SELECT * FROM jobs
       WHERE ${whereClauses.join(" AND ")}
       ORDER BY ${orderBySql(sortBy)}
       LIMIT ?`,
    )
    .all(...params) as JobRow[];
  return rows.map(mapRowToJob);
}

export interface CountJobsByStatusParams {
  userId: string;
  query?: string | null;
  remote?: boolean | null;
  type?: string | null;
  keyword?: string | null;
}

export function countJobsGroupedByStatus({
  userId,
  query,
  remote,
  type,
  keyword,
}: CountJobsByStatusParams): Record<string, number> {
  const whereClauses = ["user_id = ?"];
  const params: Array<string | number> = [userId];

  const trimmedQuery = query?.trim();
  if (trimmedQuery) {
    const pattern = `%${escapeLikePattern(trimmedQuery)}%`;
    whereClauses.push(`(
      title LIKE ? ESCAPE '\\' OR
      company LIKE ? ESCAPE '\\' OR
      location LIKE ? ESCAPE '\\' OR
      description LIKE ? ESCAPE '\\' OR
      requirements_json LIKE ? ESCAPE '\\' OR
      responsibilities_json LIKE ? ESCAPE '\\' OR
      keywords_json LIKE ? ESCAPE '\\' OR
      notes LIKE ? ESCAPE '\\'
    )`);
    params.push(
      pattern,
      pattern,
      pattern,
      pattern,
      pattern,
      pattern,
      pattern,
      pattern,
    );
  }

  if (remote != null) {
    whereClauses.push("remote = ?");
    params.push(remote ? 1 : 0);
  }

  if (type?.trim()) {
    whereClauses.push("type = ?");
    params.push(type.trim());
  }

  if (keyword?.trim()) {
    whereClauses.push("keywords_json LIKE ? ESCAPE '\\'");
    params.push(`%${escapeLikePattern(keyword.trim())}%`);
  }

  const rows = db
    .prepare(
      `SELECT COALESCE(status, 'saved') AS status, COUNT(*) AS count
       FROM jobs
       WHERE ${whereClauses.join(" AND ")}
       GROUP BY COALESCE(status, 'saved')`,
    )
    .all(...params) as Array<{ status: string; count: number }>;

  return Object.fromEntries(rows.map((row) => [row.status, Number(row.count)]));
}

export function makeJobCursor(
  job: JobDescription,
  sortBy: JobListSort = "createdAt",
): CreatedAtCursor {
  return {
    lastId: job.id,
    lastCreatedAt: job.createdAt,
    lastSortValue: sortValueForJob(job, sortBy),
    sortBy,
  };
}

function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}

function sortValueForJob(
  job: JobDescription,
  sortBy: JobListSort,
): string | null {
  switch (sortBy) {
    case "deadline":
      return job.deadline || null;
    case "company":
      return `${job.company}\u0000${job.title}`;
    case "salary":
      return String(parseSalarySortValue(job.salary));
    case "createdAt":
    default:
      return job.createdAt;
  }
}

function orderBySql(sortBy: JobListSort): string {
  switch (sortBy) {
    case "deadline":
      return "(deadline IS NULL OR deadline = '') ASC, deadline ASC, created_at DESC, id DESC";
    case "company":
      return "company COLLATE NOCASE ASC, title COLLATE NOCASE ASC, created_at DESC, id DESC";
    case "salary":
      return "CAST(REPLACE(REPLACE(COALESCE(salary, '0'), ',', ''), '$', '') AS REAL) DESC, created_at DESC, id DESC";
    case "createdAt":
    default:
      return "created_at DESC, id DESC";
  }
}

function appendCursorPredicate(
  whereClauses: string[],
  params: Array<string | number>,
  cursor: CreatedAtCursor,
  sortBy: JobListSort,
): void {
  if (sortBy === "deadline") {
    const value = cursor.lastSortValue || null;
    if (value) {
      whereClauses.push(`(
        (deadline IS NOT NULL AND deadline != '' AND deadline > ?) OR
        (deadline IS NULL OR deadline = '') OR
        (deadline = ? AND (created_at < ? OR (created_at = ? AND id < ?)))
      )`);
      params.push(
        value,
        value,
        cursor.lastCreatedAt,
        cursor.lastCreatedAt,
        cursor.lastId,
      );
    } else {
      whereClauses.push(`(
        (deadline IS NULL OR deadline = '') AND
        (created_at < ? OR (created_at = ? AND id < ?))
      )`);
      params.push(cursor.lastCreatedAt, cursor.lastCreatedAt, cursor.lastId);
    }
    return;
  }

  if (sortBy === "company") {
    const [company = "", title = ""] = (cursor.lastSortValue ?? "").split(
      "\u0000",
    );
    whereClauses.push(`(
      company COLLATE NOCASE > ? COLLATE NOCASE OR
      (company = ? COLLATE NOCASE AND title COLLATE NOCASE > ? COLLATE NOCASE) OR
      (company = ? COLLATE NOCASE AND title = ? COLLATE NOCASE AND (created_at < ? OR (created_at = ? AND id < ?)))
    )`);
    params.push(
      company,
      company,
      title,
      company,
      title,
      cursor.lastCreatedAt,
      cursor.lastCreatedAt,
      cursor.lastId,
    );
    return;
  }

  if (sortBy === "salary") {
    const value = Number(cursor.lastSortValue ?? 0);
    whereClauses.push(`(
      CAST(REPLACE(REPLACE(COALESCE(salary, '0'), ',', ''), '$', '') AS REAL) < ? OR
      (CAST(REPLACE(REPLACE(COALESCE(salary, '0'), ',', ''), '$', '') AS REAL) = ? AND (created_at < ? OR (created_at = ? AND id < ?)))
    )`);
    params.push(
      value,
      value,
      cursor.lastCreatedAt,
      cursor.lastCreatedAt,
      cursor.lastId,
    );
    return;
  }

  whereClauses.push("(created_at < ? OR (created_at = ? AND id < ?))");
  params.push(cursor.lastCreatedAt, cursor.lastCreatedAt, cursor.lastId);
}

function parseSalarySortValue(salary?: string): number {
  const firstNumber = salary?.match(/\d[\d,]*(?:\.\d+)?/)?.[0];
  return firstNumber ? Number(firstNumber.replace(/,/g, "")) || 0 : 0;
}

// Get single job
export function getJob(id: string, userId: string): JobDescription | null {
  const row = db
    .prepare("SELECT * FROM jobs WHERE id = ? AND user_id = ?")
    .get(id, userId) as JobRow | undefined;
  if (!row) return null;
  return mapRowToJob(row);
}

/**
 * Looks up an opportunity without a user predicate for share-card generation.
 * Only use this from OG image routes: opportunity IDs are random share tokens,
 * but titles and companies become visible to anyone with the exact URL.
 */
export function getJobByIdAnyUser(id: string): JobDescription | null {
  const row = db.prepare("SELECT * FROM jobs WHERE id = ?").get(id) as
    | JobRow
    | undefined;
  if (!row) return null;
  return mapRowToJob(row);
}

export function getJobByUrl(
  url: string,
  userId: string,
): JobDescription | null {
  const row = db
    .prepare("SELECT * FROM jobs WHERE url = ? AND user_id = ?")
    .get(url, userId) as JobRow | undefined;
  if (!row) return null;
  return mapRowToJob(row);
}

// Create job
export function createJob(
  job: Omit<JobDescription, "id" | "createdAt">,
  userId: string,
): JobDescription {
  const id = generateId();
  db.prepare(
    `
    INSERT INTO jobs (id, title, company, location, type, remote, salary, description, requirements_json, responsibilities_json, keywords_json, url, status, applied_at, deadline, notes, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    job.title,
    job.company,
    job.location || null,
    job.type || null,
    job.remote ? 1 : 0,
    job.salary || null,
    job.description,
    JSON.stringify(job.requirements || []),
    JSON.stringify(job.responsibilities || []),
    JSON.stringify(job.keywords || []),
    job.url || null,
    job.status || "saved",
    job.appliedAt || null,
    job.deadline || null,
    job.notes || null,
    userId,
  );
  return getJob(id, userId)!;
}

// Update job
export function updateJob(
  id: string,
  updates: Partial<JobDescription>,
  userId: string,
): void {
  const existing = getJob(id, userId);
  if (!existing) return;

  const merged = { ...existing, ...updates };
  db.prepare(
    `
    UPDATE jobs SET
      title = ?,
      company = ?,
      location = ?,
      type = ?,
      remote = ?,
      salary = ?,
      description = ?,
      requirements_json = ?,
      responsibilities_json = ?,
      keywords_json = ?,
      url = ?,
      status = ?,
      applied_at = ?,
      deadline = ?,
      notes = ?
    WHERE id = ? AND user_id = ?
  `,
  ).run(
    merged.title,
    merged.company,
    merged.location || null,
    merged.type || null,
    merged.remote ? 1 : 0,
    merged.salary || null,
    merged.description,
    JSON.stringify(merged.requirements || []),
    JSON.stringify(merged.responsibilities || []),
    JSON.stringify(merged.keywords || []),
    merged.url || null,
    merged.status || "saved",
    merged.appliedAt || null,
    merged.deadline || null,
    merged.notes || null,
    id,
    userId,
  );
}

// Update job status
export function updateJobStatus(
  id: string,
  status: JobStatus,
  appliedAt: string | undefined,
  userId: string,
): JobDescription | null {
  const now = nowIso();

  db.prepare(
    `
    UPDATE jobs SET
      status = ?,
      applied_at = COALESCE(?, applied_at)
    WHERE id = ? AND user_id = ?
  `,
  ).run(
    status,
    status === "applied" && !appliedAt ? now : appliedAt || null,
    id,
    userId,
  );

  return getJob(id, userId);
}

// Delete job
export function deleteJob(id: string, userId: string): void {
  db.prepare("DELETE FROM jobs WHERE id = ? AND user_id = ?").run(id, userId);
}

export function countJobsByStatus(status: string, userId: string): number {
  const result = db
    .prepare(
      "SELECT COUNT(*) as count FROM jobs WHERE status = ? AND user_id = ?",
    )
    .get(status, userId) as { count: number } | undefined;
  return result?.count ?? 0;
}
