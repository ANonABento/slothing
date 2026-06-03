import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "status-id",
}));

import {
  getAnalyticsSnapshots,
  getAverageTimeInStatus,
  getJobStatusHistory,
  recordJobStatusChange,
  saveAnalyticsSnapshot,
} from "./analytics";

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

describe("Analytics DB Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.execute.mockResolvedValue(result([], 1));
  });

  describe("saveAnalyticsSnapshot", () => {
    it("upserts snapshots by user and snapshot day", async () => {
      const snapshot = await saveAnalyticsSnapshot(
        {
          userId: "user-123",
          snapshotDate: "2026-05-20",
          totalJobs: 4,
          jobsSaved: 1,
          jobsApplied: 2,
          jobsInterviewing: 1,
          jobsOffered: 0,
          jobsRejected: 0,
          totalInterviews: 3,
          interviewsCompleted: 2,
          totalDocuments: 5,
          totalResumes: 6,
          profileCompleteness: 80,
        },
        "user-123",
      );

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining(
          "INSERT OR REPLACE INTO analytics_snapshots",
        ),
        args: [
          "user-123",
          "2026-05-20",
          "status-id",
          "user-123",
          "2026-05-20",
          4,
          1,
          2,
          1,
          0,
          0,
          3,
          2,
          5,
          6,
          80,
          expect.any(String),
        ],
      });
      expect(snapshot.id).toBe("status-id");
      expect(snapshot.totalJobs).toBe(4);
    });
  });

  describe("getAnalyticsSnapshots", () => {
    it("maps snapshot rows in the requested date range", async () => {
      dbMocks.execute.mockResolvedValueOnce(
        result([
          {
            id: "snapshot-1",
            user_id: "user-123",
            snapshot_date: "2026-05-20",
            total_jobs: 4,
            jobs_saved: 1,
            jobs_applied: 2,
            jobs_interviewing: 1,
            jobs_offered: 0,
            jobs_rejected: 0,
            total_interviews: 3,
            interviews_completed: 2,
            total_documents: 5,
            total_resumes: 6,
            profile_completeness: 80,
            created_at: "2026-05-20T00:00:00.000Z",
          },
        ]),
      );

      await expect(
        getAnalyticsSnapshots("2026-05-01", "2026-05-20", "user-123"),
      ).resolves.toEqual([
        {
          id: "snapshot-1",
          userId: "user-123",
          snapshotDate: "2026-05-20",
          totalJobs: 4,
          jobsSaved: 1,
          jobsApplied: 2,
          jobsInterviewing: 1,
          jobsOffered: 0,
          jobsRejected: 0,
          totalInterviews: 3,
          interviewsCompleted: 2,
          totalDocuments: 5,
          totalResumes: 6,
          profileCompleteness: 80,
          createdAt: "2026-05-20T00:00:00.000Z",
        },
      ]);
    });
  });

  describe("recordJobStatusChange", () => {
    it("records status changes only for the provided user job", async () => {
      const status = await recordJobStatusChange(
        "job-1",
        "saved",
        "applied",
        "Submitted",
        "user-123",
      );

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("WHERE EXISTS"),
        args: [
          "status-id",
          "user-123",
          "job-1",
          "saved",
          "applied",
          expect.any(String),
          "Submitted",
          "job-1",
          "user-123",
        ],
      });
      expect(status.userId).toBe("user-123");
    });

    it("rejects status changes for jobs outside the provided user", async () => {
      dbMocks.execute.mockResolvedValueOnce(result([], 0));

      await expect(
        recordJobStatusChange(
          "job-1",
          "saved",
          "applied",
          undefined,
          "user-123",
        ),
      ).rejects.toThrow("Job not found");
    });
  });

  describe("getJobStatusHistory", () => {
    it("scopes status history by job and user", async () => {
      dbMocks.execute.mockResolvedValueOnce(
        result([
          {
            id: "status-id",
            user_id: "user-123",
            job_id: "job-1",
            from_status: "saved",
            to_status: "applied",
            changed_at: "2024-01-01T00:00:00.000Z",
            notes: null,
          },
        ]),
      );

      await expect(getJobStatusHistory("job-1", "user-123")).resolves.toEqual([
        {
          id: "status-id",
          userId: "user-123",
          jobId: "job-1",
          fromStatus: "saved",
          toStatus: "applied",
          changedAt: "2024-01-01T00:00:00.000Z",
          notes: undefined,
        },
      ]);
      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("WHERE job_id = ? AND user_id = ?"),
        args: ["job-1", "user-123"],
      });
    });
  });

  describe("getAverageTimeInStatus", () => {
    it("averages status durations from ordered status changes", async () => {
      dbMocks.execute.mockResolvedValueOnce(
        result([
          {
            job_id: "job-1",
            from_status: "saved",
            to_status: "saved",
            changed_at: "2026-05-01T00:00:00.000Z",
          },
          {
            job_id: "job-1",
            from_status: "saved",
            to_status: "applied",
            changed_at: "2026-05-03T00:00:00.000Z",
          },
        ]),
      );

      await expect(getAverageTimeInStatus("user-123")).resolves.toEqual({
        saved: 2,
      });
    });
  });
});
