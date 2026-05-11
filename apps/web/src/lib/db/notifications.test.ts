import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";

// Mock the database module
vi.mock("./legacy", () => {
  const mockDb = {
    prepare: vi.fn(),
  };
  return { default: mockDb };
});

// Mock utils to control ID generation
vi.mock("@/lib/utils", () => ({
  generateId: () => "test-notification-id",
}));

import db from "./legacy";
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

describe("Notification Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createNotification", () => {
    it("should create a notification and return it", () => {
      const mockRun = vi.fn();
      (db.prepare as Mock).mockReturnValue({ run: mockRun });

      const result = createNotification(
        {
          type: "info",
          title: "Test Notification",
          message: "This is a test",
          link: "/test",
        },
        TEST_USER_ID,
      );

      expect(db.prepare).toHaveBeenCalled();
      expect(mockRun).toHaveBeenCalledWith(
        "test-notification-id",
        "info",
        "Test Notification",
        "This is a test",
        "/test",
        expect.any(String),
        TEST_USER_ID,
      );
      expect(result.id).toBe("test-notification-id");
      expect(result.type).toBe("info");
      expect(result.title).toBe("Test Notification");
      expect(result.read).toBe(false);
    });

    it("should handle optional message and link", () => {
      const mockRun = vi.fn();
      (db.prepare as Mock).mockReturnValue({ run: mockRun });

      const result = createNotification(
        {
          type: "system",
          title: "System Alert",
        },
        TEST_USER_ID,
      );

      expect(mockRun).toHaveBeenCalledWith(
        "test-notification-id",
        "system",
        "System Alert",
        null,
        null,
        expect.any(String),
        TEST_USER_ID,
      );
      expect(result.message).toBeUndefined();
      expect(result.link).toBeUndefined();
    });
  });

  describe("getNotifications", () => {
    function mockNotificationQuery(rows: unknown[] = []) {
      const mockAll = vi.fn().mockReturnValue(rows);
      (db.prepare as Mock).mockImplementation((sql: string) => {
        if (sql.startsWith("PRAGMA table_info")) {
          return {
            all: vi
              .fn()
              .mockReturnValue([
                { name: "confidence" },
                { name: "reason" },
                { name: "evidence_json" },
              ]),
          };
        }
        if (sql.includes("SELECT")) {
          return { all: mockAll };
        }
        return { run: vi.fn() };
      });
      return mockAll;
    }

    it("should return all notifications ordered by created_at DESC", () => {
      const mockRows = [
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
      ];

      const mockAll = mockNotificationQuery(mockRows);

      const result = getNotifications({ userId: TEST_USER_ID });

      expect(db.prepare).toHaveBeenLastCalledWith(
        expect.stringContaining("LEFT JOIN suggested_status_updates"),
      );
      expect(mockAll).toHaveBeenCalledWith(TEST_USER_ID, 50);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("notif-1");
      expect(result[0].read).toBe(false);
      expect(result[1].read).toBe(true);
      expect(result[1].message).toBeUndefined();
      expect(result[1].link).toBeUndefined();
    });

    it("should filter unread only when specified", () => {
      mockNotificationQuery();

      getNotifications({ userId: TEST_USER_ID, unreadOnly: true });

      expect(db.prepare).toHaveBeenLastCalledWith(
        expect.stringContaining("AND notifications.read = 0"),
      );
    });

    it("should respect limit parameter", () => {
      const mockAll = mockNotificationQuery();

      getNotifications({ userId: TEST_USER_ID, limit: 10 });

      expect(mockAll).toHaveBeenCalledWith(TEST_USER_ID, 10);
    });

    it("should use default limit of 50", () => {
      const mockAll = mockNotificationQuery();

      getNotifications({ userId: TEST_USER_ID });

      expect(mockAll).toHaveBeenCalledWith(TEST_USER_ID, 50);
    });

    it("should include suggested status metadata", () => {
      mockNotificationQuery([
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

      expect(
        getNotifications({ userId: TEST_USER_ID })[0].suggestedStatusUpdate,
      ).toEqual({
        state: "pending",
        opportunityId: "opp-1",
        suggestedStatus: "interviewing",
        confidence: 0.76,
        reason: "interview scheduling language",
        evidence: ["Can we schedule a call?"],
      });
    });

    it("should ignore invalid suggested evidence JSON", () => {
      mockNotificationQuery([
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

      expect(
        getNotifications({ userId: TEST_USER_ID })[0].suggestedStatusUpdate
          ?.evidence,
      ).toEqual([]);
    });
  });

  describe("markNotificationRead", () => {
    it("should mark a single notification as read", () => {
      const mockRun = vi.fn();
      (db.prepare as Mock).mockReturnValue({ run: mockRun });

      markNotificationRead("notif-1", TEST_USER_ID);

      expect(db.prepare).toHaveBeenCalledWith(
        "UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?",
      );
      expect(mockRun).toHaveBeenCalledWith("notif-1", TEST_USER_ID);
    });
  });

  describe("markAllNotificationsRead", () => {
    it("should mark all unread notifications as read", () => {
      const mockRun = vi.fn();
      (db.prepare as Mock).mockReturnValue({ run: mockRun });

      markAllNotificationsRead(TEST_USER_ID);

      expect(db.prepare).toHaveBeenCalledWith(
        "UPDATE notifications SET read = 1 WHERE read = 0 AND user_id = ?",
      );
      expect(mockRun).toHaveBeenCalledWith(TEST_USER_ID);
    });
  });

  describe("deleteNotification", () => {
    it("should delete a notification by id", () => {
      const mockRun = vi.fn();
      (db.prepare as Mock).mockReturnValue({ run: mockRun });

      deleteNotification("notif-1", TEST_USER_ID);

      expect(db.prepare).toHaveBeenCalledWith(
        "DELETE FROM notifications WHERE id = ? AND user_id = ?",
      );
      expect(mockRun).toHaveBeenCalledWith("notif-1", TEST_USER_ID);
    });
  });

  describe("deleteReadNotifications", () => {
    it("should delete all read notifications", () => {
      const mockRun = vi.fn();
      (db.prepare as Mock).mockReturnValue({ run: mockRun });

      deleteReadNotifications(TEST_USER_ID);

      expect(db.prepare).toHaveBeenCalledWith(
        "DELETE FROM notifications WHERE read = 1 AND user_id = ?",
      );
      expect(mockRun).toHaveBeenCalledWith(TEST_USER_ID);
    });
  });

  describe("getUnreadNotificationCount", () => {
    it("should return count of unread notifications", () => {
      const mockGet = vi.fn().mockReturnValue({ count: 5 });
      (db.prepare as Mock).mockReturnValue({ get: mockGet });

      const result = getUnreadNotificationCount(TEST_USER_ID);

      expect(db.prepare).toHaveBeenCalledWith(
        "SELECT COUNT(*) as count FROM notifications WHERE read = 0 AND user_id = ?",
      );
      expect(mockGet).toHaveBeenCalledWith(TEST_USER_ID);
      expect(result).toBe(5);
    });

    it("should return 0 when no unread notifications", () => {
      const mockGet = vi.fn().mockReturnValue({ count: 0 });
      (db.prepare as Mock).mockReturnValue({ get: mockGet });

      const result = getUnreadNotificationCount(TEST_USER_ID);

      expect(mockGet).toHaveBeenCalledWith(TEST_USER_ID);
      expect(result).toBe(0);
    });
  });

  describe("createReminderNotification", () => {
    it("should create a due reminder notification", () => {
      const mockRun = vi.fn();
      (db.prepare as Mock).mockReturnValue({ run: mockRun });

      const result = createReminderNotification(
        "Follow up",
        "Software Engineer",
        false,
        "job-123",
        "user-1",
      );

      expect(mockRun).toHaveBeenCalledWith(
        expect.any(String),
        "reminder_due",
        "Reminder Due",
        "Follow up for Software Engineer",
        "/opportunities?id=job-123",
        expect.any(String),
        "user-1",
      );
      expect(result.type).toBe("reminder_due");
      expect(result.title).toBe("Reminder Due");
      expect(result.message).toBe("Follow up for Software Engineer");
      expect(result.link).toBe("/opportunities?id=job-123");
    });

    it("should create an overdue reminder notification", () => {
      const mockRun = vi.fn();
      (db.prepare as Mock).mockReturnValue({ run: mockRun });

      const result = createReminderNotification(
        "Submit application",
        "Data Analyst",
        true,
        "job-456",
        "user-1",
      );

      expect(result.type).toBe("reminder_overdue");
      expect(result.title).toBe("Overdue Reminder");
    });
  });

  describe("createApplicationUpdateNotification", () => {
    it("should create an application update notification", () => {
      const mockRun = vi.fn();
      (db.prepare as Mock).mockReturnValue({ run: mockRun });

      const result = createApplicationUpdateNotification(
        "Frontend Developer",
        "interviewing",
        "job-789",
        TEST_USER_ID,
      );

      expect(result.type).toBe("application_update");
      expect(result.title).toBe("Application Status Updated");
      expect(result.message).toBe('Frontend Developer is now "interviewing"');
      expect(result.link).toBe("/opportunities?id=job-789");
    });
  });
});
