/**
 * Field editing — the ONLY write path into a span's text, and the guard that makes it
 * impossible to silently destroy inline formatting.
 * See docs/specs/latex-single-source-rebuild.md §3.4, §7.3.
 *
 * The problem: `latexToPlainText` is lossy. It strips \slothingB / \slothingI /
 * \slothingLink. If the inspector displayed a bold bullet as plain text and wrote it back
 * escaped, the bold would be gone and nothing would have warned the user.
 *
 * The rule: a field is editable as plain text IF AND ONLY IF its plain-text projection
 * re-escapes byte-for-byte back to what is stored. That is a proof of a lossless round trip
 * using the real functions — not a heuristic macro scan — so anything the escaper cannot
 * reproduce exactly is conservatively treated as rich.
 */
import {
  latexToPlainText,
  plainTextToLatex,
  validateInlineSubset,
  type InlineViolation,
} from "./inline";
import { patchSpanField } from "./scanner";

export type FieldMode = "plain" | "rich";

/**
 * A tagged union so `plainTextToLatex` has exactly one call site in the codebase (the
 * `plain` branch of `writeField`). A caller cannot accidentally escape rich content.
 */
export type FieldWrite =
  | { kind: "plain"; text: string }
  | { kind: "latex"; latex: string };

export type WriteResult =
  | { ok: true; source: string }
  | { ok: false; reason: "mode_mismatch"; source: string }
  | {
      ok: false;
      reason: "invalid_latex";
      source: string;
      violations: InlineViolation[];
    }
  | { ok: false; reason: "not_found"; source: string; message: string };

/**
 * Can this stored LaTeX be edited as plain text without losing anything?
 *
 * Round-trips the value through the real escaper and compares bytes. `\slothingB{x}` fails
 * by construction. So does untrimmed whitespace (latexToPlainText trims), an unknown macro
 * in a hand-written file, and any escape the escaper spells differently — all of which land
 * on the safe side.
 */
export function classifyField(raw: string): FieldMode {
  return plainTextToLatex(latexToPlainText(raw)) === raw ? "plain" : "rich";
}

/** The plain-text projection for display. Only meaningful for a `plain` field. */
export function fieldDisplayText(raw: string): string {
  return latexToPlainText(raw);
}

/**
 * Write one field of one span, returning the new source.
 *
 * Re-derives the field's mode from what is CURRENTLY stored rather than trusting the
 * caller, so a stale UI, a replayed action, or a future AI caller cannot push a plain write
 * into a rich field. On any rejection the source is returned unmodified.
 */
export function writeField(
  source: string,
  spanId: string,
  fieldIndex: number,
  currentRaw: string,
  write: FieldWrite,
): WriteResult {
  if (write.kind === "plain" && classifyField(currentRaw) === "rich") {
    return { ok: false, reason: "mode_mismatch", source };
  }

  const latex =
    write.kind === "plain" ? plainTextToLatex(write.text) : write.latex;

  const violations = validateInlineSubset(latex);
  if (violations.length > 0) {
    return { ok: false, reason: "invalid_latex", source, violations };
  }

  try {
    return {
      ok: true,
      source: patchSpanField(source, spanId, fieldIndex, latex),
    };
  } catch (error) {
    return {
      ok: false,
      reason: "not_found",
      source,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Flatten a rich field to plain text. DESTRUCTIVE — drops inline formatting — so the UI
 * gates this behind a confirm dialog (Pattern A) with a before/after preview.
 */
export function flattenToPlain(raw: string): string {
  return plainTextToLatex(latexToPlainText(raw));
}
