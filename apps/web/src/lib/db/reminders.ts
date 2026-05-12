import db from "./legacy";
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

// Create a new reminder
export function createReminder(
  reminder: Omit<
    Reminder,
    "id" | "completed" | "dismissed" | "createdAt" | "completedAt" | "firedAt"
  >,
  userId: string,
): Reminder {
  ensureRemindersFiringSchema();
  const id = generateId();
  const now = nowIso();
  const job = db
    .prepare("SELECT id FROM jobs WHERE id = ? AND user_id = ?")
    .get(reminder.jobId, userId) as { id: string } | undefined;

  if (!job) {
    throw new Error("Job not found");
  }

  const stmt = db.prepare(`
    INSERT INTO reminders (
      id, user_id, job_id, type, title, description, due_date, notify_by_email, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    userId,
    reminder.jobId,
    reminder.type,
    reminder.title,
    reminder.description || null,
    reminder.dueDate,
    reminder.notifyByEmail ? 1 : 0,
    now,
  );

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
export function getReminders(options: {
  jobId?: string;
  includeCompleted?: boolean;
  includeDismissed?: boolean;
  userId: string;
}): ReminderWithJob[] {
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

  const stmt = db.prepare(query);
  const rows = (params.length > 0 ? stmt.all(...params) : stmt.all()) as Array<{
    id: string;
    job_id: string;
    type: string;
    title: string;
    description: string | null;
    due_date: string;
    completed: number;
    dismissed: number;
    created_at: string;
    completed_at: string | null;
    fired_at: string | null;
    notify_by_email: number;
    job_title: string | null;
    job_company: string | null;
  }>;

  return rows.map((row) => ({
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
  }));
}

// Get upcoming reminders (due within specified days)
export function getUpcomingReminders(
  days: number = 7,
  userId: string,
): ReminderWithJob[] {
  const futureDate = nowDate();
  futureDate.setDate(futureDate.getDate() + days);

  const stmt = db.prepare(`
    SELECT r.*, j.title as job_title, j.company as job_company
    FROM reminders r
    LEFT JOIN jobs j ON r.job_id = j.id
    WHERE r.user_id = ?
      AND (j.id IS NULL OR j.user_id = r.user_id)
      AND r.completed = 0
      AND r.dismissed = 0
      AND r.due_date <= ?
    ORDER BY r.due_date ASC
  `);

  const rows = stmt.all(userId, toIso(futureDate)) as Array<{
    id: string;
    job_id: string;
    type: string;
    title: string;
    description: string | null;
    due_date: string;
    completed: number;
    dismissed: number;
    created_at: string;
    completed_at: string | null;
    fired_at: string | null;
    notify_by_email: number;
    job_title: string | null;
    job_company: string | null;
  }>;

  return rows.map((row) => ({
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
  }));
}

// Get overdue reminders
export function getOverdueReminders(userId: string): ReminderWithJob[] {
  const now = nowIso();

  const stmt = db.prepare(`
    SELECT r.*, j.title as job_title, j.company as job_company
    FROM reminders r
    LEFT JOIN jobs j ON r.job_id = j.id
    WHERE r.user_id = ?
      AND (j.id IS NULL OR j.user_id = r.user_id)
      AND r.completed = 0
      AND r.dismissed = 0
      AND r.due_date < ?
    ORDER BY r.due_date ASC
  `);

  const rows = stmt.all(userId, now) as Array<{
    id: string;
    job_id: string;
    type: string;
    title: string;
    description: string | null;
    due_date: string;
    completed: number;
    dismissed: number;
    created_at: string;
    completed_at: string | null;
    fired_at: string | null;
    notify_by_email: number;
    job_title: string | null;
    job_company: string | null;
  }>;

  return rows.map((row) => ({
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
  }));
}

// Complete a reminder
export function completeReminder(id: string, userId: string): void {
  const now = nowIso();

  const stmt = db.prepare(`
    UPDATE reminders
    SET completed = 1, completed_at = ?
    WHERE id = ?
      AND user_id = ?
  `);

  stmt.run(now, id, userId);
}

// Dismiss a reminder
export function dismissReminder(id: string, userId: string): void {
  const stmt = db.prepare(`
    UPDATE reminders
    SET dismissed = 1
    WHERE id = ?
      AND user_id = ?
  `);

  stmt.run(id, userId);
}

// Delete a reminder
export function deleteReminder(id: string, userId: string): void {
  const stmt = db.prepare(`
    DELETE FROM reminders
    WHERE id = ?
      AND user_id = ?
  `);
  stmt.run(id, userId);
}

// Update a reminder
export function updateReminder(
  id: string,
  updates: Partial<
    Pick<
      Reminder,
      "title" | "description" | "dueDate" | "type" | "notifyByEmail"
    >
  >,
  userId: string,
): void {
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

  const stmt = db.prepare(`
    UPDATE reminders
    SET ${fields.join(", ")}
    WHERE id = ?
      AND user_id = ?
  `);

  stmt.run(...values);
}

// Create follow-up reminder for a job application
export function createFollowUpReminder(
  jobId: string,
  daysFromNow: number = 7,
  userId: string,
): Reminder {
  const dueDate = nowDate();
  dueDate.setDate(dueDate.getDate() + daysFromNow);

  return createReminder(
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
export function getReminderCounts(userId: string): {
  total: number;
  overdue: number;
  upcoming: number;
  completed: number;
} {
  const now = nowIso();
  const weekFromNow = nowDate();
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const totalStmt = db.prepare(
    `
      SELECT COUNT(*) as count
      FROM reminders r
      JOIN jobs j ON r.job_id = j.id
      WHERE r.user_id = ? AND j.user_id = r.user_id AND r.completed = 0 AND r.dismissed = 0
    `,
  );
  const overdueStmt = db.prepare(
    `
      SELECT COUNT(*) as count
      FROM reminders r
      JOIN jobs j ON r.job_id = j.id
      WHERE r.user_id = ? AND j.user_id = r.user_id AND r.completed = 0 AND r.dismissed = 0 AND r.due_date < ?
    `,
  );
  const upcomingStmt = db.prepare(
    `
      SELECT COUNT(*) as count
      FROM reminders r
      JOIN jobs j ON r.job_id = j.id
      WHERE r.user_id = ? AND j.user_id = r.user_id AND r.completed = 0 AND r.dismissed = 0 AND r.due_date >= ? AND r.due_date <= ?
    `,
  );
  const completedStmt = db.prepare(
    `
      SELECT COUNT(*) as count
      FROM reminders r
      JOIN jobs j ON r.job_id = j.id
      WHERE r.user_id = ? AND j.user_id = r.user_id AND r.completed = 1
    `,
  );

  const total = (totalStmt.get(userId) as { count: number }).count;
  const overdue = (overdueStmt.get(userId, now) as { count: number }).count;
  const upcoming = (
    upcomingStmt.get(userId, now, toIso(weekFromNow)) as { count: number }
  ).count;
  const completed = (completedStmt.get(userId) as { count: number }).count;

  return { total, overdue, upcoming, completed };
}
