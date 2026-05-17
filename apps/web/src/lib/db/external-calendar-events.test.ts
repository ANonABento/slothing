import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

vi.mock("./legacy", () => ({
  // Bootstrap DDL runs via `db.exec(...)` (see `bootstrap-sql.ts`); the
  // mock stubs it as a no-op so we can keep asserting on `prepare()`.
  default: { prepare: vi.fn(), exec: vi.fn() },
}));

import db from "./legacy";
import {
  ensureExternalCalendarEventsSchema,
  getExternalCalendarEvent,
  recordExternalCalendarEvent,
} from "./external-calendar-events";

describe("external calendar events", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates the schema idempotently", () => {
    const run = vi.fn();
    (db.prepare as Mock).mockReturnValue({ run });

    ensureExternalCalendarEventsSchema();
    ensureExternalCalendarEventsSchema();

    // Bootstrap DDL runs through `db.exec(...)` (see `bootstrap-sql.ts`)
    // once per `ensure...()` call. The function is not memoised, so two
    // calls produce two exec invocations.
    expect(db.exec).toHaveBeenCalledTimes(2);
  });

  it("looks up processed records scoped by user/provider/event", () => {
    const get = vi.fn().mockReturnValue({
      id: "google:user-1:event-1",
      user_id: "user-1",
      provider: "google",
      external_event_id: "event-1",
      action: "suggested",
      processed_at: "2026-05-10T00:00:00.000Z",
    });
    (db.prepare as Mock).mockReturnValueOnce({ get });

    const record = getExternalCalendarEvent("user-1", "google", "event-1");

    expect(get).toHaveBeenCalledWith("user-1", "google", "event-1");
    expect(record?.userId).toBe("user-1");
  });

  it("records duplicate event IDs with an upsert-safe insert", () => {
    const run = vi.fn();
    const get = vi.fn().mockReturnValue({
      id: "google:user-1:event-1",
      user_id: "user-1",
      provider: "google",
      external_event_id: "event-1",
      action: "auto_linked",
      processed_at: "2026-05-10T00:00:00.000Z",
    });
    // After moving the bootstrap DDL to `db.exec(...)`, the only
    // `prepare()` calls are (1) the INSERT and (2) the SELECT inside
    // the follow-up `getExternalCalendarEvent` lookup.
    (db.prepare as Mock)
      .mockReturnValueOnce({ run })
      .mockReturnValueOnce({ get });

    const record = recordExternalCalendarEvent({
      userId: "user-1",
      provider: "google",
      externalEventId: "event-1",
      action: "auto_linked",
    });

    expect(run).toHaveBeenCalledWith(
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
    );
    expect(record.externalEventId).toBe("event-1");
  });
});
