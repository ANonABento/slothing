"use client";

/**
 * The PDF canvas.
 *
 * Double-buffered on purpose: incoming bytes are decoded and rendered to an offscreen
 * canvas FIRST, and only then swapped in. The visible page is never unmounted, so a
 * recompile cannot blank the document, and scroll position and zoom survive for free.
 *
 * The canvas renders at devicePixelRatio (capped at 2). The bank preview renders at 1x,
 * which is why its PDF text looks soft on retina.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";

import type { HitMap } from "@/lib/latex/hitmap";
import {
  backingScale,
  fitScale,
  loadPdfjs,
  type PdfJsDocument,
} from "@/lib/pdf/load-pdfjs";
import { Button } from "@/components/ui/button";
import { pluralize } from "@/lib/text/pluralize";
import { cn } from "@/lib/utils";

import { SpanOverlay } from "./span-overlay";

export interface TexPdfCanvasProps {
  /** Bytes for the preview waiting to be shown, with the cache key that identifies them. */
  pending: { key: string; bytes: Uint8Array } | null;
  /** Hit map of the preview currently on screen. */
  hitMap: HitMap | null;
  selectedSpanId: string | null;
  onSelectSpan: (spanId: string) => void;
  /** Fired once bytes have fully decoded AND painted — this is what swaps the preview. */
  onRendered: (key: string, pageCount: number) => void;
  onRenderFailed: (key: string, message: string) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  /** True while a newer compile is in flight; dims interaction slightly. */
  stale?: boolean;
}

export function TexPdfCanvas({
  pending,
  hitMap,
  selectedSpanId,
  onSelectSpan,
  onRendered,
  onRenderFailed,
  zoom,
  onZoomChange,
  stale = false,
}: TexPdfCanvasProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const docRef = useRef<PdfJsDocument | null>(null);
  const renderedKeyRef = useRef<string | null>(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [cssSize, setCssSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const measure = () => setContainerWidth(element.clientWidth);
    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const paint = useCallback(
    async (doc: PdfJsDocument, targetPage: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) return;

      const page = await doc.getPage(targetPage);
      const base = page.getViewport({ scale: 1 });
      const scale = fitScale(base.width, containerWidth, zoom);
      const viewport = page.getViewport({ scale });
      const dpr = backingScale(
        typeof window === "undefined" ? 1 : window.devicePixelRatio,
      );

      // CSS size drives layout; the backing store is DPR-scaled for crisp text.
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      setCssSize({ width: viewport.width, height: viewport.height });
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      await page.render({ canvasContext: context, viewport }).promise;
    },
    [containerWidth, zoom],
  );

  // Decode incoming bytes, paint them, and only then tell the parent to swap.
  useEffect(() => {
    if (!pending || pending.key === renderedKeyRef.current) return;
    let cancelled = false;

    void (async () => {
      try {
        const pdfjs = await loadPdfjs();
        const doc = await pdfjs.getDocument({
          data: pending.bytes,
          verbosity: 0,
        }).promise;
        if (cancelled) return;

        const nextPage = Math.min(pageNumber, doc.numPages);
        await paint(doc, nextPage);
        if (cancelled) return;

        void docRef.current?.destroy?.();
        docRef.current = doc;
        renderedKeyRef.current = pending.key;
        setPageCount(doc.numPages);
        setPageNumber(nextPage);
        onRendered(pending.key, doc.numPages);
      } catch (error) {
        if (cancelled) return;
        onRenderFailed(
          pending.key,
          error instanceof Error ? error.message : "Could not render the PDF.",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pending, paint, pageNumber, onRendered, onRenderFailed]);

  // Repaint the already-loaded document when zoom or width changes. No refetch, no swap.
  useEffect(() => {
    if (!docRef.current || containerWidth === 0) return;
    void paint(docRef.current, pageNumber);
  }, [containerWidth, paint, pageNumber]);

  const hasDocument = pageCount > 0;

  return (
    <div className="flex h-full min-h-0 flex-col bg-page-2">
      <div className="flex items-center justify-between gap-3 border-b border-rule px-3 py-2">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Previous page"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((n) => Math.max(1, n - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3"
            aria-label={
              hasDocument
                ? `Page ${pageNumber} of ${pluralize(pageCount, "page")}`
                : undefined
            }
          >
            {hasDocument ? `${pageNumber} / ${pageCount}` : "—"}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Next page"
            disabled={pageNumber >= pageCount}
            onClick={() => setPageNumber((n) => Math.min(pageCount, n + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Zoom out"
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-mono text-[11px] text-ink-3">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Zoom in"
            onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="min-h-0 flex-1 overflow-auto p-4"
        data-testid="pdf-viewport"
      >
        <div
          className={cn(
            "relative mx-auto shadow-paper-card transition-opacity",
            stale && "opacity-90",
          )}
          style={{ width: cssSize.width || undefined }}
        >
          <canvas
            ref={canvasRef}
            className="block h-auto w-full rounded-sm"
            style={{
              width: cssSize.width || undefined,
              height: cssSize.height || undefined,
            }}
          />
          {hitMap && hasDocument ? (
            <SpanOverlay
              hitMap={hitMap}
              page={pageNumber - 1}
              selectedSpanId={selectedSpanId}
              onSelect={onSelectSpan}
              muted={stale}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
