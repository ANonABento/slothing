import type Database from "libsql";

let ensured = false;

export function ensureOpportunityContactsSchema(db: Database.Database): void {
  if (ensured) return;

  db.exec(`
    CREATE TABLE IF NOT EXISTS opportunity_contacts (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL DEFAULT 'default',
      opportunity_id TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      company TEXT,
      title TEXT,
      source TEXT NOT NULL DEFAULT 'google',
      google_resource_name TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_opportunity_contacts_user_opp
      ON opportunity_contacts(user_id, opportunity_id);
    CREATE UNIQUE INDEX IF NOT EXISTS uniq_opp_contacts_user_opp_resource
      ON opportunity_contacts(user_id, opportunity_id, google_resource_name)
      WHERE google_resource_name IS NOT NULL;
  `);

  ensured = true;
}
