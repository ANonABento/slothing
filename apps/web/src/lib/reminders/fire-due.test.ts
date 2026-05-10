import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

const mocks = vi.hoisted(() => ({
  prepare: vi.fn(),
  createReminderNotification: vi.fn(),
  sendReminderEmail: vi.fn(),
}));

vi.mock("@/lib/db/legacy", () => ({
  default: { prepare: mocks.prepare },
}));

vi.mock("@/lib/db/notifications", () => ({
  createReminderNotification: mocks.createReminderNotification,
}));

vi.mock("./send-email", () => ({
  sendReminderEmail: mocks.sendReminderEmail,
}));

import {
  ensureRemindersFiringSchema,
  fireDueReminders,
  resetRemindersFiringSchemaForTest,
} from "./fire-due";

const dueReminder = {
  id: "reminder-1",
  user_id: "user-1",
  job_id: "job-1",
  title: "Follow up",
  due_date: "2026-05-10T12:00:00.000Z",
  notify_by_email: 0,
  job_title: "Engineer",
  job_company: "Acme",
  user_email: "ada@example.com",
};

describe("fireDueReminders", () => {
  beforeEach(() => {
    resetRemindersFiringSchemaForTest();
    vi.clearAllMocks();
    mocks.prepare.mockImplementation((sql: string) => {
      if (sql.includes("PRAGMA table_info")) {
        return {
          all: vi.fn(() => [{ name: "fired_at" }, { name: "notify_by_email" }]),
        };
      }
      if (sql.includes("SELECT r.id")) {
        return { all: vi.fn(() => [dueReminder]) };
      }
      return { run: vi.fn(() => ({ changes: 1 })) };
    });
    mocks.sendReminderEmail.mockResolvedValue({ ok: true, status: 202 });
  });

  it("fires a due reminder and scopes the notification to the reminder user", async () => {
    const result = await fireDueReminders("2026-05-10T12:05:00.000Z");

    expect(result).toMatchObject({ fired: 1, errors: 0 });
    expect(mocks.createReminderNotification).toHaveBeenCalledWith(
      "Follow up",
      "Engineer",
      false,
      "job-1",
      "user-1",
    );
    expect(mocks.prepare).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE reminders SET fired_at = ?"),
    );
  });

  it("selects only due active unfired reminders with a batch limit", async () => {
    await fireDueReminders("2026-05-10T12:05:00.000Z");

    const selectSql = (mocks.prepare as Mock).mock.calls
      .map(([sql]) => String(sql))
      .find((sql) => sql.includes("SELECT r.id"));
    expect(selectSql).toContain("r.due_date <= ?");
    expect(selectSql).toContain("r.fired_at IS NULL");
    expect(selectSql).toContain("r.completed = 0");
    expect(selectSql).toContain("r.dismissed = 0");
    expect(selectSql).toContain("LIMIT 500");
  });

  it("sends email when requested and configured by the sender", async () => {
    mocks.prepare.mockImplementation((sql: string) => {
      if (sql.includes("PRAGMA table_info")) {
        return {
          all: vi.fn(() => [{ name: "fired_at" }, { name: "notify_by_email" }]),
        };
      }
      if (sql.includes("SELECT r.id")) {
        return {
          all: vi.fn(() => [{ ...dueReminder, notify_by_email: 1 }]),
        };
      }
      return { run: vi.fn(() => ({ changes: 1 })) };
    });

    const result = await fireDueReminders("2026-05-10T12:05:00.000Z");

    expect(result).toMatchObject({ fired: 1, errors: 0 });
    expect(mocks.sendReminderEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "ada@example.com",
        reminderTitle: "Follow up",
      }),
    );
  });

  it("marks fired even when email delivery fails and reports the error", async () => {
    mocks.prepare.mockImplementation((sql: string) => {
      if (sql.includes("PRAGMA table_info")) {
        return {
          all: vi.fn(() => [{ name: "fired_at" }, { name: "notify_by_email" }]),
        };
      }
      if (sql.includes("SELECT r.id")) {
        return {
          all: vi.fn(() => [{ ...dueReminder, notify_by_email: 1 }]),
        };
      }
      return { run: vi.fn(() => ({ changes: 1 })) };
    });
    mocks.sendReminderEmail.mockResolvedValue({
      ok: false,
      status: 500,
      error: "sender down",
    });

    const result = await fireDueReminders("2026-05-10T12:05:00.000Z");

    expect(result).toMatchObject({ fired: 1, errors: 1 });
    expect(mocks.prepare).not.toHaveBeenCalledWith(
      "UPDATE reminders SET fired_at = NULL WHERE id = ?",
    );
  });

  it("rolls back fired_at when notification creation fails", async () => {
    mocks.createReminderNotification.mockImplementation(() => {
      throw new Error("notification failed");
    });

    const result = await fireDueReminders("2026-05-10T12:05:00.000Z");

    expect(result).toMatchObject({ fired: 0, errors: 1 });
    expect(mocks.prepare).toHaveBeenCalledWith(
      "UPDATE reminders SET fired_at = NULL WHERE id = ?",
    );
  });

  it("adds the firing columns and index when ensuring schema", () => {
    mocks.prepare.mockImplementation((sql: string) => {
      if (sql.includes("PRAGMA table_info")) {
        return { all: vi.fn(() => []) };
      }
      return { run: vi.fn(() => ({ changes: 1 })) };
    });

    ensureRemindersFiringSchema();

    const sql = (mocks.prepare as Mock).mock.calls.map(([value]) =>
      String(value),
    );
    expect(sql).toContain("ALTER TABLE reminders ADD COLUMN fired_at TEXT");
    expect(sql).toContain(
      "ALTER TABLE reminders ADD COLUMN notify_by_email INTEGER NOT NULL DEFAULT 0",
    );
    expect(sql).toContain(
      "CREATE INDEX IF NOT EXISTS idx_reminders_due_unfired ON reminders(due_date, fired_at)",
    );
  });
});
