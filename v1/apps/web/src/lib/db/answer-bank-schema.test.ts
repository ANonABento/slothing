import Database from "libsql";
import { beforeEach, describe, expect, it } from "vitest";
import {
  ensureAnswerBankSchema,
  resetAnswerBankSchemaEnsureForTests,
} from "./answer-bank-schema";

describe("ensureAnswerBankSchema", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = new Database(":memory:");
    resetAnswerBankSchemaEnsureForTests();
  });

  it("renames legacy answer tables and backfills extension source", async () => {
    db.exec(`
      CREATE TABLE learned_answers (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL DEFAULT 'default',
        question TEXT NOT NULL,
        question_normalized TEXT NOT NULL,
        answer TEXT NOT NULL,
        source_url TEXT,
        source_company TEXT,
        times_used INTEGER DEFAULT 1,
        last_used_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE learned_answer_versions (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL DEFAULT 'default',
        answer_id TEXT NOT NULL,
        version INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        source_url TEXT,
        source_company TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX idx_learned_answers_user ON learned_answers(user_id);
      INSERT INTO learned_answers (
        id, user_id, question, question_normalized, answer, source_url
      ) VALUES ('a1', 'default', 'Q', 'q', 'A', 'https://example.com');
    `);

    await ensureAnswerBankSchema(db);
    resetAnswerBankSchemaEnsureForTests();
    await ensureAnswerBankSchema(db);

    expect(
      db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
        )
        .get("answer_bank"),
    ).toBeTruthy();
    expect(
      db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
        )
        .get("learned_answers"),
    ).toBeUndefined();
    expect(
      db.prepare("SELECT source FROM answer_bank WHERE id = ?").get("a1"),
    ).toMatchObject({
      source: "extension",
    });
  });

  it("adds source to an existing answer_bank table", async () => {
    db.exec(`
      CREATE TABLE answer_bank (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL DEFAULT 'default',
        question TEXT NOT NULL,
        question_normalized TEXT NOT NULL,
        answer TEXT NOT NULL,
        source_url TEXT,
        source_company TEXT,
        times_used INTEGER DEFAULT 1,
        last_used_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
      INSERT INTO answer_bank (
        id, user_id, question, question_normalized, answer
      ) VALUES ('a1', 'default', 'Q', 'q', 'A');
    `);

    await ensureAnswerBankSchema(db);

    expect(
      db.prepare("SELECT source FROM answer_bank WHERE id = ?").get("a1"),
    ).toMatchObject({
      source: "manual",
    });
  });
});
