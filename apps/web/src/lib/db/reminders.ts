import { getClient } from "./client";
import { generateId } from "@/lib/utils";
import { ensureRemindersFiringSchema } from "@/lib/reminders/fire-due";

import { nowDate, nowIso, toIso } from "@/lib/format/time";
export type ReminderType = "follow_up" | "deadline" | "interview" | "custom";

export interface Reminder {
  id: string;
  jobId: string;
  type: ReminderType;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  dismissed: boolean;
  createdAt: string;
  completedAt?: string;
  firedAt?: string;
  notifyByEmail?: boolean;
}

export interface ReminderWithJob extends Reminder {
  jobTitle?: string;
  jobCompany?: string;
}

interface ReminderWithJobRow {
  id: string;
  job_id: string;
  type: string;
  title: string;
  description: string | null;
  due_date: string;
  completed: number | boolean;
  dismissed: number | boolean;
  created_at: string;
  completed_at: string | null;
  fired_at: string | null;
  notify_by_email: number | boolean;
  job_title: string | null;
  job_company: string | null;
}

function mapReminderRow(row: ReminderWithJobRow): ReminderWithJob {
  return {
    id: row.id,
    jobId: row.job_id,
    type: row.type as ReminderType,
    title: row.title,
    description: row.description || undefined,
    dueDate: row.due_date,
    completed: Boolean(row.completed),
    dismissed: Boolean(row.dismissed),
    createdAt: row.created_at,
    completedAt: row.completed_at || undefined,
    firedAt: row.fired_at || undefined,
    notifyByEmail: Boolean(row.notify_by_email),
    jobTitle: row.job_title || undefined,
    jobCompany: row.job_company || undefined,
  };
}

async function readCount(
  sql: string,
  args: Array<string | number | null>,
): Promise<number> {
  const result = await getClient().execute({ sql, args });
  const row = result.rows[0] as unknown as { count: number } | undefined;
  return row?.count ?? 0;
}

