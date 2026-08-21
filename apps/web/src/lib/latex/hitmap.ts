/**
 * The span hit map — docs/specs/latex-single-source-rebuild.md §6.
 *
 * Resolves a click in the rendered PDF to a contract span id.
 *
 * MECHANISM (decided by the PR 3 spike): preview compiles wrap each id-bearing span in an
 * invisible link annotation carrying `slothing://<id>`, and we read those annotations
 * back out of the PDF *server-side* with pdf-lib. The client receives a plain JSON map of
 * normalised rectangles and never inspects the PDF itself.
 *
 * Extracting server-side is what makes this robust: PDF.js sanitises unknown URI schemes
 * in its own annotation layer, so a client-side reader could not be relied on to surface
 * `slothing://`. pdf-lib reads the raw object graph, where the URI is simply present.
 *
 * A span that wraps across lines yields MULTIPLE rects sharing one id — hyperref emits one
 * annotation per line box. That is a feature: the overlay wants every rect.
 */
import { PDFArray, PDFDict, PDFDocument, PDFName, PDFString } from "pdf-lib";

export const ANCHOR_SCHEME = "slothing://";

/**
 * One clickable rectangle, normalised to the page box with a TOP-LEFT origin — the
 * coordinate space an HTML overlay actually uses. PDF's native origin is bottom-left.
 */
export interface HitRect {
  id: string;
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface HitMap {
  rects: HitRect[];
  /** Span ids present in the map, in first-appearance order. */
  ids: string[];
}

export const EMPTY_HIT_MAP: HitMap = { rects: [], ids: [] };

/** Read the span hit map out of a preview-compiled PDF. */
export async function extractHitMap(pdf: Uint8Array): Promise<HitMap> {
  const doc = await PDFDocument.load(pdf);
  const rects: HitRect[] = [];

  doc.getPages().forEach((page, pageIndex) => {
    const { width, height } = page.getSize();
    if (width <= 0 || height <= 0) return;

    // `lookup` (not `get`) resolves indirect references — annotations are almost always
    // stored as refs, so `get` returns a PDFRef and silently finds nothing.
    const annots = page.node.lookup(PDFName.of("Annots"));
    if (!(annots instanceof PDFArray)) return;

    for (let i = 0; i < annots.size(); i += 1) {
      const annot = annots.lookup(i);
      if (!(annot instanceof PDFDict)) continue;

      const action = annot.lookup(PDFName.of("A"));
      if (!(action instanceof PDFDict)) continue;

      const uri = action.lookup(PDFName.of("URI"));
      if (!(uri instanceof PDFString)) continue;

      const value = uri.decodeText();
      if (!value.startsWith(ANCHOR_SCHEME)) continue;

      const rect = annot.lookup(PDFName.of("Rect"));
      if (!(rect instanceof PDFArray)) continue;

      const box = rect.asArray().map((n) => Number(n.toString()));
      if (box.length < 4 || box.some((n) => !Number.isFinite(n))) continue;
      const [x1, y1, x2, y2] = box;

      rects.push({
        id: value.slice(ANCHOR_SCHEME.length),
        page: pageIndex,
        x: x1 / width,
        y: 1 - y2 / height,
        w: (x2 - x1) / width,
        h: (y2 - y1) / height,
      });
    }
  });

  const ids: string[] = [];
  for (const rect of rects) if (!ids.includes(rect.id)) ids.push(rect.id);
  return { rects, ids };
}

/**
 * Resolve a normalised point to a span id. The SMALLEST matching rect wins, so a nested
 * span always beats an enclosing one if their rects ever overlap.
 */
export function hitTest(
  map: HitMap,
  page: number,
  x: number,
  y: number,
): string | null {
  let best: HitRect | null = null;
  for (const rect of map.rects) {
    if (rect.page !== page) continue;
    if (x < rect.x || x > rect.x + rect.w) continue;
    if (y < rect.y || y > rect.y + rect.h) continue;
    if (!best || rect.w * rect.h < best.w * best.h) best = rect;
  }
  return best?.id ?? null;
}

/** Every rect belonging to one span — what the overlay highlights on selection. */
export function rectsForSpan(map: HitMap, id: string): HitRect[] {
  return map.rects.filter((rect) => rect.id === id);
}
