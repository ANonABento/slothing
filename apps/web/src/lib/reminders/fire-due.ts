import db from "@/lib/db/legacy";
import { createReminderNotification } from "@/lib/db/notifications";
import { nowIso } from "@/lib/format/time";
import { sendReminderEmail } from "./send-email";

let remindersFiringSchemaEnsured = false;

interface DueReminderRow {
  id: string;
  user_id: string;
  job_id: string;
  title: string;
  due_date: string;
  notify_by_email: number | boolean | null;
  job_title: string | null;
  job_company: string | null;
  user_email: string | null;
}

export interface FiredReminderResult {
  id: string;
  fired: boolean;
  notificationCreated: boolean;
  emailSent: boolean;
  emailSkipped: boolean;
  error?: string;
}

export interface FireDueRemindersResult {
  fired: number;
  errors: number;
  results: FiredReminderResult[];
}

export function ensureRemindersFiringSchema(): void {
  if (remindersFiringSchemaEnsured) return;

  const columns = db.prepare("PRAGMA table_info(reminders)").all() as Array<{
    name: string;
  }>;
  const columnNames = new Set(columns.map((column) => column.name));

  if (!columnNames.has("fired_at")) {
    db.prepare("ALTER TABLE reminders ADD COLUMN fired_at TEXT").run();
  }
  if (!columnNames.has("notify_by_email")) {
    db.prepare(
      "ALTER TABLE reminders ADD COLUMN notify_by_email INTEGER NOT NULL DEFAULT 0",
    ).run();
  }

  db.prepare(
    "CREATE INDEX IF NOT EXISTS idx_reminders_due_unfired ON reminders(due_date, fired_at)",
  ).run();
  remindersFiringSchemaEnsured = true;
}

export function resetRemindersFiringSchemaForTest(): void {
  remindersFiringSchemaEnsured = false;
}

export async function fireDueReminders(
  now: string = nowIso(),
): Promise<FireDueRemindersResult> {
  ensureRemindersFiringSchema();

  const dueReminders = db
    .prepare(
      `
        SELECT r.id, r.user_id, r.job_id, r.title, r.due_date, r.notify_by_email,
               j.title AS job_title, j.company AS job_company,
               u.email AS user_email
        FROM reminders r
        LEFT JOIN jobs j ON r.job_id = j.id
        LEFT JOIN user u ON r.user_id = u.id
        WHERE r.due_date <= ?
          AND r.fired_at IS NULL
          AND r.completed = 0
          AND r.dismissed = 0
        ORDER BY r.due_date ASC
        LIMIT 500
      `,
    )
    .all(now) as DueReminderRow[];

  const results: FiredReminderResult[] = [];
  let fired = 0;
  let errors = 0;

  for (const reminder of dueReminders) {
    const result = await fireReminder(reminder, now);
    results.push(result);

    if (result.fired) fired += 1;
    if (result.error) errors += 1;
  }

  return { fired, errors, results };
}

async function fireReminder(
  reminder: DueReminderRow,
  firedAt: string,
): Promise<FiredReminderResult> {
  const claim = db
    .prepare(
      "UPDATE reminders SET fired_at = ? WHERE id = ? AND fired_at IS NULL",
    )
    .run(firedAt, reminder.id) as { changes: number };

  if (claim.changes === 0) {
    return {
      id: reminder.id,
      fired: false,
      notificationCreated: false,
      emailSent: false,
      emailSkipped: true,
    };
  }

  try {
    createReminderNotification(
      reminder.title,
      reminder.job_title || "your application",
      false,
      reminder.job_id,
      reminder.user_id,
    );
  } catch (error) {
    db.prepare("UPDATE reminders SET fired_at = NULL WHERE id = ?").run(
      reminder.id,
    );
    return {
      id: reminder.id,
      fired: false,
      notificationCreated: false,
      emailSent: false,
      emailSkipped: true,
      error: error instanceof Error ? error.message : "Notification failed",
    };
  }

  const wantsEmail =
    reminder.notify_by_email === 1 || reminder.notify_by_email === true;
  if (wantsEmail && reminder.user_email) {
    const emailResult = await sendReminderEmail({
      to: reminder.user_email,
      reminderTitle: reminder.title,
      jobTitle: reminder.job_title,
      jobCompany: reminder.job_company,
      jobId: reminder.job_id,
      dueDate: reminder.due_date,
    });

    if (!emailResult.ok) {
      return {
        id: reminder.id,
        fired: true,
        notificationCreated: true,
        emailSent: false,
        emailSkipped: false,
        error: emailResult.error,
      };
    }

    return {
      id: reminder.id,
      fired: true,
      notificationCreated: true,
      emailSent: !emailResult.skipped,
      emailSkipped: Boolean(emailResult.skipped),
    };
  }

  return {
    id: reminder.id,
    fired: true,
    notificationCreated: true,
    emailSent: false,
    emailSkipped: true,
  };
}
