export const GENERIC_PHRASES = [
  "passionate about",
  "excited about this opportunity",
  "perfect fit",
  "contribute effectively",
  "fast-paced environment",
  "dynamic team",
  "strong background",
  "aligns well with my experience",
  "writing to express my interest",
] as const;

export const EVIDENCE_FIRST_PROMPT_RULES = `Evidence-first rules:
- Lead with one concrete candidate evidence point from the supplied context.
- Connect that evidence to exactly one job or company requirement from the job description.
- Preserve supplied candidate evidence; do not invent achievements, metrics, roles, projects, or credentials.
- Do not invent company facts. Use company facts only when they appear in the job description or supplied context.
- Stay concise and include one clear call to action.
- Avoid generic phrases such as "passionate about", "excited about this opportunity", "perfect fit", "contribute effectively", "fast-paced environment", "dynamic team", "strong background", and "aligns well with my experience".`;

export const EMAIL_EVIDENCE_FIRST_PROMPT_RULES = `Evidence-first email rules:
- Lead with one concrete candidate/context evidence point or the supplied hook note.
- Connect that evidence to exactly one recipient, company, job, or relationship reason from the supplied context.
- Do not invent company facts, relationship history, role facts, or candidate achievements.
- Keep the body under 200 words.
- Include one clear call to action.
- Avoid generic phrases such as "passionate about", "excited about this opportunity", "perfect fit", "contribute effectively", "fast-paced environment", "dynamic team", "strong background", and "aligns well with my experience".`;

export interface SelfCheckInstructionOptions {
  fieldName?: string;
  evidenceKey?: string;
  matchedKey?: string;
  unsupportedKey?: string;
}

export function buildEvidenceFirstSelfCheckInstructions({
  fieldName = "selfCheck",
  evidenceKey = "evidencePoint",
  matchedKey = "matchedRequirement",
  unsupportedKey = "unsupportedCompanyFacts",
}: SelfCheckInstructionOptions = {}): string {
  return `Include a "${fieldName}" object with:
{
  "${evidenceKey}": "The exact candidate evidence point used",
  "${matchedKey}": "The exact job/company/recipient requirement or reason it connects to",
  "${unsupportedKey}": ["Any company, relationship, role, metric, or achievement facts that were not supplied"],
  "genericPhrases": ["Any generic phrases from the avoid list that remain"],
  "hasClearCTA": boolean
}`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function detectGenericPhrases(text: string): string[] {
  const normalized = text.toLowerCase();

  return GENERIC_PHRASES.filter((phrase) => {
    const pattern = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "i");
    return pattern.test(normalized);
  });
}

export function scoreGenericPhraseDensity(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;

  const matches = detectGenericPhrases(text).length;
  return matches / words;
}

export function genericPhrasePenalty(text: string): number {
  const matches = detectGenericPhrases(text).length;
  if (matches === 0) return 0;

  const density = scoreGenericPhraseDensity(text);
  const densityPenalty = density >= 0.03 ? 1 : 0;
  return Math.min(3, Math.max(1, Math.ceil(matches / 2) + densityPenalty));
}

export function mergeGenericPhraseMatches(
  ...phraseLists: Array<readonly string[] | undefined>
): string[] {
  return Array.from(new Set(phraseLists.flatMap((phrases) => phrases ?? [])));
}
