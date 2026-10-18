import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import { join } from "path";

import { newId } from "./ids";
import {
  CoverLetter,
  type Answer,
  type Application,
  DocMeta,
  Profile,
  Settings,
  TailoredResume,
  type DocKind,
  type Job,
  type JobStatus,
  type StoredDoc,
  type Warning,
} from "./types";

/** A job you applied to is due a follow-up this long after, if nothing has moved. (Up here: migrations use it.) */
export const FOLLOW_UP_DAYS = 7;

const DATA_DIR = process.env.SLOTHING_DATA_DIR || join(process.cwd(), "data");
// Belt and braces: a test run that bypasses vitest.config (e.g. a stray file run from elsewhere) must not touch real data.
if (process.env.VITEST && !process.env.SLOTHING_DATA_DIR) {
  throw new Error("Refusing to open the real database from a test. Set SLOTHING_DATA_DIR.");
}

function open() {
  mkdirSync(DATA_DIR, { recursive: true });
  const db = new Database(join(DATA_DIR, "slothing.db"));
  // Wait for another writer (a second process, or parallel test files) instead of failing at once.
  // First, so switching to WAL below waits too.
  db.pragma("busy_timeout = 5000");
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      company TEXT NOT NULL DEFAULT '',
      title TEXT NOT NULL DEFAULT '',
      url TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'saved',
      notes TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      kind TEXT NOT NULL,
      data TEXT NOT NULL,
      warnings TEXT NOT NULL DEFAULT '[]',
      meta TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT NOT NULL,
      UNIQUE (job_id, kind)
    );
  `);
  createVersions(db);
  createAnswers(db);
  db.pragma("foreign_keys = ON");
  return db;
}

function createAnswers(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS answers (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL DEFAULT '',
      source_url TEXT NOT NULL DEFAULT '',
      uses INTEGER NOT NULL DEFAULT 0,
      used_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      url TEXT NOT NULL DEFAULT '',
      answers TEXT NOT NULL DEFAULT '[]',
      resume_version TEXT,
      letter_version TEXT,
      submitted_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS kv (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}

/** Every saved state of a job's resume and letter, newest last, so any of them can be restored. */
function createVersions(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS document_versions (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      kind TEXT NOT NULL,
      data TEXT NOT NULL,
      warnings TEXT NOT NULL DEFAULT '[]',
      meta TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS document_versions_doc ON document_versions (job_id, kind, created_at);
  `);
}

/**
 * Columns added after a table first shipped. CREATE TABLE above has them for new databases; this adds them to old ones.
 * One write-locked transaction, so two processes opening the same database (parallel test files, a second dev
 * server) can't both see a column missing and both add it.
 */
export function migrate(db: Database.Database) {
  db.transaction(() => addColumns(db)).immediate();
}

function addColumns(db: Database.Database) {
  const has = (table: string, column: string) => (db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]).some((c) => c.name === column);
  if (!has("documents", "meta")) db.exec("ALTER TABLE documents ADD COLUMN meta TEXT NOT NULL DEFAULT '{}'");
  // Columns of a table that exists: has() is false for a missing table too, and ALTER would fail.
  const cols = (table: string) => (db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]).map((c) => c.name);
  const jobCols = cols("jobs");
  if (jobCols.length && !jobCols.includes("last_seen_at")) db.exec("ALTER TABLE jobs ADD COLUMN last_seen_at TEXT");
  if (jobCols.length && !jobCols.includes("visit_started_at")) db.exec("ALTER TABLE jobs ADD COLUMN visit_started_at TEXT");
  if (jobCols.length && !jobCols.includes("prev_visit_at")) db.exec("ALTER TABLE jobs ADD COLUMN prev_visit_at TEXT");
  if (jobCols.length && !jobCols.includes("follow_up_at")) {
    db.exec("ALTER TABLE jobs ADD COLUMN follow_up_at TEXT");
    // Jobs applied to before follow-ups existed: due a week after their last application (or last update).
    const applied = cols("applications").length ? "(SELECT MAX(submitted_at) FROM applications a WHERE a.job_id = jobs.id)" : "NULL";
    db.prepare(`UPDATE jobs SET follow_up_at = strftime('%Y-%m-%dT%H:%M:%fZ', COALESCE(${applied}, updated_at), '+${FOLLOW_UP_DAYS} days') WHERE status = 'applied'`).run();
  }
  createVersions(db);
  createAnswers(db);
  if (jobCols.length && !cols("job_events").length) {
    db.exec(`CREATE TABLE job_events (
      id INTEGER PRIMARY KEY,
      job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      from_status TEXT,
      to_status TEXT NOT NULL,
      at TEXT NOT NULL
    );
    CREATE INDEX job_events_job ON job_events(job_id, at);`);
    // Jobs from before the history existed: where they stand now, as of their last update.
    db.exec("INSERT INTO job_events (job_id, from_status, to_status, at) SELECT id, NULL, status, updated_at FROM jobs");
  }
}

