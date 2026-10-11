/**
 * The \slothingset{...} settings block — docs/specs/latex-single-source-rebuild.md §3.2.
 *
 * A closed, schema-validated key/value set. The settings panel reads and writes ONLY this
 * block and never parses arbitrary LaTeX. Unknown keys are a validation error rather than
 * a silent pass-through: an unknown key means the document was written by a newer
 * contract version, and guessing would corrupt it.
 */
import { z } from "zod";

export const settingsSchema = z
  .object({
    font: z.enum(["LatinModern", "Times", "Helvetica", "Palatino"]),
    /**
     * Restricted to the sizes \documentclass accepts. Half-point sizes need an
     * extsizes-style class or a \fontsize override that \normalsize would undo, so
     * they are deliberately out of scope for v1 rather than silently ignored.
     */
    fontsize: z.enum(["10pt", "11pt", "12pt"]),
    margin: z.string().regex(/^\d+(\.\d+)?(in|cm|mm|pt)$/),
    sectionskip: z.string().regex(/^\d+(\.\d+)?(pt|em|ex)$/),
    /** `r,g,b` with each channel 0–255. */
    accent: z.string().regex(/^\d{1,3},\d{1,3},\d{1,3}$/),
    columns: z.union([z.literal(1), z.literal(2)]),
  })
  .strict();

export type DocumentSettings = z.infer<typeof settingsSchema>;

export const DEFAULT_SETTINGS: DocumentSettings = {
  font: "LatinModern",
  fontsize: "11pt",
  margin: "0.5in",
  sectionskip: "8pt",
  accent: "0,0,0",
  columns: 1,
};

const BLOCK = /\\slothingset\s*\{/;

/** Locate the settings block's inner range, or null when the document has none. */
function locateBlock(
  source: string,
): { start: number; end: number; body: string } | null {
  const match = BLOCK.exec(source);
  if (!match) return null;
  const open = match.index + match[0].length - 1;
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === "\\") {
      i += 1;
      continue;
    }
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return { start: open + 1, end: i, body: source.slice(open + 1, i) };
      }
    }
  }
  return null;
}

/**
 * Split a settings body into raw key/value pairs. Values may be brace-wrapped (`{20,40,90}`)
 * so a comma-bearing value like an RGB triple survives the split.
 */
function splitPairs(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  let depth = 0;
  let current = "";
  const chunks: string[] = [];

  for (let i = 0; i < body.length; i += 1) {
    const ch = body[i];
    if (ch === "{") depth += 1;
    if (ch === "}") depth -= 1;
    if (ch === "," && depth === 0) {
      chunks.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  chunks.push(current);

  for (const chunk of chunks) {
    const eq = chunk.indexOf("=");
    if (eq === -1) continue;
    const key = chunk.slice(0, eq).trim();
    let value = chunk.slice(eq + 1).trim();
    if (value.startsWith("{") && value.endsWith("}")) {
      value = value.slice(1, -1).trim();
    }
    if (key) out[key] = value;
  }
  return out;
}

/** Does this document carry a \slothingset block at all? */
export function hasSettingsBlock(source: string): boolean {
  return locateBlock(source) !== null;
}

/**
 * Read the settings block. Missing keys fall back to defaults; unknown keys throw, per
 * the strict schema.
 */
export function readSettings(source: string): DocumentSettings {
  const block = locateBlock(source);
  if (!block) return { ...DEFAULT_SETTINGS };

  const raw = splitPairs(block.body);
  const coerced: Record<string, unknown> = { ...DEFAULT_SETTINGS, ...raw };
  if (typeof coerced.columns === "string") {
    coerced.columns = Number(coerced.columns);
  }
  return settingsSchema.parse(coerced);
}

/** Render a settings object back to a `\slothingset{...}` block body. */
export function renderSettingsBlock(settings: DocumentSettings): string {
  const parsed = settingsSchema.parse(settings);
  const lines = [
    `  font        = ${parsed.font},`,
    `  fontsize    = ${parsed.fontsize},`,
    `  margin      = ${parsed.margin},`,
    `  sectionskip = ${parsed.sectionskip},`,
    `  accent      = {${parsed.accent}},`,
    `  columns     = ${parsed.columns},`,
  ];
  return `\n${lines.join("\n")}\n`;
}

/**
 * Write settings back into a document, splicing only the block's inner range so every
 * other byte is preserved.
 */
export function writeSettings(
  source: string,
  settings: DocumentSettings,
): string {
  const block = locateBlock(source);
  const body = renderSettingsBlock(settings);
  if (!block) {
    throw new Error("Document has no \\slothingset block to update.");
  }
  return source.slice(0, block.start) + body + source.slice(block.end);
}
