import type {
  BankEntry,
  GroupedBankEntries,
  LLMConfig,
  ContactInfo,
} from "@/types";
import { isVerifiedBankEntry } from "@/types";
import type { TailoredResume } from "@/lib/resume/generator";
import { formatHackathonHighlights } from "@/lib/resume/hackathon-highlights";
import { groundClaims } from "@/lib/grounding";
import type { BankMatch } from "./analyze";
import { LLMClient, parseJSONFromLLM } from "@/lib/llm/client";
import { tailoredResumeSchema } from "@/lib/schemas/tailor";
import {
  getActivePromptVariant,
  DEFAULT_PROMPT_CONTENT,
  type PromptVariant,
} from "@/lib/db/prompt-variants";
import { applyAtsStrictnessToResume } from "./ats-strictness";
import { buildTailoredResumePrompt } from "./prompt-builders";
import { DEFAULT_TAILOR_SETTINGS, type TailorSettings } from "./settings";

export interface BankResumeInput {
  bankEntries: GroupedBankEntries;
  matchedEntries: BankMatch[];
  contact: ContactInfo;
  summary?: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  userId: string;
  /**
   * Optional pre-existing tailored resume to seed from instead of computing a
   * fresh base from the knowledge bank. Wired up by the extension popup's
   * multi-resume picker (#34). When supplied, the LLM step still re-tailors
   * against the JD; we only swap out the deterministic base.
   */
  seedResume?: TailoredResume;
  /**
   * Per-user tailor knobs (max roles, bullets per role, drop-short-bullets
   * threshold, ATS strictness). Persisted in localStorage on the client and
   * forwarded via the API request body. Falls back to
   * `DEFAULT_TAILOR_SETTINGS` when omitted, which preserves the prior
   * hardcoded behaviour (`maxRoles=5` cap → was `slice(0,3)` minimum,
   * `bulletsPerRole.max=4` → was `slice(0,4)`).
   */
  settings?: TailorSettings;
}

export interface GenerateFromBankResult {
  resume: TailoredResume;
  baseResume: TailoredResume;
  promptVariantId: string | null;
}

/**
 * Generate a tailored resume from knowledge bank entries.
 * Uses LLM when available, falls back to keyword-based selection.
 * Returns the resume and the active prompt variant ID for result tracking.
 */
export async function generateFromBank(
  input: BankResumeInput,
  llmConfig: LLMConfig | null,
): Promise<GenerateFromBankResult> {
  const settings = input.settings ?? DEFAULT_TAILOR_SETTINGS;
  const baseResume = applyAtsStrictnessToResume(
    input.seedResume ?? generateBaseFromBank(input),
    settings.atsStrictness,
  );
  if (llmConfig) {
    const activeVariant = await getActivePromptVariant(input.userId);
    const resume = applyAtsStrictnessToResume(
      await generateWithLLM(input, llmConfig, activeVariant),
      settings.atsStrictness,
    );
    return { resume, baseResume, promptVariantId: activeVariant?.id ?? null };
  }
  return { resume: baseResume, baseResume, promptVariantId: null };
}

async function generateWithLLM(
  input: BankResumeInput,
  llmConfig: LLMConfig,
  promptVariant: PromptVariant | null,
): Promise<TailoredResume> {
  const client = new LLMClient(llmConfig);
  const instructions = promptVariant?.content ?? DEFAULT_PROMPT_CONTENT;
  const prompt = buildTailoredResumePrompt(input, instructions);

  const response = await client.complete({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.4,
    maxTokens: 2000,
  });

  // Parse the RAW JSON (keeping sourceEntryId, which tailoredResumeSchema would strip).
  const raw = parseJSONFromLLM<{
    summary?: string;
    experiences?: Array<{
      sourceEntryId?: string;
      highlights?: unknown;
    }>;
    skills?: unknown;
  }>(response);
  // Still validate the shape we render (defends against malformed output downstream).
  tailoredResumeSchema.partial().parse(raw);

  const settings = input.settings ?? DEFAULT_TAILOR_SETTINGS;
  const opts: EntryHighlightOpts = {
    bulletsPerRoleMax: Math.max(0, settings.bulletsPerRole.max),
    dropShorterThan: Math.max(0, settings.dropBulletsShorterThan),
  };

  const fallbackGenericSummary = `Experienced professional seeking ${input.jobTitle} position.`;
  const verifiedEvidence = verifiedBankEvidenceText(input);

  return {
    contact: input.contact,
    summary: groundedSummary(
      raw.summary || input.summary || fallbackGenericSummary,
      input.summary || fallbackGenericSummary,
      verifiedEvidence,
    ),
    experiences: anchorAndGroundExperiences(
      Array.isArray(raw.experiences) ? raw.experiences : [],
      input,
      opts,
    ),
    // Skills the LLM lists are kept only when they appear in the verified bank evidence.
    skills: groundedSkills(raw.skills, input, verifiedEvidence),
    education: mapBankEducation(input),
  };
}