// Survive Next dev hot reloads without leaking connections.
const g = globalThis as unknown as { __slothingDb?: Database.Database };
const db = (g.__slothingDb ??= open());
// Outside open(): a dev server keeps its connection across hot reloads, so new migrations must still run.
migrate(db);

const now = () => new Date().toISOString();

/* ─── Profile ─── */

export function getProfile(): Profile {
  const row = db.prepare("SELECT data FROM profile WHERE id = 1").get() as { data: string } | undefined;
  return Profile.parse(row ? JSON.parse(row.data) : {});
}

export function saveProfile(profile: Profile) {
  const data = JSON.stringify(Profile.parse(profile));
  db.prepare(
    "INSERT INTO profile (id, data, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at",
  ).run(data, now());
}

/* ─── Settings ─── */

export function getSettings(): Settings {
  const row = db.prepare("SELECT data FROM settings WHERE id = 1").get() as { data: string } | undefined;
  return Settings.parse(row ? JSON.parse(row.data) : {});
}

export function saveSettings(settings: Settings) {
  const data = JSON.stringify(Settings.parse(settings));
  db.prepare(
    "INSERT INTO settings (id, data, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at",
  ).run(data, now());
}

/* ─── Jobs ─── */

type JobRow = Omit<Job, "createdAt" | "updatedAt" | "lastSeenAt" | "followUpAt" | "appliedAt"> & {
  created_at: string;
  updated_at: string;
  last_seen_at: string | null;
  follow_up_at: string | null;
  applied_at: string | null;
  visit_started_at?: string | null;
  prev_visit_at?: string | null;
};
const toJob = ({ created_at, updated_at, last_seen_at, follow_up_at, applied_at, visit_started_at: _v, prev_visit_at: _p, ...r }: JobRow): Job => ({
  ...r,
  lastSeenAt: last_seen_at ?? null,
  followUpAt: follow_up_at ?? null,
  appliedAt: applied_at ?? null,
  createdAt: created_at,
  updatedAt: updated_at,
});
const JOB_SELECT = "SELECT jobs.*, (SELECT MAX(submitted_at) FROM applications a WHERE a.job_id = jobs.id) AS applied_at FROM jobs";

export function listJobs(): Job[] {
  return (db.prepare(`${JOB_SELECT} ORDER BY updated_at DESC`).all() as JobRow[]).map(toJob);
}

export function getJob(id: string): Job | null {
  const row = db.prepare(`${JOB_SELECT} WHERE id = ?`).get(id) as JobRow | undefined;
  return row ? toJob(row) : null;
}

export function createJob(input: Pick<Job, "company" | "title" | "url" | "location" | "description">, status: JobStatus = "saved"): string {
  const id = newId("job");
  const t = now();
  db.prepare(
    "INSERT INTO jobs (id, company, title, url, location, description, status, notes, last_seen_at, visit_started_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, ?, ?)",
  ).run(id, input.company, input.title, normalizeUrl(input.url), input.location, input.description, status, status === "seen" ? t : null, status === "seen" ? t : null, t, t);
  recordEvent(id, null, status, t);
  return id;
}

/** Opening a posting again within this long is the same visit (another tab, a reload, the form step). */
const VISIT_MS = 30 * 60_000;

/**
 * You opened the posting. Returns when you were here before this visit (null on the first one).
 * Doesn't count as an update, so the Jobs list order stays yours.
 */
export function touchSeen(id: string): string | null {
  const row = db.prepare("SELECT last_seen_at, visit_started_at, prev_visit_at, created_at FROM jobs WHERE id = ?").get(id) as
    | { last_seen_at: string | null; visit_started_at: string | null; prev_visit_at: string | null; created_at: string }
    | undefined;
  if (!row) return null;
  const t = now();
  const last = row.last_seen_at ?? row.created_at;
  const sameVisit = Date.now() - new Date(last).getTime() < VISIT_MS;
  if (sameVisit) {
    db.prepare("UPDATE jobs SET last_seen_at = ? WHERE id = ?").run(t, id);
    return row.prev_visit_at;
  }
  // A new visit: the one before it is the visit that just ended.
  const prev = row.visit_started_at ?? last;
  db.prepare("UPDATE jobs SET last_seen_at = ?, visit_started_at = ?, prev_visit_at = ? WHERE id = ?").run(t, t, prev, id);
  return prev;
}

