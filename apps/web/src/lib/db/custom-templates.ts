import db from "./legacy";
import { generateId } from "@/lib/utils";
import type { AnalyzedTemplate } from "@/lib/resume/template-analyzer";

import { nowIso } from "@/lib/format/time";
export interface CustomTemplate {
  id: string;
  userId: string;
  name: string;
  sourceDocumentId: string | null;
  sourceFilename: string | null;
  sourceType: "pdf" | "docx" | null;
  analyzedStyles: AnalyzedTemplate;
  createdAt: string;
  updatedAt: string;
}

interface CustomTemplateRow {
  id: string;
  user_id: string;
  name: string;
  source_document_id: string | null;
  source_filename?: string | null;
  source_type?: string | null;
  analyzed_styles: string;
  created_at: string;
  updated_at?: string | null;
}

function rowToCustomTemplate(row: CustomTemplateRow): CustomTemplate {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    sourceDocumentId: row.source_document_id,
    sourceFilename: row.source_filename ?? null,
    sourceType:
      row.source_type === "pdf" || row.source_type === "docx"
        ? row.source_type
        : null,
    analyzedStyles: JSON.parse(row.analyzed_styles) as AnalyzedTemplate,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? row.created_at,
  };
}

export function ensureCustomTemplatesSourceColumns(): void {
  try {
    const columns = db
      .prepare("PRAGMA table_info(custom_templates)")
      .all() as Array<{ name: string }>;
    const columnNames = new Set(columns.map((column) => column.name));

    if (!columnNames.has("source_filename")) {
      db.prepare("ALTER TABLE custom_templates ADD COLUMN source_filename text").run();
    }
    if (!columnNames.has("source_type")) {
      db.prepare("ALTER TABLE custom_templates ADD COLUMN source_type text").run();
    }
    if (!columnNames.has("updated_at")) {
      db.prepare("ALTER TABLE custom_templates ADD COLUMN updated_at text").run();
      db.prepare(
        "UPDATE custom_templates SET updated_at = created_at WHERE updated_at IS NULL",
      ).run();
    }
  } catch {
    // Tests and first-boot environments may not have the table available yet.
  }
}

interface CustomTemplateSource {
  filename: string;
  type: "pdf" | "docx";
}

export function saveCustomTemplate(
  name: string,
  analyzedStyles: AnalyzedTemplate,
  sourceDocumentId?: string,
  userId: string = "default",
  source?: CustomTemplateSource,
): CustomTemplate {
  ensureCustomTemplatesSourceColumns();
  const id = generateId();
  const now = nowIso();

  const stmt = db.prepare(`
    INSERT INTO custom_templates (id, user_id, name, source_document_id, source_filename, source_type, analyzed_styles, created_at, updated_at)
    SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?
    ${sourceDocumentId ? "WHERE EXISTS (SELECT 1 FROM documents WHERE id = ? AND user_id = ?)" : ""}
  `);

  const args = [
    id,
    userId,
    name,
    sourceDocumentId || null,
    source?.filename ?? null,
    source?.type ?? null,
    JSON.stringify(analyzedStyles),
    now,
    now,
  ];
  if (sourceDocumentId) {
    args.push(sourceDocumentId, userId);
  }

  const result = stmt.run(...args);
  if (result.changes === 0) {
    throw new Error("Source document not found");
  }

  return {
    id,
    userId,
    name,
    sourceDocumentId: sourceDocumentId || null,
    sourceFilename: source?.filename ?? null,
    sourceType: source?.type ?? null,
    analyzedStyles,
    createdAt: now,
    updatedAt: now,
  };
}

export function getCustomTemplates(
  userId: string = "default",
): CustomTemplate[] {
  ensureCustomTemplatesSourceColumns();
  const stmt = db.prepare(`
    SELECT id, user_id, name, source_document_id, source_filename, source_type, analyzed_styles, created_at, updated_at
    FROM custom_templates
    WHERE user_id = ?
    ORDER BY created_at DESC
  `);

  const rows = stmt.all(userId) as CustomTemplateRow[];
  return rows.map(rowToCustomTemplate);
}

export function getCustomTemplate(
  id: string,
  userId: string = "default",
): CustomTemplate | null {
  ensureCustomTemplatesSourceColumns();
  const stmt = db.prepare(`
    SELECT id, user_id, name, source_document_id, source_filename, source_type, analyzed_styles, created_at, updated_at
    FROM custom_templates
    WHERE id = ? AND user_id = ?
  `);

  const row = stmt.get(id, userId) as CustomTemplateRow | undefined;
  if (!row) return null;

  return rowToCustomTemplate(row);
}

export function deleteCustomTemplate(
  id: string,
  userId: string = "default",
): boolean {
  ensureCustomTemplatesSourceColumns();
  const stmt = db.prepare(
    "DELETE FROM custom_templates WHERE id = ? AND user_id = ?",
  );
  const result = stmt.run(id, userId);
  return result.changes > 0;
}

export function updateCustomTemplateName(
  id: string,
  name: string,
  userId: string = "default",
): boolean {
  ensureCustomTemplatesSourceColumns();
  const stmt = db.prepare(
    "UPDATE custom_templates SET name = ?, updated_at = ? WHERE id = ? AND user_id = ?",
  );
  const result = stmt.run(name, nowIso(), id, userId);
  return result.changes > 0;
}
