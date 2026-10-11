import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
  batch: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

import {
  ensureExternalCalendarEventsSchema,
  getExternalCalendarEvent,
  recordExternalCalendarEvent,
} from "./external-calendar-events";

function result(rows: unknown[] = []) {
  return { rows, rowsAffected: 0 };
}

describe("external calendar events", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.batch.mockResolvedValue([]);
    dbMocks.execute.mockImplementation(
      (statement: string | { sql: string }) => {
        const sql = typeof statement === "string" ? statement : statement.sql;
        if (sql.includes("SELECT * FROM external_calendar_events")) {
          return Promise.resolve(
            result([
              {
                id: "google:user-1:event-1",
                user_id: "user-1",
                provider: "google",
                external_event_id: "event-1",
                calendar_id: null,
                matched_opportunity_id: null,
                action: "suggested",
                event_title: null,
                event_start: null,
                processed_at: "2026-05-10T00:00:00.000Z",
              },
            ]),
          );
        }
        return Promise.resolve(result());
      },
    );
  });

  it("creates the schema idempotently", async () => {
    await ensureExternalCalendarEventsSchema();
    await ensureExternalCalendarEventsSchema();

    expect(dbMocks.batch).toHaveBeenCalledTimes(1);
  });

  it("looks up processed records scoped by user/provider/event", async () => {
    const record = await getExternalCalendarEvent(
      "user-1",
      "google",
      "event-1",
    );

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("SELECT * FROM external_calendar_events"),
      args: ["user-1", "google", "event-1"],
    });
    expect(record?.userId).toBe("user-1");
  });

  it("records duplicate event IDs with an upsert-safe insert", async () => {
    const record = await recordExternalCalendarEvent({
      userId: "user-1",
      provider: "google",
      externalEventId: "event-1",
      action: "auto_linked",
    });

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining(
        "ON CONFLICT(user_id, provider, external_event_id) DO NOTHING",
      ),
      args: [
        "google:user-1:event-1",
        "user-1",
        "google",
        "event-1",
        null,
        null,
        "auto_linked",
        null,
        null,
        expect.any(String),
      ],
    });
    expect(record.externalEventId).toBe("event-1");
  });
});
