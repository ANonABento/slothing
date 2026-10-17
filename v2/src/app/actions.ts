"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import * as db from "@/lib/db";
import { jobForUrl, resetExtensionKey } from "@/lib/extension";
import { extractText, parseResumeText, reuseIds } from "@/lib/import";
import { readJob } from "@/lib/job-import";
import { llmInfo, testLlm } from "@/lib/llm";
import { tailorJob } from "@/lib/tailor-job";
import { draftAnswers, groundResume, letterWarnings, rewordBullet, writeCoverLetter, type DraftAnswer, type Rewording } from "@/lib/tailor";
import { CoverLetter, JOB_STATUSES, Profile, Settings, TailoredBullet, TailoredResume, type AiSettings, type DocKind, type Warning } from "@/lib/types";
import { z } from "zod";

export type Result<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

const fail = (err: unknown): { ok: false; error: string } => {
  if (err instanceof z.ZodError) return { ok: false, error: "That data didn't look right, so nothing was saved." };
  const msg = err instanceof Error ? err.message : String(err);
  return { ok: false, error: msg.length > 400 ? `${msg.slice(0, 400)}…` : msg };
};

/* ─── Profile ─── */

export async function saveProfileAction(profile: Profile): Promise<Result> {
  try {
    db.saveProfile(Profile.parse(profile));
    revalidatePath("/profile");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** Parse a resume (file or pasted text) into a profile. Does not save — the editor reviews it first. */
export async function importResumeAction(form: FormData): Promise<Result<Profile>> {
  try {
    const file = form.get("file");
    const pasted = String(form.get("text") ?? "");
    const text = file instanceof File && file.size ? await extractText(file) : pasted;
    if (!text.trim()) return { ok: false, error: "Nothing to import — choose a file or paste text." };
    // Match against the saved profile so existing tailored resumes keep pointing at the same entries.
    return { ok: true, data: reuseIds(db.getProfile(), await parseResumeText(text)) };
  } catch (e) {
    return fail(e);
  }
}

/* ─── Settings ─── */

export async function saveSettingsAction(settings: Settings): Promise<Result> {
  try {
    db.saveSettings(Settings.parse(settings));
    // The sidebar shows the active model, so refresh every page.
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** The sidebar's light/dark toggle. Only changes the mode; the themes themselves are picked in Settings. */
export async function setThemeModeAction(mode: "light" | "dark"): Promise<Result> {
  try {
    const s = db.getSettings();
    db.saveSettings({ ...s, appearance: { ...s.appearance, mode: z.enum(["light", "dark"]).parse(mode) } });
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function testLlmAction(ai: AiSettings): Promise<Result<{ provider: string; model: string; ms: number }>> {
  try {
    return { ok: true, data: await testLlm(Settings.shape.ai.parse(ai)) };
  } catch (e) {
    return fail(e);
  }
}

/* ─── Jobs ─── */

/** The Add job form: a link, a pasted description or both. Opens the new job. */
export async function addJobAction(_prev: Result | null, form: FormData): Promise<Result> {
  const field = (k: string) => String(form.get(k) ?? "");
  let id: string;
  try {
    // A posting you already have (often one the extension recorded as Seen) opens instead of being added twice.
    const existing = field("url").trim() ? jobForUrl(field("url")) : null;
    if (existing) {
      if (existing.status === "seen") db.setJobStatus(existing.id, "saved");
      // Seen in passing without a description (LinkedIn): take the one you pasted.
      if (!existing.description.trim() && field("description").trim()) db.updateJob(existing.id, { description: field("description").trim() });
      id = existing.id;
    } else id = db.createJob(await readJob({ url: field("url"), description: field("description"), company: field("company"), title: field("title") }));
  } catch (e) {
    return fail(e);
  }
  revalidatePath("/");
  redirect(`/jobs/${id}`);
}

const JobPatch = z
  .object({
    company: z.string(),
    title: z.string(),
    url: z.string(),
    location: z.string(),
    description: z.string(),
    notes: z.string(),
    status: z.enum(JOB_STATUSES),
  })
  .partial()
  .strict();

export async function updateJobAction(id: string, patch: z.input<typeof JobPatch>): Promise<Result> {
  try {
    db.updateJob(String(id), JobPatch.parse(patch));
    revalidatePath("/");
    revalidatePath(`/jobs/${id}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteJobAction(id: string) {
  db.deleteJob(id);
  revalidatePath("/");
  redirect("/");
}

/* ─── Documents ─── */

function requireJob(id: string) {
  const job = db.getJob(id);
  if (!job) throw new Error("Job not found");
  return job;
}

export async function tailorResumeAction(jobId: string, useAI: boolean): Promise<Result> {
  try {
    await tailorJob(String(jobId), Boolean(useAI));
    revalidatePath(`/jobs/${jobId}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function saveResumeAction(jobId: string, data: TailoredResume): Promise<Result<Warning[]>> {
  try {
    // Hand edits are re-checked against the profile too.
    const { doc, warnings } = groundResume(db.getProfile(), TailoredResume.parse(data), requireJob(jobId));
    db.saveDoc(jobId, "resume", doc, warnings, db.editedMeta(jobId, "resume"));
    revalidatePath(`/jobs/${jobId}`);
    return { ok: true, data: warnings };
  } catch (e) {
    return fail(e);
  }
}

/** Alternatives for one bullet of a job's resume. Nothing is saved: picking one edits the draft, and saving re-grounds it. */
export async function rewordBulletAction(jobId: string, bullet: { text: string; sourceIds: string[] }, hint: string): Promise<Result<Rewording[]>> {
  try {
    const job = requireJob(jobId);
    const b = TailoredBullet.parse(bullet);
    const alternatives = await rewordBullet(db.getProfile(), job, b, String(hint ?? ""), db.getSettings().tailoring);
    if (!alternatives.length) return { ok: false, error: "The model didn't come up with anything different. Try a hint, or try again." };
    return { ok: true, data: alternatives };
  } catch (e) {
    return fail(e);
  }
}

export async function writeLetterAction(jobId: string): Promise<Result> {
  try {
    const job = requireJob(jobId);
    const settings = db.getSettings();
    const llm = llmInfo();
    const { doc, warnings } = await writeCoverLetter(db.getProfile(), job, settings.tailoring, settings.letter);
    db.saveDoc(jobId, "cover_letter", doc, warnings, { source: "ai", provider: llm?.provider, model: llm?.model });
    revalidatePath(`/jobs/${jobId}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function saveLetterAction(jobId: string, data: CoverLetter): Promise<Result> {
  try {
    const letter = CoverLetter.parse(data);
    const warnings = letterWarnings(db.getProfile(), letter, db.getJob(jobId) ?? undefined, db.getSettings().letter.length);
    db.saveDoc(jobId, "cover_letter", letter, warnings, db.editedMeta(jobId, "cover_letter"));
    revalidatePath(`/jobs/${jobId}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/**
 * Make an earlier version current again. It's saved as a new version, so a restore can itself be undone.
 * A resume is re-grounded against today's profile: bullets whose source was deleted since are dropped.
 */
export async function restoreVersionAction(jobId: string, kind: DocKind, versionId: string): Promise<Result> {
  try {
    const job = requireJob(jobId);
    if (kind !== "resume" && kind !== "cover_letter") return { ok: false, error: "Unknown document." };
    const v = db.getVersion(jobId, kind, versionId);
    if (!v) return { ok: false, error: "That version is no longer in the history." };
    const profile = db.getProfile();
    if (kind === "resume") {
      const { doc, warnings } = groundResume(profile, TailoredResume.parse(v.data), job);
      db.saveDoc(jobId, "resume", doc, warnings, v.meta);
    } else {
      const letter = CoverLetter.parse(v.data);
      db.saveDoc(jobId, "cover_letter", letter, letterWarnings(profile, letter, job, db.getSettings().letter.length), v.meta);
    }
    revalidatePath(`/jobs/${jobId}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/* ─── Answer bank ─── */

const AnswerInput = z.object({ id: z.string().optional(), question: z.string(), answer: z.string() });

export async function saveAnswerAction(input: z.input<typeof AnswerInput>): Promise<Result<{ id: string }>> {
  try {
    const a = AnswerInput.parse(input);
    if (!a.question.trim()) return { ok: false, error: "Write the question first." };
    const id = db.saveAnswer({ id: a.id, question: a.question.trim(), answer: a.answer.trim() });
    revalidatePath("/answers");
    return { ok: true, data: { id } };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteAnswerAction(id: string): Promise<Result> {
  try {
    db.deleteAnswer(String(id));
    revalidatePath("/answers");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** A first draft from your profile, in the tone of your other answers. Nothing is saved. */
export async function draftAnswerAction(question: string): Promise<Result<DraftAnswer>> {
  try {
    const q = String(question).trim();
    if (!q) return { ok: false, error: "Write the question first." };
    const examples = db.listAnswers().filter((a) => a.answer.trim() && a.question.trim() !== q);
    const [draft] = await draftAnswers(db.getProfile(), [{ id: "q", question: q, long: true }], { examples }, db.getSettings().tailoring);
    if (!draft?.text) return { ok: false, error: "Your profile doesn't answer this one (salary, dates and visa questions are yours to write)." };
    return { ok: true, data: draft };
  } catch (e) {
    return fail(e);
  }
}

/* ─── Extension ─── */

/** Whether the extension records postings you open as "seen". */
export async function setAutoSaveAction(on: boolean): Promise<Result> {
  try {
    const s = db.getSettings();
    db.saveSettings({ ...s, extension: { ...s.extension, autoSave: z.boolean().parse(on) } });
    revalidatePath("/extension");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

/** A new key. The extension stops working until it's connected again. */
export async function resetExtensionKeyAction(): Promise<Result<{ key: string }>> {
  try {
    const key = resetExtensionKey();
    revalidatePath("/extension");
    return { ok: true, data: { key } };
  } catch (e) {
    return fail(e);
  }
}
