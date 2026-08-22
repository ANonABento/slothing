import type { BankCategory, BankEntry, LLMConfig } from "@/types";
import { isVerifiedBankEntry } from "@/types";
import { LLMClient, parseJSONFromLLM } from "@/lib/llm/client";
import { groundClaims } from "@/lib/grounding";
import type { InsertBankEntry } from "@/lib/db/profile-bank";

/**
 * AI bank authoring (spec §4). AI never originates facts — it only RE-EXPRESSES material
 * the user already has, and its output is a `draft` the user must confirm. This module is
 * the "Strengthen" operation: rewrite an existing entry's bullets for impact/keywords with
 * the rewrite grounded ⊆ the original entry (no invented facts/metrics survive).
 */

export interface JobContext {
  jobTitle?: string;
  company?: string;
  jobDescription?: string;
}

/** The entry's existing bullets — `content.highlights[]`, else its description/text. */
export function entryHighlights(entry: BankEntry): string[] {
  const c = entry.content;
  if (Array.isArray(c.highlights)) return c.highlights.map(String);
  const single = c.description ?? c.text ?? c.name;
  return single ? [String(single)] : [];
}

/** Evidence text a rewrite of THIS entry must be grounded in (its own content). */
export function entryEvidence(entry: BankEntry): string {
  const c = entry.content;
  const scalars = [
    "company",
    "organizer",
    "title",
    "name",
    "description",
    "text",
  ]
    .map((k) => c[k])
    .filter(Boolean)
    .map(String);
  return [...scalars, ...entryHighlights(entry)].join(". ");
}

export function buildStrengthenPrompt(
  entry: BankEntry,
  jobContext?: JobContext,
): string {
  const job =
    jobContext?.jobDescription || jobContext?.jobTitle
      ? `\nTARGET JOB (use only to choose which TRUE details to emphasize — never to add new facts):\nTitle: ${jobContext.jobTitle ?? "N/A"}\nCompany: ${jobContext.company ?? "N/A"}\n${(jobContext.jobDescription ?? "").slice(0, 1500)}\n`
      : "";
  return `Strengthen the bullets of ONE resume entry. Rewrite for impact, strong action verbs, and clarity.

NON-NEGOTIABLE RULES:
- Use ONLY facts already present in the ENTRY below. Do NOT invent or change metrics, numbers, tools, employers, job titles, dates, clients, or outcomes.
- Do not add a number or percentage that is not already in the entry (do NOT compute a derived metric like a "% improvement" — only reuse numbers exactly as written).
- Do NOT add context, scope, skills, audiences, or descriptive detail not in the entry. Stay close to the entry — rephrase for impact, don't embellish. No trailing clauses ("guiding…", "demonstrating…", "leveraging…") unless that detail is already there.
- Improve wording, action verbs, and clarity only. Every rewritten bullet must be supported by the entry's existing content.
- Return JSON ONLY, no prose: {"highlights": ["...", "..."]}

ENTRY:
${JSON.stringify(entry.content)}
${job}
Return ONLY: {"highlights": ["rewritten bullet 1", "rewritten bullet 2"]}`;
}

/**
 * Call the LLM to strengthen the entry's bullets, then keep ONLY the rewrites grounded in
 * the original entry (claims ⊆ original; fabricated numbers dropped). Returns the grounded
 * rewritten highlights; falls back to the entry's original highlights if every rewrite was
 * rejected (never returns fabricated content, never empty when the entry had bullets).
 */
export async function strengthenEntryHighlights(
  entry: BankEntry,
  llmConfig: LLMConfig,
  jobContext?: JobContext,
): Promise<string[]> {
  const client = new LLMClient(llmConfig);
  const response = await client.complete({
    messages: [
      { role: "user", content: buildStrengthenPrompt(entry, jobContext) },
    ],
    temperature: 0.4,
    maxTokens: 800,
  });
  const parsed = parseJSONFromLLM<{ highlights?: unknown }>(response);
  const rewritten = Array.isArray(parsed.highlights)
    ? parsed.highlights.map(String)
    : [];
  const grounded = groundClaims(rewritten, entryEvidence(entry)).supported;
  return grounded.length > 0 ? grounded : entryHighlights(entry);
}

