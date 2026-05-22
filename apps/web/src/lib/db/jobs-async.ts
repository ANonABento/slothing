import { getClient } from "./client";
import { generateId } from "@/lib/utils";
import type { JobDescription, JobStatus } from "@/types";
import { nowIso } from "@/lib/format/time";

interface JobRow {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  type?: JobDescription["type"] | null;
  remote?: number | boolean | null;
  salary?: string | null;
  description: string;
  requirements_json?: string | null;
  responsibilities_json?: string | null;
  keywords_json?: string | null;
  url?: string | null;
  status?: JobStatus | null;
  applied_at?: string | null;
  deadline?: string | null;
  notes?: string | null;
  created_at?: string | null;
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

export interface CountJobsByStatusParams {
  userId: string;
  query?: string | null;
  remote?: boolean | null;
  type?: string | null;
  keyword?: string | null;
}

function parseJsonArray(value?: string | null): string[] {
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
    location: row.location ?? undefined,
    type: row.type ?? undefined,
    remote: Boolean(row.remote),
    salary: row.salary ?? undefined,
    description: row.description,
    requirements: parseJsonArray(row.requirements_json),
    responsibilities: parseJsonArray(row.responsibilities_json),
    keywords: parseJsonArray(row.keywords_json),
    url: row.url ?? undefined,
    status: row.status || "saved",
    appliedAt: row.applied_at ?? undefined,
    deadline: row.deadline ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at || nowIso(),
  };
}

async function allJobs(sql: string, args: Array<string | number | null>) {
  const result = await getClient().execute({ sql, args });
  return result.rows as unknown as JobRow[];
}

async function firstJob(sql: string, args: Array<string | number | null>) {
  const rows = await allJobs(sql, args);
  return rows[0];
}

export async function getJobs(userId: string): Promise<JobDescription[]> {
  const rows = await allJobs(
    "SELECT * FROM jobs WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
  );
  return rows.map(mapRowToJob);
}

export async function listJobsPaginated({
  userId,
  statuses,
  cursor,
  limit,
  query,
  remote,
  type,
  keyword,
  sortBy = "createdAt",
}: ListJobsParams): Promise<JobDescription[]> {
  const whereClauses = ["user_id = ?"];
  const params: Array<string | number | null> = [userId];

  appendSharedFilters(whereClauses, params, {
    statuses,
    query,
    remote,
    type,
    keyword,
  });

  if (cursor) {
    appendCursorPredicate(whereClauses, params, cursor, sortBy);
  }

  params.push(limit + 1);

  const rows = await allJobs(
    `SELECT * FROM jobs
     WHERE ${whereClauses.join(" AND ")}
     ORDER BY ${orderBySql(sortBy)}
     LIMIT ?`,
    params,
  );
  return rows.map(mapRowToJob);
}

export async function countJobsGroupedByStatus({
  userId,
  query,
  remote,
  type,
  keyword,
}: CountJobsByStatusParams): Promise<Record<string, number>> {
  const whereClauses = ["user_id = ?"];
  const params: Array<string | number | null> = [userId];

  appendSharedFilters(whereClauses, params, {
    query,
    remote,
    type,
    keyword,
  });

  const result = await getClient().execute({
    sql: `SELECT COALESCE(status, 'saved') AS status, COUNT(*) AS count
          FROM jobs
          WHERE ${whereClauses.join(" AND ")}
          GROUP BY COALESCE(status, 'saved')`,
    args: params,
  });

  return Object.fromEntries(
    result.rows.map((row) => [String(row.status), Number(row.count ?? 0)]),
  );
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

export async function getJob(
  id: string,
  userId: string,
): Promise<JobDescription | null> {
  const row = await firstJob(
    "SELECT * FROM jobs WHERE id = ? AND user_id = ?",
    [id, userId],
  );
  return row ? mapRowToJob(row) : null;
}

export async function getJobByIdAnyUser(
  id: string,
): Promise<JobDescription | null> {
  const row = await firstJob("SELECT * FROM jobs WHERE id = ?", [id]);
  return row ? mapRowToJob(row) : null;
}

export async function getJobByUrl(
  url: string,
  userId: string,
): Promise<JobDescription | null> {
  const row = await firstJob(
    "SELECT * FROM jobs WHERE url = ? AND user_id = ?",
    [url, userId],
  );
  return row ? mapRowToJob(row) : null;
}

export async function createJob(
  job: Omit<JobDescription, "id" | "createdAt">,
  userId: string,
): Promise<JobDescription> {
  const id = generateId();
  await getClient().execute({
    sql: `
      INSERT INTO jobs (
        id, title, company, location, type, remote, salary, description,
        requirements_json, responsibilities_json, keywords_json, url, status,
        applied_at, deadline, notes, user_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
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
    ],
  });
  const created = await getJob(id, userId);
  if (!created) {
    throw new Error("Created job could not be loaded");
  }
  return created;
}

export async function updateJob(
  id: string,
  updates: Partial<JobDescription>,
  userId: string,
): Promise<void> {
  const existing = await getJob(id, userId);
  if (!existing) return;

  const merged = { ...existing, ...updates };
  await getClient().execute({
    sql: `
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
        notes = ?,
      WHERE id = ? AND user_id = ?
    `,
    args: [
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
    ],
  });
}

export async function updateJobStatus(
  id: string,
  status: JobStatus,
  appliedAt: string | undefined,
  userId: string,
): Promise<JobDescription | null> {
  const now = nowIso();

  await getClient().execute({
    sql: `
      UPDATE jobs SET
        status = ?,
        applied_at = COALESCE(?, applied_at)
      WHERE id = ? AND user_id = ?
    `,
    args: [
      status,
      status === "applied" && !appliedAt ? now : appliedAt || null,
      id,
      userId,
    ],
  });

  return getJob(id, userId);
}

export async function deleteJob(id: string, userId: string): Promise<void> {
  await getClient().execute({
    sql: "DELETE FROM jobs WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
}

export async function countJobsByStatus(
  status: string,
  userId: string,
): Promise<number> {
  const result = await getClient().execute({
    sql: "SELECT COUNT(*) as count FROM jobs WHERE status = ? AND user_id = ?",
    args: [status, userId],
  });
  return Number(result.rows[0]?.count ?? 0);
}

function appendSharedFilters(
  whereClauses: string[],
  params: Array<string | number | null>,
  {
    statuses,
    query,
    remote,
    type,
    keyword,
  }: {
    statuses?: JobStatus[];
    query?: string | null;
    remote?: boolean | null;
    type?: string | null;
    keyword?: string | null;
  },
): void {
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
  params: Array<string | number | null>,
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
