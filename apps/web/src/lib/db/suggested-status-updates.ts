import db from "./legacy";
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
}

export function ensureSuggestedStatusUpdatesSchema(): void {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS suggested_status_updates (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL DEFAULT 'default',
      notification_id TEXT NOT NULL UNIQUE,
      opportunity_id TEXT NOT NULL,
      suggested_status TEXT NOT NULL,
      source_provider TEXT,
      source_event_id TEXT,
      state TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      resolved_at TEXT
    )`,
  ).run();
  db.prepare(
    `CREATE INDEX IF NOT EXISTS idx_suggested_status_updates_user_state
     ON suggested_status_updates(user_id, state)`,
  ).run();
}

function rowToSuggestedStatusUpdate(row: any): SuggestedStatusUpdate {
  return {
    id: row.id,
    userId: row.user_id,
    notificationId: row.notification_id,
    opportunityId: row.opportunity_id,
    suggestedStatus: row.suggested_status,
    sourceProvider: row.source_provider,
    sourceEventId: row.source_event_id,
    state: row.state,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
  };
}

export function createSuggestedStatusUpdate(
  input: CreateSuggestedStatusUpdateInput,
): SuggestedStatusUpdate {
  ensureSuggestedStatusUpdatesSchema();
  const id = generateId();
  const createdAt = nowIso();

  db.prepare(
    `INSERT INTO suggested_status_updates (
      id, user_id, notification_id, opportunity_id, suggested_status,
      source_provider, source_event_id, state, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
  ).run(
    id,
    input.userId,
    input.notificationId,
    input.opportunityId,
    input.suggestedStatus,
    input.sourceProvider ?? null,
    input.sourceEventId ?? null,
    createdAt,
  );

  return getSuggestedStatusUpdateByNotification(
    input.notificationId,
    input.userId,
  )!;
}

export function getSuggestedStatusUpdateByNotification(
  notificationId: string,
  userId: string,
): SuggestedStatusUpdate | null {
  ensureSuggestedStatusUpdatesSchema();
  const row = db
    .prepare(
      `SELECT * FROM suggested_status_updates
       WHERE notification_id = ? AND user_id = ?`,
    )
    .get(notificationId, userId);
  return row ? rowToSuggestedStatusUpdate(row) : null;
}

export function updateSuggestedStatusUpdateState(
  notificationId: string,
  userId: string,
  state: Exclude<SuggestedStatusUpdateState, "pending">,
): SuggestedStatusUpdate | null {
  ensureSuggestedStatusUpdatesSchema();
  db.prepare(
    `UPDATE suggested_status_updates
     SET state = ?, resolved_at = ?
     WHERE notification_id = ? AND user_id = ? AND state = 'pending'`,
  ).run(state, nowIso(), notificationId, userId);

  return getSuggestedStatusUpdateByNotification(notificationId, userId);
}
