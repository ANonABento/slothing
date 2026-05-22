import type Database from "libsql";
import { getClient } from "./client";

import { EMAIL_SENDS_BOOTSTRAP_SQL } from "./bootstrap-sql";

let ensured = false;

export function ensureEmailSendsSchema(db: Database.Database): void {
  if (ensured) return;

  // DDL co-located with `schema.ts: emailSends`. See `bootstrap-sql.ts`.
  db.exec(EMAIL_SENDS_BOOTSTRAP_SQL);

  ensured = true;
}

export async function ensureEmailSendsSchemaAsync(): Promise<void> {
  if (ensured) return;

  await getClient().batch(
    EMAIL_SENDS_BOOTSTRAP_SQL.split(";")
      .map((statement) => statement.trim())
      .filter(Boolean),
  );

  ensured = true;
}
