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

  return profile;
}
