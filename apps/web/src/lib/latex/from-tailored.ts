/**
 * TailoredResume → an annotated .tex document.
 *
 * The bridge between the existing content pipeline (bank assembly and LLM tailoring, both
 * of which survive the rebuild) and the LaTeX document model. Forward-only, like all
 * generation: once a document exists, the .tex is the artifact of record and every later
 * edit is a span patch.
 */
import type { TailoredResume } from "@/lib/resume/generator";

import { generateResumeTex, type GenerateSection } from "./generate";
import type { DocumentSettings } from "./settings";

function contactLine(contact: TailoredResume["contact"]): string {
  return [contact?.email, contact?.phone, contact?.location, contact?.website]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean)
    .join(" · ");
}

/** Build the section list, skipping anything the resume has no content for. */
export function tailoredResumeToSections(
  resume: TailoredResume,
): GenerateSection[] {
  const sections: GenerateSection[] = [];

  if (resume.summary?.trim()) {
    sections.push({ title: "Summary", text: resume.summary.trim() });
  }

  if (resume.experiences?.length) {
    sections.push({
      title: "Experience",
      entries: resume.experiences.map((experience) => ({
        organisation: experience.company ?? "",
        role: experience.title ?? "",
        dates: experience.dates ?? "",
        bullets: (experience.highlights ?? []).filter(Boolean),
      })),
    });
  }

  if (resume.projects?.length) {
    sections.push({
      title: "Projects",
      // Projects carry a description rather than a role/date pair, so the description
      // becomes the subtitle and there is nothing to put in the dates column.
      entries: resume.projects.map((project) => ({
        organisation: project.name ?? "",
        role: project.description ?? "",
        dates: "",
        bullets: (project.highlights ?? []).filter(Boolean),
      })),
    });
  }

  if (resume.education?.length) {
    sections.push({
      title: "Education",
      entries: resume.education.map((education) => ({
        organisation: education.institution ?? "",
        role: [education.degree, education.field].filter(Boolean).join(", "),
        dates: education.date ?? "",
        bullets: [],
      })),
    });
  }

  if (resume.skills?.length) {
    sections.push({ title: "Skills", text: resume.skills.join(", ") });
  }

  return sections;
}

export function tailoredResumeToTex(
  resume: TailoredResume,
  settings?: Partial<DocumentSettings>,
): string {
  return generateResumeTex({
    name: resume.contact?.name?.trim() || "Your Name",
    contact: contactLine(resume.contact),
    sections: tailoredResumeToSections(resume),
    settings,
  });
}
