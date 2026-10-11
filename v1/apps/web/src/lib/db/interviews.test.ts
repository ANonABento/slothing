import { describe, it, expect, vi, beforeEach } from "vitest";

const { executeMock } = vi.hoisted(() => ({
  executeMock: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => ({ execute: executeMock }),
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "test-session-id",
}));

import {
  createInterviewSession,
  getInterviewSession,
  getInterviewSessions,
  addInterviewAnswer,
  addInterviewFollowUp,
  completeInterviewSession,
  deleteInterviewSession,
  getRecentInterviewSessions,
} from "./interviews";

const TEST_USER_ID = "test-user";

type ExecuteArg = string | { sql: string; args?: unknown[] };

function sqlOf(arg: ExecuteArg): string {
  return typeof arg === "string" ? arg : arg.sql;
}

function isSchemaSql(sql: string): boolean {
  const upper = sql.trim().toUpperCase();
  return (
    upper.startsWith("CREATE") ||
    upper.startsWith("ALTER") ||
    upper.startsWith("DROP") ||
    upper.startsWith("PRAGMA") ||
    upper.startsWith("BEGIN") ||
    upper.startsWith("COMMIT") ||
    upper.startsWith("ROLLBACK") ||
    upper.startsWith("INSERT INTO INTERVIEW_SESSIONS_NEW") ||
    upper.startsWith("RENAME")
  );
}

function setupMock(handler: (sql: string) => unknown): void {
  executeMock.mockImplementation(async (arg: ExecuteArg) => {
    const sql = sqlOf(arg);
    if (isSchemaSql(sql)) {
      return { rows: [], rowsAffected: 0 };
    }
    const result = handler(sql);
    if (result && typeof result === "object" && "rows" in result) {
      return result;
    }
    return { rows: [], rowsAffected: 0 };
  });
}

function nonSchemaCalls(): { sql: string; args: unknown[] }[] {
  return executeMock.mock.calls
    .map(([arg]) => {
      if (typeof arg === "string") return { sql: arg, args: [] as unknown[] };
      return { sql: arg.sql, args: (arg.args ?? []) as unknown[] };
    })
    .filter((call) => !isSchemaSql(call.sql));
}

