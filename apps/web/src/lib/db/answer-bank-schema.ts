type StatementResult = Record<string, unknown> | undefined;

interface SchemaStatement {
  get(...params: unknown[]): unknown | Promise<unknown>;
}

interface SchemaDatabase {
  exec(sql: string): unknown | Promise<unknown>;
  prepare(sql: string): SchemaStatement;
}

let ensured = false;

async function getOptional(
  db: SchemaDatabase,
  sql: string,
  ...params: unknown[]
): Promise<StatementResult> {
  return (await db.prepare(sql).get(...params)) as StatementResult;
}

async function tableExists(
  db: SchemaDatabase,
  tableName: string,
): Promise<boolean> {
  const row = await getOptional(
    db,
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
    tableName,
  );
  return Boolean(row);
}

async function columnExists(
  db: SchemaDatabase,
  tableName: string,
  columnName: string,
): Promise<boolean> {
  const row = await getOptional(
    db,
    `SELECT name FROM pragma_table_info('${tableName}') WHERE name = ?`,
    columnName,
  );
  return Boolean(row);
}

export async function ensureAnswerBankSchema(
  db: SchemaDatabase,
): Promise<void> {
  if (ensured) return;

  const hasAnswerBank = await tableExists(db, "answer_bank");
  const hasLegacyAnswers = await tableExists(db, "learned_answers");
  if (!hasAnswerBank && hasLegacyAnswers) {
    await db.exec("ALTER TABLE learned_answers RENAME TO answer_bank;");
  }

  const hasAnswerBankVersions = await tableExists(db, "answer_bank_versions");
  const hasLegacyVersions = await tableExists(db, "learned_answer_versions");
  if (!hasAnswerBankVersions && hasLegacyVersions) {
    await db.exec(
      "ALTER TABLE learned_answer_versions RENAME TO answer_bank_versions;",
    );
  }

  if (await tableExists(db, "answer_bank")) {
    if (!(await columnExists(db, "answer_bank", "source"))) {
      await db.exec(
        "ALTER TABLE answer_bank ADD COLUMN source TEXT NOT NULL DEFAULT 'manual';",
      );
    }

    await db.exec(`
      UPDATE answer_bank
      SET source = 'extension'
      WHERE source = 'manual'
        AND (source_url IS NOT NULL OR source_company IS NOT NULL);

      DROP INDEX IF EXISTS idx_learned_answers_normalized;
      DROP INDEX IF EXISTS idx_learned_answers_user;
      CREATE INDEX IF NOT EXISTS idx_answer_bank_normalized
        ON answer_bank(question_normalized);
      CREATE INDEX IF NOT EXISTS idx_answer_bank_user
        ON answer_bank(user_id);
      CREATE INDEX IF NOT EXISTS idx_answer_bank_user_source
        ON answer_bank(user_id, source);
    `);
  }

  if (await tableExists(db, "answer_bank_versions")) {
    await db.exec(`
      DROP INDEX IF EXISTS idx_learned_answer_versions_answer;
      DROP INDEX IF EXISTS idx_learned_answer_versions_user;
      CREATE INDEX IF NOT EXISTS idx_answer_bank_versions_answer
        ON answer_bank_versions(answer_id, version);
      CREATE INDEX IF NOT EXISTS idx_answer_bank_versions_user
        ON answer_bank_versions(user_id);
    `);
  }

  ensured = true;
}

export function resetAnswerBankSchemaEnsureForTests(): void {
  ensured = false;
}
