/**
 * The contract scanner — a NARROW scanner, deliberately not a LaTeX parser.
 * See docs/specs/latex-single-source-rebuild.md §3.3.
 *
 * It locates `\slothing*` macro heads, matches their brace arguments, and records byte
 * ranges. Everything it does not recognise is opaque text it must preserve exactly. That
 * guarantee is what makes the raw-LaTeX escape hatch trustworthy: an AI edit to one
 * bullet can never disturb a user's hand-written preamble.
 */
import {
  MACRO_KINDS,
  SPAN_SHAPES,
  type Span,
  type SpanArg,
  type SpanKind,
} from "./contract";

const LETTER = /[A-Za-z]/;

/**
 * Advance past a TeX comment (`%` to end of line) if one starts at `i`.
 * A `%` preceded by a backslash is a literal percent, not a comment.
 */
function skipComment(source: string, i: number): number {
  if (source[i] !== "%") return i;
  const newline = source.indexOf("\n", i);
  return newline === -1 ? source.length : newline + 1;
}

/**
 * Match a balanced `{...}` group starting at `open` (which must be `{`).
 * Returns the inner range, or null when the group never closes.
 * Honours `\{` / `\}` escapes and skips comments.
 */
function matchGroup(source: string, open: number): SpanArg | null {
  if (source[open] !== "{") return null;
  let depth = 0;
  let i = open;
  while (i < source.length) {
    const ch = source[i];
    if (ch === "\\") {
      // Escaped character — consume the backslash and whatever follows it.
      i += 2;
      continue;
    }
    if (ch === "%") {
      i = skipComment(source, i);
      continue;
    }
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        return {
          start: open + 1,
          end: i,
          text: source.slice(open + 1, i),
        };
      }
    }
    i += 1;
  }
  return null;
}

/** Match an optional `[...]` argument at `i`, tolerating nested brackets. */
function matchOptional(
  source: string,
  i: number,
): { end: number; raw: string } | null {
  if (source[i] !== "[") return null;
  let depth = 0;
  let j = i;
  while (j < source.length) {
    const ch = source[j];
    if (ch === "\\") {
      j += 2;
      continue;
    }
    if (ch === "[") depth += 1;
    else if (ch === "]") {
      depth -= 1;
      if (depth === 0) return { end: j + 1, raw: source.slice(i + 1, j) };
    }
    j += 1;
  }
  return null;
}

/** Pull `id=<value>` out of an optional-argument body. Returns null when absent. */
export function parseIdOption(raw: string): string | null {
  const match = /(?:^|,)\s*id\s*=\s*([^,\]]+)/.exec(raw);
  return match ? match[1].trim() : null;
}

/** Skip whitespace, which LaTeX allows between a macro and its arguments. */
function skipSpace(source: string, i: number): number {
  while (i < source.length && /\s/.test(source[i])) i += 1;
  return i;
}

/**
 * Find every contract span in `source`, in document order, with parent/child links
 * derived from offset containment (an item inside an entry's body argument).
 */
export function scanSpans(source: string): Span[] {
  const found: Span[] = [];
  let i = 0;

  while (i < source.length) {
    const ch = source[i];

    if (ch === "%") {
      i = skipComment(source, i);
      continue;
    }
    if (ch !== "\\") {
      i += 1;
      continue;
    }

    // Read the macro name after the backslash.
    let j = i + 1;
    while (j < source.length && LETTER.test(source[j])) j += 1;
    const macro = source.slice(i + 1, j);
    const kind: SpanKind | undefined = MACRO_KINDS[macro];
    if (!kind) {
      // Not ours. Step past the backslash and (if it was an escape like `\{`) its target,
      // so an escaped brace can never be mistaken for a group delimiter.
      i = macro.length > 0 ? j : i + 2;
      continue;
    }

    const shape = SPAN_SHAPES[kind];
    let cursor = skipSpace(source, j);

    const optional = matchOptional(source, cursor);
    const id = optional ? parseIdOption(optional.raw) : null;
    if (optional) cursor = skipSpace(source, optional.end);

    const args: SpanArg[] = [];
    let malformed = false;
    for (let a = 0; a < shape.arity; a += 1) {
      const group = matchGroup(source, cursor);
      if (!group) {
        malformed = true;
        break;
      }
      args.push(group);
      cursor = skipSpace(source, group.end + 1);
    }

    if (malformed) {
      // A macro whose arguments do not close is left alone — the compiler will report it
      // far better than we can, and guessing would risk corrupting the source on write.
      i = j;
      continue;
    }

    found.push({
      id,
      kind,
      macro,
      start: i,
      end: args[args.length - 1].end + 1,
      args,
      childIds: [],
      parentId: null,
    });

    // Continue scanning INSIDE this span so nested items are found too.
    i = args[0].start;
  }

  return linkHierarchy(found.sort((a, b) => a.start - b.start));
}

/** Derive parent/child links from containment. Outermost span wins as parent. */
function linkHierarchy(spans: Span[]): Span[] {
  for (const span of spans) {
    let parent: Span | null = null;
    for (const candidate of spans) {
      if (candidate === span) continue;
      if (candidate.start <= span.start && candidate.end >= span.end) {
        if (!parent || candidate.start > parent.start) parent = candidate;
      }
    }
    if (parent && span.id) {
      span.parentId = parent.id;
      parent.childIds.push(span.id);
    } else if (parent) {
      span.parentId = parent.id;
    }
  }
  return spans;
}

export function findSpan(spans: Span[], id: string): Span | null {
  return spans.find((s) => s.id === id) ?? null;
}

/**
 * Replace one field of one span, returning the new source.
 *
 * This is the ONLY write path into a document body. It splices a single byte range and
 * leaves every other byte untouched, which is the §7.3 guarantee.
 */
export function patchSpanField(
  source: string,
  spanId: string,
  fieldIndex: number,
  latex: string,
): string {
  const span = findSpan(scanSpans(source), spanId);
  if (!span) {
    throw new Error(`No span with id "${spanId}" in this document.`);
  }
  const arg = span.args[fieldIndex];
  if (!arg) {
    throw new Error(
      `Span "${spanId}" (${span.kind}) has no field at index ${fieldIndex}.`,
    );
  }
  return source.slice(0, arg.start) + latex + source.slice(arg.end);
}
