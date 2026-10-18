import { describe, expect, it } from "vitest";

import { createJob, deleteJob, listApplicationDates, listEvents, listJobs, recordApplication, setJobStatus } from "../db";
import { countInsights, weekStart } from "../insights";
import type { JobStatus } from "../types";

// Local times, so the week boundary is tested the way the app sees it whatever the machine's time zone.
// Wednesday 21 October 2026, noon; the week started Monday the 19th at midnight.
const NOW = new Date(2026, 9, 21, 12, 0);
const at = (day: number, h = 10, m = 0, s = 0, ms = 0) => new Date(2026, 9, day, h, m, s, ms).toISOString();
const LAST_WEEK = at(14);

type Step = [JobStatus, string];
/** A job created at its first step, with every later step as a status change. */
function job(id: string, steps: Step[], applied: string[] = []) {
  return {
    job: { id, createdAt: steps[0][1] },
    events: steps.map(([to, when]) => ({ jobId: id, to, at: when })),
    apps: applied.map((when) => ({ jobId: id, submittedAt: when })),
  };
}
function count(jobs: ReturnType<typeof job>[], now = NOW) {
  return countInsights(jobs.map((j) => j.job), jobs.flatMap((j) => j.events), jobs.flatMap((j) => j.apps), now);
}

describe("insights", () => {
  it("nothing yet: every count is zero", () => {
    const zero = { seen: 0, saved: 0, applied: 0, replied: 0, interviewing: 0, offer: 0 };
    expect(count([])).toEqual({ week: zero, total: zero });
  });

  it("no applications yet: seen and saved only", () => {
    const r = count([job("a", [["seen", LAST_WEEK]]), job("b", [["seen", LAST_WEEK], ["saved", at(20)]]), job("c", [["saved", at(20)]])]);
    expect(r.total).toEqual({ seen: 3, saved: 2, applied: 0, replied: 0, interviewing: 0, offer: 0 });
    expect(r.week).toEqual({ seen: 1, saved: 2, applied: 0, replied: 0, interviewing: 0, offer: 0 });
  });

  it("rejected after an interview still counts the interview, and the reply once", () => {
    const r = count([job("a", [["saved", LAST_WEEK], ["applied", LAST_WEEK], ["interviewing", at(15)], ["rejected", at(20)]], [LAST_WEEK])]);
    expect(r.total).toEqual({ seen: 1, saved: 1, applied: 1, replied: 1, interviewing: 1, offer: 0 });
    // The rejection this week isn't news for the counts: the reply came last week, with the interview.
    expect(r.week).toEqual({ seen: 0, saved: 0, applied: 0, replied: 0, interviewing: 0, offer: 0 });
  });

  it("a rejection is a reply; archiving isn't", () => {
    const r = count([
      job("rejected", [["saved", LAST_WEEK], ["applied", LAST_WEEK], ["rejected", at(20)]], [LAST_WEEK]),
      job("gave-up", [["saved", LAST_WEEK], ["applied", LAST_WEEK], ["archived", at(20)]], [LAST_WEEK]),
      job("dismissed", [["seen", LAST_WEEK], ["archived", at(20)]]),
    ]);
    expect(r.total).toEqual({ seen: 3, saved: 2, applied: 2, replied: 1, interviewing: 0, offer: 0 });
    expect(r.week.replied).toBe(1);
  });

  it("a job applied to twice is one job applied to, counted in the week of the first", () => {
    const twice = job("a", [["saved", LAST_WEEK], ["applied", LAST_WEEK]], [LAST_WEEK, at(20)]);
    expect(count([twice]).total.applied).toBe(1);
    expect(count([twice]).week.applied).toBe(0);
    // Both this week: still one.
    expect(count([job("b", [["saved", at(19)], ["applied", at(19)]], [at(19), at(20)])]).week.applied).toBe(1);
  });

  it("an application counts even when the status never said applied (the extension saw the submit)", () => {
    const r = count([job("a", [["seen", at(20)]], [at(20, 11)])]);
    expect(r.total).toMatchObject({ seen: 1, saved: 1, applied: 1, replied: 0 });
  });

  it("this week starts at midnight on Monday", () => {
    const r = count([
      job("sunday-night", [["saved", at(18, 23, 59, 59, 999)]]),
      job("monday-midnight", [["saved", at(19, 0, 0, 0, 0)]]),
    ]);
    expect(r.week.saved).toBe(1);
    expect(r.total.saved).toBe(2);
    // On Monday at midnight exactly, the week has just begun.
    const monday = count([job("x", [["saved", at(19, 0)]]), job("y", [["saved", at(18, 23, 59)]])], new Date(2026, 9, 19, 0, 0));
    expect(monday.week.saved).toBe(1);
  });

  it("weekStart: Sunday belongs to the week that began the Monday before", () => {
    expect(weekStart(new Date(2026, 9, 25, 23, 59))).toEqual(new Date(2026, 9, 19));
    expect(weekStart(new Date(2026, 9, 19, 0, 0))).toEqual(new Date(2026, 9, 19));
    expect(weekStart(new Date(2026, 10, 1, 9))).toEqual(new Date(2026, 9, 26)); // across a month (and US DST)
  });

  it("history from before events existed: one event at the current status counts every stage up to it", () => {
    const r = count([job("old", [["offer", LAST_WEEK]])]);
    expect(r.total).toEqual({ seen: 1, saved: 1, applied: 1, replied: 1, interviewing: 1, offer: 1 });
  });

  it("moving a status back doesn't take back what happened", () => {
    const r = count([job("a", [["saved", LAST_WEEK], ["interviewing", LAST_WEEK], ["applied", at(20)]])]);
    expect(r.total.interviewing).toBe(1);
  });

  it("from the database: what the app records is what gets counted", () => {
    const before = countInsights(listJobs(), listEvents(), listApplicationDates()).total;
    const a = createJob({ company: "Initech", title: "Engineer", url: "", location: "", description: "" }, "seen");
    const b = createJob({ company: "Globex", title: "Engineer", url: "", location: "", description: "" });
    setJobStatus(b, "applied");
    recordApplication(b, "", []); // within 15 minutes: the same application
    setJobStatus(b, "interviewing");
    setJobStatus(b, "rejected");
    const gone = createJob({ company: "Gone", title: "Engineer", url: "", location: "", description: "" });
    setJobStatus(gone, "applied");
    deleteJob(gone);
    const after = countInsights(listJobs(), listEvents(), listApplicationDates()).total;
    const diff = Object.fromEntries(Object.entries(after).map(([k, n]) => [k, n - before[k as keyof typeof before]]));
    expect(diff).toEqual({ seen: 2, saved: 1, applied: 1, replied: 1, interviewing: 1, offer: 0 });
    expect(a).toBeTruthy();
  });
});
