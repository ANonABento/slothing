import { getClient } from "./client";
import { generateId } from "@/lib/utils";
import type { AnalyzedTemplate } from "@/lib/resume/template-analyzer";

import { nowIso } from "@/lib/format/time";
import type { TemplateSourceType } from "@/lib/templates/import";

export interface CustomTemplate {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  sourceDocumentId: string | null;
  sourceFilename: string | null;
  sourceType: TemplateSourceType | null;
  analyzedStyles: AnalyzedTemplate;
  createdAt: string;
  updatedAt: string;
}

interface CustomTemplateRow {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  source_document_id: string | null;
  source_filename?: string | null;
  source_type?: string | null;
  analyzed_styles: string;
  created_at: string;
  updated_at?: string | null;
}

interface CustomTemplateSource {
  filename: string;
  type: TemplateSourceType;
}

let customTemplatesSourceColumnsEnsured = false;

function rowToCustomTemplate(row: CustomTemplateRow): CustomTemplate {
  const sourceType = isTemplateSourceType(row.source_type)
    ? row.source_type
    : null;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description ?? null,
    sourceDocumentId: row.source_document_id,
    sourceFilename: row.source_filename ?? null,
    sourceType,
    analyzedStyles: JSON.parse(row.analyzed_styles) as AnalyzedTemplate,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? row.created_at,
  };
}

export async function ensureCustomTemplatesSourceColumns(): Promise<void> {
  if (customTemplatesSourceColumnsEnsured) return;

  try {
    const columnsResult = await getClient().execute(
      "PRAGMA table_info(custom_templates)",
    );
    const columnNames = new Set(
      (columnsResult.rows as unknown as Array<{ name: string }>).map(
        (column) => column.name,
      ),
    );

    if (!columnNames.has("source_filename")) {
      await getClient().execute(
        "ALTER TABLE custom_templates ADD COLUMN source_filename text",
      );
    }
    if (!columnNames.has("source_type")) {
      await getClient().execute(
        "ALTER TABLE custom_templates ADD COLUMN source_type text",
      );
    }
    if (!columnNames.has("description")) {
      await getClient().execute(
        "ALTER TABLE custom_templates ADD COLUMN description text",
      );
    }
    if (!columnNames.has("updated_at")) {
      await getClient().execute(
        "ALTER TABLE custom_templates ADD COLUMN updated_at text",
      );
      await getClient().execute(
        "UPDATE custom_templates SET updated_at = created_at WHERE updated_at IS NULL",
      );
    }
    customTemplatesSourceColumnsEnsured = true;
  } catch {
    // Tests and first-boot environments may not have the table available yet.
  }
}

function isTemplateSourceType(value: unknown): value is TemplateSourceType {
  return value === "pdf" || value === "docx" || value === "tex";
}

export async function saveCustomTemplate(
  name: string,
  analyzedStyles: AnalyzedTemplate,
  sourceDocumentId: string | undefined,
  userId: string,
  source?: CustomTemplateSource,
  description?: string | null,
): Promise<CustomTemplate> {
  await ensureCustomTemplatesSourceColumns();
  const id = generateId();
  const now = nowIso();

  const args = [
    id,
    userId,
    name,
    description?.trim() || null,
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

  const result = await getClient().execute({
    sql: `
      INSERT INTO custom_templates (id, user_id, name, description, source_document_id, source_filename, source_type, analyzed_styles, created_at, updated_at)
      SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      ${sourceDocumentId ? "WHERE EXISTS (SELECT 1 FROM documents WHERE id = ? AND user_id = ?)" : ""}
    `,
    args,
  });
  if (result.rowsAffected === 0) {
    throw new Error("Source document not found");
  }

  return {
    id,
    userId,
    name,
    description: description?.trim() || null,
    sourceDocumentId: sourceDocumentId || null,
    sourceFilename: source?.filename ?? null,
    sourceType: source?.type ?? null,
    analyzedStyles,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getCustomTemplates(
  userId: string,
): Promise<CustomTemplate[]> {
  await ensureCustomTemplatesSourceColumns();
  const result = await getClient().execute({
    sql: `
      SELECT id, user_id, name, description, source_document_id, source_filename, source_type, analyzed_styles, created_at, updated_at
      FROM custom_templates
      WHERE user_id = ?
      ORDER BY created_at DESC
    `,
    args: [userId],
  });

  return (result.rows as unknown as CustomTemplateRow[]).map(
    rowToCustomTemplate,
  );
}

export async function getCustomTemplate(
  id: string,
  userId: string,
): Promise<CustomTemplate | null> {
  await ensureCustomTemplatesSourceColumns();
  const result = await getClient().execute({
    sql: `
      SELECT id, user_id, name, description, source_document_id, source_filename, source_type, analyzed_styles, created_at, updated_at
      FROM custom_templates
      WHERE id = ? AND user_id = ?
    `,
    args: [id, userId],
  });

  const row = result.rows[0] as unknown as CustomTemplateRow | undefined;
  return row ? rowToCustomTemplate(row) : null;
}

export async function deleteCustomTemplate(
  id: string,
  userId: string,
): Promise<boolean> {
  await ensureCustomTemplatesSourceColumns();
  const result = await getClient().execute({
    sql: "DELETE FROM custom_templates WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
  return result.rowsAffected > 0;
}

export async function updateCustomTemplateName(
  id: string,
  name: string,
  userId: string,
): Promise<boolean> {
  await ensureCustomTemplatesSourceColumns();
  const result = await getClient().execute({
    sql: "UPDATE custom_templates SET name = ?, updated_at = ? WHERE id = ? AND user_id = ?",
    args: [name, nowIso(), id, userId],
  });
  return result.rowsAffected > 0;
}

export async function updateCustomTemplateMetadata(
  id: string,
  metadata: { name?: string; description?: string | null },
  userId: string,
): Promise<boolean> {
  await ensureCustomTemplatesSourceColumns();
  const updates: string[] = [];
  const values: Array<string | null> = [];

  if (metadata.name !== undefined) {
    updates.push("name = ?");
    values.push(metadata.name);
  }

  if (metadata.description !== undefined) {
    updates.push("description = ?");
    values.push(metadata.description?.trim() || null);
  }

  if (updates.length === 0) return false;

  updates.push("updated_at = ?");
  values.push(nowIso());
  values.push(id, userId);

  const result = await getClient().execute({
    sql: `UPDATE custom_templates SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
    args: values,
  });
  return result.rowsAffected > 0;
}
