import type Database from "libsql";

import { EMAIL_SENDS_BOOTSTRAP_SQL } from "./bootstrap-sql";

let ensured = false;

export function ensureEmailSendsSchema(db: Database.Database): void {
  if (ensured) return;

  // DDL co-located with `schema.ts: emailSends`. See `bootstrap-sql.ts`.
  db.exec(EMAIL_SENDS_BOOTSTRAP_SQL);

  ensured = true;
}
