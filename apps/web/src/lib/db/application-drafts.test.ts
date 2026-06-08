import { describe, it, expect, vi, beforeEach } from "vitest";

const dbMocks = vi.hoisted(() => ({ execute: vi.fn() }));

vi.mock("./client", () => ({ getClient: () => dbMocks }));
vi.mock("@/lib/utils", () => ({ generateId: () => "draft-id" }));
vi.mock("@/lib/format/time", () => ({
  nowIso: () => "2026-06-08T00:00:00.000Z",
}));

import {
  upsertDraft,
  reviewDraft,
  listDrafts,
  recordSubmission,
  countSubmittedSince,
} from "./application-drafts";

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

function draftRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "draft-id",
    job_id: "job-1",
    questions_json:
      '[{"id":"q1","label":"Why us?","type":"text","required":false}]',
    answers_json:
      '[{"questionId":"q1","value":"Because","groundedIn":"bank:1","confidence":0.8,"source":"bank: mission"}]',
    status: "pending_review",
    authored_by: "agent:test",
    created_at: "2026-06-08T00:00:00.000Z",
    reviewed_at: null,
    submitted_at: null,
    submit_result_json: null,
    ...overrides,
  };
}

const ALL_COLUMNS = [
  "id",
  "user_id",
  "job_id",
  "questions_json",
  "answers_json",
  "status",
  "authored_by",
  "created_at",
  "reviewed_at",
  "submitted_at",
  "submit_result_json",
].map((name) => ({ name }));

/** Drive the mock: openDraftRows answers findOpenDraft, byIdRow answers getDraft. */
function mockDb(openDraftRows: unknown[], byIdRow: unknown | null) {
  dbMocks.execute.mockImplementation((statement: string | { sql: string }) => {
    const sql = typeof statement === "string" ? statement : statement.sql;
    if (sql.startsWith("PRAGMA table_info")) {
      return Promise.resolve(result(ALL_COLUMNS));
    }
    if (sql.includes("status IN")) {
      return Promise.resolve(result(openDraftRows));
    }
    if (sql.startsWith("SELECT") && sql.includes("WHERE id = ?")) {
      return Promise.resolve(result(byIdRow ? [byIdRow] : []));
    }
    if (sql.startsWith("SELECT")) {
      return Promise.resolve(result(byIdRow ? [byIdRow] : []));
    }
    return Promise.resolve(result([], 1));
  });
}

describe("application-drafts DB", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("bootstraps the table + status index", async () => {
    mockDb([], null);
    await listDrafts("user-1");
    const ddl = dbMocks.execute.mock.calls
      .map((c) => (typeof c[0] === "string" ? c[0] : c[0].sql))
      .join("\n");
    expect(ddl).toContain("CREATE TABLE IF NOT EXISTS application_drafts");
    expect(ddl).toContain("idx_application_drafts_user_status");
  });

  it("inserts a new draft when no open draft exists for the job", async () => {
    mockDb([], draftRow());
    const draft = await upsertDraft("user-1", {
      jobId: "job-1",
      questions: [
        { id: "q1", label: "Why us?", type: "text", required: false },
      ],
      answers: [
        {
          questionId: "q1",
          value: "Because",
          groundedIn: "bank:1",
          confidence: 0.8,
          source: "bank: mission",
        },
      ],
      authoredBy: "agent:test",
    });

    const insert = dbMocks.execute.mock.calls.find((c) => {
      const sql = typeof c[0] === "string" ? c[0] : c[0].sql;
      return sql.includes("INSERT INTO application_drafts");
    });
    expect(insert).toBeTruthy();
    expect(draft.status).toBe("pending_review");
    expect(draft.jobId).toBe("job-1");
    expect(draft.answers[0]?.groundedIn).toBe("bank:1");
  });

  it("updates the existing open draft instead of inserting a duplicate", async () => {
    mockDb([draftRow()], draftRow());
    await upsertDraft("user-1", {
      jobId: "job-1",
      questions: [],
      answers: [],
    });

    const calls = dbMocks.execute.mock.calls.map((c) =>
      typeof c[0] === "string" ? c[0] : c[0].sql,
    );
    expect(
      calls.some((s) =>
        s.includes("UPDATE application_drafts SET questions_json"),
      ),
    ).toBe(true);
    expect(
      calls.some((s) => s.includes("INSERT INTO application_drafts")),
    ).toBe(false);
  });

  it("stamps reviewed_at when approving", async () => {
    mockDb(
      [],
      draftRow({ status: "approved", reviewed_at: "2026-06-08T00:00:00.000Z" }),
    );
    await reviewDraft("draft-id", "user-1", { status: "approved" });

    const update = dbMocks.execute.mock.calls.find((c) => {
      const sql = typeof c[0] === "string" ? c[0] : c[0].sql;
      return (
        sql.includes("UPDATE application_drafts SET") &&
        sql.includes("status = ?")
      );
    });
    expect(update).toBeTruthy();
    const sql =
      typeof update![0] === "string"
        ? update![0]
        : (update![0] as { sql: string }).sql;
    expect(sql).toContain("reviewed_at = ?");
  });

  it("records a submission for an approved draft", async () => {
    mockDb([], draftRow({ status: "approved" }));
    const { gated } = await recordSubmission("draft-id", "user-1", {
      ok: true,
      atsRef: "GH-123",
    });
    expect(gated).toBe(false);
    const update = dbMocks.execute.mock.calls.find((c) => {
      const sql = typeof c[0] === "string" ? c[0] : c[0].sql;
      return (
        sql.includes("UPDATE application_drafts SET status = ?") &&
        sql.includes("status = 'approved'")
      );
    });
    expect(update).toBeTruthy();
    expect((update![0] as { args: unknown[] }).args[0]).toBe("submitted");
  });

  it("gates submission for a non-approved draft", async () => {
    mockDb([], draftRow({ status: "pending_review" }));
    const { gated } = await recordSubmission("draft-id", "user-1", {
      ok: true,
    });
    expect(gated).toBe(true);
    const update = dbMocks.execute.mock.calls.find((c) => {
      const sql = typeof c[0] === "string" ? c[0] : c[0].sql;
      return sql.includes("UPDATE application_drafts SET status = ?");
    });
    expect(update).toBeFalsy();
  });

  it("counts submissions since a timestamp (daily cap)", async () => {
    dbMocks.execute.mockImplementation(
      (statement: string | { sql: string }) => {
        const sql = typeof statement === "string" ? statement : statement.sql;
        if (sql.startsWith("PRAGMA table_info")) {
          return Promise.resolve(result(ALL_COLUMNS));
        }
        if (sql.includes("COUNT(*)")) {
          return Promise.resolve(result([{ n: 3 }]));
        }
        return Promise.resolve(result([], 1));
      },
    );
    const n = await countSubmittedSince("user-1", "2026-06-08T00:00:00.000Z");
    expect(n).toBe(3);
  });
});
