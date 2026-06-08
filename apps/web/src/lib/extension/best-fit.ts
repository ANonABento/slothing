import { scoreResume } from "@/lib/scoring";
import type { JobDescription, Profile } from "@/types";

/**
 * Server-side "which of my resumes best fits this job" ranking — the data
 * behind experiment #1's best-fit badge. Each candidate resume's stored
 * content is flattened to text and scored against the job via the shared
 * resume scorer; the keyword sub-score (which reads `rawText`) is what
 * differentiates one resume from another for the same job.
 */

export interface BestFitCandidate {
  id: string;
  name: string;
  /** Serialized tailored-resume content (`generated_resumes.content_json`). */
  contentJson: string;
}

export interface BestFitResume {
  id: string;
  name: string;
  /** Overall resume score (0-100) against the supplied job. */
  score: number;
}

const MAX_TEXT_CHARS = 20_000;

/**
 * Flatten an arbitrary resume-content JSON blob into a plain-text bag of
 * words. Shape-agnostic on purpose: it walks every string leaf so it keeps
 * working as the resume content schema evolves.
 */
export function extractResumeText(contentJson: string): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(contentJson);
  } catch {
    // Not JSON — treat the raw value as text.
    return contentJson.slice(0, MAX_TEXT_CHARS);
  }

  const parts: string[] = [];
  const visit = (node: unknown): void => {
    if (parts.join(" ").length >= MAX_TEXT_CHARS) return;
    if (typeof node === "string") {
      parts.push(node);
    } else if (Array.isArray(node)) {
      node.forEach(visit);
    } else if (node && typeof node === "object") {
      Object.values(node).forEach(visit);
    }
  };
  visit(parsed);

  return parts.join(" ").slice(0, MAX_TEXT_CHARS);
}

/**
 * Rank candidates best-fit-first for the given job. Ties break on the
 * candidate's original order (callers pass most-recent-first), so the newest
 * resume wins a tie. The first entry is the recommended "best fit".
 */
export function rankResumesByFit(params: {
  profile: Profile;
  job: JobDescription;
  candidates: BestFitCandidate[];
}): BestFitResume[] {
  const { profile, job, candidates } = params;

  return candidates
    .map((candidate, index) => ({
      id: candidate.id,
      name: candidate.name,
      score: scoreResume({
        profile,
        job,
        rawText: extractResumeText(candidate.contentJson),
      }).overall,
      index,
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ id, name, score }) => ({ id, name, score }));
}
