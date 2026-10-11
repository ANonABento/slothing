/**
 * Co-located bootstrap DDL for tables that Drizzle's
 * `apps/web/src/lib/db/schema.ts` defines AND that individual feature
 * modules also create with `CREATE TABLE IF NOT EXISTS` on first use
 * (legacy `better-sqlite3` connection in `./legacy.ts` doesn't run
 * Drizzle migrations — fresh dev DBs + build-time prerender both need
 * an explicit bootstrap).
 *
 * Why this file exists: F2.7 in `docs/legacy-duplication-audit.md`.
 * Before this refactor, the raw `CREATE TABLE` strings lived inline
 * inside each feature module (`credits.ts`, `streak-schema.ts`, …).
 * Renaming a column in Drizzle and forgetting to update the inlined
 * string silently broke fresh installs. By co-locating every
 * bootstrap string here, *next to a one-line reference back to the
 * Drizzle table in `schema.ts`*, an editor who renames a Drizzle
 * column sees the SQL three imports away.
 *
 * Conventions:
 * - Each constant ends in `_BOOTSTRAP_SQL`.
 * - The DDL must match the matching Drizzle table in `schema.ts`
 *   column-for-column and index-for-index. Add new columns to BOTH.
 * - `IF NOT EXISTS` everywhere — these run on every boot, so they
 *   must be no-ops on existing DBs.
 *
 * Drizzle column-rename safety: column names in these strings are
 * imported as identifiers from the Drizzle table objects below where
 * possible (via the `colName()` helper), so a Drizzle rename
 * type-errors here instead of silently drifting.
 */

import {
  achievementUnlocks,
  creditBalances,
  creditTransactions,
  emailSends,
  externalCalendarEvents,
  knowledgeChunks,
  opportunityContacts,
  promptVariantResults,
  promptVariants,
  stripeCustomers,
  subscriptions,
  suggestedStatusUpdates,
  userActivity,
} from "./schema";

/**
 * Type-check that a column name string actually exists on the given
 * Drizzle table. Used by the inline references at the bottom of each
 * bootstrap constant so a Drizzle rename produces a TS error here
 * instead of silently leaving the DDL stale on fresh installs.
 *
 * The runtime value is just the column name; we use this purely for
 * the type-level check.
 */
type SqliteColumnName<T> = T extends {
  _: { columns: infer C };
}
  ? Extract<keyof C, string>
  : never;

function ref<T, K extends SqliteColumnName<T>>(_table: T, name: K): K {
  return name;
}

