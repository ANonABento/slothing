import * as pdfjs from "pdfjs-dist";
// Vite serves the worker as an asset URL.
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import type { PdfDocGeometry, PdfPageGeometry, PdfTextItem } from "@slothing/shared/resume-template";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

/**
 * Browser pdf.js → `PdfDocGeometry` adapter. The shared extractor is pdf.js-free
 * (spec §11); this thin adapter is what turns a dropped PDF into the normalized
 * geometry primitives the fingerprint + content extractors consume. The app ships an
 * equivalent server/edge adapter in Phase 4.
 */
export async function pdfToGeometry(data: ArrayBuffer): Promise<PdfDocGeometry> {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(data), useSystemFonts: true }).promise;
  const pages: PdfPageGeometry[] = [];
  for (let p = 1; p <= doc.numPages; p += 1) {
    const page = await doc.getPage(p);
    const viewport = page.getViewport({ scale: 1 });
    const tc = await page.getTextContent();
    const items: PdfTextItem[] = [];
    for (const it of tc.items) {
      if (!("str" in it) || !it.str.trim()) continue;
      const tr = it.transform as number[];
      const fontSize = Math.hypot(tr[2], tr[3]) || it.height || 10;
      items.push({
        text: it.str,
        x: tr[4],
        y: viewport.height - tr[5] - (it.height || fontSize),
        width: it.width,
        height: it.height || fontSize,
        fontName: (it as { fontName?: string }).fontName ?? "",
        fontSize,
      });
    }
    pages.push({ width: viewport.width, height: viewport.height, items });
  }
  return { pages };
}
