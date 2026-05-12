// Schema migration helper for the corrections feedback loop (#33).
//
// The base `field_mappings` table is created by the Drizzle migration in
// `apps/web/drizzle/0000_groovy_vulcan.sql` and only has the original
// site_pattern / field_selector / custom_value / enabled columns. The
// corrections loop adds `domain`, `field_signature`, `observed_value`,
// `hit_count`, and `last_seen_at` plus a uniqueness index on
// (user_id, domain, field_signature) — applied as additive ALTER TABLE
// statements via the same PRAGMA table_info pattern used by
// ensureExtensionSessionsColumns. We deliberately do NOT drop and recreate
// (per CLAUDE.md common pitfall #8): existing dev DBs would lose data.

import type Database from "libsql";

let ensured = false;

interface ColumnRow {
  name: string;
}

export function ensureFieldMappingsCorrectionColumns(
  db: Database.Database,
): void {
  if (ensured) return;

  try {
    const columns = db
      .prepare("PRAGMA table_info(field_mappings)")
      .all() as ColumnRow[];

    if (columns.length === 0) {
      // Table doesn't exist yet (fresh boot before Drizzle migrations have
      // run, or test env). Bail and let the normal CREATE TABLE path handle
      // the fresh schema, which already includes the new columns.
      ensured = true;
      return;
    }

    const names = new Set(columns.map((c) => c.name));

    if (!names.has("domain")) {
      db.prepare("ALTER TABLE field_mappings ADD COLUMN domain TEXT").run();
    }
    if (!names.has("field_signature")) {
      db.prepare(
        "ALTER TABLE field_mappings ADD COLUMN field_signature TEXT",
      ).run();
    }
    if (!names.has("observed_value")) {
      db.prepare(
        "ALTER TABLE field_mappings ADD COLUMN observed_value TEXT",
      ).run();
    }
    if (!names.has("hit_count")) {
      db.prepare(
        "ALTER TABLE field_mappings ADD COLUMN hit_count INTEGER DEFAULT 1",
      ).run();
    }
    if (!names.has("last_seen_at")) {
      db.prepare(
        "ALTER TABLE field_mappings ADD COLUMN last_seen_at TEXT",
      ).run();
    }

    // Uniqueness index for upserts. Partial — `domain` and `field_signature`
    // are nullable so legacy rows survive.
    db.prepare(
      `CREATE UNIQUE INDEX IF NOT EXISTS uniq_field_mappings_user_domain_signature
       ON field_mappings (user_id, domain, field_signature)
       WHERE domain IS NOT NULL AND field_signature IS NOT NULL`,
    ).run();

    db.prepare(
      `CREATE INDEX IF NOT EXISTS idx_field_mappings_user_domain
       ON field_mappings (user_id, domain)`,
    ).run();

    ensured = true;
  } catch {
    // First-boot environments or in-memory test DBs may not have the table
    // available yet — let the Drizzle CREATE handle the fresh schema.
  }
}

/** Test-only reset of the ensured guard so each suite starts fresh. */
export function __resetFieldMappingsSchemaCacheForTests(): void {
  ensured = false;
}