/** Concatenated text of a single bank entry's content, for grounding rewrites against it. */
function entryEvidenceText(entry: BankEntry): string {
  const c = entry.content;
  const scalars = [
    "company",
    "organizer",
    "title",
    "name",
    "description",
    "text",
    "institution",
    "degree",
    "field",
  ]
    .map((k) => c[k])
    .filter(Boolean)
    .map(String);
  const highlights = Array.isArray(c.highlights)
    ? c.highlights.map(String)
    : [];
  const keywords = Array.isArray(c.keywords) ? c.keywords.map(String) : [];
  return [...scalars, ...highlights, ...keywords].join(". ");
}

/** All VERIFIED bank entries' text — the evidence skills/summary must be grounded in. */
function verifiedBankEvidenceText(input: BankResumeInput): string {
  const g = input.bankEntries;
  const all = [
    ...g.experience,
    ...g.hackathon,
    ...g.project,
    ...g.skill,
    ...g.bullet,
    ...g.achievement,
    ...g.certification,
    ...g.education,
  ].filter(isVerifiedBankEntry);
  return [...all.map(entryEvidenceText), input.summary ?? ""].join(". ");
}

/**
 * Rebuild each output experience from the VERIFIED bank entry the model anchored it to
 * (company/title/dates come from the entry, never the model — so fabricated employers/dates
 * are impossible), and keep only the rewritten highlights grounded in that entry. Drops any
 * experience whose sourceEntryId doesn't match a verified entry. Falls back to the
 * deterministic base roles if the model anchored nothing usable.
 */
function anchorAndGroundExperiences(
  rawExperiences: Array<{ sourceEntryId?: string; highlights?: unknown }>,
  input: BankResumeInput,
  opts: EntryHighlightOpts,
): TailoredResume["experiences"] {
  const verifiedRoles = [
    ...input.bankEntries.experience,
    ...input.bankEntries.hackathon,
  ].filter(isVerifiedBankEntry);
  const roleById = new Map(verifiedRoles.map((e) => [e.id, e]));
  const maxRoles = Math.max(
    0,
    (input.settings ?? DEFAULT_TAILOR_SETTINGS).maxRoles,
  );

  const out: TailoredResume["experiences"] = [];
  const seen = new Set<string>();
  for (const raw of rawExperiences) {
    if (out.length >= maxRoles) break;
    const id = raw?.sourceEntryId ? String(raw.sourceEntryId) : "";
    const entry = roleById.get(id);
    if (!entry || seen.has(id)) continue; // unanchored or duplicate → untrustworthy
    seen.add(id);
    const anchored = entryToResumeExperience(entry, opts);
    const llmHighlights = Array.isArray(raw.highlights)
      ? raw.highlights.map(String)
      : [];
    const grounded = applyHighlightFilters(
      groundClaims(llmHighlights, entryEvidenceText(entry)).supported,
      opts,
    );
    out.push({
      company: anchored.company,
      title: anchored.title,
      dates: anchored.dates,
      // Fall back to the entry's own (verbatim, grounded) bullets if every rewrite was
      // rejected — keep a true experience rather than an empty one.
      highlights: grounded.length ? grounded : anchored.highlights,
    });
  }

  if (out.length > 0) return out;
  // Model anchored nothing usable → deterministic, grounded base.
  return verifiedRoles
    .slice(0, maxRoles)
    .map((entry) => entryToResumeExperience(entry, opts));
}

/** Keep LLM skills only if grounded in the verified bank; else fall back to bank skills. */
function groundedSkills(
  rawSkills: unknown,
  input: BankResumeInput,
  verifiedEvidence: string,
): string[] {
  const llmSkills = Array.isArray(rawSkills) ? rawSkills.map(String) : [];
  const grounded = groundClaims(llmSkills, verifiedEvidence).supported;
  if (grounded.length > 0) return grounded.slice(0, 15);
  return input.bankEntries.skill
    .filter(isVerifiedBankEntry)
    .map((e) => String(e.content.name || ""))
    .filter(Boolean)
    .slice(0, 15);
}

/**
 * Use the LLM summary only when it is grounded in the verified bank — fall back to the
 * user's own summary if it smuggles in a fabricated metric or makes claims the bank can't
 * support (e.g. naming tools/skills the candidate doesn't have).
 */
function groundedSummary(
  candidate: string,
  fallback: string,
  verifiedEvidence: string,
): string {
  const { ungroundedNumbers, supported } = groundClaims(
    candidate,
    verifiedEvidence,
  );
  if (ungroundedNumbers.length > 0 || supported.length === 0) return fallback;
  return candidate;
}