// --- Tailoring ↔ bank loop (spec §6): turn JD gaps into safe next actions ---

export interface JobGapAnalysis {
  /**
   * Missing JD keywords the user ALREADY has evidence for in a verified entry — a grounded
   * Strengthen can surface them. Each carries the entry ids whose evidence contains it.
   */
  strengthenable: Array<{ keyword: string; entryIds: string[] }>;
  /**
   * Missing keywords with NO supporting verified evidence — a true gap. The UI routes these
   * to Articulate (ask the user) rather than ever inventing the experience.
   */
  gaps: string[];
}

/**
 * Classify a JD's missing keywords against the user's VERIFIED bank (spec §6). The result
 * drives the safe loop: strengthenable → grounded rewrite suggestions; gaps → ask the user
 * (Articulate). Never invents — a gap is surfaced as a question, not filled.
 */
export function classifyJobGaps(
  missingKeywords: string[],
  bankEntries: BankEntry[],
): JobGapAnalysis {
  const verified = bankEntries
    .filter(isVerifiedBankEntry)
    .map((e) => ({ id: e.id, text: entryEvidence(e).toLowerCase() }));

  const strengthenable: JobGapAnalysis["strengthenable"] = [];
  const gaps: string[] = [];
  const seen = new Set<string>();

  for (const raw of missingKeywords) {
    const keyword = raw.trim();
    const key = keyword.toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const entryIds = verified
      .filter((e) => e.text.includes(key))
      .map((e) => e.id);
    if (entryIds.length > 0) {
      strengthenable.push({ keyword, entryIds });
    } else {
      gaps.push(keyword);
    }
  }
  return { strengthenable, gaps };
}

// --- Articulate (spec §4.2): the user's own raw material → grounded draft bullets ---

export function buildArticulatePrompt(
  rawText: string,
  jobContext?: JobContext,
): string {
  const job =
    jobContext?.jobDescription || jobContext?.jobTitle
      ? `\nTARGET JOB (use only to choose emphasis/wording — never to add facts the notes don't contain):\nTitle: ${jobContext.jobTitle ?? "N/A"}\nCompany: ${jobContext.company ?? "N/A"}\n${(jobContext.jobDescription ?? "").slice(0, 1500)}\n`
      : "";
  return `Turn the candidate's OWN notes into 1-3 strong, concise resume bullets.

NON-NEGOTIABLE RULES:
- Use ONLY facts stated in the NOTES below. Do NOT invent or change metrics, numbers, tools, employers, titles, dates, clients, or outcomes.
- Do not add a number or percentage that is not already in the notes (do NOT compute a derived metric like a "% improvement" — only reuse numbers exactly as written).
- Do NOT add context, scope, skills, audiences, or descriptive detail that is not in the notes. Stay minimal and close to the notes — rephrase, don't embellish.
- Prefer the notes' own words; a strong verb + the stated fact is enough. No trailing clauses ("guiding…", "demonstrating…", "leveraging…") unless that detail is in the notes.
- Each bullet must be fully supported by the notes. Improve wording, action verbs, and concision only.
- Return JSON ONLY, no prose: {"bullets": ["...", "..."]}

NOTES:
${rawText}
${job}
Return ONLY: {"bullets": ["bullet 1", "bullet 2"]}`;
}

/**
 * Articulate the user's raw notes into bullets, keeping ONLY those grounded in the notes
 * (claims ⊆ rawText; fabricated numbers dropped). The facts come from the user — AI only
 * phrases them. Returns the grounded bullets (possibly empty if nothing was grounded).
 */
export async function articulateToBullets(
  rawText: string,
  llmConfig: LLMConfig,
  jobContext?: JobContext,
): Promise<string[]> {
  const client = new LLMClient(llmConfig);
  const response = await client.complete({
    messages: [
      { role: "user", content: buildArticulatePrompt(rawText, jobContext) },
    ],
    temperature: 0.4,
    maxTokens: 600,
  });
  const parsed = parseJSONFromLLM<{ bullets?: unknown }>(response);
  const bullets = Array.isArray(parsed.bullets)
    ? parsed.bullets.map(String)
    : [];
  return groundClaims(bullets, rawText).supported;
}

// --- Project-from-source (spec §4.3): a fetched URL's text → a grounded project draft ---

