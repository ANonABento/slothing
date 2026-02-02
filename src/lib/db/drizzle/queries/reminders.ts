import { db, reminders, jobs, eq, and, desc, asc } from '../index';
import { generateId } from '@/lib/utils';

export type ReminderType = 'follow_up' | 'deadline' | 'interview' | 'custom';

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
}

export interface ReminderWithJob extends Reminder {
  jobTitle?: string;
  jobCompany?: string;
}

// Create a new reminder
export async function createReminder(
  userId: string,
  reminder: Omit<Reminder, 'id' | 'completed' | 'dismissed' | 'createdAt' | 'completedAt'>
): Promise<Reminder> {
  const id = generateId();
  const now = new Date();

  await db.insert(reminders).values({
    id,
    userId,
    jobId: reminder.jobId,
    type: reminder.type,
    title: reminder.title,
    description: reminder.description ?? null,
    dueDate: reminder.dueDate,
    completed: false,
    dismissed: false,
    createdAt: now,
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
    createdAt: now.toISOString(),
  };
}

// Get all reminders for a user
export async function getReminders(
  userId: string,
  options?: {
    jobId?: string;
    includeCompleted?: boolean;
    includeDismissed?: boolean;
  }
): Promise<ReminderWithJob[]> {
  const { jobId, includeCompleted = false, includeDismissed = false } = options ?? {};

  // Get reminders
  let reminderRows = await db.select().from(reminders)
    .where(eq(reminders.userId, userId))
    .orderBy(asc(reminders.dueDate));

  // Filter by jobId if specified
  if (jobId) {
    reminderRows = reminderRows.filter(r => r.jobId === jobId);
  }

  // Filter completed/dismissed
  if (!includeCompleted) {
    reminderRows = reminderRows.filter(r => !r.completed);
  }
  if (!includeDismissed) {
    reminderRows = reminderRows.filter(r => !r.dismissed);
  }

  // Get job info for each reminder
  const result: ReminderWithJob[] = [];
  for (const row of reminderRows) {
    const jobRows = await db.select().from(jobs)
      .where(and(eq(jobs.id, row.jobId), eq(jobs.userId, userId)));

    const job = jobRows[0];

    result.push({
      id: row.id,
      jobId: row.jobId,
      type: row.type as ReminderType,
      title: row.title,
      description: row.description ?? undefined,
      dueDate: row.dueDate,
      completed: row.completed ?? false,
      dismissed: row.dismissed ?? false,
      createdAt: row.createdAt?.toISOString() ?? '',
      completedAt: row.completedAt?.toISOString(),
      jobTitle: job?.title,
      jobCompany: job?.company,
    });
  }

  return result;
}

// Get upcoming reminders
export async function getUpcomingReminders(userId: string, days: number = 7): Promise<ReminderWithJob[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  const allReminders = await getReminders(userId, { includeCompleted: false, includeDismissed: false });

  return allReminders.filter(r => new Date(r.dueDate) <= futureDate);
}

// Get overdue reminders
export async function getOverdueReminders(userId: string): Promise<ReminderWithJob[]> {
  const now = new Date();

  const allReminders = await getReminders(userId, { includeCompleted: false, includeDismissed: false });

  return allReminders.filter(r => new Date(r.dueDate) < now);
}

// Complete a reminder
export async function completeReminder(userId: string, reminderId: string): Promise<void> {
  await db.update(reminders)
    .set({
      completed: true,
      completedAt: new Date(),
    })
    .where(and(eq(reminders.id, reminderId), eq(reminders.userId, userId)));
}

// Dismiss a reminder
export async function dismissReminder(userId: string, reminderId: string): Promise<void> {
  await db.update(reminders)
    .set({ dismissed: true })
    .where(and(eq(reminders.id, reminderId), eq(reminders.userId, userId)));
}

// Delete a reminder
export async function deleteReminder(userId: string, reminderId: string): Promise<void> {
  await db.delete(reminders)
    .where(and(eq(reminders.id, reminderId), eq(reminders.userId, userId)));
}

// Update a reminder
export async function updateReminder(
  userId: string,
  reminderId: string,
  updates: Partial<Pick<Reminder, 'title' | 'description' | 'dueDate' | 'type'>>
): Promise<void> {
  await db.update(reminders)
    .set({
      title: updates.title,
      description: updates.description ?? null,
      dueDate: updates.dueDate,
      type: updates.type,
    })
    .where(and(eq(reminders.id, reminderId), eq(reminders.userId, userId)));
}

// Create follow-up reminder for a job application
export async function createFollowUpReminder(
  userId: string,
  jobId: string,
  daysFromNow: number = 7
): Promise<Reminder> {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysFromNow);

  return createReminder(userId, {
    jobId,
    type: 'follow_up',
    title: 'Follow up on application',
    description: 'Send a follow-up email to check on your application status',
    dueDate: dueDate.toISOString(),
  });
}

// Get reminder counts for dashboard
export async function getReminderCounts(userId: string): Promise<{
  total: number;
  overdue: number;
  upcoming: number;
  completed: number;
}> {
  const now = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const allReminders = await db.select().from(reminders)
    .where(eq(reminders.userId, userId));

  const active = allReminders.filter(r => !r.completed && !r.dismissed);
  const overdue = active.filter(r => new Date(r.dueDate) < now);
  const upcoming = active.filter(r => {
    const due = new Date(r.dueDate);
    return due >= now && due <= weekFromNow;
  });
  const completed = allReminders.filter(r => r.completed);

  return {
    total: active.length,
    overdue: overdue.length,
    upcoming: upcoming.length,
    completed: completed.length,
  };
}
