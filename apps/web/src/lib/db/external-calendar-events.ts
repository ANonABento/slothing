import db from "./legacy";
import { nowIso } from "@/lib/format/time";

export type ExternalCalendarEventAction =
  | "auto_linked"
  | "suggested"
  | "unmatched"
  | "skipped";

export interface ExternalCalendarEventRecord {
  id: string;
  userId: string;
  provider: string;
  externalEventId: string;
  calendarId?: string | null;
  matchedOpportunityId?: string | null;
  action: ExternalCalendarEventAction;
  eventTitle?: string | null;
  eventStart?: string | null;
  processedAt: string;
}

export interface RecordExternalCalendarEventInput {
  userId: string;
  provider: string;
  externalEventId: string;
  calendarId?: string | null;
  matchedOpportunityId?: string | null;
  action: ExternalCalendarEventAction;
  eventTitle?: string | null;
  eventStart?: string | null;
}

export function ensureExternalCalendarEventsSchema(): void {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS external_calendar_events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL DEFAULT 'default',
      provider TEXT NOT NULL,
      external_event_id TEXT NOT NULL,
      calendar_id TEXT,
      matched_opportunity_id TEXT,
      action TEXT NOT NULL,
      event_title TEXT,
      event_start TEXT,
      processed_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, provider, external_event_id)
    )`,
  ).run();
  db.prepare(
    `CREATE INDEX IF NOT EXISTS idx_external_calendar_events_user_processed
     ON external_calendar_events(user_id, processed_at)`,
  ).run();
}

function rowToRecord(row: any): ExternalCalendarEventRecord {
  return {
    id: row.id,
    userId: row.user_id,
    provider: row.provider,
    externalEventId: row.external_event_id,
    calendarId: row.calendar_id,
    matchedOpportunityId: row.matched_opportunity_id,
    action: row.action,
    eventTitle: row.event_title,
    eventStart: row.event_start,
    processedAt: row.processed_at,
  };
}

export function getExternalCalendarEvent(
  userId: string,
  provider: string,
  externalEventId: string,
): ExternalCalendarEventRecord | null {
  ensureExternalCalendarEventsSchema();
  const row = db
    .prepare(
      `SELECT * FROM external_calendar_events
       WHERE user_id = ? AND provider = ? AND external_event_id = ?`,
    )
    .get(userId, provider, externalEventId);
  return row ? rowToRecord(row) : null;
}

export function hasProcessedExternalCalendarEvent(
  userId: string,
  provider: string,
  externalEventId: string,
): boolean {
  return getExternalCalendarEvent(userId, provider, externalEventId) !== null;
}

export function recordExternalCalendarEvent(
  input: RecordExternalCalendarEventInput,
): ExternalCalendarEventRecord {
  ensureExternalCalendarEventsSchema();
  const id = `${input.provider}:${input.userId}:${input.externalEventId}`;
  const processedAt = nowIso();

  db.prepare(
    `INSERT INTO external_calendar_events (
      id, user_id, provider, external_event_id, calendar_id,
      matched_opportunity_id, action, event_title, event_start, processed_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, provider, external_event_id) DO NOTHING`,
  ).run(
    id,
    input.userId,
    input.provider,
    input.externalEventId,
    input.calendarId ?? null,
    input.matchedOpportunityId ?? null,
    input.action,
    input.eventTitle ?? null,
    input.eventStart ?? null,
    processedAt,
  );

  return getExternalCalendarEvent(
    input.userId,
    input.provider,
    input.externalEventId,
  )!;
}