const JOB_COLUMNS = ["company", "title", "url", "location", "description", "notes", "status"] as const;
export type JobPatch = Partial<Pick<Job, (typeof JOB_COLUMNS)[number]>>;

/** Pasted posting links often lack a scheme ("linkedin.com/jobs/…"), which would render as a relative link. */
export const normalizeUrl = (u: string) => {
  const t = u.trim();
  return !t || /^[a-z][a-z\d+.-]*:/i.test(t) ? t : `https://${t}`;
};

export function updateJob(id: string, patch: JobPatch) {
  // Column names are interpolated into SQL, so only ever use the whitelist.
  const keys = JOB_COLUMNS.filter((k) => patch[k] !== undefined);
  if (patch.url !== undefined) patch = { ...patch, url: normalizeUrl(patch.url) };
  if (!keys.length) return;
  const sets = keys.map((k) => `${k} = @${k}`).join(", ");
  const params = Object.fromEntries(keys.map((k) => [k, patch[k]]));
  const before = patch.status ? getJob(id)?.status : undefined;
  db.prepare(`UPDATE jobs SET ${sets}, updated_at = @updated_at WHERE id = @id`).run({ ...params, id, updated_at: now() });
  if (patch.status && before && patch.status !== before) {
    recordEvent(id, before, patch.status, now());
    statusChanged(id, patch.status);
  }
}

/* ─── Status history ───
 * Every status a job has had, and when. Insights needs it: the current status alone can't say whether a
 * rejected job got an interview first, or how long a reply took.
 */

function recordEvent(jobId: string, from: JobStatus | null, to: JobStatus, at: string) {
  db.prepare("INSERT INTO job_events (job_id, from_status, to_status, at) VALUES (?, ?, ?, ?)").run(jobId, from, to, at);
}

export interface JobEvent {
  jobId: string;
  from: JobStatus | null;
  to: JobStatus;
  at: string;
}

/** Status changes, oldest first: one job's, or every job's. */
export function listEvents(jobId?: string): JobEvent[] {
  const rows = (jobId
    ? db.prepare("SELECT job_id, from_status, to_status, at FROM job_events WHERE job_id = ? ORDER BY at, id").all(jobId)
    : db.prepare("SELECT job_id, from_status, to_status, at FROM job_events ORDER BY at, id").all()) as { job_id: string; from_status: JobStatus | null; to_status: JobStatus; at: string }[];
  return rows.map((r) => ({ jobId: r.job_id, from: r.from_status, to: r.to_status, at: r.at }));
}

/* ─── Follow-ups ─── */

const inDays = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString();

/**
 * Applied: every applied job has an application (marking it by hand records one, with no answers) and a
 * follow-up date. Any other status: nothing to follow up.
 */
function statusChanged(id: string, status: JobStatus) {
  if (status === "applied") {
    if (!listApplications(id).length) recordApplication(id, "", []);
    db.prepare("UPDATE jobs SET follow_up_at = COALESCE(follow_up_at, ?) WHERE id = ?").run(inDays(FOLLOW_UP_DAYS), id);
  } else {
    db.prepare("UPDATE jobs SET follow_up_at = NULL WHERE id = ?").run(id);
  }
}

/** Remind again in `days`, or never (null). Doesn't count as an update to the job. */
export function setFollowUp(id: string, days: number | null) {
  db.prepare("UPDATE jobs SET follow_up_at = ? WHERE id = ?").run(days === null ? null : inDays(days), id);
}

/** Applied jobs whose follow-up date has come, longest waiting first. */
export function dueFollowUps(): Job[] {
  return (db.prepare(`${JOB_SELECT} WHERE status = 'applied' AND follow_up_at IS NOT NULL AND follow_up_at <= ? ORDER BY follow_up_at`).all(now()) as JobRow[]).map(toJob);
}

export function setJobStatus(id: string, status: JobStatus) {
  updateJob(id, { status });
}

export function deleteJob(id: string) {
  db.prepare("DELETE FROM jobs WHERE id = ?").run(id);
}

/* ─── Documents ─── */

const schemas = { resume: TailoredResume, cover_letter: CoverLetter } as const;
type DocData<K extends DocKind> = K extends "resume" ? TailoredResume : CoverLetter;

