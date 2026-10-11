import { getClient } from "./client";
import { generateId } from "@/lib/utils";
import type { EmailTemplateType } from "@/types";

import { nowIso } from "@/lib/format/time";
export interface EmailDraft {
  id: string;
  userId: string;
  type: EmailTemplateType;
  jobId?: string;
  subject: string;
  body: string;
  context?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailDraftInput {
  type: EmailTemplateType;
  jobId?: string;
  subject: string;
  body: string;
  context?: Record<string, string>;
}

export interface UpdateEmailDraftInput {
  subject?: string;
  body?: string;
  context?: Record<string, string>;
}

export interface EmailDraftCursor {
  lastId: string;
  lastCreatedAt: string;
}

export interface ListEmailDraftsPaginatedParams {
  userId: string;
  type?: EmailTemplateType;
  cursor?: EmailDraftCursor | null;
  limit: number;
}

type EmailDraftRow = {
  id: string;
  user_id: string;
  type: string;
  job_id: string | null;
  subject: string;
  body: string;
  context_json: string | null;
  created_at: string;
  updated_at: string;
};

function rowToEmailDraft(row: EmailDraftRow): EmailDraft {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type as EmailTemplateType,
    jobId: row.job_id || undefined,
    subject: row.subject,
    body: row.body,
    context: row.context_json ? JSON.parse(row.context_json) : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Get all email drafts for a user
export async function getEmailDrafts(userId: string): Promise<EmailDraft[]> {
  const result = await getClient().execute({
    sql: `
    SELECT id, user_id, type, job_id, subject, body, context_json, created_at, updated_at
    FROM email_drafts
    WHERE user_id = ?
    ORDER BY updated_at DESC
  `,
    args: [userId],
  });
  const rows = result.rows as unknown as EmailDraftRow[];

  return rows.map(rowToEmailDraft);
}

export async function listEmailDraftsPaginated({
  userId,
  type,
  cursor,
  limit,
}: ListEmailDraftsPaginatedParams): Promise<EmailDraft[]> {
  const whereClauses = ["user_id = ?"];
  const params: Array<string | number> = [userId];

  if (type) {
    whereClauses.push("type = ?");
    params.push(type);
  }

  if (cursor) {
    whereClauses.push("(updated_at < ? OR (updated_at = ? AND id < ?))");
    params.push(cursor.lastCreatedAt, cursor.lastCreatedAt, cursor.lastId);
  }

  params.push(limit + 1);

  const result = await getClient().execute({
    sql: `SELECT id, user_id, type, job_id, subject, body, context_json, created_at, updated_at
       FROM email_drafts
       WHERE ${whereClauses.join(" AND ")}
       ORDER BY updated_at DESC, id DESC
       LIMIT ?`,
    args: params,
  });
  const rows = result.rows as unknown as EmailDraftRow[];

  return rows.map(rowToEmailDraft);
}

// Get a single email draft by ID
export async function getEmailDraft(
  id: string,
  userId: string,
): Promise<EmailDraft | null> {
  const result = await getClient().execute({
    sql: `
    SELECT id, user_id, type, job_id, subject, body, context_json, created_at, updated_at
    FROM email_drafts
    WHERE id = ? AND user_id = ?
  `,
    args: [id, userId],
  });
  const row = result.rows[0] as unknown as EmailDraftRow | undefined;

  if (!row) return null;

  return rowToEmailDraft(row);
}

// Create a new email draft
export async function createEmailDraft(
  input: CreateEmailDraftInput,
  userId: string,
): Promise<EmailDraft> {
  const id = generateId();
  const now = nowIso();

  const result = await getClient().execute({
    sql: `
    INSERT INTO email_drafts (id, user_id, type, job_id, subject, body, context_json, created_at, updated_at)
    SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?
    ${input.jobId ? "WHERE EXISTS (SELECT 1 FROM jobs WHERE id = ? AND user_id = ?)" : ""}
  `,
    args: [
      id,
      userId,
      input.type,
      input.jobId || null,
      input.subject,
      input.body,
      input.context ? JSON.stringify(input.context) : null,
      now,
      now,
      ...(input.jobId ? [input.jobId, userId] : []),
    ],
  });

  if (result.rowsAffected === 0) {
    throw new Error("Job not found");
  }

  return {
    id,
    userId,
    type: input.type,
    jobId: input.jobId,
    subject: input.subject,
    body: input.body,
    context: input.context,
    createdAt: now,
    updatedAt: now,
  };
}

// Update an email draft
export async function updateEmailDraft(
  id: string,
  input: UpdateEmailDraftInput,
  userId: string,
): Promise<EmailDraft | null> {
  const existing = await getEmailDraft(id, userId);
  if (!existing) return null;

  const now = nowIso();

  const updates: string[] = [];
  const params: (string | null)[] = [];

  if (input.subject !== undefined) {
    updates.push("subject = ?");
    params.push(input.subject);
  }
  if (input.body !== undefined) {
    updates.push("body = ?");
    params.push(input.body);
  }
  if (input.context !== undefined) {
    updates.push("context_json = ?");
    params.push(JSON.stringify(input.context));
  }

  updates.push("updated_at = ?");
  params.push(now);

  params.push(id);
  params.push(userId);

  await getClient().execute({
    sql: `
    UPDATE email_drafts
    SET ${updates.join(", ")}
    WHERE id = ? AND user_id = ?
  `,
    args: params,
  });

  return getEmailDraft(id, userId);
}

// Delete an email draft
export async function deleteEmailDraft(
  id: string,
  userId: string,
): Promise<boolean> {
  const result = await getClient().execute({
    sql: `
    DELETE FROM email_drafts
    WHERE id = ? AND user_id = ?
  `,
    args: [id, userId],
  });

  return result.rowsAffected > 0;
}

// Get drafts by type
export async function getEmailDraftsByType(
  type: EmailTemplateType,
  userId: string,
): Promise<EmailDraft[]> {
  const result = await getClient().execute({
    sql: `
    SELECT id, user_id, type, job_id, subject, body, context_json, created_at, updated_at
    FROM email_drafts
    WHERE user_id = ? AND type = ?
    ORDER BY updated_at DESC
  `,
    args: [userId, type],
  });
  const rows = result.rows as unknown as EmailDraftRow[];

  return rows.map(rowToEmailDraft);
}