export interface ProjectSource {
  /** Readable source text (README / page) — the grounding evidence. */
  text: string;
  /** A suggested name (repo/page title) the AI may keep or refine. */
  suggestedName: string;
  /** Detected technologies (e.g. GitHub languages) — authoritative, kept as-is. */
  technologies: string[];
}

export interface ProjectDraft {
  name: string;
  technologies: string[];
  bullets: string[];
}

export function buildProjectFromSourcePrompt(
  source: ProjectSource,
  styleExemplars: string[],
  jobContext?: JobContext,
): string {
  const job =
    jobContext?.jobDescription || jobContext?.jobTitle
      ? `\nTARGET JOB (use only to choose which TRUE details to emphasize — never to add facts):\nTitle: ${jobContext.jobTitle ?? "N/A"}\nCompany: ${jobContext.company ?? "N/A"}\n${(jobContext.jobDescription ?? "").slice(0, 1500)}\n`
      : "";
  const style =
    styleExemplars.length > 0
      ? `\nSTYLE EXAMPLES (match the tone, verb-first structure, and concision — DO NOT copy their facts):\n${styleExemplars.map((s) => `- ${s}`).join("\n")}\n`
      : "";
  return `Summarize ONE software project into resume content, using ONLY the SOURCE below.

NON-NEGOTIABLE RULES:
- Use ONLY facts present in the SOURCE. Do NOT invent or change metrics, numbers, tools, scope, outcomes, employers, or dates.
- Do not add a number or percentage that is not already in the source (no derived/estimated metrics).
- Each bullet must be a strong, concise, verb-first resume bullet fully supported by the source. No filler or embellishment.
- "technologies" must be tools/languages explicitly named in the source.
- Suggested name to refine: "${source.suggestedName}".
- Return JSON ONLY, no prose: {"name": "...", "technologies": ["..."], "bullets": ["...", "..."]}
${style}
SOURCE:
${source.text}
${job}
Return ONLY: {"name": "Project Name", "technologies": ["Tech"], "bullets": ["bullet 1", "bullet 2", "bullet 3"]}`;
}

/**
 * Draft a project (name + technologies + 3–5 bullets) from fetched source text. Bullets are kept
 * only if grounded ⊆ the source (fabricated metrics dropped via {@link groundClaims}); technologies
 * are restricted to those the source names (or the authoritative detected list). The AI phrases —
 * it never originates facts. Bullets may be empty if nothing was grounded.
 */
export async function draftProjectFromSource(
  source: ProjectSource,
  llmConfig: LLMConfig,
  styleExemplars: string[] = [],
  jobContext?: JobContext,
): Promise<ProjectDraft> {
  const client = new LLMClient(llmConfig);
  const response = await client.complete({
    messages: [
      {
        role: "user",
        content: buildProjectFromSourcePrompt(
          source,
          styleExemplars,
          jobContext,
        ),
      },
    ],
    temperature: 0.4,
    maxTokens: 900,
  });
  const parsed = parseJSONFromLLM<{
    name?: unknown;
    technologies?: unknown;
    bullets?: unknown;
  }>(response);

  const rawBullets = Array.isArray(parsed.bullets)
    ? parsed.bullets.map(String)
    : [];
  const bullets = groundClaims(rawBullets, source.text).supported;

  // Technologies the source supports: the detected list (authoritative) plus any AI-named tech
  // that actually appears in the source text.
  const sourceLower = source.text.toLowerCase();
  const detected = new Set(source.technologies.map((t) => t.trim()));
  const aiTech = Array.isArray(parsed.technologies)
    ? parsed.technologies
        .map(String)
        .map((t) => t.trim())
        .filter((t) => t && sourceLower.includes(t.toLowerCase()))
    : [];
  const technologies = Array.from(new Set([...detected, ...aiTech])).filter(
    Boolean,
  );

  const name =
    typeof parsed.name === "string" && parsed.name.trim()
      ? parsed.name.trim()
      : source.suggestedName;

  return { name, technologies, bullets };
}

/** Build a draft bank entry for one articulated bullet (unverified until confirmed). */
export function articulatedDraftInput(
  rawText: string,
  bullet: string,
  category: BankCategory = "bullet",
): InsertBankEntry {
  return {
    category,
    content: { description: bullet, text: bullet },
    status: "draft",
    authoredBy: "ai_articulated",
    groundedIn: { kind: "raw_input", rawText },
    confidenceScore: 0.6,
  };
}