describe("Interview Database Functions", () => {
  beforeEach(() => {
    executeMock.mockReset();
  });

  describe("createInterviewSession", () => {
    it("creates a new interview session", async () => {
      setupMock(() => ({ rows: [], rowsAffected: 1 }));

      const questions = [
        { question: "Tell me about yourself", category: "behavioral" as const },
        { question: "What is React?", category: "technical" as const },
      ];

      const result = await createInterviewSession(
        "job-123",
        questions,
        "text",
        TEST_USER_ID,
      );

      const calls = nonSchemaCalls();
      const insert = calls.find((c) =>
        c.sql.includes("INSERT INTO interview_sessions"),
      );
      expect(insert).toBeDefined();
      expect(insert!.sql).toContain("WHERE EXISTS");
      expect(insert!.args).toEqual([
        "test-session-id",
        TEST_USER_ID,
        "job-123",
        null,
        null,
        TEST_USER_ID,
        "text",
        JSON.stringify(questions),
        expect.any(String),
        "job-123",
        TEST_USER_ID,
      ]);
      expect(result).toEqual({
        id: "test-session-id",
        jobId: "job-123",
        contextPackId: null,
        profileId: TEST_USER_ID,
        mode: "text",
        category: null,
        questions,
        status: "in_progress",
        startedAt: expect.any(String),
      });
    });

    it("creates a generic interview session without a job", async () => {
      setupMock(() => ({ rows: [], rowsAffected: 1 }));

      const questions = [
        {
          question: "Tell me about a challenge",
          category: "behavioral" as const,
        },
      ];

      const result = await createInterviewSession(
        null,
        questions,
        "generic-text",
        TEST_USER_ID,
        "behavioral",
      );

      const insert = nonSchemaCalls().find((c) =>
        c.sql.includes("INSERT INTO interview_sessions"),
      );
      expect(insert).toBeDefined();
      expect(insert!.sql).toContain("VALUES");
      expect(insert!.args).toEqual([
        "test-session-id",
        TEST_USER_ID,
        null,
        "behavioral",
        TEST_USER_ID,
        "generic-text",
        JSON.stringify(questions),
        expect.any(String),
      ]);
      expect(result).toMatchObject({
        id: "test-session-id",
        jobId: null,
        category: "behavioral",
        mode: "generic-text",
      });
    });

    it("rejects sessions for jobs outside the provided user", async () => {
      setupMock((sql) => {
        if (sql.includes("INSERT INTO interview_sessions")) {
          return { rows: [], rowsAffected: 0 };
        }
        return { rows: [], rowsAffected: 1 };
      });

      await expect(
        createInterviewSession("job-123", [], "text", "user-123"),
      ).rejects.toThrow("Job not found");

      const insert = nonSchemaCalls().find((c) =>
        c.sql.includes("INSERT INTO interview_sessions"),
      );
      expect(insert!.args).toEqual([
        "test-session-id",
        "user-123",
        "job-123",
        null,
        null,
        "user-123",
        "text",
        JSON.stringify([]),
        expect.any(String),
        "job-123",
        "user-123",
      ]);
    });

    it("defaults to text mode", async () => {
      setupMock(() => ({ rows: [], rowsAffected: 1 }));

      const result = await createInterviewSession(
        "job-123",
        [],
        undefined,
        TEST_USER_ID,
      );

      expect(result.mode).toBe("text");
    });

    it("supports voice mode", async () => {
      setupMock(() => ({ rows: [], rowsAffected: 1 }));

      const result = await createInterviewSession(
        "job-123",
        [],
        "voice",
        TEST_USER_ID,
      );

      expect(result.mode).toBe("voice");
    });

    it("attaches a context pack to a generic session", async () => {
      setupMock(() => ({ rows: [], rowsAffected: 1 }));

      const questions = [
        {
          question: "Defend this project architecture",
          category: "technical" as const,
        },
      ];

      const result = await createInterviewSession(
        null,
        questions,
        "generic-text",
        TEST_USER_ID,
        null,
        "context-pack-1",
      );

      const insert = nonSchemaCalls().find((c) =>
        c.sql.includes("INSERT INTO interview_sessions"),
      );
      expect(insert!.args).toEqual([
        "test-session-id",
        TEST_USER_ID,
        "context-pack-1",
        null,
        TEST_USER_ID,
        "generic-text",
        JSON.stringify(questions),
        expect.any(String),
      ]);
      expect(result).toMatchObject({
        jobId: null,
        contextPackId: "context-pack-1",
        mode: "generic-text",
      });
    });
  });

  describe("getInterviewSession", () => {
    it("returns session with answers", async () => {
      const sessionRow = {
        id: "session-1",
        job_id: "job-123",
        context_pack_id: null,
        category: null,
        profile_id: TEST_USER_ID,
        mode: "text",
        questions_json: '[{"question": "Q1", "category": "behavioral"}]',
        status: "in_progress",
        started_at: "2024-01-15T10:00:00.000Z",
        completed_at: null,
      };

      const answerRow = {
        id: "answer-1",
        session_id: "session-1",
        question_index: 0,
        answer: "My answer",
        feedback: "Good answer",
        created_at: "2024-01-15T10:05:00.000Z",
      };

      setupMock((sql) => {
        if (sql.includes("FROM interview_sessions"))
          return { rows: [sessionRow] };
        if (sql.includes("FROM interview_answers"))
          return { rows: [answerRow] };
        if (sql.includes("FROM interview_follow_ups")) return { rows: [] };
        return { rows: [] };
      });

      const result = await getInterviewSession("session-1", TEST_USER_ID);

      const sessionCall = nonSchemaCalls().find((c) =>
        c.sql.includes("FROM interview_sessions"),
      );
      expect(sessionCall!.sql).toContain("WHERE id = ? AND user_id = ?");
      expect(result).toEqual({
        id: "session-1",
        jobId: "job-123",
        contextPackId: null,
        contextPackTitle: null,
        contextPackMode: null,
        contextPackPromotable: false,
        profileId: TEST_USER_ID,
        mode: "text",
        category: null,
        questions: [{ question: "Q1", category: "behavioral" }],
        status: "in_progress",
        startedAt: "2024-01-15T10:00:00.000Z",
        completedAt: undefined,
        answers: [
          {
            id: "answer-1",
            sessionId: "session-1",
            questionIndex: 0,
            answer: "My answer",
            feedback: "Good answer",
            createdAt: "2024-01-15T10:05:00.000Z",
          },
        ],
        followUps: [],
      });
    });

    it("returns null for non-existent session", async () => {
      setupMock(() => ({ rows: [] }));

      const result = await getInterviewSession("non-existent", TEST_USER_ID);

      expect(result).toBeNull();
    });

    it("handles completed sessions", async () => {
      const sessionRow = {
        id: "session-1",
        job_id: "job-123",
        context_pack_id: null,
        category: null,
        profile_id: TEST_USER_ID,
        mode: "voice",
        questions_json: "[]",
        status: "completed",
        started_at: "2024-01-15T10:00:00.000Z",
        completed_at: "2024-01-15T11:00:00.000Z",
      };

      setupMock((sql) => {
        if (sql.includes("FROM interview_sessions"))
          return { rows: [sessionRow] };
        return { rows: [] };
      });

      const result = await getInterviewSession("session-1", TEST_USER_ID);

      expect(result?.status).toBe("completed");
      expect(result?.completedAt).toBe("2024-01-15T11:00:00.000Z");
    });
  });

  describe("getInterviewSessions", () => {
    it("returns all sessions ordered by started_at DESC", async () => {
      const rows = [
        {
          id: "session-2",
          job_id: "job-456",
          context_pack_id: null,
          category: null,
          profile_id: TEST_USER_ID,
          mode: "text",
          questions_json: "[]",
          status: "in_progress",
          started_at: "2024-01-16T10:00:00.000Z",
          completed_at: null,
        },
        {
          id: "session-1",
          job_id: "job-123",
          context_pack_id: null,
          category: null,
          profile_id: TEST_USER_ID,
          mode: "voice",
          questions_json: "[]",
          status: "completed",
          started_at: "2024-01-15T10:00:00.000Z",
          completed_at: "2024-01-15T11:00:00.000Z",
        },
      ];

      setupMock((sql) => {
        if (sql.includes("FROM interview_sessions")) return { rows };
        return { rows: [] };
      });

      const result = await getInterviewSessions(undefined, TEST_USER_ID);

      const sessionCall = nonSchemaCalls().find((c) =>
        c.sql.includes("FROM interview_sessions"),
      );
      expect(sessionCall!.sql).toContain("WHERE user_id = ?");
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("session-2");
      expect(result[1].id).toBe("session-1");
    });

    it("filters by jobId when provided", async () => {
      setupMock(() => ({ rows: [] }));

      await getInterviewSessions("job-123", TEST_USER_ID);

      const sessionCall = nonSchemaCalls().find((c) =>
        c.sql.includes("FROM interview_sessions"),
      );
      expect(sessionCall!.sql).toContain("AND job_id = ?");
      expect(sessionCall!.args).toEqual([TEST_USER_ID, "job-123"]);
    });

    it("returns empty array when no sessions exist", async () => {
      setupMock(() => ({ rows: [] }));

      const result = await getInterviewSessions(undefined, TEST_USER_ID);

      const sessionCall = nonSchemaCalls().find((c) =>
        c.sql.includes("FROM interview_sessions"),
      );
      expect(sessionCall!.sql).toContain("WHERE user_id = ?");
      expect(result).toEqual([]);
    });
  });

  describe("addInterviewAnswer", () => {
    it("adds an answer to a session", async () => {
      setupMock(() => ({ rows: [], rowsAffected: 1 }));

      const result = await addInterviewAnswer(
        "session-1",
        0,
        "My answer",
        "Good!",
        TEST_USER_ID,
      );

      const insert = nonSchemaCalls().find((c) =>
        c.sql.includes("INSERT INTO interview_answers"),
      );
      expect(insert!.args).toEqual([
        "test-session-id",
        TEST_USER_ID,
        "session-1",
        0,
        "My answer",
        "Good!",
        expect.any(String),
        "session-1",
        TEST_USER_ID,
      ]);
      expect(result).toEqual({
        id: "test-session-id",
        sessionId: "session-1",
        questionIndex: 0,
        answer: "My answer",
        feedback: "Good!",
        createdAt: expect.any(String),
      });
    });

    it("rejects answers for sessions outside the provided user", async () => {
      setupMock((sql) => {
        if (sql.includes("INSERT INTO interview_answers")) {
          return { rows: [], rowsAffected: 0 };
        }
        return { rows: [], rowsAffected: 1 };
      });

      await expect(
        addInterviewAnswer("session-1", 0, "My answer", undefined, "user-123"),
      ).rejects.toThrow("Session not found");

      const insert = nonSchemaCalls().find((c) =>
        c.sql.includes("INSERT INTO interview_answers"),
      );
      expect(insert!.args).toEqual([
        "test-session-id",
        "user-123",
        "session-1",
        0,
        "My answer",
        null,
        expect.any(String),
        "session-1",
        "user-123",
      ]);
    });

    it("handles answers without feedback", async () => {
      setupMock(() => ({ rows: [], rowsAffected: 1 }));

      const result = await addInterviewAnswer(
        "session-1",
        0,
        "My answer",
        undefined,
        TEST_USER_ID,
      );

      expect(result.feedback).toBeUndefined();
      const insert = nonSchemaCalls().find((c) =>
        c.sql.includes("INSERT INTO interview_answers"),
      );
      expect(insert!.args[5]).toBeNull();
    });

    it("saves answers for the provided user", async () => {
      setupMock(() => ({ rows: [], rowsAffected: 1 }));

      await addInterviewAnswer(
        "session-1",
        0,
        "My answer",
        undefined,
        "user-123",
      );

      const insert = nonSchemaCalls().find((c) =>
        c.sql.includes("INSERT INTO interview_answers"),
      );
      expect(insert!.args[1]).toBe("user-123");
    });
  });

  describe("addInterviewFollowUp", () => {
    it("adds a follow-up answer to a session", async () => {
      setupMock(() => ({ rows: [], rowsAffected: 1 }));

      const result = await addInterviewFollowUp(
        "session-1",
        0,
        "What was the result?",
        "We reduced review time by 20%.",
        "Strong measurable result.",
        TEST_USER_ID,
      );

      const insert = nonSchemaCalls().find((c) =>
        c.sql.includes("INSERT INTO interview_follow_ups"),
      );
      expect(insert!.args).toEqual([
        "test-session-id",
        TEST_USER_ID,
        "session-1",
        0,
        "What was the result?",
        "We reduced review time by 20%.",
        "Strong measurable result.",
        expect.any(String),
        "session-1",
        TEST_USER_ID,
      ]);
      expect(result).toEqual({
        id: "test-session-id",
        sessionId: "session-1",
        questionIndex: 0,
        followUpQuestion: "What was the result?",
        answer: "We reduced review time by 20%.",
        feedback: "Strong measurable result.",
        createdAt: expect.any(String),
      });
    });

    it("rejects follow-ups for sessions outside the provided user", async () => {
      setupMock((sql) => {
        if (sql.includes("INSERT INTO interview_follow_ups")) {
          return { rows: [], rowsAffected: 0 };
        }
        return { rows: [], rowsAffected: 1 };
      });

      await expect(
        addInterviewFollowUp(
          "session-1",
          0,
          "What changed?",
          "The team shipped faster.",
          undefined,
          "user-123",
        ),
      ).rejects.toThrow("Session not found");

      const insert = nonSchemaCalls().find((c) =>
        c.sql.includes("INSERT INTO interview_follow_ups"),
      );
      expect(insert!.args).toEqual([
        "test-session-id",
        "user-123",
        "session-1",
        0,
        "What changed?",
        "The team shipped faster.",
        null,
        expect.any(String),
        "session-1",
        "user-123",
      ]);
    });
  });

  describe("completeInterviewSession", () => {
    it("marks session as completed", async () => {
      setupMock(() => ({ rows: [], rowsAffected: 1 }));

      await completeInterviewSession("session-1", TEST_USER_ID);

      const update = nonSchemaCalls().find((c) =>
        c.sql.includes("UPDATE interview_sessions"),
      );
      expect(update).toBeDefined();
      expect(update!.args[0]).toBeTruthy();
      expect(update!.args[1]).toBe("session-1");
      expect(update!.args[2]).toBe(TEST_USER_ID);
    });
  });

  describe("deleteInterviewSession", () => {
    it("deletes session and its answers", async () => {
      setupMock((sql) => {
        if (sql.includes("SELECT id FROM interview_sessions")) {
          return { rows: [{ id: "session-1" }] };
        }
        return { rows: [], rowsAffected: 1 };
      });

      await deleteInterviewSession("session-1", TEST_USER_ID);

      const calls = nonSchemaCalls();
      const select = calls.find((c) =>
        c.sql.includes("SELECT id FROM interview_sessions"),
      );
      expect(select!.args).toEqual(["session-1", TEST_USER_ID]);

      const deleteCalls = calls.filter((c) => c.sql.startsWith("DELETE"));
      expect(deleteCalls).toHaveLength(3);
      for (const call of deleteCalls) {
        expect(call.args).toEqual(["session-1", TEST_USER_ID]);
      }
    });
  });

  describe("getRecentInterviewSessions", () => {
    it("returns limited number of sessions", async () => {
      const rows = [
        {
          id: "session-1",
          job_id: "job-123",
          context_pack_id: null,
          category: null,
          profile_id: TEST_USER_ID,
          mode: "text",
          questions_json: "[]",
          status: "in_progress",
          started_at: "2024-01-15T10:00:00.000Z",
          completed_at: null,
        },
      ];

      setupMock((sql) => {
        if (sql.includes("FROM interview_sessions")) return { rows };
        return { rows: [] };
      });

      const result = await getRecentInterviewSessions(5, TEST_USER_ID);

      const call = nonSchemaCalls().find((c) =>
        c.sql.includes("FROM interview_sessions"),
      );
      expect(call!.args).toEqual([TEST_USER_ID, 5]);
      expect(result).toHaveLength(1);
    });

    it("defaults to 5 sessions", async () => {
      setupMock(() => ({ rows: [] }));

      await getRecentInterviewSessions(undefined, TEST_USER_ID);

      const call = nonSchemaCalls().find((c) =>
        c.sql.includes("FROM interview_sessions"),
      );
      expect(call!.args).toEqual([TEST_USER_ID, 5]);
    });
  });
});
