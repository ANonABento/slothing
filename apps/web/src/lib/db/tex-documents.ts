/**
 * Persistence for LaTeX documents — the artifact of record.
 * See docs/specs/latex-single-source-rebuild.md §4.
 *
 * Self-bootstrapping: tables are created on first access with
 * `CREATE TABLE IF NOT EXISTS` and reconciled additively via `PRAGMA table_info` +
 * `ALTER TABLE ... ADD COLUMN`. Note `drizzle db:generate` is broken in this repo
 * (journal drift), so schema lives here rather than in generated migrations.
 *
 * `tex_document_versions` replaces the browser-localStorage version history
 * (`taida:builder:versions:*`). A .tex source is small; there is no reason a user's
 * history should be trapped in one browser.
 */
import { getClient } from "./client";
import { generateId } from "@/lib/utils";
import { nowIso } from "@/lib/format/time";
import { CONTRACT_VERSION } from "@/lib/latex/contract";

const DEFAULT_USER_ID = "default";

/** A CV is a resume with a different starter template — same pipeline, same macros. */
export type TexDocumentKind = "resume" | "cv" | "cover_letter";

export function isTexDocumentKind(value: unknown): value is TexDocumentKind {
  return value === "resume" || value === "cv" || value === "cover_letter";
}

export interface TexDocument {
  id: string;
  userId: string;
  kind: TexDocumentKind;
  title: string;
  /** The .tex source. This IS the document. */
  source: string;
  contractVersion: number;
  templateId: string | null;
  opportunityId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TexDocumentVersion {
  id: string;
  documentId: string;
  source: string;
  label: string | null;
  createdAt: string;
}

let schemaEnsured = false;

export async function ensureTexDocumentsSchema(): Promise<void> {
  if (schemaEnsured) return;
  const client = getClient();

  await client.execute(`
    CREATE TABLE IF NOT EXISTS tex_documents (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL DEFAULT '${DEFAULT_USER_ID}',
      kind TEXT NOT NULL DEFAULT 'resume',
      title TEXT NOT NULL,
      source TEXT NOT NULL,
      contract_version INTEGER NOT NULL DEFAULT ${CONTRACT_VERSION},
      template_id TEXT,
      opportunity_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
  await client.execute(
    "CREATE INDEX IF NOT EXISTS idx_tex_documents_user_id ON tex_documents(user_id)",
  );
  await client.execute(
    "CREATE INDEX IF NOT EXISTS idx_tex_documents_user_opportunity ON tex_documents(user_id, opportunity_id)",
  );

  await client.execute(`
    CREATE TABLE IF NOT EXISTS tex_document_versions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL DEFAULT '${DEFAULT_USER_ID}',
      document_id TEXT NOT NULL,
      source TEXT NOT NULL,
      label TEXT,
      created_at TEXT NOT NULL
    )
  `);
  await client.execute(
    "CREATE INDEX IF NOT EXISTS idx_tex_document_versions_user_id ON tex_document_versions(user_id)",
  );
  await client.execute(
    "CREATE INDEX IF NOT EXISTS idx_tex_document_versions_document ON tex_document_versions(document_id, created_at)",
  );

  schemaEnsured = true;
}

interface DocRow {
  id: string;
  user_id: string;
  kind: string;
  title: string;
  source: string;
  contract_version: number;
  template_id: string | null;
  opportunity_id: string | null;
  created_at: string;
  updated_at: string;
}

function toDocument(row: DocRow): TexDocument {
  return {
    id: row.id,
    userId: row.user_id,
    kind: isTexDocumentKind(row.kind) ? row.kind : "resume",
    title: row.title,
    source: row.source,
    contractVersion: Number(row.contract_version) || CONTRACT_VERSION,
    templateId: row.template_id,
    opportunityId: row.opportunity_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createTexDocument(input: {
  userId: string;
  kind: TexDocumentKind;
  title: string;
  source: string;
  templateId?: string | null;
  opportunityId?: string | null;
}): Promise<TexDocument> {
  await ensureTexDocumentsSchema();
  const id = generateId();
  const now = nowIso();

  await getClient().execute({
    sql: `INSERT INTO tex_documents
            (id, user_id, kind, title, source, contract_version, template_id, opportunity_id, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      input.userId,
      input.kind,
      input.title,
      input.source,
      CONTRACT_VERSION,
      input.templateId ?? null,
      input.opportunityId ?? null,
      now,
      now,
    ],
  });

  return {
    id,
    userId: input.userId,
    kind: input.kind,
    title: input.title,
    source: input.source,
    contractVersion: CONTRACT_VERSION,
    templateId: input.templateId ?? null,
    opportunityId: input.opportunityId ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

/** Always scoped by user_id — a document id alone is never sufficient authority. */
export async function getTexDocument(
  id: string,
  userId: string,
): Promise<TexDocument | null> {
  await ensureTexDocumentsSchema();
  const result = await getClient().execute({
    sql: "SELECT * FROM tex_documents WHERE id = ? AND user_id = ? LIMIT 1",
    args: [id, userId],
  });
  const row = result.rows[0] as unknown as DocRow | undefined;
  return row ? toDocument(row) : null;
}

export async function listTexDocuments(
  userId: string,
  kind?: TexDocumentKind,
): Promise<TexDocument[]> {
  await ensureTexDocumentsSchema();
  const result = kind
    ? await getClient().execute({
        sql: "SELECT * FROM tex_documents WHERE user_id = ? AND kind = ? ORDER BY updated_at DESC",
        args: [userId, kind],
      })
    : await getClient().execute({
        sql: "SELECT * FROM tex_documents WHERE user_id = ? ORDER BY updated_at DESC",
        args: [userId],
      });
  return (result.rows as unknown as DocRow[]).map(toDocument);
}

/**
 * Update a document's source, snapshotting the PREVIOUS source as a version first so
 * every change is revertible. Returns null when the document is not the user's.
 */
export async function updateTexDocumentSource(
  id: string,
  userId: string,
  source: string,
  label?: string,
): Promise<TexDocument | null> {
  const existing = await getTexDocument(id, userId);
  if (!existing) return null;
  if (existing.source === source) return existing;

  await saveTexDocumentVersion(existing, label ?? null);

  const now = nowIso();
  await getClient().execute({
    sql: "UPDATE tex_documents SET source = ?, updated_at = ? WHERE id = ? AND user_id = ?",
    args: [source, now, id, userId],
  });
  return { ...existing, source, updatedAt: now };
}

export async function renameTexDocument(
  id: string,
  userId: string,
  title: string,
): Promise<TexDocument | null> {
  const existing = await getTexDocument(id, userId);
  if (!existing) return null;
  const now = nowIso();
  await getClient().execute({
    sql: "UPDATE tex_documents SET title = ?, updated_at = ? WHERE id = ? AND user_id = ?",
    args: [title, now, id, userId],
  });
  return { ...existing, title, updatedAt: now };
}

/**
 * Change what a document claims to be.
 *
 * Kind is a label, not a format: every kind compiles through the same contract, so this is
 * a pure metadata update and never rewrites the source.
 */
export async function setTexDocumentKind(
  id: string,
  userId: string,
  kind: TexDocumentKind,
): Promise<TexDocument | null> {
  const existing = await getTexDocument(id, userId);
  if (!existing) return null;
  const now = nowIso();
  await getClient().execute({
    sql: "UPDATE tex_documents SET kind = ?, updated_at = ? WHERE id = ? AND user_id = ?",
    args: [kind, now, id, userId],
  });
  return { ...existing, kind, updatedAt: now };
}

/**
 * Copy a document, source and all.
 *
 * The copy deliberately starts with EMPTY version history. History records how this
 * document got here; inheriting someone else's would let a "restore" on the copy pull in
 * content the user never wrote into it.
 */
export async function duplicateTexDocument(
  id: string,
  userId: string,
  title: string,
): Promise<TexDocument | null> {
  const existing = await getTexDocument(id, userId);
  if (!existing) return null;
  return createTexDocument({
    userId,
    kind: existing.kind,
    title,
    source: existing.source,
    templateId: existing.templateId,
    // Deliberately not carried over: two documents claiming the same opportunity would
    // make "the resume for this job" ambiguous everywhere that looks it up.
    opportunityId: null,
  });
}

export async function deleteTexDocument(
  id: string,
  userId: string,
): Promise<boolean> {
  await ensureTexDocumentsSchema();
  const existing = await getTexDocument(id, userId);
  if (!existing) return false;
  await getClient().execute({
    sql: "DELETE FROM tex_document_versions WHERE document_id = ? AND user_id = ?",
    args: [id, userId],
  });
  await getClient().execute({
    sql: "DELETE FROM tex_documents WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
  return true;
}

export async function saveTexDocumentVersion(
  document: TexDocument,
  label: string | null,
): Promise<TexDocumentVersion> {
  await ensureTexDocumentsSchema();
  const id = generateId();
  const now = nowIso();
  await getClient().execute({
    sql: `INSERT INTO tex_document_versions (id, user_id, document_id, source, label, created_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [id, document.userId, document.id, document.source, label, now],
  });
  return {
    id,
    documentId: document.id,
    source: document.source,
    label,
    createdAt: now,
  };
}

export async function listTexDocumentVersions(
  documentId: string,
  userId: string,
): Promise<TexDocumentVersion[]> {
  await ensureTexDocumentsSchema();
  const result = await getClient().execute({
    sql: `SELECT * FROM tex_document_versions
          WHERE document_id = ? AND user_id = ?
          ORDER BY created_at DESC`,
    args: [documentId, userId],
  });
  return (
    result.rows as unknown as Array<{
      id: string;
      document_id: string;
      source: string;
      label: string | null;
      created_at: string;
    }>
  ).map((row) => ({
    id: row.id,
    documentId: row.document_id,
    source: row.source,
    label: row.label,
    createdAt: row.created_at,
  }));
}
