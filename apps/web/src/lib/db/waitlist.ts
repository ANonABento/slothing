import { getClient } from "./client";
import { nowIso } from "@/lib/format/time";
import { generateId } from "@/lib/utils";

export interface WaitlistEntry {
  id: string;
  email: string;
  source: string;
  interest: string | null;
  createdAt: string;
}

export interface CreateWaitlistEntryInput {
  email: string;
  source?: string;
  interest?: string | null;
}

interface WaitlistEntryRow {
  id: string;
  email: string;
  source: string;
  interest: string | null;
  created_at: string;
}

let schemaReady = false;

export async function ensureWaitlistSchema(): Promise<void> {
  if (schemaReady) return;
  await getClient().batch([
    `CREATE TABLE IF NOT EXISTS waitlist_entries (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL UNIQUE,
      source TEXT NOT NULL DEFAULT 'pricing',
      interest TEXT,
      created_at TEXT NOT NULL
    )`,
    "CREATE INDEX IF NOT EXISTS idx_waitlist_entries_created ON waitlist_entries(created_at)",
  ]);
  schemaReady = true;
}

function rowToWaitlistEntry(row: WaitlistEntryRow): WaitlistEntry {
  return {
    id: row.id,
    email: row.email,
    source: row.source,
    interest: row.interest,
    createdAt: row.created_at,
  };
}

export async function createWaitlistEntry(
  input: CreateWaitlistEntryInput,
): Promise<WaitlistEntry> {
  await ensureWaitlistSchema();

  const email = input.email.trim().toLowerCase();
  const source = input.source?.trim() || "pricing";
  const interest = input.interest?.trim() || null;
  const createdAt = nowIso();
  const id = generateId();

  await getClient().execute({
    sql: `
      INSERT INTO waitlist_entries (id, email, source, interest, created_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(email) DO UPDATE SET
        source = excluded.source,
        interest = COALESCE(excluded.interest, waitlist_entries.interest)
    `,
    args: [id, email, source, interest, createdAt],
  });

  const result = await getClient().execute({
    sql: "SELECT id, email, source, interest, created_at FROM waitlist_entries WHERE email = ?",
    args: [email],
  });
  const row = result.rows[0] as unknown as WaitlistEntryRow | undefined;

  if (!row) throw new Error("Failed to create waitlist entry");
  return rowToWaitlistEntry(row);
}

export async function listWaitlistEntries(
  limit = 100,
): Promise<WaitlistEntry[]> {
  await ensureWaitlistSchema();
  const boundedLimit = Math.min(Math.max(Math.trunc(limit), 1), 500);
  const result = await getClient().execute({
    sql: `
      SELECT id, email, source, interest, created_at
      FROM waitlist_entries
      ORDER BY created_at DESC
      LIMIT ?
    `,
    args: [boundedLimit],
  });

  return (result.rows as unknown as WaitlistEntryRow[]).map(rowToWaitlistEntry);
}