/** Build the draft bank entry for a strengthened rewrite (unverified until confirmed). */
export function strengthenedDraftInput(
  entry: BankEntry,
  highlights: string[],
): InsertBankEntry {
  const hasHighlights = Array.isArray(entry.content.highlights);
  const content: Record<string, unknown> = hasHighlights
    ? { ...entry.content, highlights }
    : { ...entry.content, description: highlights[0] ?? "" };
  return {
    category: entry.category,
    content,
    status: "draft",
    authoredBy: "ai_strengthened",
    groundedIn: { kind: "entry", refId: entry.id },
    confidenceScore: 0.7,
  };
}

// --- Revise (spec §4.4): iterative pair-writing on a single bullet, grounded ⊆ evidence ---

/** Built-in revise instructions the scratchpad exposes as one-click presets. */
export const REVISE_PRESETS = {
  shorter:
    "Make it more concise and tighter without losing the key fact or metric.",
  impact:
    "Lead with a stronger action verb and emphasize the impact/outcome. Add NO new facts.",
  metric:
    "If — and ONLY if — the evidence contains a quantitative result, surface it; never invent or estimate a number.",
  rephrase: "Rephrase for clarity and flow.",
} as const;

export type RevisePreset = keyof typeof REVISE_PRESETS;

export interface ReviseResult {
  /** The bullet to show: the revision if it stayed grounded, else the original (unchanged). */
  bullet: string;
  /** True when the revision was grounded ⊆ evidence and therefore applied. */
  applied: boolean;
  /** Metric tokens the revision introduced that the evidence does not support. */
  ungroundedNumbers: string[];
}

export function buildRevisePrompt(
  bullet: string,
  evidence: string,
  instruction: string,
  jobContext?: JobContext,
): string {
  const job =
    jobContext?.jobDescription || jobContext?.jobTitle
      ? `\nTARGET JOB (use only to choose which TRUE details to emphasize — never to add facts):\nTitle: ${jobContext.jobTitle ?? "N/A"}\nCompany: ${jobContext.company ?? "N/A"}\n${(jobContext.jobDescription ?? "").slice(0, 1500)}\n`
      : "";
  return `Revise ONE resume bullet per the instruction.

INSTRUCTION: ${instruction}

NON-NEGOTIABLE RULES:
- Use ONLY facts present in the EVIDENCE below. Do NOT invent or change metrics, numbers, tools, scope, employers, titles, dates, or outcomes.
- Do not add a number or percentage that is not already in the evidence (no derived/estimated metrics).
- Keep it a single, concise, verb-first resume bullet. No trailing filler clauses unless that detail is in the evidence.
- Return JSON ONLY, no prose: {"bullet": "..."}

CURRENT BULLET:
${bullet}

EVIDENCE (the only facts you may use):
${evidence}
${job}
Return ONLY: {"bullet": "revised bullet"}`;
}

/**
 * Revise a single bullet against its evidence. The revision is kept ONLY if it stays grounded ⊆
 * the evidence (no fabricated metrics); otherwise the original bullet is returned unchanged and
 * `applied` is false so the UI can tell the user the revision was rejected.
 */
export async function reviseBullet(
  bullet: string,
  evidence: string,
  instruction: string,
  llmConfig: LLMConfig,
  jobContext?: JobContext,
): Promise<ReviseResult> {
  const client = new LLMClient(llmConfig);
  const response = await client.complete({
    messages: [
      {
        role: "user",
        content: buildRevisePrompt(bullet, evidence, instruction, jobContext),
      },
    ],
    temperature: 0.4,
    maxTokens: 300,
  });
  const parsed = parseJSONFromLLM<{ bullet?: unknown }>(response);
  const revised = typeof parsed.bullet === "string" ? parsed.bullet.trim() : "";
  if (!revised) {
    return { bullet, applied: false, ungroundedNumbers: [] };
  }
  const result = groundClaims([revised], evidence);
  const applied = result.supported.includes(revised);
  return {
    bullet: applied ? revised : bullet,
    applied,
    ungroundedNumbers: result.ungroundedNumbers,
  };
}
