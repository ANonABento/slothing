/**
 * Starter content for a brand-new document.
 *
 * The gap this closes: before this, the only ways to get a document were "build from my
 * bank" (fails outright on an empty bank) and "import a .tex" (needs a .tex). A new user
 * with neither had no path at all, and a cover letter could only be created from a saved
 * opportunity through the AI route.
 *
 * The content is deliberately a skeleton with real headings rather than lorem ipsum: the
 * point is a document that already compiles and is already addressable, so the inspector
 * has something to click on the very first render.
 */
import type { TexDocumentKind } from "@/lib/db/tex-documents";

import type { GenerateSection } from "./generate";

export const STARTER_SECTIONS: GenerateSection[] = [
  {
    title: "Experience",
    entries: [
      {
        organisation: "Company",
        role: "Your role",
        dates: "2024 — Present",
        bullets: ["What you did, what changed because of it, and by how much."],
      },
    ],
  },
  {
    title: "Education",
    entries: [
      {
        organisation: "University",
        role: "Degree",
        dates: "2020 — 2024",
        bullets: [],
      },
    ],
  },
  { title: "Skills", text: "Add the tools and languages you actually use." },
];

export const STARTER_PARAGRAPHS: string[] = [
  "Dear Hiring Manager,",
  "Open with why this specific role, at this specific company, is the one you want.",
  "Give one concrete example of work you have done that maps onto what they need. Name the result.",
  "Close by saying what you would like to happen next.",
  "Sincerely,",
];

/** The default title for a new document, used when the user does not supply one. */
export function starterTitle(kind: TexDocumentKind): string {
  if (kind === "cover_letter") return "Untitled cover letter";
  if (kind === "cv") return "Untitled CV";
  return "Untitled resume";
}
