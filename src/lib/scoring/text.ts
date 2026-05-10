import type { Profile } from "@/types";

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function wordBoundaryRegex(term: string, flags = ""): RegExp {
  return new RegExp(`\\b${escapeRegExp(term)}\\b`, flags);
}

export function containsWord(text: string, term: string): boolean {
  return wordBoundaryRegex(term).test(text);
}

export function countWordOccurrences(text: string, term: string): number {
  return (text.match(wordBoundaryRegex(term, "g")) || []).length;
}

export function getHighlights(profile: Profile): string[] {
  return [
    ...profile.experiences.flatMap((experience) => experience.highlights),
    ...profile.projects.flatMap((project) => project.highlights),
  ].filter(Boolean);
}

export function extractProfileText(profile: Profile): string {
  const parts = [
    profile.contact?.name,
    profile.contact?.email,
    profile.contact?.phone,
    profile.contact?.location,
    profile.contact?.linkedin,
    profile.contact?.github,
    profile.contact?.website,
    profile.contact?.headline,
    profile.summary,
    ...profile.experiences.flatMap((experience) => [
      experience.title,
      experience.company,
      experience.location,
      experience.description,
      ...experience.highlights,
      ...experience.skills,
      experience.startDate,
      experience.endDate,
    ]),
    ...profile.education.flatMap((education) => [
      education.institution,
      education.degree,
      education.field,
      ...education.highlights,
      education.startDate,
      education.endDate,
    ]),
    ...profile.skills.map((skill) => skill.name),
    ...profile.projects.flatMap((project) => [
      project.name,
      project.description,
      project.url,
      ...project.highlights,
      ...project.technologies,
    ]),
    ...profile.certifications.flatMap((certification) => [
      certification.name,
      certification.issuer,
      certification.date,
      certification.url,
    ]),
  ];

  return parts.filter(Boolean).join("\n");
}

export function getResumeText(profile: Profile, rawText?: string): string {
  return rawText?.trim() || profile.rawText?.trim() || extractProfileText(profile);
}

export function wordCount(text: string): number {
  const normalized = normalizeText(text);
  if (!normalized) return 0;
  return normalized.split(/\s+/).filter(Boolean).length;
}
