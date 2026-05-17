import type Database from "libsql";

import { OPPORTUNITY_CONTACTS_BOOTSTRAP_SQL } from "./bootstrap-sql";

let ensured = false;

export function ensureOpportunityContactsSchema(db: Database.Database): void {
  if (ensured) return;

  // DDL co-located with `schema.ts: opportunityContacts`. See
  // `bootstrap-sql.ts` for the partial-unique-index caveat.
  db.exec(OPPORTUNITY_CONTACTS_BOOTSTRAP_SQL);

  ensured = true;
}
