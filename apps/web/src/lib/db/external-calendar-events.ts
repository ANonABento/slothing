import db from "./legacy";
import { EXTERNAL_CALENDAR_EVENTS_BOOTSTRAP_SQL } from "./bootstrap-sql";
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

interface ExternalCalendarEventRow {
  id: string;
  user_id: string;
  provider: string;
  external_event_id: string;
  calendar_id: string | null;
  matched_opportunity_id: string | null;
  action: ExternalCalendarEventAction;
  event_title: string | null;
  event_start: string | null;
  processed_at: string;
}

export function ensureExternalCalendarEventsSchema(): void {
  // DDL co-located with `schema.ts: externalCalendarEvents`. See
  // `bootstrap-sql.ts`.
  db.exec(EXTERNAL_CALENDAR_EVENTS_BOOTSTRAP_SQL);
}

function rowToRecord(
  row: ExternalCalendarEventRow,
): ExternalCalendarEventRecord {
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
    .get(userId, provider, externalEventId) as
    | ExternalCalendarEventRow
    | undefined;
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