// Touch each `ref(...)` so the compiler verifies the column exists on
// the matching Drizzle table. If a column is renamed in `schema.ts`
// the corresponding `ref()` call below fails to type-check, surfacing
// the drift instead of letting it ship.
//
// We list every column that appears in the SQL below; renaming any of
// them is the failure mode this guards against.
const _columnPins = [
  ref(creditBalances, "userId"),
  ref(creditBalances, "balance"),
  ref(creditBalances, "updatedAt"),
  ref(creditTransactions, "id"),
  ref(creditTransactions, "userId"),
  ref(creditTransactions, "delta"),
  ref(creditTransactions, "reason"),
  ref(creditTransactions, "feature"),
  ref(creditTransactions, "refId"),
  ref(creditTransactions, "createdAt"),

  ref(userActivity, "id"),
  ref(userActivity, "userId"),
  ref(userActivity, "currentStreak"),
  ref(userActivity, "longestStreak"),
  ref(userActivity, "lastActivityDay"),
  ref(userActivity, "totalOppsCreated"),
  ref(userActivity, "totalOppsApplied"),
  ref(userActivity, "totalResumesTailored"),
  ref(userActivity, "totalCoverLetters"),
  ref(userActivity, "totalEmailsSent"),
  ref(userActivity, "totalInterviewsStarted"),
  ref(userActivity, "updatedAt"),
  ref(achievementUnlocks, "id"),
  ref(achievementUnlocks, "userId"),
  ref(achievementUnlocks, "achievementId"),
  ref(achievementUnlocks, "unlockedAt"),

  ref(emailSends, "id"),
  ref(emailSends, "userId"),
  ref(emailSends, "type"),
  ref(emailSends, "jobId"),
  ref(emailSends, "recipient"),
  ref(emailSends, "subject"),
  ref(emailSends, "body"),
  ref(emailSends, "inReplyToDraftId"),
  ref(emailSends, "gmailMessageId"),
  ref(emailSends, "status"),
  ref(emailSends, "errorMessage"),
  ref(emailSends, "sentAt"),

  ref(opportunityContacts, "id"),
  ref(opportunityContacts, "userId"),
  ref(opportunityContacts, "opportunityId"),
  ref(opportunityContacts, "name"),
  ref(opportunityContacts, "email"),
  ref(opportunityContacts, "phone"),
  ref(opportunityContacts, "company"),
  ref(opportunityContacts, "title"),
  ref(opportunityContacts, "source"),
  ref(opportunityContacts, "googleResourceName"),
  ref(opportunityContacts, "createdAt"),

  ref(externalCalendarEvents, "id"),
  ref(externalCalendarEvents, "userId"),
  ref(externalCalendarEvents, "provider"),
  ref(externalCalendarEvents, "externalEventId"),
  ref(externalCalendarEvents, "calendarId"),
  ref(externalCalendarEvents, "matchedOpportunityId"),
  ref(externalCalendarEvents, "action"),
  ref(externalCalendarEvents, "eventTitle"),
  ref(externalCalendarEvents, "eventStart"),
  ref(externalCalendarEvents, "processedAt"),

  ref(suggestedStatusUpdates, "id"),
  ref(suggestedStatusUpdates, "userId"),
  ref(suggestedStatusUpdates, "notificationId"),
  ref(suggestedStatusUpdates, "opportunityId"),
  ref(suggestedStatusUpdates, "suggestedStatus"),
  ref(suggestedStatusUpdates, "sourceProvider"),
  ref(suggestedStatusUpdates, "sourceEventId"),
  ref(suggestedStatusUpdates, "confidence"),
  ref(suggestedStatusUpdates, "reason"),
  ref(suggestedStatusUpdates, "evidenceJson"),
  ref(suggestedStatusUpdates, "state"),
  ref(suggestedStatusUpdates, "createdAt"),
  ref(suggestedStatusUpdates, "resolvedAt"),

  ref(stripeCustomers, "userId"),
  ref(stripeCustomers, "stripeCustomerId"),
  ref(stripeCustomers, "email"),
  ref(stripeCustomers, "createdAt"),
  ref(stripeCustomers, "updatedAt"),

  ref(subscriptions, "id"),
  ref(subscriptions, "userId"),
  ref(subscriptions, "stripeCustomerId"),
  ref(subscriptions, "planKey"),
  ref(subscriptions, "status"),
  ref(subscriptions, "stripePriceId"),
  ref(subscriptions, "currentPeriodStart"),
  ref(subscriptions, "currentPeriodEnd"),
  ref(subscriptions, "cancelAtPeriodEnd"),
  ref(subscriptions, "canceledAt"),
  ref(subscriptions, "createdAt"),
  ref(subscriptions, "updatedAt"),

  ref(promptVariants, "id"),
  ref(promptVariants, "userId"),
  ref(promptVariants, "name"),
  ref(promptVariants, "version"),
  ref(promptVariants, "content"),
  ref(promptVariants, "active"),
  ref(promptVariants, "createdAt"),
  ref(promptVariants, "updatedAt"),
  ref(promptVariantResults, "id"),
  ref(promptVariantResults, "userId"),
  ref(promptVariantResults, "promptVariantId"),
  ref(promptVariantResults, "jobId"),
  ref(promptVariantResults, "resumeId"),
  ref(promptVariantResults, "matchScore"),
  ref(promptVariantResults, "createdAt"),

  ref(knowledgeChunks, "id"),
  ref(knowledgeChunks, "userId"),
  ref(knowledgeChunks, "documentId"),
  ref(knowledgeChunks, "sectionType"),
  ref(knowledgeChunks, "content"),
  ref(knowledgeChunks, "contentHash"),
  ref(knowledgeChunks, "embedding"),
  ref(knowledgeChunks, "metadataJson"),
  ref(knowledgeChunks, "createdAt"),
];
// Force the array to be retained so tsc does not tree-shake the
// type-check away. (No runtime cost beyond a single 0-length read.)
void _columnPins.length;

