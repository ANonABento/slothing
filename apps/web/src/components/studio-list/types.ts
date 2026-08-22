import type { TexDocumentKind } from "@/lib/db/tex-documents";

/** What the list endpoint returns — everything except the (potentially large) source. */
export interface TexDocumentSummary {
  id: string;
  title: string;
  kind: TexDocumentKind;
  createdAt: string;
  updatedAt: string;
}

export const KIND_LABEL: Record<TexDocumentKind, string> = {
  resume: "Resume",
  cv: "CV",
  cover_letter: "Cover letter",
};

/**
 * The kinds a user can choose between, in the order they are offered.
 *
 * CV sits next to resume rather than being folded into it: they are the same pipeline, but
 * they are different documents to the person writing them, and a list that cannot tell
 * them apart is a list you have to open every entry of.
 */
export const KIND_OPTIONS: ReadonlyArray<{
  value: TexDocumentKind;
  label: string;
  hint: string;
}> = [
  {
    value: "resume",
    label: "Resume",
    hint: "One or two pages, sections and bullets.",
  },
  {
    value: "cv",
    label: "CV",
    hint: "Longer form — academic or research history.",
  },
  {
    value: "cover_letter",
    label: "Cover letter",
    hint: "Prose, addressed to someone.",
  },
];
