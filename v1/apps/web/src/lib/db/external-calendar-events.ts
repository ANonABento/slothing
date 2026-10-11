import { getClient } from "./client";
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

let externalCalendarEventsSchemaEnsured = false;

export async function ensureExternalCalendarEventsSchema(): Promise<void> {
  if (externalCalendarEventsSchemaEnsured) return;

  // DDL co-located with `schema.ts: externalCalendarEvents`. See
  // `bootstrap-sql.ts`.
  await getClient().batch(
    EXTERNAL_CALENDAR_EVENTS_BOOTSTRAP_SQL.split(";")
      .map((statement) => statement.trim())
      .filter(Boolean),
  );
  externalCalendarEventsSchemaEnsured = true;
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

export async function getExternalCalendarEvent(
  userId: string,
  provider: string,
  externalEventId: string,
): Promise<ExternalCalendarEventRecord | null> {
  await ensureExternalCalendarEventsSchema();
  const result = await getClient().execute({
    sql: `SELECT * FROM external_calendar_events
       WHERE user_id = ? AND provider = ? AND external_event_id = ?`,
    args: [userId, provider, externalEventId],
  });
  const row = result.rows[0] as unknown as ExternalCalendarEventRow | undefined;
  return row ? rowToRecord(row) : null;
}

export async function hasProcessedExternalCalendarEvent(
  userId: string,
  provider: string,
  externalEventId: string,
): Promise<boolean> {
  return (
    (await getExternalCalendarEvent(userId, provider, externalEventId)) !== null
  );
}

export async function recordExternalCalendarEvent(
  input: RecordExternalCalendarEventInput,
): Promise<ExternalCalendarEventRecord> {
  await ensureExternalCalendarEventsSchema();
  const id = `${input.provider}:${input.userId}:${input.externalEventId}`;
  const processedAt = nowIso();

  await getClient().execute({
    sql: `INSERT INTO external_calendar_events (
      id, user_id, provider, external_event_id, calendar_id,
      matched_opportunity_id, action, event_title, event_start, processed_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id, provider, external_event_id) DO NOTHING`,
    args: [
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
    ],
  });

  const record = await getExternalCalendarEvent(
    input.userId,
    input.provider,
    input.externalEventId,
  );
  if (!record) {
    throw new Error("Failed to record external calendar event");
  }
  return record;
}
