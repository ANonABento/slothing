import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "test-tracking-id",
}));

import {
  deleteTrackingEntry,
  getTrackedResumeIds,
  getTrackingEntries,
  getTrackingEntriesByResume,
  trackResumeSent,
  updateTrackingOutcome,
} from "./resume-tracking";

const TEST_USER_ID = "test-user";

const trackingRow = {
  id: "e1",
  resume_id: "r1",
  job_id: "j1",
  outcome: "applied",
  sent_at: "2024-01-01",
  updated_at: "2024-01-01",
  notes: "test note",
};

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

describe("Resume A/B Tracking Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.execute.mockResolvedValue(result([], 1));
  });

  describe("trackResumeSent", () => {
    it("should insert a new tracking entry with applied outcome", async () => {
      const entry = await trackResumeSent(
        "resume-123",
        "job-456",
        TEST_USER_ID,
      );

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("INSERT INTO resume_ab_tracking"),
        args: [
          "test-tracking-id",
          "resume-123",
          "job-456",
          TEST_USER_ID,
          expect.any(String),
          expect.any(String),
          null,
          "resume-123",
          TEST_USER_ID,
          "job-456",
          TEST_USER_ID,
        ],
      });
      expect(entry.id).toBe("test-tracking-id");
      expect(entry.resumeId).toBe("resume-123");
      expect(entry.jobId).toBe("job-456");
      expect(entry.outcome).toBe("applied");
    });

    it("should include notes when provided", async () => {
      const entry = await trackResumeSent(
        "resume-123",
        "job-456",
        TEST_USER_ID,
        "Tailored for role",
      );

      expect(entry.notes).toBe("Tailored for role");
    });

    it("should reject tracking when the resume or job is outside the user", async () => {
      dbMocks.execute.mockResolvedValueOnce(result([], 0));

      await expect(
        trackResumeSent("resume-123", "job-456", "user-1"),
      ).rejects.toThrow("Resume or job not found");
      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("INSERT INTO resume_ab_tracking"),
        args: [
          "test-tracking-id",
          "resume-123",
          "job-456",
          "user-1",
          expect.any(String),
          expect.any(String),
          null,
          "resume-123",
          "user-1",
          "job-456",
          "user-1",
        ],
      });
    });
  });

  describe("updateTrackingOutcome", () => {
    it("should update outcome and return true on success", async () => {
      await expect(
        updateTrackingOutcome("entry-1", "interviewing", TEST_USER_ID),
      ).resolves.toBe(true);

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("UPDATE resume_ab_tracking"),
        args: ["interviewing", expect.any(String), "entry-1", TEST_USER_ID],
      });
    });

    it("should return false when entry not found", async () => {
      dbMocks.execute.mockResolvedValueOnce(result([], 0));

      await expect(
        updateTrackingOutcome("nonexistent", "offered", TEST_USER_ID),
      ).resolves.toBe(false);
    });
  });

  describe("getTrackingEntries", () => {
    it("should return mapped tracking entries", async () => {
      dbMocks.execute.mockResolvedValueOnce(result([trackingRow]));

      await expect(getTrackingEntries(TEST_USER_ID)).resolves.toEqual([
        {
          id: "e1",
          resumeId: "r1",
          jobId: "j1",
          outcome: "applied",
          sentAt: "2024-01-01",
          updatedAt: "2024-01-01",
          notes: "test note",
        },
      ]);
    });

    it("should handle null notes", async () => {
      dbMocks.execute.mockResolvedValueOnce(
        result([{ ...trackingRow, notes: null }]),
      );

      const entries = await getTrackingEntries(TEST_USER_ID);

      expect(entries[0].notes).toBeUndefined();
    });

    it("should return empty array when no entries", async () => {
      dbMocks.execute.mockResolvedValueOnce(result([]));

      await expect(getTrackingEntries(TEST_USER_ID)).resolves.toEqual([]);
    });
  });

  describe("getTrackingEntriesByResume", () => {
    it("should filter by resume ID", async () => {
      await getTrackingEntriesByResume("resume-123", TEST_USER_ID);

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("WHERE resume_id = ? AND user_id = ?"),
        args: ["resume-123", TEST_USER_ID],
      });
    });
  });

  describe("getTrackedResumeIds", () => {
    it("should return distinct resume IDs", async () => {
      dbMocks.execute.mockResolvedValueOnce(
        result([{ resume_id: "r1" }, { resume_id: "r2" }]),
      );

      await expect(getTrackedResumeIds(TEST_USER_ID)).resolves.toEqual([
        "r1",
        "r2",
      ]);
    });
  });

  describe("deleteTrackingEntry", () => {
    it("should return true when entry deleted", async () => {
      await expect(deleteTrackingEntry("entry-1", TEST_USER_ID)).resolves.toBe(
        true,
      );
    });

    it("should return false when entry not found", async () => {
      dbMocks.execute.mockResolvedValueOnce(result([], 0));

      await expect(
        deleteTrackingEntry("nonexistent", TEST_USER_ID),
      ).resolves.toBe(false);
    });
  });
});
