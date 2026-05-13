import {
  analyzePdfLayout,
  type PdfLayoutReport,
  type PdfPageLayout,
  type PdfTextItem,
} from ".";

interface PdfJsTextItem {
  str?: string;
  transform?: number[];
  width?: number;
  height?: number;
}

interface PdfJsPage {
  getViewport: (options: { scale: number }) => {
    width: number;
    height: number;
  };
  getTextContent: () => Promise<{ items: PdfJsTextItem[] }>;
}

interface PdfJsDocument {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfJsPage>;
  destroy?: () => Promise<void> | void;
}

interface PdfJsModule {
  getDocument: (options: {
    data: Uint8Array;
    disableWorker: boolean;
    useSystemFonts: boolean;
    verbosity?: number;
  }) => { promise: Promise<PdfJsDocument> };
}

function toPageTextItem(
  item: PdfJsTextItem,
  order: number,
  pageHeight: number,
): PdfTextItem | null {
  const text = item.str?.trim();
  const transform = item.transform;
  if (!text || !transform || transform.length < 6) return null;

  const x = transform[4] ?? 0;
  const baselineY = transform[5] ?? 0;
  const height = Math.max(1, Math.abs(item.height ?? transform[3] ?? 10));
  const y = Math.max(0, pageHeight - baselineY - height);

  return {
    text,
    x,
    y,
    width: Math.max(1, item.width ?? text.length * 6),
    height,
    order,
  };
}

export async function extractPdfLayoutReport(
  buffer: Buffer,
): Promise<PdfLayoutReport> {
  const pdfjs =
    (await import("pdfjs-dist/legacy/build/pdf.mjs")) as unknown as PdfJsModule;
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    disableWorker: true,
    useSystemFonts: true,
    verbosity: 0,
  });
  const document = await loadingTask.promise;

  try {
    const pages: PdfPageLayout[] = [];
    let order = 0;
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1 });
      const textContent = await page.getTextContent();
      const items = textContent.items
        .map((item) => {
          const textItem = toPageTextItem(item, order, viewport.height);
          order += 1;
          return textItem;
        })
        .filter((item): item is PdfTextItem => Boolean(item));

      pages.push({
        pageNumber,
        width: viewport.width,
        height: viewport.height,
        items,
      });
    }

    return analyzePdfLayout(pages);
  } finally {
    await document.destroy?.();
  }
}
