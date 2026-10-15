"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import * as db from "@/lib/db";
import { extractText, parseResumeText, reuseIds } from "@/lib/import";
import { generateJSON, testLlm } from "@/lib/llm";
import { profileAsTailored } from "@/lib/resolve";
import { groundResume, letterWarnings, tailorResume, writeCoverLetter } from "@/lib/tailor";
import { CoverLetter, JOB_STATUSES, Profile, Settings, TailoredResume, type AiSettings, type Warning } from "@/lib/types";
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

export async function testLlmAction(ai: AiSettings): Promise<Result<{ provider: string; model: string; ms: number }>> {
  try {
    return { ok: true, data: await testLlm(Settings.shape.ai.parse(ai)) };
  } catch (e) {
    return fail(e);
  }
}

/* ─── Jobs ─── */

const JobMeta = z.object({ company: z.string().default(""), title: z.string().default(""), location: z.string().default("") });

export async function createJobAction(form: FormData) {
  const description = String(form.get("description") ?? "").trim();
  let company = String(form.get("company") ?? "").trim();
  let title = String(form.get("title") ?? "").trim();
  let location = "";
  // Fill in whatever the user left blank from the description, if an LLM is available.
  if (description && (!company || !title)) {
    try {
      const meta = await generateJSON(
        JobMeta,
        'Extract the hiring company, job title, and location from this job posting. JSON: { "company", "title", "location" }. Empty string if unknown.',
        description.slice(0, 8000),
      );
      company ||= meta.company;
      title ||= meta.title;
      location = meta.location;
    } catch {
      // No LLM or it failed — the user can edit the fields later.
    }
  }
  const id = db.createJob({ company, title, location, url: String(form.get("url") ?? "").trim(), description });
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
    const job = requireJob(jobId);
    const profile = db.getProfile();
    if (!profile.experience.length && !profile.projects.length) {
      return { ok: false, error: "Your profile is empty — add your experience on the Profile page first." };
    }
    const { doc, warnings } = useAI ? await tailorResume(profile, job, db.getSettings().tailoring) : { doc: profileAsTailored(profile), warnings: [] as Warning[] };
    db.saveDoc(jobId, "resume", doc, warnings);
    revalidatePath(`/jobs/${jobId}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function saveResumeAction(jobId: string, data: TailoredResume): Promise<Result<Warning[]>> {
  try {
    // Hand edits are re-checked against the profile too.
    const { doc, warnings } = groundResume(db.getProfile(), TailoredResume.parse(data));
    db.saveDoc(jobId, "resume", doc, warnings);
    revalidatePath(`/jobs/${jobId}`);
    return { ok: true, data: warnings };
  } catch (e) {
    return fail(e);
  }
}

export async function writeLetterAction(jobId: string): Promise<Result> {
  try {
    const job = requireJob(jobId);
    const { doc, warnings } = await writeCoverLetter(db.getProfile(), job, db.getSettings().tailoring);
    db.saveDoc(jobId, "cover_letter", doc, warnings);
    revalidatePath(`/jobs/${jobId}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}

export async function saveLetterAction(jobId: string, data: CoverLetter): Promise<Result> {
  try {
    const letter = CoverLetter.parse(data);
    db.saveDoc(jobId, "cover_letter", letter, letterWarnings(db.getProfile(), letter, db.getJob(jobId) ?? undefined));
    revalidatePath(`/jobs/${jobId}`);
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
