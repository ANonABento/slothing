import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import { join } from "path";

import { newId } from "./ids";
import {
  CoverLetter,
  Profile,
  TailoredResume,
  type DocKind,
  type Job,
  type JobStatus,
  type StoredDoc,
  type Warning,
} from "./types";

const DATA_DIR = join(process.cwd(), "data");

function open() {
  mkdirSync(DATA_DIR, { recursive: true });
  const db = new Database(join(DATA_DIR, "slothing.db"));
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
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
      updated_at TEXT NOT NULL,
      UNIQUE (job_id, kind)
    );
  `);
  db.pragma("foreign_keys = ON");
  return db;
}

// Survive Next dev hot reloads without leaking connections.
const g = globalThis as unknown as { __slothingDb?: Database.Database };
const db = (g.__slothingDb ??= open());

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
  ).run(id, input.company, input.title, input.url, input.location, input.description, t, t);
  return id;
}

export function updateJob(id: string, patch: Partial<Pick<Job, "company" | "title" | "url" | "location" | "description" | "notes" | "status">>) {
  const keys = Object.keys(patch) as (keyof typeof patch)[];
  if (!keys.length) return;
  const sets = keys.map((k) => `${k} = @${k}`).join(", ");
  db.prepare(`UPDATE jobs SET ${sets}, updated_at = @updated_at WHERE id = @id`).run({ ...patch, id, updated_at: now() });
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
    | { id: string; job_id: string; kind: K; data: string; warnings: string; updated_at: string }
    | undefined;
  if (!row) return null;
  return {
    id: row.id,
    jobId: row.job_id,
    kind,
    data: schemas[kind].parse(JSON.parse(row.data)) as DocData<K>,
    warnings: JSON.parse(row.warnings),
    updatedAt: row.updated_at,
  };
}

export function saveDoc<K extends DocKind>(jobId: string, kind: K, data: DocData<K>, warnings?: Warning[]) {
  const parsed = schemas[kind].parse(data);
  const existing = getDoc(jobId, kind);
  db.prepare(
    `INSERT INTO documents (id, job_id, kind, data, warnings, updated_at) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(job_id, kind) DO UPDATE SET data = excluded.data, warnings = excluded.warnings, updated_at = excluded.updated_at`,
  ).run(
    existing?.id ?? newId("doc"),
    jobId,
    kind,
    JSON.stringify(parsed),
    JSON.stringify(warnings ?? existing?.warnings ?? []),
    now(),
  );
}