export function getDoc<K extends DocKind>(jobId: string, kind: K): StoredDoc<DocData<K>> | null {
  const row = db.prepare("SELECT * FROM documents WHERE job_id = ? AND kind = ?").get(jobId, kind) as
    | { id: string; job_id: string; kind: K; data: string; warnings: string; meta: string; updated_at: string }
    | undefined;
  if (!row) return null;
  return {
    id: row.id,
    jobId: row.job_id,
    kind,
    data: schemas[kind].parse(JSON.parse(row.data)) as DocData<K>,
    warnings: JSON.parse(row.warnings),
    meta: DocMeta.catch({}).parse(JSON.parse(row.meta)),
    updatedAt: row.updated_at,
  };
}

/** How many versions each document keeps; older ones are dropped. */
export const MAX_VERSIONS = 50;

const insertVersion = (jobId: string, kind: DocKind, data: string, warnings: string, meta: string, at: string) =>
  db.prepare("INSERT INTO document_versions (id, job_id, kind, data, warnings, meta, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").run(newId("ver"), jobId, kind, data, warnings, meta, at);

/** `warnings` and `meta` keep their stored values when omitted. Every save is also kept as a version. */
export function saveDoc<K extends DocKind>(jobId: string, kind: K, data: DocData<K>, warnings?: Warning[], meta?: DocMeta) {
  const parsed = schemas[kind].parse(data);
  const existing = getDoc(jobId, kind);
  const row = {
    data: JSON.stringify(parsed),
    warnings: JSON.stringify(warnings ?? existing?.warnings ?? []),
    meta: JSON.stringify(meta ?? existing?.meta ?? {}),
    at: now(),
  };
  db.transaction(() => {
    // A document from before versions existed: keep it as the first version, so it can be restored.
    const count = (db.prepare("SELECT COUNT(*) AS n FROM document_versions WHERE job_id = ? AND kind = ?").get(jobId, kind) as { n: number }).n;
    if (existing && count === 0) insertVersion(jobId, kind, JSON.stringify(existing.data), JSON.stringify(existing.warnings), JSON.stringify(existing.meta), existing.updatedAt);
    upsertDoc(existing?.id ?? newId("doc"), jobId, kind, row);
    insertVersion(jobId, kind, row.data, row.warnings, row.meta, row.at);
    db.prepare(
      `DELETE FROM document_versions WHERE job_id = ? AND kind = ? AND id NOT IN
         (SELECT id FROM document_versions WHERE job_id = ? AND kind = ? ORDER BY created_at DESC, rowid DESC LIMIT ?)`,
    ).run(jobId, kind, jobId, kind, MAX_VERSIONS);
    // Immediate: take the write lock up front. A read-then-write transaction can't wait for another writer.
  }).immediate();
}

function upsertDoc(id: string, jobId: string, kind: DocKind, row: { data: string; warnings: string; meta: string; at: string }) {
  db.prepare(
    `INSERT INTO documents (id, job_id, kind, data, warnings, meta, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(job_id, kind) DO UPDATE SET data = excluded.data, warnings = excluded.warnings, meta = excluded.meta, updated_at = excluded.updated_at`,
  ).run(id, jobId, kind, row.data, row.warnings, row.meta, row.at);
}

export interface DocVersion<T> {
  id: string;
  data: T;
  warnings: Warning[];
  meta: DocMeta;
  createdAt: string;
}

/** Saved versions of one document, newest first. */
export function listVersions<K extends DocKind>(jobId: string, kind: K): DocVersion<DocData<K>>[] {
  const rows = db
    .prepare("SELECT * FROM document_versions WHERE job_id = ? AND kind = ? ORDER BY created_at DESC, rowid DESC")
    .all(jobId, kind) as { id: string; data: string; warnings: string; meta: string; created_at: string }[];
  return rows.flatMap((r) => {
    // A version that no longer parses (an old shape) is skipped rather than breaking the list.
    const data = schemas[kind].safeParse(JSON.parse(r.data));
    return data.success
      ? [{ id: r.id, data: data.data as DocData<K>, warnings: JSON.parse(r.warnings), meta: DocMeta.catch({}).parse(JSON.parse(r.meta)), createdAt: r.created_at }]
      : [];
  });
}

export function getVersion<K extends DocKind>(jobId: string, kind: K, id: string): DocVersion<DocData<K>> | null {
  return listVersions(jobId, kind).find((v) => v.id === id) ?? null;
}

/** Meta for a hand save: whatever made the document, now marked as edited. */
export const editedMeta = (jobId: string, kind: DocKind): DocMeta => ({ ...getDoc(jobId, kind)?.meta, edited: true });

/* ─── Answer bank ─── */

