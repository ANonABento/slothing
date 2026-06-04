/**
 * Geometry input model for deterministic extraction (spec §3 Decision 2 / Phase 2).
 *
 * The fingerprint + content extractors are framework-free and operate ONLY on these
 * normalized primitives — they never import pdf.js. A thin adapter (pdfjs-adapter.ts,
 * node/browser) turns a real PDF into a `PdfDocGeometry`. This keeps @slothing/shared
 * dependency-free, makes every extractor unit-testable with synthetic geometry (no
 * binary fixtures), and lets the same core run in the app, the extension, and tests.
 *
 * Coordinates are TOP-DOWN: (0,0) is the top-left of the page; `y` increases
 * downward. The adapter is responsible for flipping pdf.js' bottom-left origin.
 */

export interface PdfTextItem {
  text: string;
  /** Left edge, in PDF points. */
  x: number;
  /** Top edge, in PDF points (top-down). */
  y: number;
  width: number;
  /** Glyph height ≈ font size, in points. */
  height: number;
  /** Embedded font name, e.g. "ABCDEF+Arial-BoldMT". May be empty if unknown. */
  fontName: string;
  /** Font size in points. */
  fontSize: number;
  /** Fill color as #rrggbb, when the adapter can determine it. */
  color?: string;
  bold?: boolean;
  italic?: boolean;
}

export interface PdfPageGeometry {
  width: number;
  height: number;
  items: PdfTextItem[];
}

export interface PdfDocGeometry {
  pages: PdfPageGeometry[];
}

/** One visual line: text items sharing a baseline, left-to-right. */
export interface TextLine {
  items: PdfTextItem[];
  text: string;
  /** Min left edge across items. */
  x: number;
  /** Representative top. */
  y: number;
  /** Right edge (max x+width). */
  right: number;
  /** Dominant font size on the line. */
  fontSize: number;
  bold: boolean;
  /** Page index this line belongs to. */
  page: number;
}

const NBSP = / /g;

function clean(s: string): string {
  return s.replace(NBSP, " ").replace(/\s+/g, " ").trim();
}

