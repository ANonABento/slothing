import { beforeEach, describe, expect, it, vi } from "vitest";

const { executeMock } = vi.hoisted(() => ({
  executeMock: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => ({ execute: executeMock }),
}));

vi.mock("@/lib/utils", () => ({
  generateId: () => "test-resume-id",
}));

import {
  deleteGeneratedResume,
  getAllGeneratedResumes,
  getGeneratedResume,
  getGeneratedResumeCount,
  getGeneratedResumes,
  saveGeneratedResume,
  STANDALONE_RESUME_JOB_ID,
} from "./resumes";

const TEST_USER_ID = "test-user";

describe("Resume Database Functions", () => {
  beforeEach(() => {
    executeMock.mockReset();
  });

  describe("saveGeneratedResume", () => {
    it("saves a generated resume through the async client", async () => {
      executeMock.mockResolvedValue({ rowsAffected: 1, rows: [] });

      const content = { name: "John Doe", skills: ["JavaScript"] };
      const result = await saveGeneratedResume(
        "job-123",
        "professional",
        content,
        "/path/to/resume.html",
        85,
        TEST_USER_ID,
      );

      expect(executeMock).toHaveBeenCalledWith({
        sql: expect.stringContaining(
          "WHERE EXISTS (SELECT 1 FROM jobs WHERE id = ? AND user_id = ?)",
        ),
        args: [
          "test-resume-id",
          TEST_USER_ID,
          "job-123",
          TEST_USER_ID,
          JSON.stringify(content),
          "/path/to/resume.html",
          85,
          expect.any(String),
          "job-123",
          TEST_USER_ID,
        ],
      });
      expect(result).toEqual({
        id: "test-resume-id",
        jobId: "job-123",
        profileId: TEST_USER_ID,
        templateId: "professional",
        contentJson: JSON.stringify(content),
        htmlPath: "/path/to/resume.html",
        matchScore: 85,
        createdAt: expect.any(String),
      });
    });

    it("uses null for missing matchScore", async () => {
      executeMock.mockResolvedValue({ rowsAffected: 1, rows: [] });

      const result = await saveGeneratedResume(
        "job-123",
        "modern",
        {},
        "/path/to/resume.html",
        undefined,
        TEST_USER_ID,
      );

      expect(result.matchScore).toBeUndefined();
      expect(executeMock.mock.calls[0][0].args[6]).toBeNull();
    });

    it("rejects resumes for jobs outside the provided user", async () => {
      executeMock.mockResolvedValue({ rowsAffected: 0, rows: [] });

      await expect(
        saveGeneratedResume(
          "job-123",
          "modern",
          {},
          "/path/to/resume.html",
          undefined,
          "user-123",
        ),
      ).rejects.toThrow("Job not found");
    });

    it("allows standalone resumes without a job ownership check", async () => {
      executeMock.mockResolvedValue({ rowsAffected: 1, rows: [] });

      const result = await saveGeneratedResume(
        STANDALONE_RESUME_JOB_ID,
        "retrieval",
        {},
        "",
        undefined,
        "user-123",
      );

      expect(result.jobId).toBe(STANDALONE_RESUME_JOB_ID);
      expect(executeMock).toHaveBeenCalledWith({
        sql: expect.not.stringContaining("WHERE EXISTS"),
        args: [
          "test-resume-id",
          "user-123",
          STANDALONE_RESUME_JOB_ID,
          "user-123",
          JSON.stringify({}),
          "",
          null,
          expect.any(String),
        ],
      });
    });
  });

  describe("getGeneratedResumes", () => {
    it("returns all resumes for a job", async () => {
      executeMock.mockResolvedValue({
        rows: [
          {
            id: "resume-1",
            job_id: "job-123",
            profile_id: TEST_USER_ID,
            content_json: '{"name": "John"}',
            pdf_path: "/path/resume1.html",
            match_score: 90,
            created_at: "2024-01-15T10:00:00.000Z",
          },
          {
            id: "resume-2",
            job_id: "job-123",
            profile_id: TEST_USER_ID,
            content_json: '{"name": "John v2"}',
            pdf_path: "/path/resume2.html",
            match_score: 95,
            created_at: "2024-01-16T10:00:00.000Z",
          },
        ],
      });

      const result = await getGeneratedResumes("job-123", TEST_USER_ID);

      expect(executeMock).toHaveBeenCalledWith({
        sql: expect.stringContaining("WHERE job_id = ? AND user_id = ?"),
        args: ["job-123", TEST_USER_ID],
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "resume-1",
        jobId: "job-123",
        profileId: TEST_USER_ID,
        templateId: "",
        contentJson: '{"name": "John"}',
        htmlPath: "/path/resume1.html",
        matchScore: 90,
        createdAt: "2024-01-15T10:00:00.000Z",
      });
    });

    it("maps null matchScore to undefined", async () => {
      executeMock.mockResolvedValue({
        rows: [
          {
            id: "resume-1",
            job_id: "job-123",
            profile_id: TEST_USER_ID,
            content_json: "{}",
            pdf_path: "/path/resume.html",
            match_score: null,
            created_at: "2024-01-15T10:00:00.000Z",
          },
        ],
      });

      const result = await getGeneratedResumes("job-123", TEST_USER_ID);

      expect(result[0].matchScore).toBeUndefined();
    });
  });

  describe("getGeneratedResume", () => {
    it("returns resume by id", async () => {
      executeMock.mockResolvedValue({
        rows: [
          {
            id: "resume-1",
            job_id: "job-123",
            profile_id: TEST_USER_ID,
            content_json: '{"skills": ["React"]}',
            pdf_path: "/path/resume.html",
            match_score: 88,
            created_at: "2024-01-15T10:00:00.000Z",
          },
        ],
      });

      const result = await getGeneratedResume("resume-1", TEST_USER_ID);

      expect(executeMock).toHaveBeenCalledWith({
        sql: expect.stringContaining("WHERE id = ? AND user_id = ?"),
        args: ["resume-1", TEST_USER_ID],
      });
      expect(result).toEqual({
        id: "resume-1",
        jobId: "job-123",
        profileId: TEST_USER_ID,
        templateId: "",
        contentJson: '{"skills": ["React"]}',
        htmlPath: "/path/resume.html",
        matchScore: 88,
        createdAt: "2024-01-15T10:00:00.000Z",
      });
    });

    it("returns null for a missing resume", async () => {
      executeMock.mockResolvedValue({ rows: [] });

      await expect(
        getGeneratedResume("non-existent", TEST_USER_ID),
      ).resolves.toBeNull();
    });
  });

  describe("deleteGeneratedResume", () => {
    it("deletes resume by id for the current user", async () => {
      executeMock.mockResolvedValue({ rowsAffected: 1, rows: [] });

      await deleteGeneratedResume("resume-1", TEST_USER_ID);

      expect(executeMock).toHaveBeenCalledWith({
        sql: "DELETE FROM generated_resumes WHERE id = ? AND user_id = ?",
        args: ["resume-1", TEST_USER_ID],
      });
    });
  });

  describe("getAllGeneratedResumes", () => {
    it("returns all resumes across all jobs", async () => {
      executeMock.mockResolvedValue({
        rows: [
          {
            id: "resume-1",
            job_id: "job-123",
            profile_id: TEST_USER_ID,
            content_json: "{}",
            pdf_path: "/path/r1.html",
            match_score: 90,
            created_at: "2024-01-16T10:00:00.000Z",
          },
          {
            id: "resume-2",
            job_id: "job-456",
            profile_id: TEST_USER_ID,
            content_json: "{}",
            pdf_path: "/path/r2.html",
            match_score: 85,
            created_at: "2024-01-15T10:00:00.000Z",
          },
        ],
      });

      const result = await getAllGeneratedResumes(TEST_USER_ID);

      expect(executeMock).toHaveBeenCalledWith({
        sql: expect.stringContaining("WHERE user_id = ?"),
        args: [TEST_USER_ID],
      });
      expect(result).toHaveLength(2);
      expect(result[0].jobId).toBe("job-123");
      expect(result[1].jobId).toBe("job-456");
    });
  });

  describe("getGeneratedResumeCount", () => {
    it("returns count of all generated resumes", async () => {
      executeMock.mockResolvedValue({ rows: [{ count: 42 }] });

      await expect(getGeneratedResumeCount(TEST_USER_ID)).resolves.toBe(42);
      expect(executeMock).toHaveBeenCalledWith({
        sql: "SELECT COUNT(*) as count FROM generated_resumes WHERE user_id = ?",
        args: [TEST_USER_ID],
      });
    });

    it("returns 0 when no count row exists", async () => {
      executeMock.mockResolvedValue({ rows: [] });

      await expect(getGeneratedResumeCount(TEST_USER_ID)).resolves.toBe(0);
    });
  });
});
