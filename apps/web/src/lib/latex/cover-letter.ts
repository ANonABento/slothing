/**
 * Cover letters on the LaTeX pipeline — spec §11.
 *
 * Same contract, same compile service, same inspector. A cover letter is just a short
 * document whose spans are paragraphs (`\slothingPara`) instead of bullets. That sameness
 * is what lets TipTap be deleted outright in PR 9 rather than kept alive for one surface.
 *
 * The generation prompt work in `lib/cover-letter/generate.ts` is reused unchanged — it
 * already returns plain prose, so the only new step is turning prose into a document.
 */
import { generateCoverLetterTex } from "./generate";
import type { DocumentSettings } from "./settings";

/**
 * Split prose into paragraphs.
 *
 * Moved here from `lib/resume/pdf.ts`, which the rebuild deletes. Blank lines separate
 * paragraphs; single newlines inside one are soft wraps and get collapsed, because LaTeX
 * does its own line breaking.
 */
export function splitParagraphs(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

export interface CoverLetterDocumentInput {
  name: string;
  contact: string;
  /** The generated prose, as returned by `generateCoverLetter`. */
  prose: string;
  settings?: Partial<DocumentSettings>;
}

export interface CoverLetterDocument {
  source: string;
  paragraphCount: number;
}

/** Prose → an annotated cover-letter .tex. */
export function coverLetterToTex(
  input: CoverLetterDocumentInput,
): CoverLetterDocument {
  const paragraphs = splitParagraphs(input.prose);
  return {
    source: generateCoverLetterTex({
      name: input.name,
      contact: input.contact,
      paragraphs,
      settings: input.settings,
    }),
    paragraphCount: paragraphs.length,
  };
}

/** A default title when the user has not named the document. */
export function coverLetterTitle(company?: string | null): string {
  const trimmed = company?.trim();
  return trimmed ? `Cover letter — ${trimmed}` : "Cover letter";
}
