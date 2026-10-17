import { randomBytes, timingSafeEqual } from "crypto";
import { z } from "zod";

import { FormField, planFill, proposeAnswers, type AnswerProposal, type Fill, type Skip } from "./autofill";
import * as db from "./db";
import { importJobFromPage, linkedInJobId, linkedInTitle, parsePostingUrl, postingKey } from "./job-import";
import { llmConfigured } from "./llm";
import { draftAnswers, type DraftAnswer } from "./tailor";
import { tailorJob } from "./tailor-job";
import type { Job, JobStatus } from "./types";

/* ─── The browser extension's API ───
 * The extension calls these from its popup (never from a web page): it holds a key, shown on the
 * Extension page, and sends it with every request. No CORS headers are set, so a site you visit can't
 * read anything from here; the key stops one from writing blind.
 * These are route handlers rather than server actions only because the extension can't call actions;
 * like actions, they validate with Zod and keep the logic in lib/.
 */

const KEY = "extension_key";
const SEEN = "extension_seen";

export function extensionKey(): string {
  let key = db.getKv(KEY);
  if (!key) {
    key = randomBytes(24).toString("base64url");
    db.setKv(KEY, key);
  }
  return key;
}

/** A new key: the extension has to connect again. */
export function resetExtensionKey(): string {
  const key = randomBytes(24).toString("base64url");
  db.setKv(KEY, key);
  db.setKv(SEEN, "");
  return key;
}

export function keyMatches(given: string | null): boolean {
  const a = Buffer.from(given ?? "");
  const b = Buffer.from(extensionKey());
  return a.length === b.length && timingSafeEqual(a, b);
}

/** When the extension last called, and its version. */
export function extensionSeen(): { at: string; version: string } | null {
  try {
    const v = JSON.parse(db.getKv(SEEN) || "null");
    return v && typeof v.at === "string" ? { at: v.at, version: String(v.version ?? "") } : null;
  } catch {
    return null;
  }
}

export const markSeen = (version: string) => db.setKv(SEEN, JSON.stringify({ at: new Date().toISOString(), version: version.slice(0, 20) }));

/* ─── Operations ─── */

export interface JobSummary {
  id: string;
  title: string;
  company: string;
  status: JobStatus;
  resume: boolean;
  letter: boolean;
  /** Whether there's a description to tailor from (a LinkedIn posting seen in passing may not have one). */
  described: boolean;
  lastSeenAt: string | null;
  /** The last application recorded for it. */
  appliedAt: string | null;
}

const summary = (j: Job): JobSummary => ({
  id: j.id,
  title: j.title,
  company: j.company,
  status: j.status,
  resume: Boolean(db.getDoc(j.id, "resume")),
  letter: Boolean(db.getDoc(j.id, "cover_letter")),
  described: Boolean(j.description.trim()),
  lastSeenAt: j.lastSeenAt,
  appliedAt: db.listApplications(j.id)[0]?.submittedAt ?? null,
});

/** The saved job a page belongs to: the posting itself, or its application form. */
export function jobForUrl(url: string): Job | null {
  const key = postingKey(url);
  return key ? (db.listJobs().find((j) => j.url && postingKey(j.url) === key) ?? null) : null;
}

const Status = z.object({ url: z.string().default(""), jobId: z.string().optional() });

export function status(input: unknown) {
  const { url, jobId } = Status.parse(input);
  const profile = db.getProfile();
  const { appearance } = db.getSettings();
  const job = (url ? jobForUrl(url) : null) ?? (jobId ? db.getJob(jobId) : null);
  return {
    profile: { name: profile.contact.name.split(",")[0].trim(), ready: Boolean(profile.contact.name || profile.experience.length) },
    job: job ? summary(job) : null,
    // To pick from when the page isn't a saved posting (an application form on another domain).
    recent: db
      .listJobs()
      .filter((j) => j.status === "seen" || j.status === "saved" || j.status === "applied")
      .sort((a, b) => (b.lastSeenAt ?? b.updatedAt).localeCompare(a.lastSeenAt ?? a.updatedAt))
      .slice(0, 15)
      .map(summary),
    answers: db.listAnswers().filter((a) => a.answer.trim()).length,
    llm: llmConfigured(),
    theme: appearance,
    autoSave: db.getSettings().extension.autoSave,
  };
}

const PageInput = z.object({ url: z.string().min(1), html: z.string().default(""), text: z.string().default("") });

/** Save the posting open in the browser, or return the job it already is. A "seen" job becomes saved. */
export async function saveJob(input: unknown): Promise<{ job: JobSummary; created: boolean }> {
  const page = PageInput.parse(input);
  const existing = jobForUrl(page.url);
  if (existing && existing.status !== "seen") return { job: summary(existing), created: false };
  if (existing) {
    // Seen in passing without a description (LinkedIn): read it properly now that you want it.
    if (!existing.description.trim()) {
      const read = await importJobFromPage(page);
      db.updateJob(existing.id, { title: read.title || existing.title, company: read.company || existing.company, location: read.location, description: read.description });
    }
    db.setJobStatus(existing.id, "saved");
    return { job: summary(db.getJob(existing.id)!), created: true };
  }
  const read = await importJobFromPage(page);
  // A posting saved from its form ("…/apply") keeps the posting's link.
  const again = jobForUrl(read.url);
  if (again) {
    if (again.status === "seen") db.setJobStatus(again.id, "saved");
    return { job: summary(db.getJob(again.id)!), created: again.status === "seen" };
  }
  const id = db.createJob(read);
  return { job: summary(db.getJob(id)!), created: true };
}

