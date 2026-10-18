import { describe, expect, it } from "vitest";

import Database from "better-sqlite3";

import { FOLLOW_UP_DAYS, createJob, deleteJob, dueFollowUps, getJob, listApplications, listEvents, migrate, recordApplication, setFollowUp, setJobStatus, updateJob } from "../db";
import { followUpNote } from "../follow-up";

const newJob = () => createJob({ company: "Initech", title: "Platform Engineer", url: "", location: "", description: "" });
const daysFromNow = (iso: string | null) => Math.round((new Date(iso!).getTime() - Date.now()) / 86_400_000);

describe("follow-ups", () => {
  it("applying by hand records an application and sets a follow-up a week out", () => {
    const id = newJob();
    setJobStatus(id, "applied");
    expect(listApplications(id)).toHaveLength(1);
    expect(getJob(id)?.appliedAt).toBe(listApplications(id)[0].submittedAt);
    expect(daysFromNow(getJob(id)!.followUpAt)).toBe(FOLLOW_UP_DAYS);
  });

  it("an application the extension recorded isn't doubled when the status follows", () => {
    const id = newJob();
    recordApplication(id, "https://jobs.example.com/apply", [{ question: "Why us?", answer: "Because." }]);
    setJobStatus(id, "applied");
    expect(listApplications(id)).toHaveLength(1);
    expect(listApplications(id)[0].answers).toHaveLength(1);
  });

  it("is due once its date comes, and only while the job is applied", () => {
    const id = newJob();
    setJobStatus(id, "applied");
    expect(dueFollowUps().map((j) => j.id)).not.toContain(id);
    setFollowUp(id, -1);
    expect(dueFollowUps().map((j) => j.id)).toContain(id);
    setJobStatus(id, "interviewing");
    expect(getJob(id)?.followUpAt).toBeNull();
    expect(dueFollowUps().map((j) => j.id)).not.toContain(id);
  });

  it("snooze and stop", () => {
    const id = newJob();
    setJobStatus(id, "applied");
    setFollowUp(id, 3);
    expect(daysFromNow(getJob(id)!.followUpAt)).toBe(3);
    setFollowUp(id, null);
    expect(getJob(id)?.followUpAt).toBeNull();
  });

  it("migration: jobs already applied get a follow-up a week after their last application", () => {
    const db = new Database(":memory:");
    db.exec(`CREATE TABLE jobs (id TEXT PRIMARY KEY, status TEXT, updated_at TEXT NOT NULL);
      CREATE TABLE applications (id TEXT, job_id TEXT, submitted_at TEXT);
      CREATE TABLE documents (id TEXT, meta TEXT NOT NULL DEFAULT '{}');
      INSERT INTO jobs VALUES ('a', 'applied', '2026-01-01T00:00:00.000Z'), ('b', 'saved', '2026-01-01T00:00:00.000Z');
      INSERT INTO applications VALUES ('x', 'a', '2026-03-01T10:00:00.000Z');`);
    migrate(db);
    const rows = db.prepare("SELECT id, follow_up_at FROM jobs ORDER BY id").all() as { id: string; follow_up_at: string | null }[];
    expect(rows).toEqual([
      { id: "a", follow_up_at: "2026-03-08T10:00:00.000Z" },
      { id: "b", follow_up_at: null },
    ]);
  });
});

describe("followUpNote", () => {
  it("says only what's known: the role, the company and when you applied", () => {
    const note = followUpNote({ title: "Platform Engineer", company: "Initech", appliedAt: "2026-10-03T12:00:00.000Z" }, "Alex Rivera");
    expect(note).toContain("Subject: Following up on my application for Platform Engineer");
    expect(note).toContain("the Platform Engineer position at Initech on October 3");
    expect(note.endsWith("Alex Rivera")).toBe(true);
  });

  it("reads fine with nothing but a title", () => {
    expect(followUpNote({ title: "", company: "", appliedAt: null }, "")).toContain("I applied for the open position and");
  });
});

describe("status history", () => {
  it("records the first status and every change, not edits that keep it", () => {
    const id = newJob();
    setJobStatus(id, "applied");
    updateJob(id, { notes: "Referred by Sam" });
    updateJob(id, { status: "applied" });
    setJobStatus(id, "interviewing");
    setJobStatus(id, "rejected");
    expect(listEvents(id).map((e) => [e.from, e.to])).toEqual([
      [null, "saved"],
      ["saved", "applied"],
      ["applied", "interviewing"],
      ["interviewing", "rejected"],
    ]);
    deleteJob(id);
    expect(listEvents(id)).toEqual([]);
  });

  it("migration: jobs from before the history get their current status", () => {
    const db = new Database(":memory:");
    db.exec(`CREATE TABLE jobs (id TEXT PRIMARY KEY, status TEXT, updated_at TEXT NOT NULL);
      CREATE TABLE applications (id TEXT, job_id TEXT, submitted_at TEXT);
      CREATE TABLE documents (id TEXT, meta TEXT NOT NULL DEFAULT '{}');
      INSERT INTO jobs VALUES ('a', 'interviewing', '2026-03-01T00:00:00.000Z');`);
    migrate(db);
    migrate(db);
    expect(db.prepare("SELECT job_id, from_status, to_status, at FROM job_events").all()).toEqual([
      { job_id: "a", from_status: null, to_status: "interviewing", at: "2026-03-01T00:00:00.000Z" },
    ]);
  });
});
