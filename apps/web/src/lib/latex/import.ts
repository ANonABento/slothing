/**
 * Importing someone else's .tex.
 * See docs/specs/latex-single-source-rebuild.md §9.1.
 *
 * The wedge: paste your Overleaf resume and it renders EXACTLY as it does today, because
 * it is still your document. We do not reinterpret it, restyle it, or convert it to our
 * grammar — we compile it.
 *
 * An imported document that carries no `\slothing*` macros is not broken. It compiles,
 * previews, and downloads; it simply has no addressable spans yet, so the inspector cannot
 * offer per-field editing until it has been annotated (§9.2, a follow-up).
 */
import { scanSpans } from "./scanner";

/** Documents larger than this are not resumes. */
export const MAX_TEX_BYTES = 512 * 1024;

export type ImportRejection =
  | { code: "empty"; message: string }
  | { code: "too_large"; message: string }
  | { code: "not_tex"; message: string }
  | { code: "no_document_body"; message: string };

export interface ImportAssessment {
  /** Contract spans found. Zero means importable but not yet addressable. */
  spanCount: number;
  annotated: boolean;
  /** True when the file already declares our package — i.e. it came from us. */
  usesSlothingPackage: boolean;
  /** Packages the document requires, for a clearer error if one is unavailable. */
  packages: string[];
}

const DOCUMENT_ENVIRONMENT = /\\begin\s*\{document\}/;
const PACKAGE_PATTERN =
  /\\(?:usepackage|RequirePackage)\s*(?:\[[^\]]*\])?\s*\{([^}]*)\}/g;

/**
 * Reject obviously unusable input BEFORE spending a compile on it. Anything subtler is
 * left to the compiler, which reports LaTeX problems far better than we could.
 */
export function assessImportability(
  source: string,
  filename?: string,
): ImportRejection | null {
  if (source.trim().length === 0) {
    return { code: "empty", message: "That file is empty." };
  }
  if (Buffer.byteLength(source, "utf8") > MAX_TEX_BYTES) {
    return {
      code: "too_large",
      message: "That file is too large to be a resume (max 512KB).",
    };
  }
  if (filename && !/\.tex$/i.test(filename)) {
    return {
      code: "not_tex",
      message: "Only .tex files can be imported.",
    };
  }
  if (!DOCUMENT_ENVIRONMENT.test(source)) {
    return {
      code: "no_document_body",
      message:
        "That file has no \\begin{document} — it looks like a fragment or a class file rather than a complete document.",
    };
  }
  return null;
}

/** What we know about an importable document before compiling it. */
export function assessImport(source: string): ImportAssessment {
  const spans = scanSpans(source);
  const packages = new Set<string>();

  for (const match of source.matchAll(PACKAGE_PATTERN)) {
    for (const name of match[1].split(",")) {
      const trimmed = name.trim();
      if (trimmed) packages.add(trimmed);
    }
  }

  return {
    spanCount: spans.length,
    annotated: spans.length > 0,
    usesSlothingPackage: packages.has("slothing"),
    packages: [...packages].sort(),
  };
}

/**
 * Turn a missing-package compile failure into something actionable.
 *
 * Tectonic reports it as `LaTeX Error: File 'fontawesome5.sty' not found.`, which is
 * accurate and useless to someone who just dragged in their Overleaf file.
 */
export function explainCompileFailure(logText: string): string | null {
  const missing = /File\s+[`'"]([^`'"]+)\.sty['"]?\s+not found/i.exec(logText);
  if (missing) {
    return `This document needs the "${missing[1]}" LaTeX package, which this server does not have available.`;
  }
  if (/Undefined control sequence/i.test(logText)) {
    return "This document uses a command that is not defined — it may rely on a class file or style file that was not uploaded alongside it.";
  }
  return null;
}

/** A title guess from the filename, so the import does not land as "Untitled". */
export function titleFromFilename(filename: string | undefined): string {
  if (!filename) return "Imported resume";
  const base = filename
    .replace(/\.tex$/i, "")
    .replace(/[_-]+/g, " ")
    .trim();
  if (!base) return "Imported resume";
  return base.charAt(0).toUpperCase() + base.slice(1);
}
