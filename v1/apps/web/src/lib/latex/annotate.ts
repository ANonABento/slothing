/**
 * The annotation pass — spec §9.2.
 *
 * An imported .tex renders perfectly but carries none of our macros, so nothing in it is
 * addressable. This asks a model to insert `\slothing*` wrappers around the structure it
 * already has, WITHOUT changing a single visible character.
 *
 * That is a genuinely risky operation — a model rewriting someone's hand-tuned résumé —
 * so it is defended in three layers, cheapest first:
 *
 *   1. Structural checks here (no compile): ids well-formed and unique, every emitted
 *      macro actually parses, and no word from the original went missing.
 *   2. Render equivalence: compile before and after and compare extracted text. If the
 *      rendered words changed at all, the model altered content and the proposal is
 *      thrown away.
 *   3. Human review: the proposal is never applied automatically.
 *
 * A failed annotation changes nothing. The document stays exactly as imported.
 */
import { isSpanId, MACRO_KINDS, type SpanKind } from "./contract";
import { scanSpans } from "./scanner";

export interface AnnotationIssue {
  code:
    | "no_spans"
    | "malformed_macro"
    | "duplicate_id"
    | "bad_id"
    | "content_lost"
    | "content_added";
  message: string;
}

export interface AnnotationShape {
  ok: boolean;
  issues: AnnotationIssue[];
  spanCount: number;
  /** Counts per kind, for a summary the user can actually judge. */
  byKind: Record<string, number>;
}

/** Words the model is free to move around; they carry no résumé content. */
const LATEX_NOISE = /\\[A-Za-z@]+|[{}[\]\\$&%#_^~]/g;
/**
 * Our own `[id=...]` arguments. Stripped FIRST — the bracket characters alone would go,
 * leaving `id=itm-d4e5f6` behind as apparent prose and making every annotation look like
 * it invented text.
 */
const SLOTHING_OPTIONAL_ARG = /\\slothing[A-Za-z]+\s*\[[^\]]*\]/g;

/**
 * The visible-word multiset of a source, ignoring LaTeX control sequences.
 * Not a renderer — just enough to catch a model that dropped or invented prose.
 */
export function contentWords(source: string): string[] {
  const body = source
    .replace(SLOTHING_OPTIONAL_ARG, " ")
    .replace(LATEX_NOISE, " ");
  return body
    .toLowerCase()
    .split(/[^a-z0-9%.+-]+/)
    .filter((word) => word.length > 1);
}

function multiset(words: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);
  return counts;
}

/**
 * Structural validation of an annotation proposal. Runs before any compile, so an
 * obviously-broken response costs nothing.
 */
export function checkAnnotationShape(
  original: string,
  annotated: string,
): AnnotationShape {
  const issues: AnnotationIssue[] = [];
  const spans = scanSpans(annotated);

  const byKind: Record<string, number> = {};
  for (const span of spans) {
    byKind[span.kind] = (byKind[span.kind] ?? 0) + 1;
  }

  if (spans.length === 0) {
    issues.push({
      code: "no_spans",
      message: "The annotation added no recognisable structure.",
    });
  }

  // Every `\slothing<Kind>` the model wrote must have parsed. The scanner skips a macro
  // whose braces do not close, so a mismatch means it emitted something malformed.
  const emitted = [...annotated.matchAll(/\\(slothing[A-Za-z]+)/g)]
    .map((match) => match[1])
    .filter((name) => name in MACRO_KINDS);
  if (emitted.length !== spans.length) {
    issues.push({
      code: "malformed_macro",
      message: `${emitted.length - spans.length} of the added macros are malformed and would not compile.`,
    });
  }

  const seen = new Set<string>();
  for (const span of spans) {
    if (!span.id) continue;
    if (!isSpanId(span.id)) {
      issues.push({
        code: "bad_id",
        message: `"${span.id}" is not a valid span id.`,
      });
      continue;
    }
    if (seen.has(span.id)) {
      issues.push({
        code: "duplicate_id",
        message: `Span id "${span.id}" was used more than once.`,
      });
    }
    seen.add(span.id);
  }

  // Cheap content guard before the expensive render check.
  const before = multiset(contentWords(original));
  const after = multiset(contentWords(annotated));

  const lost: string[] = [];
  for (const [word, count] of before) {
    if ((after.get(word) ?? 0) < count) lost.push(word);
  }
  const added: string[] = [];
  for (const [word, count] of after) {
    if ((before.get(word) ?? 0) < count) added.push(word);
  }

  if (lost.length > 0) {
    issues.push({
      code: "content_lost",
      message: `Text went missing: ${lost.slice(0, 5).join(", ")}${lost.length > 5 ? "…" : ""}`,
    });
  }
  if (added.length > 0) {
    issues.push({
      code: "content_added",
      message: `Text was invented: ${added.slice(0, 5).join(", ")}${added.length > 5 ? "…" : ""}`,
    });
  }

  return { ok: issues.length === 0, issues, spanCount: spans.length, byKind };
}

/** A human summary of what the annotation found, for the review step. */
export function summarizeAnnotation(byKind: Record<string, number>): string {
  const order: SpanKind[] = [
    "header",
    "section",
    "entry",
    "item",
    "skills",
    "para",
    "mark",
  ];
  const labels: Record<SpanKind, [string, string]> = {
    header: ["header", "headers"],
    section: ["section", "sections"],
    entry: ["role", "roles"],
    item: ["bullet", "bullets"],
    skills: ["skills block", "skills blocks"],
    para: ["paragraph", "paragraphs"],
    mark: ["editable field", "editable fields"],
  };

  const parts = order.flatMap((kind) => {
    const count = byKind[kind] ?? 0;
    if (count === 0) return [];
    const [one, many] = labels[kind];
    return [`${count} ${count === 1 ? one : many}`];
  });

  return parts.length > 0 ? parts.join(", ") : "no structure";
}

export function buildAnnotatePrompt(source: string): string {
  return `Add Slothing structural macros to this LaTeX résumé.

ABSOLUTE RULES — a violation makes the whole result unusable:
- Do NOT change, reword, reorder, add or remove ANY visible text.
- Do NOT change the preamble, packages, lengths, or any existing macro definition.
- Do NOT change formatting, spacing, or the document's appearance in any way.
- The compiled PDF must be character-for-character identical to the original.

Your ONLY job is to WRAP existing text in ONE macro so the app can address it:

  \\slothingMark[id=mrk-XXXXXX]{EXISTING TEXT}

where XXXXXX is 6 random lowercase hex characters, unique across the document.

\\slothingMark renders its content exactly as-is and adds nothing. Wrap the TEXT ONLY —
never a \\item, never a list, never a whole environment, never anything that produces
layout. For a bullet like:

  \\resumeItem{Cut cost 40\\% by rewriting the solver.}

the correct result is:

  \\resumeItem{\\slothingMark[id=mrk-a1b2c3]{Cut cost 40\\% by rewriting the solver.}}

Wrap each bullet's text, each section title, and the name and contact line. If a piece of
content does not have a clean text span to wrap, LEAVE IT ALONE. Partial annotation is
fine and expected. Wrapping something incorrectly is much worse than not wrapping it.

Return JSON ONLY: {"annotated": "<the complete .tex source>"}

SOURCE:
${source}`;
}