export function buildBankTailoredResumePrompt(
  input: BankResumeInput,
  promptVariant: PromptVariant | null,
): string {
  const instructions = promptVariant?.content ?? DEFAULT_PROMPT_CONTENT;
  return buildTailoredResumePrompt(input, instructions);
}

export function generateBaseFromBank(input: BankResumeInput): TailoredResume {
  const settings = input.settings ?? DEFAULT_TAILOR_SETTINGS;
  const maxRoles = Math.max(0, settings.maxRoles);
  const bulletsPerRoleMax = Math.max(0, settings.bulletsPerRole.max);
  const dropShorterThan = Math.max(0, settings.dropBulletsShorterThan);

  // Use matched entries sorted by relevance
  const usedEntryIds = new Set<string>();
  const topExperiences = input.matchedEntries
    .filter(
      (m) =>
        m.entry.category === "experience" || m.entry.category === "hackathon",
    )
    .slice(0, maxRoles)
    .map((m) => {
      usedEntryIds.add(m.entry.id);
      return entryToResumeExperience(m.entry, {
        bulletsPerRoleMax,
        dropShorterThan,
      });
    });

  // If not enough matched experiences, fill from bank
  if (topExperiences.length < Math.min(2, maxRoles)) {
    for (const entry of [
      ...input.bankEntries.experience,
      ...input.bankEntries.hackathon,
    ]) {
      if (topExperiences.length >= maxRoles) break;
      if (!usedEntryIds.has(entry.id)) {
        topExperiences.push(
          entryToResumeExperience(entry, {
            bulletsPerRoleMax,
            dropShorterThan,
          }),
        );
        usedEntryIds.add(entry.id);
      }
    }
  }

  // Collect skills - prioritize matched ones
  const matchedSkillNames = new Set<string>();
  for (const m of input.matchedEntries) {
    if (m.entry.category === "skill") {
      matchedSkillNames.add(String(m.entry.content.name || ""));
    }
  }
  const bankSkillNames = input.bankEntries.skill
    .map((e) => String(e.content.name || ""))
    .filter(Boolean);
  const allSkills = [
    ...Array.from(matchedSkillNames),
    ...bankSkillNames.filter((s) => !matchedSkillNames.has(s)),
  ].slice(0, 15);

  // Education
  const education = input.bankEntries.education.map((e) => {
    const c = e.content;
    return {
      institution: String(c.institution || ""),
      degree: String(c.degree || ""),
      field: String(c.field || ""),
      date: String(c.endDate || ""),
    };
  });

  return {
    contact: input.contact,
    summary:
      input.summary ||
      `Experienced professional seeking ${input.jobTitle} position at ${input.company}.`,
    experiences: topExperiences,
    skills: allSkills,
    education,
  };
}

function mapBankEducation(input: BankResumeInput): TailoredResume["education"] {
  return input.bankEntries.education.map((e) => {
    const c = e.content;
    return {
      institution: String(c.institution || ""),
      degree: String(c.degree || ""),
      field: String(c.field || ""),
      date: String(c.endDate || ""),
    };
  });
}

interface EntryHighlightOpts {
  /** Cap on highlights per experience block (was hardcoded 4). */
  bulletsPerRoleMax: number;
  /** Drop highlights shorter than this many chars (was hardcoded 0 — no filter). */
  dropShorterThan: number;
}

function applyHighlightFilters(
  highlights: string[],
  opts: EntryHighlightOpts,
): string[] {
  return highlights
    .filter((h) => h.trim().length >= opts.dropShorterThan)
    .slice(0, opts.bulletsPerRoleMax);
}

function entryToResumeExperience(
  entry: BankEntry,
  opts: EntryHighlightOpts = {
    bulletsPerRoleMax: DEFAULT_TAILOR_SETTINGS.bulletsPerRole.max,
    dropShorterThan: DEFAULT_TAILOR_SETTINGS.dropBulletsShorterThan,
  },
): TailoredResume["experiences"][number] {
  const c = entry.content;
  if (entry.category === "hackathon") {
    return {
      company: String(c.organizer || "Hackathon"),
      title: String(c.name || ""),
      dates: formatDateRange(c),
      highlights: applyHighlightFilters(formatHackathonHighlights(c), opts),
    };
  }

  const rawHighlights = Array.isArray(c.highlights)
    ? c.highlights.map(String)
    : [];
  return {
    company: String(c.company || ""),
    title: String(c.title || ""),
    dates: formatDateRange(c),
    highlights: applyHighlightFilters(rawHighlights, opts),
  };
}

function formatDateRange(content: Record<string, unknown>): string {
  const start = content.startDate ? String(content.startDate) : "";
  const end = content.endDate ? String(content.endDate) : "";
  if (start && end) return `${start} - ${end}`;
  if (start) return `${start} - Present`;
  return end;
}
