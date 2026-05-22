import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

import {
  deleteCoverLetter,
  getAllCoverLetters,
  getCoverLetter,
  getCoverLetterCount,
  getCoverLettersByJob,
  getLatestCoverLetter,
  saveCoverLetter,
} from "./cover-letters";

const TEST_USER_ID = "test-user";

const coverLetterRow = {
  id: "cl-1",
  job_id: "job-1",
  profile_id: TEST_USER_ID,
  content: "Letter content",
  highlights_json: JSON.stringify(["highlight1"]),
  version: 1,
  created_at: "2024-01-01T00:00:00.000Z",
};

function result(rows: unknown[] = [], rowsAffected = 0) {
  return { rows, rowsAffected };
}

describe("Cover Letter Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.execute.mockResolvedValue(result([], 1));
  });

  describe("saveCoverLetter", () => {
    it("saves a cover letter with the next scoped version", async () => {
      dbMocks.execute.mockResolvedValueOnce(result([{ max_version: 2 }]));

      const saved = await saveCoverLetter(
        "job-1",
        "Dear hiring manager...",
        ["skill1"],
        "user-1",
      );

      expect(saved).toEqual({
        id: expect.any(String),
        jobId: "job-1",
        profileId: "user-1",
        content: "Dear hiring manager...",
        highlights: ["skill1"],
        version: 3,
        createdAt: expect.any(String),
      });
      expect(dbMocks.execute).toHaveBeenLastCalledWith({
        sql: expect.stringContaining("WHERE EXISTS"),
        args: [
          saved.id,
          "user-1",
          "job-1",
          "user-1",
          "Dear hiring manager...",
          JSON.stringify(["skill1"]),
          3,
          "job-1",
          "user-1",
        ],
      });
    });

    it("starts at version 1 when no existing letters exist", async () => {
      dbMocks.execute.mockResolvedValueOnce(result([{ max_version: null }]));

      const saved = await saveCoverLetter(
        "job-1",
        "Content",
        undefined,
        TEST_USER_ID,
      );

      expect(saved.version).toBe(1);
    });

    it("rejects cover letters for jobs outside the provided user", async () => {
      dbMocks.execute
        .mockResolvedValueOnce(result([{ max_version: null }]))
        .mockResolvedValueOnce(result([], 0));

      await expect(
        saveCoverLetter("job-1", "Content", [], "user-1"),
      ).rejects.toThrow("Job not found");
    });
  });

  describe("getCoverLettersByJob", () => {
    it("returns all cover letters for a job", async () => {
      dbMocks.execute.mockResolvedValueOnce(result([coverLetterRow]));

      await expect(
        getCoverLettersByJob("job-1", TEST_USER_ID),
      ).resolves.toEqual([
        {
          id: "cl-1",
          jobId: "job-1",
          profileId: TEST_USER_ID,
          content: "Letter content",
          highlights: ["highlight1"],
          version: 1,
          createdAt: "2024-01-01T00:00:00.000Z",
        },
      ]);
      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: expect.stringContaining("WHERE job_id = ? AND user_id = ?"),
        args: ["job-1", TEST_USER_ID],
      });
    });
  });

  describe("getLatestCoverLetter", () => {
    it("returns the latest cover letter for a job", async () => {
      dbMocks.execute.mockResolvedValueOnce(
        result([{ ...coverLetterRow, id: "cl-2", highlights_json: null }]),
      );

      const coverLetter = await getLatestCoverLetter("job-1", TEST_USER_ID);

      expect(coverLetter?.highlights).toEqual([]);
      expect(coverLetter?.id).toBe("cl-2");
    });

    it("returns null when no cover letter exists", async () => {
      await expect(
        getLatestCoverLetter("job-1", TEST_USER_ID),
      ).resolves.toBeNull();
    });
  });

  describe("getCoverLetter", () => {
    it("returns a specific cover letter by id", async () => {
      dbMocks.execute.mockResolvedValueOnce(result([coverLetterRow]));

      const coverLetter = await getCoverLetter("cl-1", TEST_USER_ID);

      expect(coverLetter?.id).toBe("cl-1");
    });

    it("returns null when not found", async () => {
      await expect(getCoverLetter("missing", TEST_USER_ID)).resolves.toBeNull();
    });
  });

  describe("deleteCoverLetter", () => {
    it("returns true when deleted", async () => {
      await expect(deleteCoverLetter("cl-1", TEST_USER_ID)).resolves.toBe(true);
    });

    it("returns false when not found", async () => {
      dbMocks.execute.mockResolvedValueOnce(result([], 0));

      await expect(deleteCoverLetter("missing", TEST_USER_ID)).resolves.toBe(
        false,
      );
    });
  });

  describe("getCoverLetterCount", () => {
    it("returns the count", async () => {
      dbMocks.execute.mockResolvedValueOnce(result([{ count: 5 }]));

      await expect(getCoverLetterCount("job-1", TEST_USER_ID)).resolves.toBe(5);
    });
  });

  describe("getAllCoverLetters", () => {
    it("returns all cover letters for a user", async () => {
      dbMocks.execute.mockResolvedValueOnce(
        result([
          coverLetterRow,
          {
            ...coverLetterRow,
            id: "cl-2",
            job_id: "job-2",
            content: "Second letter",
            highlights_json: null,
          },
        ]),
      );

      const rows = await getAllCoverLetters(TEST_USER_ID);

      expect(dbMocks.execute).toHaveBeenCalledWith({
        sql: "SELECT * FROM cover_letters WHERE user_id = ? ORDER BY created_at DESC",
        args: [TEST_USER_ID],
      });
      expect(rows).toHaveLength(2);
      expect(rows[0].highlights).toEqual(["highlight1"]);
      expect(rows[1].highlights).toEqual([]);
    });

    it("returns empty array when no cover letters exist", async () => {
      await expect(getAllCoverLetters("user-1")).resolves.toEqual([]);
    });
  });
});
