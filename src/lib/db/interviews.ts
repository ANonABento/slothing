import db from "./legacy";
import { generateId } from "@/lib/utils";
import type { SessionQuestionCategory, SessionMode } from "@/lib/constants";

import { nowIso } from "@/lib/format/time";
interface InterviewQuestion {
  question: string;
  category: SessionQuestionCategory;
  suggestedAnswer?: string;
}

export interface InterviewSession {
  id: string;
  jobId: string | null;
  profileId: string;
  mode: SessionMode;
  category?: SessionQuestionCategory | null;
  questions: InterviewQuestion[];
  status: "in_progress" | "completed";
  startedAt: string;
  completedAt?: string;
}

export interface InterviewAnswer {
  id: string;
  sessionId: string;
  questionIndex: number;
  answer: string;
  feedback?: string;
  createdAt: string;
}

export interface InterviewSessionWithAnswers extends InterviewSession {
  answers: InterviewAnswer[];
}

let interviewSessionsSchemaEnsured = false;

interface TableInfoRow {
  name: string;
  notnull: number;
}

function tryExec(statement: string): void {
  const exec = (db as unknown as { exec?: (sql: string) => void }).exec;
  if (typeof exec === "function") {
    exec.call(db, statement);
    return;
  }

  const prepared = db.prepare(statement);
  if ("run" in prepared && typeof prepared.run === "function") {
    prepared.run();
  }
}

export function ensureInterviewSessionsSchema(): void {
  if (interviewSessionsSchemaEnsured) return;

  try {
    tryExec("ALTER TABLE interview_sessions ADD COLUMN category TEXT");
  } catch (error) {
    const message = (error as Error).message.toLowerCase();
    if (!message.includes("duplicate column")) throw error;
  }

  try {
    const pragmaStmt = db.prepare("PRAGMA table_info(interview_sessions)") as {
      all?: () => TableInfoRow[];
    };
    if (typeof pragmaStmt.all !== "function") {
      interviewSessionsSchemaEnsured = true;
      return;
    }
    const rows = pragmaStmt.all();
    const jobIdColumn = rows?.find((row) => row.name === "job_id");

    if (jobIdColumn?.notnull) {
      tryExec("BEGIN");
      try {
        tryExec(`
          CREATE TABLE interview_sessions_new (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL DEFAULT 'default',
            job_id TEXT,
            category TEXT,
            profile_id TEXT NOT NULL,
            mode TEXT DEFAULT 'text',
            questions_json TEXT NOT NULL,
            status TEXT DEFAULT 'in_progress',
            started_at TEXT DEFAULT CURRENT_TIMESTAMP,
            completed_at TEXT
          )
        `);
        tryExec(`
          INSERT INTO interview_sessions_new (
            id, user_id, job_id, category, profile_id, mode, questions_json, status, started_at, completed_at
          )
          SELECT id, user_id, job_id, category, profile_id, mode, questions_json, status, started_at, completed_at
          FROM interview_sessions
        `);
        tryExec("DROP TABLE interview_sessions");
        tryExec(
          "ALTER TABLE interview_sessions_new RENAME TO interview_sessions",
        );
        tryExec("COMMIT");
      } catch (error) {
        tryExec("ROLLBACK");
        throw error;
      }
    }
  } catch (error) {
    const message = (error as Error).message.toLowerCase();
    if (
      !message.includes("no such table") &&
      !message.includes("no such column")
    ) {
      throw error;
    }
  }

  interviewSessionsSchemaEnsured = true;
}

function rowJobId(value: string | null | undefined): string | null {
  return value || null;
}

// Create a new interview session
export function createInterviewSession(
  jobId: string | null,
  questions: InterviewQuestion[],
  mode: SessionMode = "text",
  userId: string = "default",
  category?: SessionQuestionCategory | null,
): InterviewSession {
  ensureInterviewSessionsSchema();
  const id = generateId();
  const now = nowIso();

  const stmt = jobId
    ? db.prepare(`
        INSERT INTO interview_sessions (id, user_id, job_id, category, profile_id, mode, questions_json, status, started_at)
        SELECT ?, ?, ?, ?, ?, ?, ?, 'in_progress', ?
        WHERE EXISTS (SELECT 1 FROM jobs WHERE id = ? AND user_id = ?)
      `)
    : db.prepare(`
        INSERT INTO interview_sessions (id, user_id, job_id, category, profile_id, mode, questions_json, status, started_at)
        VALUES (?, ?, NULL, ?, ?, ?, ?, 'in_progress', ?)
      `);

  const result = jobId
    ? (stmt.run(
        id,
        userId,
        jobId,
        category || null,
        userId,
        mode,
        JSON.stringify(questions),
        now,
        jobId,
        userId,
      ) as { changes?: number } | undefined)
    : (stmt.run(
        id,
        userId,
        category || null,
        userId,
        mode,
        JSON.stringify(questions),
        now,
      ) as { changes?: number } | undefined);

  if (result?.changes === 0) {
    throw new Error("Job not found");
  }

  return {
    id,
    jobId,
    profileId: userId,
    mode,
    category: category || null,
    questions,
    status: "in_progress",
    startedAt: now,
  };
}

