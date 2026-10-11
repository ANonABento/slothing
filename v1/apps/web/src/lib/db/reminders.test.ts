import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

const schemaMocks = vi.hoisted(() => ({
  ensureRemindersFiringSchema: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "test-reminder-id",
}));

vi.mock("@/lib/reminders/fire-due", () => ({
  ensureRemindersFiringSchema: schemaMocks.ensureRemindersFiringSchema,
}));

import {
  createReminder,
  getReminders,
  completeReminder,
  dismissReminder,
  deleteReminder,
  updateReminder,
  ensureApplicationFollowUpReminder,
} from "./reminders";

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

describe("Reminder Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.execute.mockResolvedValue(result([], 1));
    schemaMocks.ensureRemindersFiringSchema.mockResolvedValue(undefined);
  });

  it("should create a reminder for a job owned by the user", async () => {
    dbMocks.execute.mockResolvedValueOnce(result([{ id: "job-1" }]));

    const created = await createReminder(
      {
        jobId: "job-1",
        type: "follow_up",
        title: "Follow up",
        dueDate: "2026-05-01T00:00:00.000Z",
      },
      "user-1",
    );

    expect(schemaMocks.ensureRemindersFiringSchema).toHaveBeenCalled();
    expect(dbMocks.execute).toHaveBeenNthCalledWith(1, {
      sql: "SELECT id FROM jobs WHERE id = ? AND user_id = ?",
      args: ["job-1", "user-1"],
    });
    expect(dbMocks.execute).toHaveBeenNthCalledWith(2, {
      sql: expect.stringContaining("INSERT INTO reminders"),
      args: [
        "test-reminder-id",
        "user-1",
        "job-1",
        "follow_up",
        "Follow up",
        null,
        "2026-05-01T00:00:00.000Z",
        0,
        expect.any(String),
      ],
    });
    expect(created.id).toBe("test-reminder-id");
  });

  it("should reject reminders for jobs outside the provided user", async () => {
    dbMocks.execute.mockResolvedValueOnce(result([]));

    await expect(
      createReminder(
        {
          jobId: "job-1",
          type: "follow_up",
          title: "Follow up",
          dueDate: "2026-05-01T00:00:00.000Z",
        },
        "user-1",
      ),
    ).rejects.toThrow("Job not found");
  });

  it("should list reminders scoped by reminder user_id", async () => {
    dbMocks.execute.mockResolvedValueOnce(
      result([
        {
          id: "reminder-1",
          job_id: "job-1",
          type: "deadline",
          title: "Apply",
          description: null,
          due_date: "2026-05-01T00:00:00.000Z",
          completed: 0,
          dismissed: 0,
          created_at: "2026-04-26T00:00:00.000Z",
          completed_at: null,
          fired_at: null,
          notify_by_email: 0,
          job_title: "Engineer",
          job_company: "Acme",
        },
      ]),
    );

    const rows = await getReminders({ userId: "user-1" });

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("WHERE r.user_id = ?"),
      args: ["user-1"],
    });
    expect(rows[0].jobTitle).toBe("Engineer");
  });

  it("should update reminder state only for the provided user", async () => {
    await completeReminder("reminder-1", "user-1");
    await dismissReminder("reminder-2", "user-1");
    await deleteReminder("reminder-3", "user-1");

    expect(dbMocks.execute).toHaveBeenNthCalledWith(1, {
      sql: expect.stringContaining("SET completed = 1"),
      args: [expect.any(String), "reminder-1", "user-1"],
    });
    expect(dbMocks.execute).toHaveBeenNthCalledWith(2, {
      sql: expect.stringContaining("SET dismissed = 1"),
      args: ["reminder-2", "user-1"],
    });
    expect(dbMocks.execute).toHaveBeenNthCalledWith(3, {
      sql: expect.stringContaining("DELETE FROM reminders"),
      args: ["reminder-3", "user-1"],
    });
  });

  it("should update reminder fields only for the provided user", async () => {
    await updateReminder(
      "reminder-1",
      { title: "New title", description: "" },
      "user-1",
    );

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("AND user_id = ?"),
      args: ["New title", null, "reminder-1", "user-1"],
    });
  });

  it("auto-creates a follow-up reminder when none is open for the job", async () => {
    // 1: dedupe SELECT (no open follow-up) → 2: createReminder job-ownership
    // SELECT → 3: INSERT.
    dbMocks.execute
      .mockResolvedValueOnce(result([]))
      .mockResolvedValueOnce(result([{ id: "job-1" }]))
      .mockResolvedValueOnce(result([], 1));

    const created = await ensureApplicationFollowUpReminder("job-1", "user-1");

    expect(dbMocks.execute).toHaveBeenNthCalledWith(1, {
      sql: expect.stringContaining("type = 'follow_up'"),
      args: ["user-1", "job-1"],
    });
    expect(dbMocks.execute).toHaveBeenNthCalledWith(3, {
      sql: expect.stringContaining("INSERT INTO reminders"),
      args: expect.arrayContaining(["job-1", "follow_up"]),
    });
    expect(created?.type).toBe("follow_up");
  });

  it("does not duplicate a follow-up reminder that already exists", async () => {
    dbMocks.execute.mockResolvedValueOnce(result([{ id: "existing" }]));

    const created = await ensureApplicationFollowUpReminder("job-1", "user-1");

    expect(created).toBeNull();
    // Only the dedupe SELECT ran — no ownership check, no INSERT.
    expect(dbMocks.execute).toHaveBeenCalledTimes(1);
  });
});
