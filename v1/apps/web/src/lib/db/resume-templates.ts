import db from "./legacy";
import { nowIso } from "@/lib/format/time";
import { generateId } from "@/lib/utils";
import { reusableIrToResumeTemplate } from "@/lib/resume/template-collapse";
import type { TemplateSourceType } from "@/lib/templates/import";
import {
  resumeDocumentModelSchema,
  resumeTemplateSchema,
  type ResumeDocumentModel,
  type ResumeTemplate,
} from "@slothing/shared/resume-template";

/**
 * The SINGLE collapsed template store (spec §3 Decision 3 / Phase 4). One table,
 * `document_templates`, holding the new (grammar + tokens) ResumeTemplate plus an
 * optional RDM (the accepted content draft, enabling instant self-re-render). Replaces
 * the V2/V3/V4 three-table sprawl + the migration-draft table. Additive migration
 * convention (CREATE TABLE IF NOT EXISTS + per-table user_id index), scoped by user_id.
 */

/** Preferred PDF export engine for this template (set at import time). */
export type ExportEngine = "html" | "typst";

export interface SavedResumeTemplate {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  sourceFilename: string | null;
  sourceType: TemplateSourceType | null;
  template: ResumeTemplate;
  /** The content the template was accepted with, if any (null for style-only). */
  rdm: ResumeDocumentModel | null;
  /** Preferred PDF engine; null = use the app default (HTML→Chromium). */
  exportEngine: ExportEngine | null;
  createdAt: string;
  updatedAt: string;
}

interface Row {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  source_filename: string | null;
  source_type: TemplateSourceType | null;
  template_json: string;
  rdm_json: string | null;
  export_engine: string | null;
  created_at: string;
  updated_at: string;
}