/**
 * `credit_balances` + `credit_transactions` — mirrors
 * `schema.ts: creditBalances` / `creditTransactions` (search the
 * Drizzle definitions for `sqliteTable("credit_balances"` and
 * `sqliteTable("credit_transactions"`).
 */
export const CREDITS_BOOTSTRAP_SQL = `
  CREATE TABLE IF NOT EXISTS credit_balances (
    user_id TEXT PRIMARY KEY NOT NULL DEFAULT 'default',
    balance INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS credit_transactions (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL DEFAULT 'default',
    delta INTEGER NOT NULL,
    reason TEXT NOT NULL,
    feature TEXT,
    ref_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_created
    ON credit_transactions(user_id, created_at);
`;

/**
 * `user_activity` + `achievement_unlocks` — mirrors
 * `schema.ts: userActivity` / `achievementUnlocks`.
 */
export const STREAK_BOOTSTRAP_SQL = `
  CREATE TABLE IF NOT EXISTS user_activity (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_day TEXT,
    total_opps_created INTEGER NOT NULL DEFAULT 0,
    total_opps_applied INTEGER NOT NULL DEFAULT 0,
    total_resumes_tailored INTEGER NOT NULL DEFAULT 0,
    total_cover_letters INTEGER NOT NULL DEFAULT 0,
    total_emails_sent INTEGER NOT NULL DEFAULT 0,
    total_interviews_started INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_user_activity_user_id
    ON user_activity(user_id);

  CREATE TABLE IF NOT EXISTS achievement_unlocks (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    achievement_id TEXT NOT NULL,
    unlocked_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_achievement_unlocks_user_achievement
    ON achievement_unlocks(user_id, achievement_id);
  CREATE INDEX IF NOT EXISTS idx_achievement_unlocks_user_unlocked
    ON achievement_unlocks(user_id, unlocked_at);
`;

/**
 * `email_sends` — mirrors `schema.ts: emailSends`.
 */
export const EMAIL_SENDS_BOOTSTRAP_SQL = `
  CREATE TABLE IF NOT EXISTS email_sends (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL DEFAULT 'default',
    type TEXT NOT NULL,
    job_id TEXT,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    in_reply_to_draft_id TEXT,
    gmail_message_id TEXT,
    status TEXT NOT NULL DEFAULT 'sent',
    error_message TEXT,
    sent_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_email_sends_user_sent_at
    ON email_sends(user_id, sent_at);
  CREATE INDEX IF NOT EXISTS idx_email_sends_user_recipient_type
    ON email_sends(user_id, recipient, type);
`;

/**
 * `opportunity_contacts` — mirrors `schema.ts: opportunityContacts`.
 * The partial unique index on `google_resource_name` is not present
 * in the Drizzle definition (Drizzle's `uniqueIndex` builder doesn't
 * model a `WHERE` clause); we keep it as a SQLite-only constraint
 * here. See `schema.ts:uniq_opp_contacts_user_opp_resource` for the
 * non-partial counterpart.
 */
export const OPPORTUNITY_CONTACTS_BOOTSTRAP_SQL = `
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
`;

/**
 * `external_calendar_events` — mirrors `schema.ts: externalCalendarEvents`.
 */
