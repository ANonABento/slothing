import type { BankEntry, LLMConfig } from "@/types";
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
  return `Strengthen the bullets of ONE résumé entry. Rewrite for impact, strong action verbs, and clarity.

NON-NEGOTIABLE RULES:
- Use ONLY facts already present in the ENTRY below. Do NOT invent or change metrics, numbers, tools, employers, job titles, dates, clients, or outcomes.
- Improve wording only. Every rewritten bullet must be supported by the entry's existing content.
- Do not add a number or percentage that is not already in the entry.
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
