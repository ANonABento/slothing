import { getClient } from "./client";
import { SUGGESTED_STATUS_UPDATES_BOOTSTRAP_SQL } from "./bootstrap-sql";
import { generateId } from "@/lib/utils";
import { nowIso } from "@/lib/format/time";

export type SuggestedStatusUpdateState = "pending" | "accepted" | "dismissed";

export interface SuggestedStatusUpdate {
  id: string;
  userId: string;
  notificationId: string;
  opportunityId: string;
  suggestedStatus: string;
  sourceProvider?: string | null;
  sourceEventId?: string | null;
  confidence?: number | null;
  reason?: string | null;
  evidence?: string[];
  state: SuggestedStatusUpdateState;
  createdAt: string;
  resolvedAt?: string | null;
}

export interface CreateSuggestedStatusUpdateInput {
  userId: string;
  notificationId: string;
  opportunityId: string;
  suggestedStatus: string;
  sourceProvider?: string | null;
  sourceEventId?: string | null;
  confidence?: number | null;
  reason?: string | null;
  evidence?: string[];
}

interface SuggestedStatusUpdateRow {
  id: string;
  user_id: string;
  notification_id: string;
  opportunity_id: string;
  suggested_status: string;
  source_provider: string | null;
  source_event_id: string | null;
  confidence: number | null;
  reason: string | null;
  evidence_json: string | null;
  state: SuggestedStatusUpdateState;
  created_at: string;
  resolved_at: string | null;
}

let suggestedStatusUpdatesSchemaEnsured = false;

export async function ensureSuggestedStatusUpdatesSchema(): Promise<void> {
  if (suggestedStatusUpdatesSchemaEnsured) return;

  // DDL co-located with `schema.ts: suggestedStatusUpdates`. See
  // `bootstrap-sql.ts`.
  await getClient().batch(
    SUGGESTED_STATUS_UPDATES_BOOTSTRAP_SQL.split(";")
      .map((statement) => statement.trim())
      .filter(Boolean),
  );
  const columnsResult = await getClient().execute(
    "PRAGMA table_info(suggested_status_updates)",
  );
  const columns = (
    columnsResult.rows as unknown as Array<{ name: string }>
  ).map((column) => column.name);
  if (!columns.includes("confidence")) {
    await getClient().execute(
      "ALTER TABLE suggested_status_updates ADD COLUMN confidence REAL",
    );
  }
  if (!columns.includes("reason")) {
    await getClient().execute(
      "ALTER TABLE suggested_status_updates ADD COLUMN reason TEXT",
    );
  }
  if (!columns.includes("evidence_json")) {
    await getClient().execute(
      "ALTER TABLE suggested_status_updates ADD COLUMN evidence_json TEXT",
    );
  }
  suggestedStatusUpdatesSchemaEnsured = true;
}

function parseEvidence(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function rowToSuggestedStatusUpdate(
  row: SuggestedStatusUpdateRow,
): SuggestedStatusUpdate {
  return {
    id: row.id,
    userId: row.user_id,
    notificationId: row.notification_id,
    opportunityId: row.opportunity_id,
    suggestedStatus: row.suggested_status,
    sourceProvider: row.source_provider,
    sourceEventId: row.source_event_id,
    confidence: row.confidence,
    reason: row.reason,
    evidence: parseEvidence(row.evidence_json),
    state: row.state,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
  };
}

export function createSuggestedStatusUpdate(
  input: CreateSuggestedStatusUpdateInput,
): Promise<SuggestedStatusUpdate> {
  return createSuggestedStatusUpdateAsync(input);
}

async function createSuggestedStatusUpdateAsync(
  input: CreateSuggestedStatusUpdateInput,
): Promise<SuggestedStatusUpdate> {
  await ensureSuggestedStatusUpdatesSchema();
  const id = generateId();
  const createdAt = nowIso();

  await getClient().execute({
    sql: `INSERT INTO suggested_status_updates (
      id, user_id, notification_id, opportunity_id, suggested_status,
      source_provider, source_event_id, confidence, reason, evidence_json,
      state, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    args: [
      id,
      input.userId,
      input.notificationId,
      input.opportunityId,
      input.suggestedStatus,
      input.sourceProvider ?? null,
      input.sourceEventId ?? null,
      input.confidence ?? null,
      input.reason ?? null,
      input.evidence ? JSON.stringify(input.evidence) : null,
      createdAt,
    ],
  });

  const suggestion = await getSuggestedStatusUpdateByNotification(
    input.notificationId,
    input.userId,
  );
  if (!suggestion) {
    throw new Error("Failed to create suggested status update");
  }
  return suggestion;
}

export async function getSuggestedStatusUpdateByNotification(
  notificationId: string,
  userId: string,
): Promise<SuggestedStatusUpdate | null> {
  await ensureSuggestedStatusUpdatesSchema();
  const result = await getClient().execute({
    sql: `SELECT * FROM suggested_status_updates
       WHERE notification_id = ? AND user_id = ?`,
    args: [notificationId, userId],
  });
  const row = result.rows[0] as unknown as SuggestedStatusUpdateRow | undefined;
  return row ? rowToSuggestedStatusUpdate(row) : null;
}

export async function updateSuggestedStatusUpdateState(
  notificationId: string,
  userId: string,
  state: Exclude<SuggestedStatusUpdateState, "pending">,
): Promise<SuggestedStatusUpdate | null> {
  await ensureSuggestedStatusUpdatesSchema();
  await getClient().execute({
    sql: `UPDATE suggested_status_updates
     SET state = ?, resolved_at = ?
     WHERE notification_id = ? AND user_id = ? AND state = 'pending'`,
    args: [state, nowIso(), notificationId, userId],
  });

  return getSuggestedStatusUpdateByNotification(notificationId, userId);
}
