import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

vi.mock("./legacy", () => ({
  default: {
    prepare: vi.fn(),
  },
}));

import db from "./legacy";
import {
  getDocumentCount,
  getGeneratedResumeAnalyticsView,
  getGeneratedResumeCount,
  getInterviewSessionStats,
  getJobsAnalyticsView,
  getProfileAnalyticsView,
} from "./analytics-queries";

describe("analytics query helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads the narrow jobs analytics view without large text columns", () => {
    const all = vi.fn().mockReturnValue([
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
    ]);
    (db.prepare as Mock).mockReturnValue({ all });

    const result = getJobsAnalyticsView("user-1");

    expect(db.prepare).toHaveBeenCalledWith(
      expect.stringContaining(
        "SELECT id, title, company, type, status, keywords_json, applied_at, created_at",
      ),
    );
    expect(db.prepare).not.toHaveBeenCalledWith(
      expect.stringContaining("description"),
    );
    expect(all).toHaveBeenCalledWith("user-1");
    expect(result).toEqual([
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

  it("returns a scoped profile analytics view with counts only", () => {
    const get = vi
      .fn()
      .mockReturnValueOnce({
        id: "user-1",
        contact_json: '{"name":"Ava","email":"ava@example.com"}',
        summary: "A long enough summary for profile completeness.",
      })
      .mockReturnValueOnce({ count: 2 })
      .mockReturnValueOnce({ count: 1 })
      .mockReturnValueOnce({ count: 3 })
      .mockReturnValueOnce({ count: 0 });
    const all = vi
      .fn()
      .mockReturnValue([{ name: "React", category: "frontend" }]);
    (db.prepare as Mock).mockImplementation((sql: string) =>
      sql.includes("FROM skills") ? { all } : { get },
    );

    const result = getProfileAnalyticsView("user-1");

    expect(result).toEqual({
      contact: { name: "Ava", email: "ava@example.com" },
      summary: "A long enough summary for profile completeness.",
      skills: [{ name: "React", category: "frontend" }],
      experienceCount: 2,
      educationCount: 1,
      projectCount: 3,
      certificationCount: 0,
    });
    expect(all).toHaveBeenCalledWith("user-1");
    expect(get).toHaveBeenNthCalledWith(1, "user-1");
  });

  it("returns empty profile as null and zero counts for empty users", () => {
    const get = vi.fn().mockReturnValue(undefined);
    (db.prepare as Mock).mockReturnValue({ get });

    expect(getProfileAnalyticsView("missing")).toBeNull();
  });

  it("aggregates interview session status counts", () => {
    const all = vi.fn().mockReturnValue([
      { status: "completed", count: 4 },
      { status: "in_progress", count: 2 },
    ]);
    (db.prepare as Mock).mockReturnValue({ all });

    expect(getInterviewSessionStats("user-1")).toEqual({
      total: 6,
      completed: 4,
      inProgress: 2,
    });
    expect(all).toHaveBeenCalledWith("user-1");
  });

  it("counts documents and generated resumes without hydrating rows", () => {
    const get = vi.fn().mockReturnValue({ count: 7 });
    (db.prepare as Mock).mockReturnValue({ get });

    expect(getDocumentCount("user-1")).toBe(7);
    expect(getGeneratedResumeCount("user-1")).toBe(7);
  });

  it("loads generated resume analytics without content_json", () => {
    const all = vi.fn().mockReturnValue([
      {
        id: "resume-1",
        job_id: "job-1",
        profile_id: "user-1",
        pdf_path: "/tmp/resume.html",
        match_score: 91,
        created_at: "2026-01-03T00:00:00.000Z",
      },
    ]);
    (db.prepare as Mock).mockReturnValue({ all });

    const result = getGeneratedResumeAnalyticsView("user-1");

    expect(db.prepare).toHaveBeenCalledWith(
      expect.not.stringContaining("content_json"),
    );
    expect(result[0]).toMatchObject({
      id: "resume-1",
      jobId: "job-1",
      contentJson: "",
      matchScore: 91,
    });
  });
});
