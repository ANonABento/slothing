import {
  countWordsInDiff,
  diffWords,
  type WordDiffCounts,
  type WordDiffSegment,
} from "@/lib/diff/word-diff";
import type { TailoredResume } from "@/lib/resume/generator";

export type TailorDiffSectionKind =
  | "summary"
  | "experience"
  | "skills"
  | "education";

export interface TailorDiffSection {
  id: string;
  title: string;
  kind: TailorDiffSectionKind;
  segments: WordDiffSegment[];
  counts: WordDiffCounts;
}

export interface TailorDiff {
  sections: TailorDiffSection[];
  counts: WordDiffCounts;
}

interface ResumeDiffInputSection {
  id: string;
  title: string;
  kind: TailorDiffSectionKind;
  text: string;
}

export function createTailorDiff(
  base: TailoredResume,
  tailored: TailoredResume,
): TailorDiff {
  const baseSections = resumeToDiffSections(base);
  const tailoredSections = resumeToDiffSections(tailored);
  const sectionIds = new Set([
    ...baseSections.map((section) => section.id),
    ...tailoredSections.map((section) => section.id),
  ]);

  const sections = Array.from(sectionIds).map((id) => {
    const baseSection = baseSections.find((section) => section.id === id);
    const tailoredSection = tailoredSections.find(
      (section) => section.id === id,
    );
    const fallback = tailoredSection ?? baseSection;
    const segments = diffWords(
      baseSection?.text ?? "",
      tailoredSection?.text ?? "",
    );

    return {
      id,
      title: fallback?.title ?? "Resume section",
      kind: fallback?.kind ?? "summary",
      segments,
      counts: countWordsInDiff(segments),
    };
  });

  return {
    sections,
    counts: sumCounts(sections.map((section) => section.counts)),
  };
}

function resumeToDiffSections(resume: TailoredResume): ResumeDiffInputSection[] {
  const sections: ResumeDiffInputSection[] = [];

  sections.push({
    id: "summary",
    title: "Summary",
    kind: "summary",
    text: resume.summary,
  });

  resume.experiences.forEach((experience, experienceIndex) => {
    const label = formatExperienceLabel(experience, experienceIndex);
    sections.push({
      id: `experience:${experienceKey(experience, experienceIndex)}`,
      title: label,
      kind: "experience",
      text: [
        [experience.title, experience.company].filter(Boolean).join(" at "),
        experience.dates,
        ...experience.highlights,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  });

  sections.push({
    id: "skills",
    title: "Skills",
    kind: "skills",
    text: resume.skills.join(", "),
  });

  resume.education.forEach((education, educationIndex) => {
    sections.push({
      id: `education:${educationKey(education, educationIndex)}`,
      title:
        education.institution ||
        [education.degree, education.field].filter(Boolean).join(" in ") ||
        `Education ${educationIndex + 1}`,
      kind: "education",
      text: [
        [education.degree, education.field].filter(Boolean).join(" in "),
        education.institution,
        education.date,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  });

  return sections;
}

function formatExperienceLabel(
  experience: TailoredResume["experiences"][number],
  index: number,
): string {
  return (
    [experience.title, experience.company].filter(Boolean).join(" at ") ||
    `Experience ${index + 1}`
  );
}

function experienceKey(
  experience: TailoredResume["experiences"][number],
  index: number,
): string {
  return (
    slugify([experience.title, experience.company].join(" ")) || String(index)
  );
}

function educationKey(
  education: TailoredResume["education"][number],
  index: number,
): string {
  return (
    slugify(
      [education.institution, education.degree, education.field].join(" "),
    ) ||
    String(index)
  );
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function sumCounts(counts: WordDiffCounts[]): WordDiffCounts {
  const total = counts.reduce(
    (next, count) => ({
      added: next.added + count.added,
      removed: next.removed + count.removed,
      reworded: next.reworded + count.reworded,
      total: next.total + count.total,
    }),
    { added: 0, removed: 0, reworded: 0, total: 0 },
  );

  return total;
}