const SeenInput = PageInput.extend({ title: z.string().default("") });

/**
 * You opened a posting (the extension's page watcher). A job you have gets its "last seen" time; a new
 * one is recorded as seen when auto-save is on. Only structured data is read, never AI: this runs for
 * every posting you open. `before` is when you'd last seen it, so the extension can say "seen before".
 */
export async function seen(input: unknown): Promise<{ job: JobSummary | null; before: string | null }> {
  const page = SeenInput.parse(input);
  const existing = jobForUrl(page.url);
  if (existing) {
    db.touchSeen(existing.id);
    return { job: summary(db.getJob(existing.id)!), before: existing.lastSeenAt ?? existing.createdAt };
  }
  if (!db.getSettings().extension.autoSave) return { job: null, before: null };
  let read;
  try {
    read = await importJobFromPage(page, { ai: false });
  } catch {
    // LinkedIn limits its guest reads; its page title still says what and where, enough for history.
    const li = linkedInJobId(parsePostingUrl(page.url)) && linkedInTitle(page.title);
    if (!li) return { job: null, before: null };
    read = { ...li, location: "", description: "", url: `https://www.linkedin.com/jobs/view/${linkedInJobId(parsePostingUrl(page.url))}` };
  }
  const again = jobForUrl(read.url);
  if (again) {
    db.touchSeen(again.id);
    return { job: summary(db.getJob(again.id)!), before: again.lastSeenAt ?? again.createdAt };
  }
  const id = db.createJob(read, "seen");
  return { job: summary(db.getJob(id)!), before: null };
}

const TailorInput = z.object({ jobId: z.string(), ai: z.boolean() });

export async function tailor(input: unknown): Promise<{ job: JobSummary }> {
  const { jobId, ai } = TailorInput.parse(input);
  await tailorJob(jobId, ai);
  const job = db.getJob(jobId)!;
  if (job.status === "seen") db.setJobStatus(jobId, "saved");
  return { job: summary(db.getJob(jobId)!) };
}

const AppliedInput = z.object({ jobId: z.string(), url: z.string().default(""), fields: z.array(FormField).max(400).default([]) });

/**
 * You submitted the application (or said so). Records what the form said (questions you answered, not
 * the identity fields) and the resume and letter versions, and moves the job to applied.
 */
export function applied(input: unknown): { job: JobSummary } {
  const { jobId, url, fields } = AppliedInput.parse(input);
  const job = db.getJob(jobId);
  if (!job) throw new Error("Job not found");
  const answers = fields.filter((f) => f.kind !== "file" && f.label.trim() && f.value.trim()).map((f) => ({ question: f.label.trim(), answer: f.value.trim() }));
  db.recordApplication(jobId, url, answers);
  if (job.status === "seen" || job.status === "saved") db.setJobStatus(jobId, "applied");
  return { job: summary(db.getJob(jobId)!) };
}

const FillInput = z.object({ jobId: z.string().optional(), fields: z.array(FormField).max(400) });

export function fill(input: unknown): { fills: Fill[]; skipped: Skip[] } {
  const { jobId, fields } = FillInput.parse(input);
  const job = jobId ? db.getJob(jobId) : null;
  const docs = { resume: Boolean(job && db.getDoc(job.id, "resume")), letter: Boolean(job && db.getDoc(job.id, "cover_letter")) };
  const plan = planFill(fields, db.getProfile(), db.listAnswers(), docs);
  const used = [...new Set(plan.fills.flatMap((f) => (f.source === "bank" ? [f.answerId] : [])))];
  if (used.length) db.markAnswersUsed(used);
  return plan;
}

const DraftInput = z.object({
  jobId: z.string().optional(),
  questions: z.array(z.object({ id: z.string(), question: z.string().min(1).max(1000), long: z.boolean() })).min(1).max(20),
});

export async function draft(input: unknown): Promise<{ drafts: DraftAnswer[] }> {
  const { jobId, questions } = DraftInput.parse(input);
  const job = jobId ? db.getJob(jobId) : null;
  const examples = db.listAnswers().filter((a) => a.answer.trim().length > 40);
  const drafts = await draftAnswers(db.getProfile(), questions, { job: job ?? undefined, examples }, db.getSettings().tailoring);
  return { drafts };
}

const ProposeInput = z.object({ fields: z.array(FormField).max(400) });

export function propose(input: unknown): { proposals: AnswerProposal[] } {
  const { fields } = ProposeInput.parse(input);
  return { proposals: proposeAnswers(fields, db.listAnswers()) };
}

const SaveAnswersInput = z.object({
  url: z.string().default(""),
  answers: z.array(z.object({ question: z.string().min(1).max(1000), answer: z.string().max(10_000), replaces: z.string().optional() })).max(100),
});

export function saveAnswers(input: unknown): { saved: number } {
  const { url, answers } = SaveAnswersInput.parse(input);
  for (const a of answers) db.saveAnswer({ id: a.replaces, question: a.question.trim(), answer: a.answer.trim(), sourceUrl: url });
  return { saved: answers.length };
}
