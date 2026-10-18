import type { JobStatus } from "./types";

/* ─── Insights: counts, nothing else ───
 * How far each job has got, from its status history and its applications. Counts only: with tens of
 * applications a percentage or a comparison is noise, a count is honest at any size (RESEARCH.md).
 */

export const STAGES = ["seen", "saved", "applied", "replied", "interviewing", "offer"] as const;
export type Stage = (typeof STAGES)[number];
export type Counts = Record<Stage, number>;

/**
 * The furthest stage a status means. A reply is any answer after applying, a rejection included.
 * Archived means you dropped it, so it reaches nothing new.
 */
const REACHES: Record<JobStatus, number> = { seen: 0, saved: 1, applied: 2, rejected: 3, interviewing: 4, offer: 5, archived: -1 };

/** Midnight at the start of this week (Monday), in the server's time zone: the same machine as you. */
export function weekStart(now: Date): Date {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

export interface Insights {
  week: Counts;
  total: Counts;
}

/**
 * Each job counts once per stage, on the day it first got there: applying twice is one job applied to,
 * and a rejection after an interview still counts as an interview. So "this week" counts what moved
 * forward this week, and every week's counts add up to the totals.
 */
export function countInsights(
  jobs: { id: string; createdAt: string }[],
  events: { jobId: string; to: JobStatus; at: string }[],
  applications: { jobId: string; submittedAt: string }[],
  now = new Date(),
): Insights {
  // When each job first reached each stage (ISO strings compare as times).
  const first = new Map<string, (string | undefined)[]>();
  const reach = (jobId: string, stage: number, at: string) => {
    const row = first.get(jobId);
    if (!row) return; // a deleted job's leftovers
    for (let s = 0; s <= stage; s++) if (!row[s] || at < row[s]!) row[s] = at;
  };
  for (const j of jobs) first.set(j.id, [j.createdAt]);
  for (const e of events) reach(e.jobId, REACHES[e.to], e.at);
  for (const a of applications) reach(a.jobId, REACHES.applied, a.submittedAt);

  const since = weekStart(now).getTime();
  const week = zero();
  const total = zero();
  for (const row of first.values()) {
    STAGES.forEach((stage, i) => {
      const at = row[i];
      if (!at) return;
      total[stage]++;
      if (new Date(at).getTime() >= since) week[stage]++;
    });
  }
  return { week, total };
}

const zero = (): Counts => ({ seen: 0, saved: 0, applied: 0, replied: 0, interviewing: 0, offer: 0 });
