import * as db from "./db";
import { fitResume } from "./fit";
import { llmInfo } from "./llm";
import { profileAsTailored } from "./resolve";
import { groundResume, letterWarnings, tailorResume, writeCoverLetter } from "./tailor";
import type { CoverLetter, DocMeta, TailoredResume, Warning } from "./types";

/**
 * Tailor a job's resume and save it: the job page's Tailor buttons, the extension's and MCP's all call this.
 * Every path goes through the same fitter: the AI's draft, your whole profile, or a draft an agent wrote
 * with its own model (`draft`, over MCP; `by` names the agent).
 */
export async function tailorJob(jobId: string, useAI: boolean, draft?: { doc: TailoredResume; by: string }) {
  const job = db.getJob(jobId);
  if (!job) throw new Error("Job not found");
  const profile = db.getProfile();
  if (!profile.experience.length && !profile.projects.length) throw new Error("Your profile is empty — add your experience on the Profile page first.");
  if (!job.description.trim()) throw new Error("This job has no description yet. Add it on the job page first.");
  const { tailoring, resume: layout } = db.getSettings();
  const drafted = draft ? { doc: draft.doc, warnings: [] as Warning[] } : useAI ? await tailorResume(profile, job, tailoring) : { doc: profileAsTailored(profile), warnings: [] as Warning[] };
  const fitted = await fitResume(profile, job, drafted.doc, layout);
  // Re-ground the fitted resume: checks on bullets the fitter dropped go away; drops the AI caused stay.
  const { doc, warnings } = groundResume(profile, fitted.doc, job);
  const all = [...drafted.warnings.filter((w) => !w.kind), ...warnings];
  if (fitted.overflow) all.unshift({ where: "Page length", message: `Your pinned items alone run past ${layout.pages === "two" ? "2 pages" : "1 page"}. Unpin something or change Page length in Settings.` });
  const llm = llmInfo();
  const meta: DocMeta = draft ? { source: "ai", provider: draft.by } : useAI ? { source: "ai", provider: llm?.provider, model: llm?.model, latitude: tailoring.latitude } : { source: "auto" };
  db.saveDoc(jobId, "resume", doc, all, meta);
  return all;
}

/** Write a job's cover letter with AI and save it: the job page's button and the extension's both call this. */
export async function writeLetter(jobId: string) {
  const job = db.getJob(jobId);
  if (!job) throw new Error("Job not found");
  const settings = db.getSettings();
  const { doc, warnings } = await writeCoverLetter(db.getProfile(), job, settings.tailoring, settings.letter);
  const llm = llmInfo();
  db.saveDoc(jobId, "cover_letter", doc, warnings, { source: "ai", provider: llm?.provider, model: llm?.model });
}

/** Save a cover letter an agent wrote with its own model (over MCP), checked like any letter. */
export function saveAgentLetter(jobId: string, letter: CoverLetter, by: string): Warning[] {
  const job = db.getJob(jobId);
  if (!job) throw new Error("Job not found");
  const warnings = letterWarnings(db.getProfile(), letter, job, db.getSettings().letter.length);
  db.saveDoc(jobId, "cover_letter", letter, warnings, { source: "ai", provider: by });
  return warnings;
}
