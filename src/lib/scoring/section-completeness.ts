import { SUB_SCORE_MAX_POINTS } from "./constants";
import type { ResumeScoreInput, SubScore } from "./types";

export function scoreSectionCompleteness(input: ResumeScoreInput): SubScore {
  const { profile } = input;
  const notes: string[] = [];
  const evidence: string[] = [];
  let earned = 0;
  let completeSections = 0;

  if (profile.contact.name?.trim()) {
    earned += 1;
  } else {
    notes.push("Missing contact name.");
  }

  if (profile.contact.email?.trim()) {
    earned += 1;
  } else {
    notes.push("Missing contact email.");
  }

  const summaryLength = profile.summary?.trim().length ?? 0;
  if (summaryLength >= 50 && summaryLength <= 500) {
    earned += 1;
    completeSections += 1;
  } else {
    notes.push("Summary should be between 50 and 500 characters.");
  }

  const hasExperience = profile.experiences.some(
    (experience) =>
      experience.title.trim() &&
      experience.company.trim() &&
      experience.startDate.trim(),
  );
  if (hasExperience) {
    earned += 2;
    completeSections += 1;
  } else {
    notes.push("Add at least one role with title, company, and start date.");
  }

  if (profile.education.length > 0) {
    earned += 1;
    completeSections += 1;
  } else {
    notes.push("Add at least one education entry.");
  }

  if (profile.skills.length >= 3) {
    earned += 2;
    completeSections += 1;
  } else if (profile.skills.length > 0) {
    earned += 1;
    notes.push("Add at least three skills.");
  } else {
    notes.push("Add a skills section.");
  }

  const hasHighlight = profile.experiences.some(
    (experience) => experience.highlights.length > 0,
  );
  if (hasHighlight) {
    earned += 1;
    completeSections += 1;
  } else {
    notes.push("Add achievement highlights to experience.");
  }

  const hasSecondaryContact = Boolean(
    profile.contact.phone?.trim() ||
      profile.contact.linkedin?.trim() ||
      profile.contact.location?.trim(),
  );
  if (hasSecondaryContact) {
    earned += 1;
    completeSections += 1;
  } else {
    notes.push("Add phone, LinkedIn, or location.");
  }

  if (profile.contact.name?.trim() && profile.contact.email?.trim()) {
    completeSections += 1;
  }

  evidence.push(`${completeSections}/7 sections complete`);

  return {
    key: "sectionCompleteness",
    label: "Section completeness",
    earned: Math.min(earned, SUB_SCORE_MAX_POINTS.sectionCompleteness),
    maxPoints: SUB_SCORE_MAX_POINTS.sectionCompleteness,
    notes,
    evidence,
  };
}