/** Median of a numeric list (0 for empty). */
export function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Group a page's text items into visual lines. Items belong to the same line when
 * their vertical centers are within `tolerance` of each other (tolerance scales with
 * font size). Within a line, items are ordered left-to-right and joined with spaces
 * only where there is a real horizontal gap (OpenResume's avg-char-width heuristic).
 */
export function groupIntoLines(
  page: PdfPageGeometry,
  pageIndex: number,
): TextLine[] {
  const items = page.items.filter((it) => clean(it.text).length > 0);
  if (!items.length) return [];

  const sorted = [...items].sort((a, b) => a.y - b.y || a.x - b.x);
  const baselineGroups: PdfTextItem[][] = [];
  for (const it of sorted) {
    const last = baselineGroups[baselineGroups.length - 1];
    if (last) {
      const ref = last[0];
      const tol = Math.max(2, Math.min(ref.fontSize, it.fontSize) * 0.5);
      const refCenter = ref.y + ref.height / 2;
      const itCenter = it.y + it.height / 2;
      if (Math.abs(refCenter - itCenter) <= tol) {
        last.push(it);
        continue;
      }
    }
    baselineGroups.push([it]);
  }

  // Split each baseline group wherever a WIDE horizontal gap separates runs — this is
  // a column gutter, not inter-word spacing. Without it, items on the same baseline in
  // different columns would merge into one nonsensical line (spec §3 x-clustering).
  const gutter = page.width * 0.16;
  const lines: PdfTextItem[][] = [];
  for (const group of baselineGroups) {
    const ordered = [...group].sort((a, b) => a.x - b.x);
    let run: PdfTextItem[] = [ordered[0]];
    for (let i = 1; i < ordered.length; i += 1) {
      const prev = ordered[i - 1];
      const gap = ordered[i].x - (prev.x + prev.width);
      if (gap > gutter) {
        lines.push(run);
        run = [];
      }
      run.push(ordered[i]);
    }
    if (run.length) lines.push(run);
  }

  return lines.map((group) => {
    const ordered = [...group].sort((a, b) => a.x - b.x);
    const fontSizes = ordered.map((i) => i.fontSize);
    const x = Math.min(...ordered.map((i) => i.x));
    const right = Math.max(...ordered.map((i) => i.x + i.width));
    const y = Math.min(...ordered.map((i) => i.y));
    // Join with a space where the horizontal gap exceeds ~0.25 of the avg char width.
    let text = "";
    for (let i = 0; i < ordered.length; i += 1) {
      const cur = ordered[i];
      const piece = cur.text.replace(NBSP, " ");
      if (i === 0) {
        text = piece;
        continue;
      }
      const prev = ordered[i - 1];
      const gap = cur.x - (prev.x + prev.width);
      const avgChar = prev.width / Math.max(1, prev.text.length);
      const needsSpace =
        gap > avgChar * 0.25 && !text.endsWith(" ") && !piece.startsWith(" ");
      text += (needsSpace ? " " : "") + piece;
    }

    const boldCount = ordered.filter((i) => i.bold).length;
    return {
      items: ordered,
      text: clean(text),
      x,
      y,
      right,
      fontSize: median(fontSizes),
      bold: boldCount >= ordered.length / 2,
      page: pageIndex,
    };
  });
}

/** All lines across the document, in reading order (page, then top-down). */
export function allLines(doc: PdfDocGeometry): TextLine[] {
  return doc.pages.flatMap((page, i) => groupIntoLines(page, i));
}

/** Total non-empty text-item count across the document. */
export function totalTextItems(doc: PdfDocGeometry): number {
  return doc.pages.reduce(
    (n, p) => n + p.items.filter((it) => clean(it.text).length > 0).length,
    0,
  );
}

/**
 * Scanned/image-PDF detection (spec §3 / Phase 2): a PDF with (almost) no extractable
 * text is an image scan — we must route to manual template pick, NOT guess geometry.
 */
export function isLikelyScanned(doc: PdfDocGeometry): boolean {
  const items = totalTextItems(doc);
  const chars = doc.pages.reduce(
    (n, p) => n + p.items.reduce((s, it) => s + clean(it.text).length, 0),
    0,
  );
  // A real one-page resume has hundreds of characters / dozens of runs. Almost nothing
  // extractable => image scan.
  return items < 10 || chars < 80;
}

/**
 * Is this line a SECTION HEADER? OpenResume-style detection: short, bold and/or
 * larger-than-body, often UPPERCASE, no sentence punctuation. `bodyFontSize` is the
 * document's dominant body size for the relative comparison.
 */
export function isSectionHeader(line: TextLine, bodyFontSize: number): boolean {
  const t = line.text;
  if (!t || t.length > 40) return false;
  // Contact runs (email) and long sentences are never section headers.
  if (/@/.test(t)) return false;
  const wordCount = t.split(/\s+/).length;
  if (wordCount > 5) return false;
  // The name / job title is much larger than body — exclude it so it stays in the
  // profile band rather than being mistaken for the first section header.
  if (line.fontSize > bodyFontSize * 1.55) return false;
  const isUpper = t === t.toUpperCase() && /[A-Z]/.test(t);
  const isBigger = line.fontSize > bodyFontSize * 1.08;
  return isUpper || (line.bold && wordCount <= 4) || isBigger;
}

/** The dominant body font size — the most common rounded size across all lines. */
export function dominantBodyFontSize(lines: TextLine[]): number {
  if (!lines.length) return 10;
  const counts = new Map<number, number>();
  for (const l of lines) {
    const k = Math.round(l.fontSize * 2) / 2; // 0.5pt buckets
    counts.set(k, (counts.get(k) ?? 0) + l.items.length);
  }
  let best = 10;
  let bestCount = -1;
  for (const [size, count] of counts) {
    if (count > bestCount) {
      best = size;
      bestCount = count;
    }
  }
  return best;
}
