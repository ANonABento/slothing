import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  execute: vi.fn(),
}));

vi.mock("./client", () => ({
  getClient: () => dbMocks,
}));

import {
  getDocumentCount,
  getGeneratedResumeAnalyticsView,
  getGeneratedResumeCount,
  getInterviewSessionStats,
  getJobsAnalyticsView,
  getProfileAnalyticsView,
} from "./analytics-queries";

function result(rows: unknown[] = []) {
  return { rows, rowsAffected: 0 };
}

describe("analytics query helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbMocks.execute.mockResolvedValue(result([]));
  });

  it("loads the narrow jobs analytics view without large text columns", async () => {
    dbMocks.execute.mockResolvedValueOnce(
      result([
        {
          id: "job-1",
          title: "Engineer",
          company: "Acme",
          type: "full-time",
          status: "applied",
          keywords_json: '["TypeScript","React"]',
          applied_at: "2026-01-02T00:00:00.000Z",
          created_at: "2026-01-01T00:00:00.000Z",
        },
      ]),
    );

    const rows = await getJobsAnalyticsView("user-1");

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining(
        "SELECT id, title, company, type, status, keywords_json, applied_at, created_at",
      ),
      args: ["user-1"],
    });
    expect(dbMocks.execute).not.toHaveBeenCalledWith({
      sql: expect.stringContaining("description"),
      args: expect.anything(),
    });
    expect(rows).toEqual([
      {
        id: "job-1",
        title: "Engineer",
        company: "Acme",
        type: "full-time",
        status: "applied",
        keywords: ["TypeScript", "React"],
        appliedAt: "2026-01-02T00:00:00.000Z",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ]);
  });

  it("returns a scoped profile analytics view with counts only", async () => {
    dbMocks.execute
      .mockResolvedValueOnce(
        result([
          {
            id: "user-1",
            contact_json: '{"name":"Ava","email":"ava@example.com"}',
            summary: "A long enough summary for profile completeness.",
          },
        ]),
      )
      .mockResolvedValueOnce(result([{ name: "React", category: "frontend" }]))
      .mockResolvedValueOnce(result([{ count: 2 }]))
      .mockResolvedValueOnce(result([{ count: 1 }]))
      .mockResolvedValueOnce(result([{ count: 3 }]))
      .mockResolvedValueOnce(result([{ count: 0 }]));

    await expect(getProfileAnalyticsView("user-1")).resolves.toEqual({
      contact: { name: "Ava", email: "ava@example.com" },
      summary: "A long enough summary for profile completeness.",
      skills: [{ name: "React", category: "frontend" }],
      experienceCount: 2,
      educationCount: 1,
      projectCount: 3,
      certificationCount: 0,
    });
  });

  it("returns empty profile as null and zero counts for empty users", async () => {
    await expect(getProfileAnalyticsView("missing")).resolves.toBeNull();
  });

  it("aggregates interview session status counts", async () => {
    dbMocks.execute.mockResolvedValueOnce(
      result([
        { status: "completed", count: 4 },
        { status: "in_progress", count: 2 },
      ]),
    );

    await expect(getInterviewSessionStats("user-1")).resolves.toEqual({
      total: 6,
      completed: 4,
      inProgress: 2,
    });
    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.stringContaining("FROM interview_sessions"),
      args: ["user-1"],
    });
  });

  it("counts documents and generated resumes without hydrating rows", async () => {
    dbMocks.execute.mockResolvedValue(result([{ count: 7 }]));

    await expect(getDocumentCount("user-1")).resolves.toBe(7);
    await expect(getGeneratedResumeCount("user-1")).resolves.toBe(7);
  });

  it("loads generated resume analytics without content_json", async () => {
    dbMocks.execute.mockResolvedValueOnce(
      result([
        {
          id: "resume-1",
          job_id: "job-1",
          profile_id: "user-1",
          pdf_path: "/tmp/resume.html",
          match_score: 91,
          created_at: "2026-01-03T00:00:00.000Z",
        },
      ]),
    );

    const rows = await getGeneratedResumeAnalyticsView("user-1");

    expect(dbMocks.execute).toHaveBeenCalledWith({
      sql: expect.not.stringContaining("content_json"),
      args: ["user-1"],
    });
    expect(rows[0]).toMatchObject({
      id: "resume-1",
      jobId: "job-1",
      contentJson: "",
      matchScore: 91,
    });
  });
});
