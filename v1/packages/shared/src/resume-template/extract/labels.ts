/**
 * Section LABELING — the ONLY part of extraction the spec assigns to semantics (and,
 * optionally, an LLM): mapping a detected header's text ("WORK HISTORY", "Employment")
 * to a canonical section kind (spec §3 Decision 2). Geometry stays deterministic; this
 * is language. The default is a fast keyword map; an LLM labeler can be injected for
 * headers it returns "unknown" for, without the core ever importing an LLM client.
 */

export type SectionKind =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "contact"
  | "unknown";

const LABEL_RULES: { kind: SectionKind; re: RegExp }[] = [
  { kind: "summary", re: /\b(summary|profile|objective|about|overview)\b/i },
  {
    kind: "experience",
    re: /\b(experience|employment|work history|career|professional background|positions?)\b/i,
  },
  {
    kind: "education",
    re: /\b(education|academic|qualifications?|degrees?)\b/i,
  },
  {
    kind: "skills",
    re: /\b(skills?|technologies|technical|competenc|tools|stack|expertise|languages?)\b/i,
  },
  {
    kind: "projects",
    re: /\b(projects?|portfolio|open[\s-]?source|publications?|selected work)\b/i,
  },
  { kind: "contact", re: /\b(contact|details|info|reach)\b/i },
];

/** Deterministic keyword labeler. Returns "unknown" when no rule matches. */
export function labelSection(header: string): SectionKind {
  const h = header.trim();
  for (const { kind, re } of LABEL_RULES) {
    if (re.test(h)) return kind;
  }
  return "unknown";
}

/** Pluggable labeler signature (e.g. an LLM call in the app for "unknown" headers). */
export type SectionLabeler = (
  header: string,
) => SectionKind | Promise<SectionKind>;
