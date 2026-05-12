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
      confidence REAL,
      reason TEXT,
      evidence_json TEXT,
      state TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      resolved_at TEXT
    )`,
  ).run();
  db.prepare(
    `CREATE INDEX IF NOT EXISTS idx_suggested_status_updates_user_state
     ON suggested_status_updates(user_id, state)`,
  ).run();
  const columns = (
    db.prepare("PRAGMA table_info(suggested_status_updates)").all() as Array<{
      name: string;
    }>
  ).map((column) => column.name);
  if (!columns.includes("confidence")) {
    db.prepare(
      "ALTER TABLE suggested_status_updates ADD COLUMN confidence REAL",
    ).run();
  }
  if (!columns.includes("reason")) {
    db.prepare(
      "ALTER TABLE suggested_status_updates ADD COLUMN reason TEXT",
    ).run();
  }
  if (!columns.includes("evidence_json")) {
    db.prepare(
      "ALTER TABLE suggested_status_updates ADD COLUMN evidence_json TEXT",
    ).run();
  }
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
): SuggestedStatusUpdate {
  ensureSuggestedStatusUpdatesSchema();
  const id = generateId();
  const createdAt = nowIso();

  db.prepare(
    `INSERT INTO suggested_status_updates (
      id, user_id, notification_id, opportunity_id, suggested_status,
      source_provider, source_event_id, confidence, reason, evidence_json,
      state, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
  ).run(
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
    .get(notificationId, userId) as SuggestedStatusUpdateRow | undefined;
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