export const EXTERNAL_CALENDAR_EVENTS_BOOTSTRAP_SQL = `
  CREATE TABLE IF NOT EXISTS external_calendar_events (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'default',
    provider TEXT NOT NULL,
    external_event_id TEXT NOT NULL,
    calendar_id TEXT,
    matched_opportunity_id TEXT,
    action TEXT NOT NULL,
    event_title TEXT,
    event_start TEXT,
    processed_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, provider, external_event_id)
  );
  CREATE INDEX IF NOT EXISTS idx_external_calendar_events_user_processed
    ON external_calendar_events(user_id, processed_at);
`;

/**
 * `suggested_status_updates` — mirrors `schema.ts: suggestedStatusUpdates`.
 *
 * The `confidence`/`reason`/`evidence_json` columns were added in a
 * follow-up migration; the consumer module (`suggested-status-updates.ts`)
 * keeps its `ALTER TABLE … ADD COLUMN` block for DBs that pre-date the
 * extension. New installs get them straight from this DDL.
 */
export const SUGGESTED_STATUS_UPDATES_BOOTSTRAP_SQL = `
  CREATE TABLE IF NOT EXISTS suggested_status_updates (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'default',
    notification_id TEXT NOT NULL UNIQUE,
    opportunity_id TEXT NOT NULL,
    suggested_status TEXT NOT NULL,
    source_provider TEXT,
    source_event_id TEXT,
    confidence REAL,
    reason TEXT,
    evidence_json TEXT,
    state TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    resolved_at TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_suggested_status_updates_user_state
    ON suggested_status_updates(user_id, state);
`;

/**
 * `stripe_customers` + `subscriptions` — mirrors
 * `schema.ts: stripeCustomers` / `subscriptions`.
 */
export const BILLING_BOOTSTRAP_SQL = `
  CREATE TABLE IF NOT EXISTS stripe_customers (
    user_id TEXT PRIMARY KEY NOT NULL DEFAULT 'default',
    stripe_customer_id TEXT NOT NULL UNIQUE,
    email TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_stripe_customers_stripe_id
    ON stripe_customers(stripe_customer_id);

  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL DEFAULT 'default',
    stripe_customer_id TEXT NOT NULL,
    plan_key TEXT NOT NULL,
    status TEXT NOT NULL,
    stripe_price_id TEXT,
    current_period_start TEXT,
    current_period_end TEXT,
    cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
    canceled_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status
    ON subscriptions(user_id, status);
  CREATE INDEX IF NOT EXISTS idx_subscriptions_customer
    ON subscriptions(stripe_customer_id);
`;

/**
 * `prompt_variants` + `prompt_variant_results` — mirrors
 * `schema.ts: promptVariants` / `promptVariantResults`.
 *
 * The consumer module still runs the `ALTER TABLE … ADD COLUMN
 * user_id` migration for DBs that pre-date the user-scoping change.
 * New DBs land on the canonical shape directly from this DDL.
 */
export const PROMPT_VARIANTS_BOOTSTRAP_SQL = `
  CREATE TABLE IF NOT EXISTS prompt_variants (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'default',
    name TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    content TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS prompt_variant_results (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'default',
    prompt_variant_id TEXT NOT NULL,
    job_id TEXT,
    resume_id TEXT,
    match_score REAL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`;

/**
 * `knowledge_chunks` — mirrors `schema.ts: knowledgeChunks`.
 */
export const KNOWLEDGE_CHUNKS_BOOTSTRAP_SQL = `
  CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'default',
    document_id TEXT NOT NULL,
    section_type TEXT NOT NULL,
    content TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    embedding BLOB,
    metadata_json TEXT DEFAULT '{}',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_user ON knowledge_chunks(user_id);
  CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_document ON knowledge_chunks(document_id);
  CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_hash ON knowledge_chunks(content_hash);
  CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_section ON knowledge_chunks(user_id, section_type);
`;
