import { getClient } from "./client";
import { generateId } from "@/lib/utils";
import { ensureSuggestedStatusUpdatesSchema } from "./suggested-status-updates";

import { nowIso } from "@/lib/format/time";

let notificationsIndexEnsured = false;

/**
 * The notification bell queries `WHERE user_id = ? ORDER BY created_at DESC` on
 * every page load. Without an index that's a full table scan that grows with
 * every reminder fire / status-change notification. Created at runtime
 * (idempotent) since this table's schema is bootstrapped outside migrations.
 */
async function ensureNotificationsIndex(): Promise<void> {
  if (notificationsIndexEnsured) return;
  try {
    await getClient().execute(
      "CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(user_id, created_at)",
    );
    notificationsIndexEnsured = true;
  } catch {
    // First-boot / test environments may lack the table; the read path's own
    // try/catch handles that — don't let an index hiccup break notifications.
  }
}
export type NotificationType =
  | "reminder_due"
  | "reminder_overdue"
  | "application_update"
  | "interview_scheduled"
  | "job_deadline"
  | "system"
  | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  link?: string;
  read: boolean;
  createdAt: string;
  suggestedStatusUpdate?: {
    state: "pending" | "accepted" | "dismissed";
    opportunityId: string;
    suggestedStatus: string;
    confidence?: number | null;
    reason?: string | null;
    evidence?: string[];
  };
}

// Create a new notification
export function createNotification(
  notification: Omit<Notification, "id" | "read" | "createdAt">,
  userId: string,
): Promise<Notification> {
  return createNotificationAsync(notification, userId);
}

async function createNotificationAsync(
  notification: Omit<Notification, "id" | "read" | "createdAt">,
  userId: string,
): Promise<Notification> {
  const id = generateId();
  const now = nowIso();

  await getClient().execute({
    sql: `
      INSERT INTO notifications (id, type, title, message, link, created_at, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      notification.type,
      notification.title,
      notification.message || null,
      notification.link || null,
      now,
      userId,
    ],
  });

  return {
    id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    link: notification.link,
    read: false,
    createdAt: now,
  };
}

// Get all notifications
export function getNotifications(options: {
  unreadOnly?: boolean;
  limit?: number;
  userId: string;
}): Promise<Notification[]> {
  return getNotificationsAsync(options);
}

async function getNotificationsAsync(options: {
  unreadOnly?: boolean;
  limit?: number;
  userId: string;
}): Promise<Notification[]> {
  const { unreadOnly = false, limit = 50, userId } = options || {};
  await ensureSuggestedStatusUpdatesSchema();
  await ensureNotificationsIndex();

  let query = `
    SELECT
      notifications.*,
      suggested_status_updates.state AS suggested_state,
      suggested_status_updates.opportunity_id AS suggested_opportunity_id,
      suggested_status_updates.suggested_status AS suggested_status,
      suggested_status_updates.confidence AS suggested_confidence,
      suggested_status_updates.reason AS suggested_reason,
      suggested_status_updates.evidence_json AS suggested_evidence_json
    FROM notifications
    LEFT JOIN suggested_status_updates
      ON suggested_status_updates.notification_id = notifications.id
      AND suggested_status_updates.user_id = notifications.user_id
    WHERE notifications.user_id = ?`;
  const params: Array<string | number> = [userId];

  if (unreadOnly) {
    query += " AND notifications.read = 0";
  }

  query += " ORDER BY notifications.created_at DESC LIMIT ?";
  params.push(limit);

  const result = await getClient().execute({ sql: query, args: params });
  return (result.rows as unknown as NotificationQueryRow[]).map((row) => ({
    id: row.id,
    type: row.type as NotificationType,
    title: row.title,
    message: row.message || undefined,
    link: row.link || undefined,
    read: Boolean(row.read),
    createdAt: row.created_at,
    suggestedStatusUpdate:
      row.suggested_state &&
      row.suggested_opportunity_id &&
      row.suggested_status
        ? {
            state: row.suggested_state as "pending" | "accepted" | "dismissed",
            opportunityId: row.suggested_opportunity_id,
            suggestedStatus: row.suggested_status,
            confidence: row.suggested_confidence,
            reason: row.suggested_reason,
            evidence: parseEvidence(row.suggested_evidence_json),
          }
        : undefined,
  }));
}

interface NotificationQueryRow {
  id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  read: number | boolean;
  created_at: string;
  suggested_state: string | null;
  suggested_opportunity_id: string | null;
  suggested_status: string | null;
  suggested_confidence: number | null;
  suggested_reason: string | null;
  suggested_evidence_json: string | null;
}

function parseEvidence(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

// Mark notification as read
export async function markNotificationRead(
  id: string,
  userId: string,
): Promise<void> {
  await getClient().execute({
    sql: "UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
}

// Mark all notifications as read
export async function markAllNotificationsRead(userId: string): Promise<void> {
  await getClient().execute({
    sql: "UPDATE notifications SET read = 1 WHERE read = 0 AND user_id = ?",
    args: [userId],
  });
}

// Delete a notification
export async function deleteNotification(
  id: string,
  userId: string,
): Promise<void> {
  await getClient().execute({
    sql: "DELETE FROM notifications WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });
}

// Delete all read notifications
export async function deleteReadNotifications(userId: string): Promise<void> {
  await getClient().execute({
    sql: "DELETE FROM notifications WHERE read = 1 AND user_id = ?",
    args: [userId],
  });
}

// Get unread notification count
export async function getUnreadNotificationCount(
  userId: string,
): Promise<number> {
  const result = await getClient().execute({
    sql: "SELECT COUNT(*) as count FROM notifications WHERE read = 0 AND user_id = ?",
    args: [userId],
  });
  const row = result.rows[0] as unknown as { count: number } | undefined;
  return row?.count ?? 0;
}

// Create reminder notification
export function createReminderNotification(
  reminderTitle: string,
  jobTitle: string,
  isOverdue: boolean,
  jobId: string,
  userId: string,
): Promise<Notification> {
  return createNotification(
    {
      type: isOverdue ? "reminder_overdue" : "reminder_due",
      title: isOverdue ? "Overdue Reminder" : "Reminder Due",
      message: `${reminderTitle} for ${jobTitle}`,
      link: `/opportunities?id=${jobId}`,
    },
    userId,
  );
}

// Create application update notification
export function createApplicationUpdateNotification(
  jobTitle: string,
  newStatus: string,
  jobId: string,
  userId: string,
): Promise<Notification> {
  return createNotification(
    {
      type: "application_update",
      title: "Application Status Updated",
      message: `${jobTitle} is now "${newStatus}"`,
      link: `/opportunities?id=${jobId}`,
    },
    userId,
  );
}
