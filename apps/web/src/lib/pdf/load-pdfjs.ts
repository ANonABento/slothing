/**
 * Shared pdfjs loader.
 *
 * Extracted from `components/bank/preview/pdf-preview.tsx` so the bank preview and the
 * tex editor share ONE module-level promise. Two independent promises would fetch and
 * initialise pdfjs twice.
 *
 * The loading strategy below is deliberate and hard-won — do not "simplify" it into a
 * plain `import("pdfjs-dist")`. See `next.config.mjs`, which also lists pdfjs-dist as a
 * server external.
 */

export interface PdfJsViewport {
  width: number;
  height: number;
}

export interface PdfJsPage {
  getViewport: (opts: { scale: number }) => PdfJsViewport;
  render: (opts: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PdfJsViewport;
  }) => { promise: Promise<void> };
}

export interface PdfJsDocument {
  numPages: number;
  getPage: (n: number) => Promise<PdfJsPage>;
  destroy?: () => Promise<void> | void;
}

export interface PdfJsModule {
  getDocument: (opts: { data: Uint8Array; verbosity?: number }) => {
    promise: Promise<PdfJsDocument>;
  };
  GlobalWorkerOptions?: { workerSrc: string };
}

let pdfjsPromise: Promise<PdfJsModule> | null = null;
const PDFJS_MODULE_PATH = "/pdfjs/pdf.mjs";

/**
 * Load pdfjs-dist once and configure its worker. The non-legacy build is the
 * browser-targeted ESM module. The worker URL is served from `/pdfjs/`-prefixed public
 * assets — `new URL(..., import.meta.url)` doesn't resolve through Next.js's webpack for
 * ESM packages, and falling back to "fake worker" mode warns loudly and runs PDF parsing
 * on the main thread.
 *
 * Loading the legacy build (`pdfjs-dist/legacy/build/pdf.mjs`) in Next.js's
 * (app-pages-browser) layer triggers `Object.defineProperty called on non-object` inside
 * its webpack-shim header — we steer clear of it here.
 */
export function loadPdfjs(): Promise<PdfJsModule> {
  if (!pdfjsPromise) {
    // `webpackIgnore: true` tells Next.js's webpack not to re-bundle the pdfjs module —
    // the browser fetches the ESM directly from `/public`. Re-bundling triggered a
    // webpack-runtime collision (pdfjs's own `__webpack_require__.r(...)` shim called
    // inside Next's webpack runtime) that threw `Object.defineProperty called on
    // non-object`.
    pdfjsPromise = import(
      /* @vite-ignore */ /* webpackIgnore: true */ PDFJS_MODULE_PATH
    ).then((mod) => {
      const pdfjs = mod as unknown as PdfJsModule;
      if (pdfjs.GlobalWorkerOptions) {
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.mjs";
      }
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

/**
 * The scale a page should render at to fit `containerWidth`, times the user's zoom.
 * Clamped so a pathological page size cannot produce a zero or enormous canvas.
 */
export function fitScale(
  pageWidth: number,
  containerWidth: number,
  zoom: number,
  horizontalPadding = 32,
): number {
  if (pageWidth <= 0 || containerWidth <= 0) return zoom;
  const usable = Math.max(240, containerWidth - horizontalPadding);
  return Math.max(0.25, Math.min(2.5, (usable / pageWidth) * zoom));
}

/**
 * Backing-store multiplier for a crisp canvas on high-DPI displays.
 *
 * The bank preview renders at 1x, which is why its PDF text looks soft on retina. Capped
 * at 2 because 3x on a large page costs a lot of memory for no visible gain.
 */
export function backingScale(devicePixelRatio: number | undefined): number {
  const ratio = devicePixelRatio ?? 1;
  return Math.max(1, Math.min(2, ratio));
}
