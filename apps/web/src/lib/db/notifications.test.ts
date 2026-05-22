import { describe, it, expect, vi, beforeEach } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
  batch: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "test-notification-id",
}));

import {
  createNotification,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteReadNotifications,
  getUnreadNotificationCount,
  createReminderNotification,
  createApplicationUpdateNotification,
} from "./notifications";

const TEST_USER_ID = "test-user";

function result(rows: unknown[] = []) {
  return { rows, rowsAffected: 0 };
}

function mockExecute(rows: unknown[] = []) {
  dbMocks.execute.mockImplementation((statement: string | { sql: string }) => {
    const sql = typeof statement === "string" ? statement : statement.sql;
    if (sql.startsWith("PRAGMA table_info")) {
      return Promise.resolve(
        result([
          { name: "confidence" },
          { name: "reason" },
          { name: "evidence_json" },
        ]),
      );
    }
    if (sql.includes("SELECT COUNT")) {
      return Promise.resolve(result([{ count: 5 }]));
    }
    if (sql.includes("SELECT") && sql.includes("FROM notifications")) {
      return Promise.resolve(result(rows));
    }
    return Promise.resolve(result());
  });
}

describe("Notification Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.batch.mockResolvedValue([]);
    mockExecute();
  });

  describe("createNotification", () => {
    it("should create a notification and return it", async () => {
      const notification = await createNotification(
        {
          type: "info",
          title: "Test Notification",
          message: "This is a test",
          link: "/test",
        },
        TEST_USER_ID,
      );

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("INSERT INTO notifications"),
        args: [
          "test-notification-id",
          "info",
          "Test Notification",
          "This is a test",
          "/test",
          expect.any(String),
          TEST_USER_ID,
        ],
      });
      expect(notification).toMatchObject({
        id: "test-notification-id",
        type: "info",
        title: "Test Notification",
        read: false,
      });
    });

    it("should handle optional message and link", async () => {
      const notification = await createNotification(
        {
          type: "system",
          title: "System Alert",
        },
        TEST_USER_ID,
      );

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("INSERT INTO notifications"),
        args: [
          "test-notification-id",
          "system",
          "System Alert",
          null,
          null,
          expect.any(String),
          TEST_USER_ID,
        ],
      });
      expect(notification.message).toBeUndefined();
      expect(notification.link).toBeUndefined();
    });
  });

  describe("getNotifications", () => {
    it("should return all notifications ordered by created_at DESC", async () => {
      mockExecute([
        {
          id: "notif-1",
          type: "info",
          title: "First Notification",
          message: "Message 1",
          link: "/link1",
          read: 0,
          created_at: "2024-01-15T00:00:00.000Z",
          suggested_state: null,
          suggested_opportunity_id: null,
          suggested_status: null,
          suggested_confidence: null,
          suggested_reason: null,
          suggested_evidence_json: null,
        },
        {
          id: "notif-2",
          type: "reminder_due",
          title: "Second Notification",
          message: null,
          link: null,
          read: 1,
          created_at: "2024-01-14T00:00:00.000Z",
          suggested_state: null,
          suggested_opportunity_id: null,
          suggested_status: null,
          suggested_confidence: null,
          suggested_reason: null,
          suggested_evidence_json: null,
        },
      ]);

      const notifications = await getNotifications({ userId: TEST_USER_ID });

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("LEFT JOIN suggested_status_updates"),
        args: [TEST_USER_ID, 50],
      });
      expect(notifications).toHaveLength(2);
      expect(notifications[0].id).toBe("notif-1");
      expect(notifications[0].read).toBe(false);
      expect(notifications[1].read).toBe(true);
      expect(notifications[1].message).toBeUndefined();
      expect(notifications[1].link).toBeUndefined();
    });

    it("should filter unread only when specified", async () => {
      await getNotifications({ userId: TEST_USER_ID, unreadOnly: true });

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("AND notifications.read = 0"),
        args: [TEST_USER_ID, 50],
      });
    });

    it("should respect limit parameter", async () => {
      await getNotifications({ userId: TEST_USER_ID, limit: 10 });

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("LIMIT ?"),
        args: [TEST_USER_ID, 10],
      });
    });

    it("should include suggested status metadata", async () => {
      mockExecute([
        {
          id: "notif-1",
          type: "application_update",
          title: "Review Gmail status suggestion",
          message: "Message",
          link: "/opportunities?id=opp-1",
          read: 0,
          created_at: "2024-01-15T00:00:00.000Z",
          suggested_state: "pending",
          suggested_opportunity_id: "opp-1",
          suggested_status: "interviewing",
          suggested_confidence: 0.76,
          suggested_reason: "interview scheduling language",
          suggested_evidence_json: JSON.stringify(["Can we schedule a call?"]),
        },
      ]);

      await expect(
        getNotifications({ userId: TEST_USER_ID }).then(
          (notifications) => notifications[0].suggestedStatusUpdate,
        ),
      ).resolves.toEqual({
        state: "pending",
        opportunityId: "opp-1",
        suggestedStatus: "interviewing",
        confidence: 0.76,
        reason: "interview scheduling language",
        evidence: ["Can we schedule a call?"],
      });
    });

    it("should ignore invalid suggested evidence JSON", async () => {
      mockExecute([
        {
          id: "notif-1",
          type: "application_update",
          title: "Review Gmail status suggestion",
          message: "Message",
          link: "/opportunities?id=opp-1",
          read: 0,
          created_at: "2024-01-15T00:00:00.000Z",
          suggested_state: "pending",
          suggested_opportunity_id: "opp-1",
          suggested_status: "interviewing",
          suggested_confidence: 0.76,
          suggested_reason: "interview scheduling language",
          suggested_evidence_json: "{nope",
        },
      ]);

      await expect(
        getNotifications({ userId: TEST_USER_ID }).then(
          (notifications) => notifications[0].suggestedStatusUpdate?.evidence,
        ),
      ).resolves.toEqual([]);
    });
  });

  describe("mutations", () => {
    it("should mark a single notification as read", async () => {
      await markNotificationRead("notif-1", TEST_USER_ID);

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: "UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?",
        args: ["notif-1", TEST_USER_ID],
      });
    });

    it("should mark all unread notifications as read", async () => {
      await markAllNotificationsRead(TEST_USER_ID);

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: "UPDATE notifications SET read = 1 WHERE read = 0 AND user_id = ?",
        args: [TEST_USER_ID],
      });
    });

    it("should delete a notification by id", async () => {
      await deleteNotification("notif-1", TEST_USER_ID);

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: "DELETE FROM notifications WHERE id = ? AND user_id = ?",
        args: ["notif-1", TEST_USER_ID],
      });
    });

    it("should delete all read notifications", async () => {
      await deleteReadNotifications(TEST_USER_ID);

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: "DELETE FROM notifications WHERE read = 1 AND user_id = ?",
        args: [TEST_USER_ID],
      });
    });
  });

  describe("getUnreadNotificationCount", () => {
    it("should return count of unread notifications", async () => {
      await expect(getUnreadNotificationCount(TEST_USER_ID)).resolves.toBe(5);

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: "SELECT COUNT(*) as count FROM notifications WHERE read = 0 AND user_id = ?",
        args: [TEST_USER_ID],
      });
    });

    it("should return 0 when no unread row is returned", async () => {
      dbMocks.execute.mockResolvedValue(result([]));

      await expect(getUnreadNotificationCount(TEST_USER_ID)).resolves.toBe(0);
    });
  });

  describe("helper notification factories", () => {
    it("should create a due reminder notification", async () => {
      const notification = await createReminderNotification(
        "Follow up",
        "Software Engineer",
        false,
        "job-123",
        "user-1",
      );

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("INSERT INTO notifications"),
        args: [
          "test-notification-id",
          "reminder_due",
          "Reminder Due",
          "Follow up for Software Engineer",
          "/opportunities?id=job-123",
          expect.any(String),
          "user-1",
        ],
      });
      expect(notification).toMatchObject({
        type: "reminder_due",
        title: "Reminder Due",
        message: "Follow up for Software Engineer",
        link: "/opportunities?id=job-123",
      });
    });

    it("should create an overdue reminder notification", async () => {
      const notification = await createReminderNotification(
        "Submit application",
        "Data Analyst",
        true,
        "job-456",
        "user-1",
      );

      expect(notification.type).toBe("reminder_overdue");
      expect(notification.title).toBe("Overdue Reminder");
    });

    it("should create an application update notification", async () => {
      const notification = await createApplicationUpdateNotification(
        "Frontend Developer",
        "interviewing",
        "job-789",
        TEST_USER_ID,
      );

      expect(notification.type).toBe("application_update");
      expect(notification.title).toBe("Application Status Updated");
      expect(notification.message).toBe(
        'Frontend Developer is now "interviewing"',
      );
      expect(notification.link).toBe("/opportunities?id=job-789");
    });
  });
});
