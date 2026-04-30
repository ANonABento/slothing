import db from "./schema";
import { generateId } from "@/lib/utils";

export const RESUME_EVENT_TYPES = ["view", "download", "share_click"] as const;

export type ResumeEventType = (typeof RESUME_EVENT_TYPES)[number];

export interface ResumeEvent {
  id: string;
  userId: string;
  resumeId: string;
  eventType: ResumeEventType;
  occurredAt: string;
  metadata?: Record<string, unknown>;
}

export interface ResumeEventTrendPoint {
  date: string;
  views: number;
  downloads: number;
  shareClicks: number;
}

export interface ResumeEventTopPerformer {
  resumeId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  createdAt: string;
  views: number;
  downloads: number;
  shareClicks: number;
  totalEvents: number;
}

export interface ResumeEventSummary {
  overview: {
    totalViews: number;
    totalDownloads: number;
    totalShareClicks: number;
    totalEvents: number;
  };
  trend: ResumeEventTrendPoint[];
  topPerformers: ResumeEventTopPerformer[];
}

const MAX_ANALYTICS_DAYS = 365;

function parseMetadata(metadataJson: string | null): Record<string, unknown> | undefined {
  if (!metadataJson) return undefined;

  try {
    const parsed = JSON.parse(metadataJson);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
}

function mapEventRow(row: {
  id: string;
  user_id: string;
  resume_id: string;
  event_type: ResumeEventType;
  occurred_at: string;
  metadata_json: string | null;
}): ResumeEvent {
  return {
    id: row.id,
    userId: row.user_id,
    resumeId: row.resume_id,
    eventType: row.event_type,
    occurredAt: row.occurred_at,
    metadata: parseMetadata(row.metadata_json),
  };
}

export function recordResumeEvent(
  resumeId: string,
  eventType: ResumeEventType,
  userId: string = "default",
  metadata?: Record<string, unknown>,
): ResumeEvent {
  const id = generateId();
  const occurredAt = new Date().toISOString();
  const metadataJson = metadata ? JSON.stringify(metadata) : null;

  const stmt = db.prepare(`
    INSERT INTO resume_events (id, user_id, resume_id, event_type, occurred_at, metadata_json)
    SELECT ?, ?, ?, ?, ?, ?
    WHERE EXISTS (SELECT 1 FROM generated_resumes WHERE id = ? AND user_id = ?)
  `);

  const result = stmt.run(
    id,
    userId,
    resumeId,
    eventType,
    occurredAt,
    metadataJson,
    resumeId,
    userId,
  );

  if (result.changes === 0) {
    throw new Error("Resume not found");
  }

  return {
    id,
    userId,
    resumeId,
    eventType,
    occurredAt,
    metadata,
  };
}

export function getResumeEvents(
  resumeId: string,
  userId: string = "default",
): ResumeEvent[] {
  const stmt = db.prepare(`
    SELECT id, user_id, resume_id, event_type, occurred_at, metadata_json
    FROM resume_events
    WHERE resume_id = ? AND user_id = ?
    ORDER BY occurred_at DESC
  `);

  const rows = stmt.all(resumeId, userId) as Array<{
    id: string;
    user_id: string;
    resume_id: string;
    event_type: ResumeEventType;
    occurred_at: string;
    metadata_json: string | null;
  }>;

  return rows.map(mapEventRow);
}

export function getResumeEventSummary(
  userId: string = "default",
  days: number = 30,
): ResumeEventSummary {
  const safeDays =
    Number.isFinite(days) && days > 0
      ? Math.min(Math.floor(days), MAX_ANALYTICS_DAYS)
      : 30;
  const since = new Date(
    Date.now() - safeDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  const overviewRow = db
    .prepare(
      `
      SELECT
        SUM(CASE WHEN event_type = 'view' THEN 1 ELSE 0 END) AS views,
        SUM(CASE WHEN event_type = 'download' THEN 1 ELSE 0 END) AS downloads,
        SUM(CASE WHEN event_type = 'share_click' THEN 1 ELSE 0 END) AS share_clicks,
        COUNT(*) AS total_events
      FROM resume_events
      WHERE user_id = ? AND occurred_at >= ?
    `,
    )
    .get(userId, since) as {
    views: number | null;
    downloads: number | null;
    share_clicks: number | null;
    total_events: number;
  };

  const trendRows = db
    .prepare(
      `
      SELECT
        substr(occurred_at, 1, 10) AS event_date,
        SUM(CASE WHEN event_type = 'view' THEN 1 ELSE 0 END) AS views,
        SUM(CASE WHEN event_type = 'download' THEN 1 ELSE 0 END) AS downloads,
        SUM(CASE WHEN event_type = 'share_click' THEN 1 ELSE 0 END) AS share_clicks
      FROM resume_events
      WHERE user_id = ? AND occurred_at >= ?
      GROUP BY event_date
      ORDER BY event_date ASC
    `,
    )
    .all(userId, since) as Array<{
    event_date: string;
    views: number | null;
    downloads: number | null;
    share_clicks: number | null;
  }>;

  const topRows = db
    .prepare(
      `
      SELECT
        r.id AS resume_id,
        r.job_id,
        COALESCE(j.title, CASE WHEN r.job_id = 'standalone' THEN 'Standalone resume' ELSE 'Untitled job' END) AS job_title,
        COALESCE(j.company, '') AS company,
        r.created_at,
        SUM(CASE WHEN e.event_type = 'view' THEN 1 ELSE 0 END) AS views,
        SUM(CASE WHEN e.event_type = 'download' THEN 1 ELSE 0 END) AS downloads,
        SUM(CASE WHEN e.event_type = 'share_click' THEN 1 ELSE 0 END) AS share_clicks,
        COUNT(e.id) AS total_events
      FROM generated_resumes r
      LEFT JOIN jobs j ON j.id = r.job_id AND j.user_id = r.user_id
      LEFT JOIN resume_events e
        ON e.resume_id = r.id
        AND e.user_id = r.user_id
        AND e.occurred_at >= ?
      WHERE r.user_id = ?
      GROUP BY r.id
      ORDER BY total_events DESC, downloads DESC, views DESC, r.created_at DESC
      LIMIT 10
    `,
    )
    .all(since, userId) as Array<{
    resume_id: string;
    job_id: string;
    job_title: string;
    company: string;
    created_at: string;
    views: number | null;
    downloads: number | null;
    share_clicks: number | null;
    total_events: number;
  }>;

  const totalViews = overviewRow.views ?? 0;
  const totalDownloads = overviewRow.downloads ?? 0;
  const totalShareClicks = overviewRow.share_clicks ?? 0;

  return {
    overview: {
      totalViews,
      totalDownloads,
      totalShareClicks,
      totalEvents: overviewRow.total_events ?? 0,
    },
    trend: trendRows.map((row) => ({
      date: row.event_date,
      views: row.views ?? 0,
      downloads: row.downloads ?? 0,
      shareClicks: row.share_clicks ?? 0,
    })),
    topPerformers: topRows.map((row) => ({
      resumeId: row.resume_id,
      jobId: row.job_id,
      jobTitle: row.job_title,
      company: row.company,
      createdAt: row.created_at,
      views: row.views ?? 0,
      downloads: row.downloads ?? 0,
      shareClicks: row.share_clicks ?? 0,
      totalEvents: row.total_events,
    })),
  };
}
