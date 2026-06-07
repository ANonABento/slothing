import type {
  BulletStyle,
  ColumnLayout,
  DateAlignment,
  Density,
  HeaderStyle,
  SectionTitleStyle,
} from "../grammar";
import type { AccentPlacement, FontClass } from "../tokens";
import {
  allLines,
  dominantBodyFontSize,
  isSectionHeader,
  median,
  type PdfDocGeometry,
  type TextLine,
} from "./geometry";

/**
 * Deterministic STYLE FINGERPRINT (spec §3 Decision 2 / Phase 2). Geometry — not an
 * LLM — drives everything visual: columns by x-clustering, accent by the most-common
 * non-ink heading color, density from line-gap stats, font class from the embedded
 * font dictionary. Each axis carries its OWN confidence so the classifier can fall
 * back to a curated default PER AXIS when the signal is weak (spec §3). The LLM is
 * reserved for semantic section labeling only (content.ts), never geometry.
 */

/** A fingerprinted axis: best-guess value + 0..1 confidence. */
export interface AxisValue<T> {
  value: T;
  confidence: number;
}

export interface StyleFingerprint {
  columns: AxisValue<ColumnLayout>;
  header: AxisValue<HeaderStyle>;
  sectionTitle: AxisValue<SectionTitleStyle>;
  bullets: AxisValue<BulletStyle>;
  density: AxisValue<Density>;
  accent: AxisValue<string>;
  fontClass: AxisValue<FontClass>;
  baseFontSizePt: AxisValue<number>;
  // Phase A (fidelity roadmap) — parametric knobs read from geometry.
  dateAlignment: AxisValue<DateAlignment>;
  nameScale: AxisValue<number>;
  pageMarginPt: AxisValue<number>;
  accentPlacement: AxisValue<AccentPlacement>;
}

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex(rgb: [number, number, number]): string {
  return "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("");
}

/** True for near-black / grayscale colors (body ink) — never a usable accent. */
function isInk(hex: string): boolean {
  const rgb = parseHex(hex);
  if (!rgb) return true;
  const [r, g, b] = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;
  // Grayscale (low chroma) OR very dark => ink.
  return chroma < 28 || max < 60;
}

/** True when an item color is a real (non-ink) accent color. */
function isAccentColor(color?: string): boolean {
  if (!color) return false;
  const rgb = parseHex(color);
  return rgb ? !isInk(toHex(rgb)) : false;
}

/** The largest-font line in the top third (the name), or the largest line overall. */
function findNameLine(
  doc: PdfDocGeometry,
  lines: TextLine[],
): TextLine | undefined {
  const page = doc.pages[0];
  const top = page
    ? lines.filter((l) => l.page === 0 && l.y < page.height * 0.33)
    : [];
  const pool = top.length ? top : lines;
  return [...pool].sort((a, b) => b.fontSize - a.fontSize || a.y - b.y)[0];
}

// ---------------------------------------------------------------------------
// Font class
// ---------------------------------------------------------------------------

function stripSubsetPrefix(name: string): string {
  return name.replace(/^[A-Z]{6}\+/, "");
}

function classifyFontName(name: string): {
  cls: FontClass;
  informative: boolean;
} {
  const n = stripSubsetPrefix(name).toLowerCase();
  if (!n) return { cls: "sans", informative: false };
  if (/slab|rockwell|clarendon|memphis/.test(n))
    return { cls: "slab", informative: true };
  if (
    /times|georgia|garamond|serif|minion|roman|cambria|palatino|book ?antiqua|charter|merriweather|source ?serif/.test(
      n,
    )
  )
    return { cls: "serif", informative: true };
  if (
    /arial|helvetica|calibri|roboto|lato|open ?sans|source ?sans|verdana|segoe|tahoma|futura|gill|frutiger|nunito|raleway|montserrat|sans/.test(
      n,
    )
  )
    return { cls: "sans", informative: true };
  return { cls: "sans", informative: false };
}

