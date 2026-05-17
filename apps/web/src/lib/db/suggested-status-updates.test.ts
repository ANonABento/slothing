import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

vi.mock("./legacy", () => ({
  default: {
    prepare: vi.fn(),
    // Bootstrap DDL runs via `db.exec(...)` (see `bootstrap-sql.ts`).
    // The tests don't exercise the bootstrap statements directly — they
    // assert on the `prepare()`-driven ALTER TABLE migrations — so this
    // stub is a no-op.
    exec: vi.fn(),
  },
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "suggestion-1",
}));

import db from "./legacy";
import {
  createSuggestedStatusUpdate,
  ensureSuggestedStatusUpdatesSchema,
} from "./suggested-status-updates";

describe("suggested status updates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds metadata columns for existing local databases", () => {
    const run = vi.fn();
    (db.prepare as Mock).mockImplementation((sql: string) => {
      if (sql.startsWith("PRAGMA table_info")) {
        return { all: vi.fn().mockReturnValue([{ name: "id" }]) };
      }
      return { run };
    });

    ensureSuggestedStatusUpdatesSchema();

    expect(db.prepare).toHaveBeenCalledWith(
      "ALTER TABLE suggested_status_updates ADD COLUMN confidence REAL",
    );
    expect(db.prepare).toHaveBeenCalledWith(
      "ALTER TABLE suggested_status_updates ADD COLUMN reason TEXT",
    );
    expect(db.prepare).toHaveBeenCalledWith(
      "ALTER TABLE suggested_status_updates ADD COLUMN evidence_json TEXT",
    );
  });

  it("stores and reads confidence, reason, and evidence metadata", () => {
    const insertRun = vi.fn();
    (db.prepare as Mock).mockImplementation((sql: string) => {
      if (sql.startsWith("PRAGMA table_info")) {
        return {
          all: vi
            .fn()
            .mockReturnValue([
              { name: "confidence" },
              { name: "reason" },
              { name: "evidence_json" },
            ]),
        };
      }
      if (sql.includes("INSERT INTO suggested_status_updates")) {
        return { run: insertRun };
      }
      if (sql.includes("SELECT * FROM suggested_status_updates")) {
        return {
          get: vi.fn().mockReturnValue({
            id: "suggestion-1",
            user_id: "user-1",
            notification_id: "notif-1",
            opportunity_id: "opp-1",
            suggested_status: "interviewing",
            source_provider: "gmail",
            source_event_id: "message-1",
            confidence: 0.76,
            reason: "interview scheduling language",
            evidence_json: JSON.stringify(["Can we schedule a call?"]),
            state: "pending",
            created_at: "2026-05-10T00:00:00.000Z",
            resolved_at: null,
          }),
        };
      }
      return { run: vi.fn() };
    });

    const suggestion = createSuggestedStatusUpdate({
      userId: "user-1",
      notificationId: "notif-1",
      opportunityId: "opp-1",
      suggestedStatus: "interviewing",
      sourceProvider: "gmail",
      sourceEventId: "message-1",
      confidence: 0.76,
      reason: "interview scheduling language",
      evidence: ["Can we schedule a call?"],
    });

    expect(insertRun).toHaveBeenCalledWith(
      "suggestion-1",
      "user-1",
      "notif-1",
      "opp-1",
      "interviewing",
      "gmail",
      "message-1",
      0.76,
      "interview scheduling language",
      JSON.stringify(["Can we schedule a call?"]),
      expect.any(String),
    );
    expect(suggestion.evidence).toEqual(["Can we schedule a call?"]);
  });
});
