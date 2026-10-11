import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
  batch: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "suggestion-1",
}));

import {
  createSuggestedStatusUpdate,
  ensureSuggestedStatusUpdatesSchema,
} from "./suggested-status-updates";

function result(rows: unknown[] = []) {
  return { rows, rowsAffected: 0 };
}

describe("suggested status updates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.batch.mockResolvedValue([]);
    dbMocks.execute.mockImplementation(
      (statement: string | { sql: string }) => {
        const sql = typeof statement === "string" ? statement : statement.sql;
        if (sql.startsWith("PRAGMA table_info")) {
          return Promise.resolve(result([{ name: "id" }]));
        }
        if (sql.includes("SELECT * FROM suggested_status_updates")) {
          return Promise.resolve(
            result([
              {
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
              },
            ]),
          );
        }
        return Promise.resolve(result());
      },
    );
  });

  it("adds metadata columns for existing local databases", async () => {
    await ensureSuggestedStatusUpdatesSchema();

    expect(dbMocks.batch).toHaveBeenCalled();
    expect(dbMocks.execute).toHaveBeenCalledWith(
      "PRAGMA table_info(suggested_status_updates)",
    );
    expect(dbMocks.execute).toHaveBeenCalledWith(
      "ALTER TABLE suggested_status_updates ADD COLUMN confidence REAL",
    );
    expect(dbMocks.execute).toHaveBeenCalledWith(
      "ALTER TABLE suggested_status_updates ADD COLUMN reason TEXT",
    );
    expect(dbMocks.execute).toHaveBeenCalledWith(
      "ALTER TABLE suggested_status_updates ADD COLUMN evidence_json TEXT",
    );
  });

  it("stores and reads confidence, reason, and evidence metadata", async () => {
    const suggestion = await createSuggestedStatusUpdate({
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

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("INSERT INTO suggested_status_updates"),
      args: [
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
      ],
    });
    expect(suggestion.evidence).toEqual(["Can we schedule a call?"]);
  });
});
