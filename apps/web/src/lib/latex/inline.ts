/**
 * The inline markup subset — docs/specs/latex-single-source-rebuild.md §3.4.
 *
 * Field content is plain text, escaped. Exactly three inline macros are permitted:
 * \slothingB{...}, \slothingI{...}, \slothingLink{url}{text}.
 *
 * This is a SECURITY boundary, not only a formatting one. Model output is validated
 * against it and rejected on violation — free-form LaTeX from an LLM would defeat both
 * the sandbox reasoning and the addressability guarantees.
 */
import { escapeLatex } from "@/lib/resume/latex-generator";

export const ALLOWED_INLINE_MACROS = [
  "slothingB",
  "slothingI",
  "slothingLink",
] as const;

export type InlineViolation =
  | { kind: "disallowed-macro"; macro: string; index: number }
  | { kind: "unbalanced-braces" }
  | { kind: "unsafe-url"; url: string };

/** Only these URL schemes may appear in \slothingLink. */
const SAFE_URL = /^(https?:\/\/|mailto:)/i;

/** Plain text → LaTeX-safe text. The default path for every field write. */
export function plainTextToLatex(text: string): string {
  return escapeLatex(text);
}

/**
 * Validate that `latex` contains only escaped text plus the allowed inline macros.
 * Returns every violation found rather than throwing on the first, so a rejected model
 * response can be retried with specific feedback.
 */
export function validateInlineSubset(latex: string): InlineViolation[] {
  const violations: InlineViolation[] = [];

  let depth = 0;
  let i = 0;
  while (i < latex.length) {
    const ch = latex[i];
    if (ch === "\\") {
      let j = i + 1;
      while (j < latex.length && /[A-Za-z]/.test(latex[j])) j += 1;
      const macro = latex.slice(i + 1, j);
      if (macro.length === 0) {
        // An escaped symbol such as \% or \& — legitimate escaped text.
        i += 2;
        continue;
      }
      if (!ALLOWED_INLINE_MACROS.includes(macro as never)) {
        violations.push({ kind: "disallowed-macro", macro, index: i });
      }
      i = j;
      continue;
    }
    if (ch === "{") depth += 1;
    if (ch === "}") {
      depth -= 1;
      if (depth < 0) {
        violations.push({ kind: "unbalanced-braces" });
        return violations;
      }
    }
    i += 1;
  }
  if (depth !== 0) violations.push({ kind: "unbalanced-braces" });

  for (const match of latex.matchAll(/\\slothingLink\{([^}]*)\}/g)) {
    const url = match[1];
    if (!SAFE_URL.test(url)) violations.push({ kind: "unsafe-url", url });
  }

  return violations;
}

export function isValidInline(latex: string): boolean {
  return validateInlineSubset(latex).length === 0;
}

/**
 * LaTeX (in the allowed subset) → plain text, for display in the inspector.
 * Inverse of {@link plainTextToLatex} for the escaped-character cases.
 */
export function latexToPlainText(latex: string): string {
  return latex
    .replace(/\\slothingLink\{[^}]*\}\{([^}]*)\}/g, "$1")
    .replace(/\\slothing[BI]\{([^}]*)\}/g, "$1")
    .replace(/\\textbackslash\{\}/g, "\\")
    .replace(/\\textasciitilde\{\}/g, "~")
    .replace(/\\textasciicircum\{\}/g, "^")
    .replace(/\\([%&$#_{}])/g, "$1")
    .trim();
}