type AnswerRow = { id: string; question: string; answer: string; source_url: string; uses: number; used_at: string | null; created_at: string; updated_at: string };
const toAnswer = (r: AnswerRow): Answer => ({ id: r.id, question: r.question, answer: r.answer, sourceUrl: r.source_url, uses: r.uses, usedAt: r.used_at, createdAt: r.created_at, updatedAt: r.updated_at });

export function listAnswers(): Answer[] {
  return (db.prepare("SELECT * FROM answers ORDER BY updated_at DESC, rowid DESC").all() as AnswerRow[]).map(toAnswer);
}

/** Insert (no id, or an id that's gone) or update one answer. Returns its id. */
export function saveAnswer(input: { id?: string; question: string; answer: string; sourceUrl?: string }): string {
  const t = now();
  if (input.id) {
    const res = db.prepare("UPDATE answers SET question = ?, answer = ?, updated_at = ? WHERE id = ?").run(input.question, input.answer, t, input.id);
    if (res.changes) return input.id;
  }
  const id = newId("ans");
  db.prepare("INSERT INTO answers (id, question, answer, source_url, uses, used_at, created_at, updated_at) VALUES (?, ?, ?, ?, 0, NULL, ?, ?)").run(
    id,
    input.question,
    input.answer,
    input.sourceUrl ?? "",
    t,
    t,
  );
  return id;
}

export function deleteAnswer(id: string) {
  db.prepare("DELETE FROM answers WHERE id = ?").run(id);
}

/** Counted when a form is filled with them, so the bank can show what you actually reuse. */
export function markAnswersUsed(ids: string[]) {
  const t = now();
  const stmt = db.prepare("UPDATE answers SET uses = uses + 1, used_at = ? WHERE id = ?");
  db.transaction(() => ids.forEach((id) => stmt.run(t, id)))();
}

/* ─── Small app state (the extension's key) ─── */

export function getKv(key: string): string | null {
  return (db.prepare("SELECT value FROM kv WHERE key = ?").get(key) as { value: string } | undefined)?.value ?? null;
}

export function setKv(key: string, value: string) {
  db.prepare("INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(key, value);
}

/* ─── Applications ─── */

type AppRow = { id: string; job_id: string; url: string; answers: string; resume_version: string | null; letter_version: string | null; submitted_at: string };

export function listApplications(jobId: string): Application[] {
  return (db.prepare("SELECT * FROM applications WHERE job_id = ? ORDER BY submitted_at DESC").all(jobId) as AppRow[]).map((r) => ({
    id: r.id,
    jobId: r.job_id,
    url: r.url,
    answers: JSON.parse(r.answers),
    resumeVersion: r.resume_version,
    letterVersion: r.letter_version,
    submittedAt: r.submitted_at,
  }));
}

/** When each application was sent, every job's: what Insights counts. */
export function listApplicationDates(): { jobId: string; submittedAt: string }[] {
  return db.prepare("SELECT job_id AS jobId, submitted_at AS submittedAt FROM applications").all() as { jobId: string; submittedAt: string }[];
}

/** The latest saved version of a document, for an application to point at. */
const latestVersion = (jobId: string, kind: DocKind) =>
  (db.prepare("SELECT id FROM document_versions WHERE job_id = ? AND kind = ? ORDER BY created_at DESC, rowid DESC LIMIT 1").get(jobId, kind) as { id: string } | undefined)?.id ?? null;

/** Submitting twice in a few minutes (a resubmit, or Mark applied after it was detected) is one application. */
const SAME_APPLICATION_MS = 15 * 60_000;

export function recordApplication(jobId: string, url: string, answers: Application["answers"]): string {
  const last = listApplications(jobId)[0];
  if (last && Date.now() - new Date(last.submittedAt).getTime() < SAME_APPLICATION_MS) {
    // Keep the fuller record: Mark applied on a page that's already gone reads no fields.
    const keep = answers.length >= last.answers.length;
    db.prepare("UPDATE applications SET url = ?, answers = ?, resume_version = ?, letter_version = ? WHERE id = ?").run(
      keep ? url : last.url,
      JSON.stringify(keep ? answers : last.answers),
      latestVersion(jobId, "resume"),
      latestVersion(jobId, "cover_letter"),
      last.id,
    );
    return last.id;
  }
  const id = newId("app");
  db.prepare("INSERT INTO applications (id, job_id, url, answers, resume_version, letter_version, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    id,
    jobId,
    url,
    JSON.stringify(answers),
    latestVersion(jobId, "resume"),
    latestVersion(jobId, "cover_letter"),
    now(),
  );
  return id;
}
