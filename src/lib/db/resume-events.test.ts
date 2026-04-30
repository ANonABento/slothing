import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

vi.mock("./schema", () => {
  const mockDb = {
    prepare: vi.fn(),
  };
  return { default: mockDb };
});

vi.mock("@/lib/utils", () => ({
  generateId: () => "event-id",
}));

import db from "./schema";
import {
  getResumeEventSummary,
  getResumeEvents,
  recordResumeEvent,
} from "./resume-events";

describe("Resume event DB functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("records resume events only for resumes owned by the provided user", () => {
    vi.setSystemTime(new Date("2024-05-01T12:00:00.000Z"));
    const mockRun = vi.fn().mockReturnValue({ changes: 1 });
    (db.prepare as Mock).mockReturnValue({ run: mockRun });

    const event = recordResumeEvent("resume-1", "download", "user-1", {
      format: "pdf",
    });

    expect(db.prepare).toHaveBeenCalledWith(
      expect.stringContaining("WHERE EXISTS"),
    );
    expect(mockRun).toHaveBeenCalledWith(
      "event-id",
      "user-1",
      "resume-1",
      "download",
      "2024-05-01T12:00:00.000Z",
      JSON.stringify({ format: "pdf" }),
      "resume-1",
      "user-1",
    );
    expect(event).toEqual({
      id: "event-id",
      userId: "user-1",
      resumeId: "resume-1",
      eventType: "download",
      occurredAt: "2024-05-01T12:00:00.000Z",
      metadata: { format: "pdf" },
    });
  });

  it("rejects events for resumes outside the provided user", () => {
    const mockRun = vi.fn().mockReturnValue({ changes: 0 });
    (db.prepare as Mock).mockReturnValue({ run: mockRun });

    expect(() => recordResumeEvent("resume-1", "view", "user-1")).toThrow(
      "Resume not found",
    );
  });

  it("lists resume events with parsed metadata", () => {
    const mockAll = vi.fn().mockReturnValue([
      {
        id: "event-1",
        user_id: "user-1",
        resume_id: "resume-1",
        event_type: "share_click",
        occurred_at: "2024-05-01T12:00:00.000Z",
        metadata_json: JSON.stringify({ target: "copy-link" }),
      },
    ]);
    (db.prepare as Mock).mockReturnValue({ all: mockAll });

    expect(getResumeEvents("resume-1", "user-1")).toEqual([
      {
        id: "event-1",
        userId: "user-1",
        resumeId: "resume-1",
        eventType: "share_click",
        occurredAt: "2024-05-01T12:00:00.000Z",
        metadata: { target: "copy-link" },
      },
    ]);
    expect(mockAll).toHaveBeenCalledWith("resume-1", "user-1");
  });

  it("builds overview, trend, and top performer summaries", () => {
    vi.setSystemTime(new Date("2024-05-31T00:00:00.000Z"));
    const overviewGet = vi.fn().mockReturnValue({
      views: 3,
      downloads: 2,
      share_clicks: 1,
      total_events: 6,
    });
    const trendAll = vi.fn().mockReturnValue([
      {
        event_date: "2024-05-30",
        views: 2,
        downloads: 1,
        share_clicks: 0,
      },
    ]);
    const topAll = vi.fn().mockReturnValue([
      {
        resume_id: "resume-1",
        job_id: "job-1",
        job_title: "Senior Engineer",
        company: "Acme",
        created_at: "2024-05-01T00:00:00.000Z",
        views: 3,
        downloads: 2,
        share_clicks: 1,
        total_events: 6,
      },
    ]);
    (db.prepare as Mock)
      .mockReturnValueOnce({ get: overviewGet })
      .mockReturnValueOnce({ all: trendAll })
      .mockReturnValueOnce({ all: topAll });

    const summary = getResumeEventSummary("user-1", 30);

    expect(summary.overview).toEqual({
      totalViews: 3,
      totalDownloads: 2,
      totalShareClicks: 1,
      totalEvents: 6,
    });
    expect(summary.trend).toEqual([
      {
        date: "2024-05-30",
        views: 2,
        downloads: 1,
        shareClicks: 0,
      },
    ]);
    expect(summary.topPerformers[0]).toMatchObject({
      resumeId: "resume-1",
      jobTitle: "Senior Engineer",
      totalEvents: 6,
    });
    expect(overviewGet).toHaveBeenCalledWith(
      "user-1",
      "2024-05-01T00:00:00.000Z",
    );
  });
});
