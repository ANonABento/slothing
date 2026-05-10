import type Database from "libsql";

let ensured = false;

export function ensureEmailSendsSchema(db: Database.Database): void {
  if (ensured) return;

  db.exec(`
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
  `);

  ensured = true;
}