export function ensureResumeTemplatesTable(): void {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS document_templates (
      id text PRIMARY KEY,
      user_id text NOT NULL DEFAULT 'default',
      name text NOT NULL,
      description text,
      source_filename text,
      source_type text,
      template_json text NOT NULL,
      rdm_json text,
      export_engine text,
      created_at text NOT NULL,
      updated_at text NOT NULL
    )`,
  ).run();
  db.prepare(
    `CREATE INDEX IF NOT EXISTS idx_document_templates_user_id ON document_templates (user_id)`,
  ).run();
  // Additive migration for existing dev DBs (Phase C follow-up): per-template engine.
  const cols = db
    .prepare(`PRAGMA table_info(document_templates)`)
    .all() as Array<{ name: string }>;
  if (!cols.some((c) => c.name === "export_engine")) {
    db.prepare(
      `ALTER TABLE document_templates ADD COLUMN export_engine text`,
    ).run();
  }
}

function rowToSaved(row: Row): SavedResumeTemplate | null {
  const parsedTemplate = resumeTemplateSchema.safeParse(
    JSON.parse(row.template_json),
  );
  if (!parsedTemplate.success) return null;
  let rdm: ResumeDocumentModel | null = null;
  if (row.rdm_json) {
    const parsedRdm = resumeDocumentModelSchema.safeParse(
      JSON.parse(row.rdm_json),
    );
    rdm = parsedRdm.success ? (parsedRdm.data as ResumeDocumentModel) : null;
  }
  const exportEngine: ExportEngine | null =
    row.export_engine === "html" || row.export_engine === "typst"
      ? row.export_engine
      : null;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description,
    sourceFilename: row.source_filename,
    sourceType: row.source_type,
    template: parsedTemplate.data as ResumeTemplate,
    rdm,
    exportEngine,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface SaveResumeTemplateInput {
  template: ResumeTemplate;
  rdm?: ResumeDocumentModel | null;
  name?: string;
  description?: string | null;
  sourceFilename?: string | null;
  sourceType?: TemplateSourceType | null;
  exportEngine?: ExportEngine | null;
}

export function saveResumeTemplate(
  userId: string,
  input: SaveResumeTemplateInput,
): SavedResumeTemplate {
  ensureResumeTemplatesTable();
  const now = nowIso();
  const id = input.template.id || generateId();
  const template = { ...input.template, id };
  const name = input.name ?? template.name;
  const existing = getResumeTemplate(id, userId);
  const exportEngine = input.exportEngine ?? existing?.exportEngine ?? null;
  if (existing) {
    db.prepare(
      `UPDATE document_templates
       SET name = ?, description = ?, source_filename = ?, source_type = ?, template_json = ?, rdm_json = ?, export_engine = ?, updated_at = ?
       WHERE id = ? AND user_id = ?`,
    ).run(
      name,
      input.description ?? existing.description,
      input.sourceFilename ?? existing.sourceFilename,
      input.sourceType ?? existing.sourceType,
      JSON.stringify(template),
      input.rdm
        ? JSON.stringify(input.rdm)
        : existing.rdm
          ? JSON.stringify(existing.rdm)
          : null,
      exportEngine,
      now,
      id,
      userId,
    );
  } else {
    db.prepare(
      `INSERT INTO document_templates (id, user_id, name, description, source_filename, source_type, template_json, rdm_json, export_engine, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      userId,
      name,
      input.description ?? null,
      input.sourceFilename ?? null,
      input.sourceType ?? null,
      JSON.stringify(template),
      input.rdm ? JSON.stringify(input.rdm) : null,
      exportEngine,
      now,
      now,
    );
  }
  return {
    id,
    userId,
    name,
    description: input.description ?? existing?.description ?? null,
    sourceFilename: input.sourceFilename ?? existing?.sourceFilename ?? null,
    sourceType: input.sourceType ?? existing?.sourceType ?? null,
    template,
    rdm: input.rdm ?? existing?.rdm ?? null,
    exportEngine,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

export function getResumeTemplate(
  id: string,
  userId: string,
): SavedResumeTemplate | null {
  ensureResumeTemplatesTable();
  const row = db
    .prepare(`SELECT * FROM document_templates WHERE id = ? AND user_id = ?`)
    .get(id, userId) as Row | undefined;
  return row ? rowToSaved(row) : null;
}

export function listResumeTemplates(userId: string): SavedResumeTemplate[] {
  ensureResumeTemplatesTable();
  const rows = db
    .prepare(
      `SELECT * FROM document_templates WHERE user_id = ? ORDER BY updated_at DESC`,
    )
    .all(userId) as Row[];
  return rows
    .map(rowToSaved)
    .filter((t): t is SavedResumeTemplate => t !== null);
}

export function deleteResumeTemplate(id: string, userId: string): boolean {
  ensureResumeTemplatesTable();
  const res = db
    .prepare(`DELETE FROM document_templates WHERE id = ? AND user_id = ?`)
    .run(id, userId);
  return res.changes > 0;
}

export function updateResumeTemplateMetadata(
  id: string,
  userId: string,
  updates: { name?: string; description?: string | null },
): SavedResumeTemplate | null {
  const existing = getResumeTemplate(id, userId);
  if (!existing) return null;
  db.prepare(
    `UPDATE document_templates SET name = ?, description = ?, updated_at = ? WHERE id = ? AND user_id = ?`,
  ).run(
    updates.name ?? existing.name,
    updates.description ?? existing.description,
    nowIso(),
    id,
    userId,
  );
  return getResumeTemplate(id, userId);
}

/**
 * One-time migration of committed V4 templates into the collapsed model. Idempotent:
 * a V4 row already present in `document_templates` (same id) is skipped. Tolerant of a
 * missing legacy table (fresh installs). Spec §3 Decision 3 / Phase 4.
 */
export function migrateV4ToCollapsed(): { migrated: number; skipped: number } {
  ensureResumeTemplatesTable();
  const legacyExists = db
    .prepare(
      `SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'document_templates_v4'`,
    )
    .get();
  if (!legacyExists) return { migrated: 0, skipped: 0 };

  const rows = db
    .prepare(
      `SELECT id, user_id, name, description, source_filename, source_type, template_json, created_at, updated_at FROM document_templates_v4`,
    )
    .all() as Array<{
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    source_filename: string | null;
    source_type: TemplateSourceType | null;
    template_json: string;
    created_at: string;
    updated_at: string;
  }>;

  let migrated = 0;
  let skipped = 0;
  for (const row of rows) {
    const already = db
      .prepare(`SELECT id FROM document_templates WHERE id = ?`)
      .get(row.id);
    if (already) {
      skipped += 1;
      continue;
    }
    let ir: unknown;
    try {
      ir = JSON.parse(row.template_json);
    } catch {
      skipped += 1;
      continue;
    }
    const template = reusableIrToResumeTemplate(ir, row.id);
    db.prepare(
      `INSERT INTO document_templates (id, user_id, name, description, source_filename, source_type, template_json, rdm_json, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      row.id,
      row.user_id,
      row.name,
      row.description,
      row.source_filename,
      row.source_type,
      JSON.stringify(template),
      null,
      row.created_at,
      row.updated_at,
    );
    migrated += 1;
  }
  return { migrated, skipped };
}
