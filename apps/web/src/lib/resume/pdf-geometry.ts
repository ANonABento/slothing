import type {
  PdfDocGeometry,
  PdfPageGeometry,
  PdfTextItem,
} from "@slothing/shared/resume-template";

/**
 * Server-side pdf.js → `PdfDocGeometry` adapter (spec §11). The shared extractor is
 * pdf.js-free; this thin adapter turns an uploaded PDF into the normalized geometry
 * primitives the fingerprint + content extractors consume. Mirrors the playground's
 * browser adapter so the same core runs identically in both. Coordinates are flipped
 * to a top-down origin here.
 */

interface PdfJsItem {
  str?: string;
  transform?: number[];
  width?: number;
  height?: number;
  fontName?: string;
}

export async function pdfBufferToGeometry(
  buffer: Buffer | Uint8Array,
): Promise<PdfDocGeometry> {
  const pdfjs =
    (await import("pdfjs-dist/legacy/build/pdf.mjs")) as unknown as {
      getDocument: (o: {
        data: Uint8Array;
        disableWorker: boolean;
        useSystemFonts: boolean;
        verbosity?: number;
      }) => {
        promise: Promise<{
          numPages: number;
          getPage: (n: number) => Promise<{
            getViewport: (o: { scale: number }) => {
              width: number;
              height: number;
            };
            getTextContent: () => Promise<{ items: PdfJsItem[] }>;
          }>;
          destroy?: () => Promise<void> | void;
        }>;
      };
    };

  const doc = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    disableWorker: true,
    useSystemFonts: true,
    verbosity: 0,
  }).promise;

  try {
    const pages: PdfPageGeometry[] = [];
    for (let p = 1; p <= doc.numPages; p += 1) {
      const page = await doc.getPage(p);
      const viewport = page.getViewport({ scale: 1 });
      const tc = await page.getTextContent();
      const items: PdfTextItem[] = [];
      for (const it of tc.items) {
        const text = it.str?.trim();
        const tr = it.transform;
        if (!text || !tr || tr.length < 6) continue;
        const fontSize = Math.hypot(tr[2] ?? 0, tr[3] ?? 0) || it.height || 10;
        const height = Math.max(1, Math.abs(it.height ?? fontSize));
        items.push({
          text: it.str ?? "",
          x: tr[4] ?? 0,
          y: Math.max(0, viewport.height - (tr[5] ?? 0) - height),
          width: Math.max(1, it.width ?? text.length * 6),
          height,
          fontName: it.fontName ?? "",
          fontSize,
        });
      }
      pages.push({ width: viewport.width, height: viewport.height, items });
    }
    return { pages };
  } finally {
    await doc.destroy?.();
  }
}
