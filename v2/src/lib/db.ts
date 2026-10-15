import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import { join } from "path";

import { newId } from "./ids";
import {
  CoverLetter,
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

const DATA_DIR = process.env.SLOTHING_DATA_DIR || join(process.cwd(), "data");
// Belt and braces: a test run that bypasses vitest.config (e.g. a stray file run from elsewhere) must not touch real data.
if (process.env.VITEST && !process.env.SLOTHING_DATA_DIR) {
  throw new Error("Refusing to open the real database from a test. Set SLOTHING_DATA_DIR.");
}

function open() {
  mkdirSync(DATA_DIR, { recursive: true });
  const db = new Database(join(DATA_DIR, "slothing.db"));
  db.pragma("journal_mode = WAL");
  // Wait for another writer (a second process, or parallel test files) instead of failing at once.
  db.pragma("busy_timeout = 5000");
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
  db.pragma("foreign_keys = ON");
  return db;
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

/** Columns added after a table first shipped. CREATE TABLE above has them for new databases; this adds them to old ones. */
export function migrate(db: Database.Database) {
  const has = (table: string, column: string) => (db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]).some((c) => c.name === column);
  if (!has("documents", "meta")) db.exec("ALTER TABLE documents ADD COLUMN meta TEXT NOT NULL DEFAULT '{}'");
  createVersions(db);
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

type JobRow = Omit<Job, "createdAt" | "updatedAt"> & { created_at: string; updated_at: string };
const toJob = ({ created_at, updated_at, ...r }: JobRow): Job => ({ ...r, createdAt: created_at, updatedAt: updated_at });

export function listJobs(): Job[] {
  return (db.prepare("SELECT * FROM jobs ORDER BY updated_at DESC").all() as JobRow[]).map(toJob);
}

export function getJob(id: string): Job | null {
  const row = db.prepare("SELECT * FROM jobs WHERE id = ?").get(id) as JobRow | undefined;
  return row ? toJob(row) : null;
}

export function createJob(input: Pick<Job, "company" | "title" | "url" | "location" | "description">): string {
  const id = newId("job");
  const t = now();
  db.prepare(
    "INSERT INTO jobs (id, company, title, url, location, description, status, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'saved', '', ?, ?)",
  ).run(id, input.company, input.title, normalizeUrl(input.url), input.location, input.description, t, t);
  return id;
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
  db.prepare(`UPDATE jobs SET ${sets}, updated_at = @updated_at WHERE id = @id`).run({ ...params, id, updated_at: now() });
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