function fingerprintFontClass(lines: TextLine[]): AxisValue<FontClass> {
  const counts: Record<FontClass, number> = { serif: 0, sans: 0, slab: 0 };
  let informativeWeight = 0;
  let totalWeight = 0;
  for (const line of lines) {
    for (const item of line.items) {
      const w = Math.max(1, item.text.length);
      const { cls, informative } = classifyFontName(item.fontName);
      counts[cls] += w;
      totalWeight += w;
      if (informative) informativeWeight += w;
    }
  }
  if (totalWeight === 0) return { value: "sans", confidence: 0 };
  const entries = (Object.entries(counts) as [FontClass, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  const [bestClass, bestCount] = entries[0];
  const share = bestCount / totalWeight;
  const informativeShare = informativeWeight / totalWeight;
  // Confident only when names are informative AND the majority is clear.
  const confidence = Math.min(1, share * informativeShare * 1.2);
  return { value: bestClass, confidence };
}

// ---------------------------------------------------------------------------
// Accent
// ---------------------------------------------------------------------------

function fingerprintAccent(
  lines: TextLine[],
  bodyFontSize: number,
): AxisValue<string> {
  const counts = new Map<string, number>();
  for (const line of lines) {
    const heading = line.bold || line.fontSize > bodyFontSize * 1.08;
    if (!heading) continue;
    for (const item of line.items) {
      if (!item.color) continue;
      const rgb = parseHex(item.color);
      if (!rgb) continue;
      const hex = toHex(rgb);
      if (isInk(hex)) continue;
      counts.set(hex, (counts.get(hex) ?? 0) + Math.max(1, item.text.length));
    }
  }
  if (!counts.size) return { value: "#1f4e79", confidence: 0 };
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const [bestColor, bestCount] = sorted[0];
  const total = sorted.reduce((s, [, c]) => s + c, 0);
  // Confident when one accent dominates the colored headings and appears enough.
  const dominance = bestCount / total;
  const enough = Math.min(1, bestCount / 12);
  return {
    value: bestColor,
    confidence: Math.min(1, dominance * 0.6 + enough * 0.5),
  };
}

// ---------------------------------------------------------------------------
// Density
// ---------------------------------------------------------------------------

function fingerprintDensity(
  lines: TextLine[],
  bodyFontSize: number,
): AxisValue<Density> {
  // Consecutive in-paragraph gaps on the dominant column.
  const byPage = new Map<number, TextLine[]>();
  for (const l of lines) {
    const arr = byPage.get(l.page) ?? [];
    arr.push(l);
    byPage.set(l.page, arr);
  }
  const gaps: number[] = [];
  for (const arr of byPage.values()) {
    const sorted = [...arr].sort((a, b) => a.y - b.y);
    for (let i = 1; i < sorted.length; i += 1) {
      const gap = sorted[i].y - sorted[i - 1].y;
      // Ignore section breaks (huge gaps) and overlaps (multi-column same y).
      if (gap > bodyFontSize * 0.6 && gap < bodyFontSize * 2.6) gaps.push(gap);
    }
  }
  if (gaps.length < 4) return { value: "normal", confidence: 0.2 };
  const ratio = median(gaps) / Math.max(1, bodyFontSize);
  let value: Density;
  if (ratio < 1.25) value = "compact";
  else if (ratio > 1.6) value = "airy";
  else value = "normal";
  const confidence = Math.min(1, gaps.length / 25 + 0.3);
  return { value, confidence };
}

// ---------------------------------------------------------------------------
// Columns (x-clustering / gutter detection)
// ---------------------------------------------------------------------------

function fingerprintColumns(doc: PdfDocGeometry): AxisValue<ColumnLayout> {
  const page = doc.pages[0];
  if (!page) return { value: "single", confidence: 0 };
  const items = page.items.filter((it) => it.text.trim().length > 0);
  if (items.length < 12) return { value: "single", confidence: 0.3 };

  const contentLeft = Math.min(...items.map((i) => i.x));
  const contentRight = Math.max(...items.map((i) => i.x + i.width));
  const contentTop = Math.min(...items.map((i) => i.y));
  const contentBottom = Math.max(...items.map((i) => i.y + i.height));
  const contentH = Math.max(1, contentBottom - contentTop);
  const contentW = Math.max(1, contentRight - contentLeft);

  const totalChars = items.reduce((s, it) => s + it.text.trim().length, 0);

  // Sweep candidate dividers across the CENTRAL band of the content box; pick the one
  // with the fewest straddling items. Keeping the sweep central means right-aligned
  // dates hugging the right margin (a single-column signal) can't masquerade as a
  // column — a real gutter sits between two content bands, not by the margin.
  let best = {
    crossings: Infinity,
    leftN: 0,
    rightN: 0,
    leftChars: 0,
    rightChars: 0,
    leftSpan: 0,
    rightSpan: 0,
    minColWidth: 0,
  };
  for (let f = 0.3; f <= 0.62; f += 0.02) {
    const d = contentLeft + contentW * f;
    let crossings = 0;
    const leftYs: number[] = [];
    const rightYs: number[] = [];
    let leftChars = 0;
    let rightChars = 0;
    let leftMinX = Infinity;
    let leftMaxR = -Infinity;
    let rightMinX = Infinity;
    let rightMaxR = -Infinity;
    for (const it of items) {
      const l = it.x;
      const r = it.x + it.width;
      if (l < d && r > d) crossings += 1;
      else if (r <= d) {
        leftYs.push(it.y);
        leftChars += it.text.trim().length;
        leftMinX = Math.min(leftMinX, l);
        leftMaxR = Math.max(leftMaxR, r);
      } else {
        rightYs.push(it.y);
        rightChars += it.text.trim().length;
        rightMinX = Math.min(rightMinX, l);
        rightMaxR = Math.max(rightMaxR, r);
      }
    }
    if (crossings < best.crossings) {
      const leftSpan = leftYs.length
        ? Math.max(...leftYs) - Math.min(...leftYs)
        : 0;
      const rightSpan = rightYs.length
        ? Math.max(...rightYs) - Math.min(...rightYs)
        : 0;
      const leftWidth = leftYs.length ? leftMaxR - leftMinX : 0;
      const rightWidth = rightYs.length ? rightMaxR - rightMinX : 0;
      best = {
        crossings,
        leftN: leftYs.length,
        rightN: rightYs.length,
        leftChars,
        rightChars,
        leftSpan,
        rightSpan,
        minColWidth: Math.min(leftWidth, rightWidth),
      };
    }
  }

  const crossRatio = best.crossings / items.length;
  const minSideShare = Math.min(best.leftN, best.rightN) / items.length;
  const minCharShare =
    Math.min(best.leftChars, best.rightChars) / Math.max(1, totalChars);
  const bothSpanVertically =
    best.leftSpan > contentH * 0.35 && best.rightSpan > contentH * 0.35;
  // The minority column must be a real content BAND, not a thin strip of right-aligned
  // meta — require it to occupy a meaningful fraction of both items and characters.
  const isTwoCol =
    crossRatio < 0.08 &&
    minSideShare > 0.22 &&
    minCharShare > 0.15 &&
    bothSpanVertically &&
    best.minColWidth > contentW * 0.1;
  if (!isTwoCol) {
    // Low crossings can also mean a clean single column; report single with confidence
    // inversely related to how "two-column-like" it looked.
    const conf = 0.5 + (1 - Math.min(1, minSideShare * 4)) * 0.4;
    return { value: "single", confidence: Math.min(0.95, conf) };
  }

  // The sidebar is the column with LESS text (skills/contact), per our split (layout.ts).
  const sidebarOnLeft = best.leftChars < best.rightChars;
  const value: ColumnLayout = sidebarOnLeft ? "left-sidebar" : "right-sidebar";
  const confidence = Math.min(
    1,
    (1 - crossRatio * 6) * 0.6 + minSideShare * 1.5,
  );
  return { value, confidence: Math.max(0.4, confidence) };
}

// ---------------------------------------------------------------------------
// Header style
// ---------------------------------------------------------------------------

function fingerprintHeader(
  doc: PdfDocGeometry,
  bodyFontSize: number,
): AxisValue<HeaderStyle> {
  const page = doc.pages[0];
  if (!page) return { value: "centered", confidence: 0 };
  const lines = allLines({ pages: [page] });
  if (!lines.length) return { value: "centered", confidence: 0 };

  // Name line = the largest-font line in the top third of the page.
  const topBand = lines.filter((l) => l.y < page.height * 0.33);
  const pool = topBand.length ? topBand : lines;
  const nameLine = [...pool].sort(
    (a, b) => b.fontSize - a.fontSize || a.y - b.y,
  )[0];
  if (!nameLine || nameLine.fontSize < bodyFontSize * 1.1) {
    return { value: "left-aligned", confidence: 0.3 };
  }

  const pageCenter = page.width / 2;
  const nameCenter = (nameLine.x + nameLine.right) / 2;
  const centeredness =
    1 - Math.min(1, Math.abs(nameCenter - pageCenter) / (page.width * 0.18));

  // Is there a separate cluster of contact text to the RIGHT, on roughly the same band?
  const band = lines.filter(
    (l) =>
      Math.abs(l.y - nameLine.y) < nameLine.fontSize * 2.5 && l !== nameLine,
  );
  const hasRightCluster = band.some(
    (l) =>
      l.x > pageCenter && /@|\d{3}|http|linkedin|github|\.com/i.test(l.text),
  );

  if (hasRightCluster && centeredness < 0.6) {
    return { value: "split", confidence: 0.7 };
  }
  if (centeredness > 0.6) {
    return {
      value: "centered",
      confidence: Math.min(1, 0.45 + centeredness * 0.5),
    };
  }
  return {
    value: "left-aligned",
    confidence: Math.min(1, 0.45 + (1 - centeredness) * 0.4),
  };
}

// ---------------------------------------------------------------------------
// Bullets
// ---------------------------------------------------------------------------

const BULLET_MAP: { re: RegExp; style: BulletStyle }[] = [
  { re: /^[•●·◦∙*]/, style: "disc" },
  { re: /^[-–—‐]/, style: "dash" },
  { re: /^[▸►➤»‣>→]/, style: "arrow" },
];

function fingerprintBullets(lines: TextLine[]): AxisValue<BulletStyle> {
  const counts: Record<BulletStyle, number> = {
    disc: 0,
    dash: 0,
    arrow: 0,
    none: 0,
  };
  let markered = 0;
  for (const line of lines) {
    const t = line.text.trimStart();
    let matched = false;
    for (const { re, style } of BULLET_MAP) {
      if (re.test(t)) {
        counts[style] += 1;
        markered += 1;
        matched = true;
        break;
      }
    }
    void matched;
  }
  if (markered < 2) return { value: "disc", confidence: 0.15 };
  const sorted = (Object.entries(counts) as [BulletStyle, number][])
    .filter(([s]) => s !== "none")
    .sort((a, b) => b[1] - a[1]);
  const [bestStyle, bestCount] = sorted[0];
  const confidence = Math.min(
    1,
    (bestCount / Math.max(3, markered)) * 0.7 + Math.min(1, markered / 8) * 0.4,
  );
  return { value: bestStyle, confidence };
}

// ---------------------------------------------------------------------------
// Section title style (text-only signal is weak — honest low confidence)
// ---------------------------------------------------------------------------

function fingerprintSectionTitle(
  lines: TextLine[],
  bodyFontSize: number,
): AxisValue<SectionTitleStyle> {
  const maxFontSize = lines.reduce((m, l) => Math.max(m, l.fontSize), 0);
  const headers = lines.filter((l) =>
    isSectionHeader(l, bodyFontSize, maxFontSize),
  );
  if (headers.length < 2) return { value: "full-rule", confidence: 0.1 };
  const upperShare =
    headers.filter((h) => h.text === h.text.toUpperCase()).length /
    headers.length;
  // Vector rules (full/underline/accent-bar) aren't visible in the text layer, so we
  // cannot distinguish them deterministically. Offer a weak small-caps vs full-rule
  // lean and keep confidence low so the classifier defaults this axis (spec §3).
  if (upperShare > 0.7) return { value: "small-caps", confidence: 0.25 };
  return { value: "full-rule", confidence: 0.15 };
}

// ---------------------------------------------------------------------------
// Name scale (name size relative to body, normalized to the 1.9em baseline)
// ---------------------------------------------------------------------------

function fingerprintNameScale(
  doc: PdfDocGeometry,
  lines: TextLine[],
  bodyFontSize: number,
): AxisValue<number> {
  const nameLine = findNameLine(doc, lines);
  if (!nameLine || bodyFontSize <= 0) return { value: 1, confidence: 0 };
  const ratio = nameLine.fontSize / bodyFontSize;
  // The renderer draws the name at 1.9em × nameScale, so scale = observed / 1.9.
  const value = clampNameScale(ratio / 1.9);
  // Confident only when the name is clearly larger than body text.
  const confidence =
    nameLine.fontSize > bodyFontSize * 1.2
      ? Math.min(1, 0.5 + (ratio - 1.2) * 0.4)
      : 0.2;
  return { value, confidence };
}

// ---------------------------------------------------------------------------
// Page margin (content bounding box vs page box, in points)
// ---------------------------------------------------------------------------

function fingerprintPageMargin(doc: PdfDocGeometry): AxisValue<number> {
  const page = doc.pages[0];
  if (!page) return { value: 40, confidence: 0 };
  const items = page.items.filter((it) => it.text.trim().length > 0);
  if (items.length < 8) return { value: 40, confidence: 0 };
  const left = Math.min(...items.map((i) => i.x));
  const right = Math.max(...items.map((i) => i.x + i.width));
  const top = Math.min(...items.map((i) => i.y));
  // Sane margins only — discard outliers (e.g. a full-bleed sidebar band at x≈0).
  const candidates = [left, page.width - right, top].filter(
    (m) => m > 4 && m < page.width * 0.3,
  );
  if (!candidates.length) return { value: 40, confidence: 0.2 };
  return { value: clampMargin(median(candidates)), confidence: 0.6 };
}

// ---------------------------------------------------------------------------
// Accent placement (is the NAME colored? are the SECTION HEADERS colored?)
// ---------------------------------------------------------------------------

function fingerprintAccentPlacement(
  doc: PdfDocGeometry,
  lines: TextLine[],
  bodyFontSize: number,
): AxisValue<AccentPlacement> {
  const nameLine = findNameLine(doc, lines);
  const nameColored = !!nameLine?.items.some((it) => isAccentColor(it.color));
  const maxFontSize = lines.reduce((m, l) => Math.max(m, l.fontSize), 0);
  const headers = lines.filter((l) =>
    isSectionHeader(l, bodyFontSize, maxFontSize),
  );
  const sectionsColored = headers.some((h) =>
    h.items.some((it) => isAccentColor(it.color)),
  );

  let value: AccentPlacement;
  if (nameColored && sectionsColored) value = "both";
  else if (nameColored) value = "name";
  else if (sectionsColored) value = "rules";
  else value = "none";

  // We can read fill colors fairly reliably; confidence is higher when there are
  // enough headers to judge the "sections" signal.
  const confidence = headers.length >= 2 ? 0.6 : 0.4;
  return { value, confidence };
}

// ---------------------------------------------------------------------------
// Date alignment (do date-like tokens hug the right margin, or flow inline?)
// ---------------------------------------------------------------------------

const DATE_TOKEN_RE =
  /\b(19|20)\d{2}\b|present|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i;

function fingerprintDateAlignment(
  doc: PdfDocGeometry,
): AxisValue<DateAlignment> {
  const page = doc.pages[0];
  if (!page) return { value: "right-tab", confidence: 0 };
  const items = page.items.filter((it) => it.text.trim().length > 0);
  if (!items.length) return { value: "right-tab", confidence: 0 };
  const left = Math.min(...items.map((i) => i.x));
  const right = Math.max(...items.map((i) => i.x + i.width));
  const width = Math.max(1, right - left);

  let rightN = 0;
  let inlineN = 0;
  for (const it of items) {
    if (!DATE_TOKEN_RE.test(it.text)) continue;
    const center = (it.x + it.width / 2 - left) / width;
    if (center > 0.6) rightN += 1;
    else inlineN += 1;
  }
  const total = rightN + inlineN;
  if (total < 2) return { value: "right-tab", confidence: 0.2 };
  const value: DateAlignment = rightN >= inlineN ? "right-tab" : "inline";
  const dominance = Math.max(rightN, inlineN) / total;
  const confidence = Math.min(
    1,
    dominance * 0.7 + Math.min(1, total / 5) * 0.4,
  );
  return { value, confidence };
}

// ---------------------------------------------------------------------------

/** Compute the full deterministic style fingerprint for a parsed PDF geometry. */
export function computeFingerprint(doc: PdfDocGeometry): StyleFingerprint {
  const lines = allLines(doc);
  const bodyFontSize = dominantBodyFontSize(lines);
  return {
    baseFontSizePt: {
      value: clampFont(bodyFontSize),
      confidence: lines.length ? 0.85 : 0,
    },
    fontClass: fingerprintFontClass(lines),
    accent: fingerprintAccent(lines, bodyFontSize),
    density: fingerprintDensity(lines, bodyFontSize),
    columns: fingerprintColumns(doc),
    header: fingerprintHeader(doc, bodyFontSize),
    bullets: fingerprintBullets(lines),
    sectionTitle: fingerprintSectionTitle(lines, bodyFontSize),
    dateAlignment: fingerprintDateAlignment(doc),
    nameScale: fingerprintNameScale(doc, lines, bodyFontSize),
    pageMarginPt: fingerprintPageMargin(doc),
    accentPlacement: fingerprintAccentPlacement(doc, lines, bodyFontSize),
  };
}

function clampFont(size: number): number {
  return Math.min(14, Math.max(7, Math.round(size * 2) / 2));
}

function clampNameScale(scale: number): number {
  return Math.min(1.8, Math.max(0.6, Math.round(scale * 20) / 20));
}

function clampMargin(pt: number): number {
  return Math.min(96, Math.max(18, Math.round(pt)));
}
