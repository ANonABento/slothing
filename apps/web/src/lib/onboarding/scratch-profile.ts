import type { Profile } from "@/types";
import { generateId } from "@/lib/utils";

export interface ScratchProfileAnswers {
  name: string;
  email: string;
  headline: string;
  summary?: string;
  educationInstitution?: string;
  educationDegree?: string;
  educationField?: string;
  skillsCsv?: string;
  experienceCompany?: string;
  experienceTitle?: string;
  experienceHighlights?: string;
  projectName?: string;
  projectSummary?: string;
  projectHighlights?: string;
  achievements?: string;
}

function clean(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function splitList(value: string | undefined): string[] {
  return clean(value)
    .split(/[,/]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitBullets(value: string | undefined, max = 3): string[] {
  const normalized = value ?? "";
  const delimiter = normalized.includes("\n") ? /\n/ : /[,;]/;

  return normalized
    .split(delimiter)
    .map((item) => clean(item))
    .filter(Boolean)
    .slice(0, max);
}

export function scratchProfileFromAnswers(
  answers: ScratchProfileAnswers,
): Partial<Profile> {
  const headline = clean(answers.headline);
  const summary = clean(answers.summary);
  const institution = clean(answers.educationInstitution);
  const degree = clean(answers.educationDegree);
  const field = clean(answers.educationField);
  const skillNames = splitList(answers.skillsCsv);
  const targetRoles = splitList(headline);
  const company = clean(answers.experienceCompany);
  const title = clean(answers.experienceTitle);
  const experienceHighlights = splitBullets(answers.experienceHighlights);
  const projectName = clean(answers.projectName);
  const projectHighlights = splitBullets(answers.projectHighlights);
  const achievements = splitList(answers.achievements);

  const profile: Partial<Profile> = {
    contact: {
      name: clean(answers.name),
      email: clean(answers.email),
      headline,
      ...(targetRoles.length > 0 ? { targetRoles } : {}),
    },
  };

  if (summary) {
    profile.summary = summary;
  }

  if (institution) {
    profile.education = [
      {
        id: generateId(),
        institution,
        degree: degree || "Not specified",
        field,
        highlights: [],
      },
    ];
  }

  if (skillNames.length > 0) {
    profile.skills = skillNames.map((name) => ({
      id: generateId(),
      name,
      category: "other",
    }));
  }

  if (company && title) {
    profile.experiences = [
      {
        id: generateId(),
        company,
        title,
        startDate: "",
        current: false,
        description: experienceHighlights.join("\n"),
        highlights: experienceHighlights,
        skills: [],
      },
    ];
  }

  if (projectName) {
    profile.projects = [
      {
        id: generateId(),
        name: projectName,
        description: clean(answers.projectSummary),
        technologies: [],
        highlights: projectHighlights,
      },
    ];
  }

  if (achievements.length > 0) {
    if (profile.education?.[0]) {
      profile.education[0].highlights.push(...achievements);
    } else if (profile.experiences?.[0]) {
      profile.experiences[0].highlights.push(...achievements);
    }
  }

  return profile;
}