// Get interview session by ID
export function getInterviewSession(
  id: string,
  userId: string = "default",
): InterviewSessionWithAnswers | null {
  ensureInterviewSessionsSchema();
  const sessionStmt = db.prepare(`
    SELECT id, job_id, category, profile_id, mode, questions_json, status, started_at, completed_at
    FROM interview_sessions
    WHERE id = ? AND user_id = ?
  `);

  const row = sessionStmt.get(id, userId) as
    | {
        id: string;
        job_id: string | null;
        category: SessionQuestionCategory | null;
        profile_id: string;
        mode: string;
        questions_json: string;
        status: string;
        started_at: string;
        completed_at: string | null;
      }
    | undefined;

  if (!row) return null;

  const answersStmt = db.prepare(`
    SELECT id, session_id, question_index, answer, feedback, created_at
    FROM interview_answers
    WHERE session_id = ? AND user_id = ?
    ORDER BY question_index
  `);

  const answerRows = answersStmt.all(id, userId) as Array<{
    id: string;
    session_id: string;
    question_index: number;
    answer: string;
    feedback: string | null;
    created_at: string;
  }>;

  return {
    id: row.id,
    jobId: rowJobId(row.job_id),
    profileId: row.profile_id,
    mode: row.mode as SessionMode,
    category: row.category || null,
    questions: JSON.parse(row.questions_json),
    status: row.status as "in_progress" | "completed",
    startedAt: row.started_at,
    completedAt: row.completed_at || undefined,
    answers: answerRows.map((a) => ({
      id: a.id,
      sessionId: a.session_id,
      questionIndex: a.question_index,
      answer: a.answer,
      feedback: a.feedback || undefined,
      createdAt: a.created_at,
    })),
  };
}

// Get all interview sessions (optionally filter by job)
export function getInterviewSessions(
  jobId?: string,
  userId: string = "default",
): InterviewSession[] {
  ensureInterviewSessionsSchema();
  let query = `
    SELECT id, job_id, category, profile_id, mode, questions_json, status, started_at, completed_at
    FROM interview_sessions
  `;
  const params: string[] = [userId];

  query += " WHERE user_id = ?";

  if (jobId) {
    query += " AND job_id = ?";
    params.push(jobId);
  }

  query += " ORDER BY started_at DESC";

  const stmt = db.prepare(query);
  const rows = stmt.all(...params) as Array<{
    id: string;
    job_id: string | null;
    category: SessionQuestionCategory | null;
    profile_id: string;
    mode: string;
    questions_json: string;
    status: string;
    started_at: string;
    completed_at: string | null;
  }>;

  return rows.map((row) => ({
    id: row.id,
    jobId: rowJobId(row.job_id),
    profileId: row.profile_id,
    mode: row.mode as SessionMode,
    category: row.category || null,
    questions: JSON.parse(row.questions_json),
    status: row.status as "in_progress" | "completed",
    startedAt: row.started_at,
    completedAt: row.completed_at || undefined,
  }));
}

// Add an answer to an interview session
export function addInterviewAnswer(
  sessionId: string,
  questionIndex: number,
  answer: string,
  feedback?: string,
  userId: string = "default",
): InterviewAnswer {
  ensureInterviewSessionsSchema();
  const id = generateId();
  const now = nowIso();

  const stmt = db.prepare(`
    INSERT INTO interview_answers (id, user_id, session_id, question_index, answer, feedback, created_at)
    SELECT ?, ?, ?, ?, ?, ?, ?
    WHERE EXISTS (
      SELECT 1 FROM interview_sessions
      WHERE id = ? AND user_id = ?
    )
  `);

  const result = stmt.run(
    id,
    userId,
    sessionId,
    questionIndex,
    answer,
    feedback || null,
    now,
    sessionId,
    userId,
  ) as { changes?: number } | undefined;

  if (result?.changes === 0) {
    throw new Error("Session not found");
  }

  return {
    id,
    sessionId,
    questionIndex,
    answer,
    feedback,
    createdAt: now,
  };
}

// Complete an interview session
export function completeInterviewSession(
  sessionId: string,
  userId: string = "default",
): void {
  ensureInterviewSessionsSchema();
  const now = nowIso();

  const stmt = db.prepare(`
    UPDATE interview_sessions
    SET status = 'completed', completed_at = ?
    WHERE id = ? AND user_id = ?
  `);

  stmt.run(now, sessionId, userId);
}

// Delete an interview session (cascades to answers)
export function deleteInterviewSession(
  id: string,
  userId: string = "default",
): void {
  ensureInterviewSessionsSchema();
  const session = db
    .prepare("SELECT id FROM interview_sessions WHERE id = ? AND user_id = ?")
    .get(id, userId) as { id: string } | undefined;

  if (!session) {
    return;
  }

  const deleteAnswers = db.prepare(
    "DELETE FROM interview_answers WHERE session_id = ? AND user_id = ?",
  );
  deleteAnswers.run(id, userId);

  const deleteSession = db.prepare(
    "DELETE FROM interview_sessions WHERE id = ? AND user_id = ?",
  );
  deleteSession.run(id, userId);
}

// Get recent interview sessions for dashboard
export function getRecentInterviewSessions(
  limit: number = 5,
  userId: string = "default",
): InterviewSession[] {
  ensureInterviewSessionsSchema();
  const stmt = db.prepare(`
    SELECT id, job_id, category, profile_id, mode, questions_json, status, started_at, completed_at
    FROM interview_sessions
    WHERE user_id = ?
    ORDER BY started_at DESC
    LIMIT ?
  `);

  const rows = stmt.all(userId, limit) as Array<{
    id: string;
    job_id: string | null;
    category: SessionQuestionCategory | null;
    profile_id: string;
    mode: string;
    questions_json: string;
    status: string;
    started_at: string;
    completed_at: string | null;
  }>;

  return rows.map((row) => ({
    id: row.id,
    jobId: rowJobId(row.job_id),
    profileId: row.profile_id,
    mode: row.mode as SessionMode,
    category: row.category || null,
    questions: JSON.parse(row.questions_json),
    status: row.status as "in_progress" | "completed",
    startedAt: row.started_at,
    completedAt: row.completed_at || undefined,
  }));
}
