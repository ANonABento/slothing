import { getClient } from "@/lib/db/client";
import { nowIso } from "@/lib/format/time";
import { sendReminderEmail } from "./send-email";
import { generateId } from "@/lib/utils";

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

export async function ensureRemindersFiringSchema(): Promise<void> {
  if (remindersFiringSchemaEnsured) return;

  const columnsResult = await getClient().execute(
    "PRAGMA table_info(reminders)",
  );
  const columns = columnsResult.rows as unknown as Array<{ name: string }>;
  const columnNames = new Set(columns.map((column) => column.name));

  if (!columnNames.has("fired_at")) {
    await getClient().execute("ALTER TABLE reminders ADD COLUMN fired_at TEXT");
  }
  if (!columnNames.has("notify_by_email")) {
    await getClient().execute(
      "ALTER TABLE reminders ADD COLUMN notify_by_email INTEGER NOT NULL DEFAULT 0",
    );
  }

  await getClient().execute(
    "CREATE INDEX IF NOT EXISTS idx_reminders_due_unfired ON reminders(due_date, fired_at)",
  );
  // The user-facing reminder list + dashboard counts filter by user and order
  // by due_date; without this they full-scan the table on every load.
  await getClient().execute(
    "CREATE INDEX IF NOT EXISTS idx_reminders_user_due ON reminders(user_id, due_date)",
  );
  remindersFiringSchemaEnsured = true;
}

export function resetRemindersFiringSchemaForTest(): void {
  remindersFiringSchemaEnsured = false;
}

export async function fireDueReminders(
  now: string = nowIso(),
): Promise<FireDueRemindersResult> {
  await ensureRemindersFiringSchema();

  const dueResult = await getClient().execute({
    sql: `
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
    args: [now],
  });
  const dueReminders = dueResult.rows as unknown as DueReminderRow[];

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
  const claim = await getClient().execute({
    sql: "UPDATE reminders SET fired_at = ? WHERE id = ? AND fired_at IS NULL",
    args: [firedAt, reminder.id],
  });

  if (claim.rowsAffected === 0) {
    return {
      id: reminder.id,
      fired: false,
      notificationCreated: false,
      emailSent: false,
      emailSkipped: true,
    };
  }

  try {
    await createReminderNotificationAsync(
      reminder.title,
      reminder.job_title || "your application",
      false,
      reminder.job_id,
      reminder.user_id,
    );
  } catch (error) {
    await getClient().execute({
      sql: "UPDATE reminders SET fired_at = NULL WHERE id = ?",
      args: [reminder.id],
    });
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

async function createReminderNotificationAsync(
  reminderTitle: string,
  jobTitle: string,
  isOverdue: boolean,
  jobId: string,
  userId: string,
): Promise<void> {
  await getClient().execute({
    sql: `
      INSERT INTO notifications (id, type, title, message, link, created_at, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      generateId(),
      isOverdue ? "reminder_overdue" : "reminder_due",
      isOverdue ? "Overdue Reminder" : "Reminder Due",
      `${reminderTitle} for ${jobTitle}`,
      `/opportunities?id=${jobId}`,
      nowIso(),
      userId,
    ],
  });
}
