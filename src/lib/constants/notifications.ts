import { z } from "zod";

// Notification action schema
export const NOTIFICATION_ACTIONS = ["markAllRead", "deleteRead"] as const;

export type NotificationAction = (typeof NOTIFICATION_ACTIONS)[number];

export const notificationActionSchema = z.object({
  action: z.enum(NOTIFICATION_ACTIONS),
});