// Create a new reminder
export async function createReminder(
  reminder: Omit<
    Reminder,
    "id" | "completed" | "dismissed" | "createdAt" | "completedAt" | "firedAt"
  >,
  userId: string,
): Promise<Reminder> {
  await ensureRemindersFiringSchema();
  const id = generateId();
  const now = nowIso();
  const jobResult = await getClient().execute({
    sql: "SELECT id FROM jobs WHERE id = ? AND user_id = ?",
    args: [reminder.jobId, userId],
  });
  const job = jobResult.rows[0] as unknown as { id: string } | undefined;

  if (!job) {
    throw new Error("Job not found");
  }

  await getClient().execute({
    sql: `
      INSERT INTO reminders (
        id, user_id, job_id, type, title, description, due_date, notify_by_email, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      userId,
      reminder.jobId,
      reminder.type,
      reminder.title,
      reminder.description || null,
      reminder.dueDate,
      reminder.notifyByEmail ? 1 : 0,
      now,
    ],
  });

  return {
    id,
    jobId: reminder.jobId,
    type: reminder.type,
    title: reminder.title,
    description: reminder.description,
    dueDate: reminder.dueDate,
    completed: false,
    dismissed: false,
    createdAt: now,
    notifyByEmail: reminder.notifyByEmail ?? false,
  };
}

// Get all reminders
export async function getReminders(options: {
  jobId?: string;
  includeCompleted?: boolean;
  includeDismissed?: boolean;
  userId: string;
}): Promise<ReminderWithJob[]> {
  const {
    jobId,
    includeCompleted = false,
    includeDismissed = false,
    userId,
  } = options || {};

  let query = `
    SELECT r.*, j.title as job_title, j.company as job_company
    FROM reminders r
    LEFT JOIN jobs j ON r.job_id = j.id
    WHERE r.user_id = ?
      AND (j.id IS NULL OR j.user_id = r.user_id)
  `;
  const params: (string | number)[] = [userId];

  if (jobId) {
    query += " AND r.job_id = ?";
    params.push(jobId);
  }

  if (!includeCompleted) {
    query += " AND r.completed = 0";
  }

  if (!includeDismissed) {
    query += " AND r.dismissed = 0";
  }

  query += " ORDER BY r.due_date ASC";

  const result = await getClient().execute({ sql: query, args: params });
  return (result.rows as unknown as ReminderWithJobRow[]).map(mapReminderRow);
}

// Get upcoming reminders (due within specified days)
export async function getUpcomingReminders(
  days: number = 7,
  userId: string,
): Promise<ReminderWithJob[]> {
  const futureDate = nowDate();
  futureDate.setDate(futureDate.getDate() + days);

  const result = await getClient().execute({
    sql: `
      SELECT r.*, j.title as job_title, j.company as job_company
      FROM reminders r
      LEFT JOIN jobs j ON r.job_id = j.id
      WHERE r.user_id = ?
        AND (j.id IS NULL OR j.user_id = r.user_id)
        AND r.completed = 0
        AND r.dismissed = 0
        AND r.due_date <= ?
      ORDER BY r.due_date ASC
    `,
    args: [userId, toIso(futureDate)],
  });

  return (result.rows as unknown as ReminderWithJobRow[]).map(mapReminderRow);
}

// Get overdue reminders
export async function getOverdueReminders(
  userId: string,
): Promise<ReminderWithJob[]> {
  const now = nowIso();

  const result = await getClient().execute({
    sql: `
      SELECT r.*, j.title as job_title, j.company as job_company
      FROM reminders r
      LEFT JOIN jobs j ON r.job_id = j.id
      WHERE r.user_id = ?
        AND (j.id IS NULL OR j.user_id = r.user_id)
        AND r.completed = 0
        AND r.dismissed = 0
        AND r.due_date < ?
      ORDER BY r.due_date ASC
    `,
    args: [userId, now],
  });

  return (result.rows as unknown as ReminderWithJobRow[]).map(mapReminderRow);
}

// Complete a reminder
export async function completeReminder(
  id: string,
  userId: string,
): Promise<void> {
  const now = nowIso();

  await getClient().execute({
    sql: `
      UPDATE reminders
      SET completed = 1, completed_at = ?
      WHERE id = ?
        AND user_id = ?
    `,
    args: [now, id, userId],
  });
}

// Dismiss a reminder
export async function dismissReminder(
  id: string,
  userId: string,
): Promise<void> {
  await getClient().execute({
    sql: `
      UPDATE reminders
      SET dismissed = 1
      WHERE id = ?
        AND user_id = ?
    `,
    args: [id, userId],
  });
}

// Delete a reminder
export async function deleteReminder(
  id: string,
  userId: string,
): Promise<void> {
  await getClient().execute({
    sql: `
      DELETE FROM reminders
      WHERE id = ?
        AND user_id = ?
    `,
    args: [id, userId],
  });
}

// Update a reminder
export async function updateReminder(
  id: string,
  updates: Partial<
    Pick<
      Reminder,
      "title" | "description" | "dueDate" | "type" | "notifyByEmail"
    >
  >,
  userId: string,
): Promise<void> {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (updates.title !== undefined) {
    fields.push("title = ?");
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    fields.push("description = ?");
    values.push(updates.description || null);
  }
  if (updates.dueDate !== undefined) {
    fields.push("due_date = ?");
    values.push(updates.dueDate);
  }
  if (updates.type !== undefined) {
    fields.push("type = ?");
    values.push(updates.type);
  }
  if (updates.notifyByEmail !== undefined) {
    fields.push("notify_by_email = ?");
    values.push(updates.notifyByEmail ? 1 : 0);
  }

  if (fields.length === 0) return;

  values.push(id, userId);

  await getClient().execute({
    sql: `
      UPDATE reminders
      SET ${fields.join(", ")}
      WHERE id = ?
        AND user_id = ?
    `,
    args: values,
  });
}

// Create follow-up reminder for a job application
export async function createFollowUpReminder(
  jobId: string,
  daysFromNow: number = 7,
  userId: string,
): Promise<Reminder> {
  const dueDate = nowDate();
  dueDate.setDate(dueDate.getDate() + daysFromNow);

  return await createReminder(
    {
      jobId,
      type: "follow_up",
      title: "Follow up on application",
      description: "Send a follow-up email to check on your application status",
      dueDate: toIso(dueDate),
    },
    userId,
  );
}

// Get reminder counts for dashboard
export async function getReminderCounts(userId: string): Promise<{
  total: number;
  overdue: number;
  upcoming: number;
  completed: number;
}> {
  const now = nowIso();
  const weekFromNow = nowDate();
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const total = await readCount(
    `
      SELECT COUNT(*) as count
      FROM reminders r
      JOIN jobs j ON r.job_id = j.id
      WHERE r.user_id = ? AND j.user_id = r.user_id AND r.completed = 0 AND r.dismissed = 0
    `,
    [userId],
  );
  const overdue = await readCount(
    `
      SELECT COUNT(*) as count
      FROM reminders r
      JOIN jobs j ON r.job_id = j.id
      WHERE r.user_id = ? AND j.user_id = r.user_id AND r.completed = 0 AND r.dismissed = 0 AND r.due_date < ?
    `,
    [userId, now],
  );
  const upcoming = await readCount(
    `
      SELECT COUNT(*) as count
      FROM reminders r
      JOIN jobs j ON r.job_id = j.id
      WHERE r.user_id = ? AND j.user_id = r.user_id AND r.completed = 0 AND r.dismissed = 0 AND r.due_date >= ? AND r.due_date <= ?
    `,
    [userId, now, toIso(weekFromNow)],
  );
  const completed = await readCount(
    `
      SELECT COUNT(*) as count
      FROM reminders r
      JOIN jobs j ON r.job_id = j.id
      WHERE r.user_id = ? AND j.user_id = r.user_id AND r.completed = 1
    `,
    [userId],
  );

  return { total, overdue, upcoming, completed };
}
