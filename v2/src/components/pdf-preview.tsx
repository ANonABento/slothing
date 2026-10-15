"use client";

import { AlertTriangle, Code2, Download, Loader2, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { buttonClass, cx } from "./ui";

type Pdf = Awaited<ReturnType<typeof import("unpdf").getDocumentProxy>>;

const LETTER_RATIO = 11 / 8.5; // placeholder page shape until the real page size is known

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/** One page drawn to a canvas at device resolution. Renders off-screen and swaps, so re-renders never flash blank. */
function PdfPage({ pdf, n, width }: { pdf: Pdf; n: number; width: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ratio, setRatio] = useState(LETTER_RATIO);

  useEffect(() => {
    if (!width) return;
    let cancelled = false;
    let task: ReturnType<Awaited<ReturnType<Pdf["getPage"]>>["render"]> | undefined;
    pdf
      .getPage(n)
      .then(async (page) => {
        if (cancelled) return;
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: (width / base.width) * (window.devicePixelRatio || 1) });
        const off = document.createElement("canvas");
        off.width = Math.ceil(viewport.width);
        off.height = Math.ceil(viewport.height);
        task = page.render({ canvas: off, viewport });
        await task.promise;
        const canvas = ref.current;
        if (cancelled || !canvas) return;
        canvas.width = off.width;
        canvas.height = off.height;
        canvas.getContext("2d")?.drawImage(off, 0, 0);
        setRatio(base.height / base.width);
      })
      .catch((e: Error) => e?.name !== "RenderingCancelledException" && console.error(e));
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [pdf, n, width]);

  return <canvas ref={ref} aria-label={`Page ${n}`} className="block w-full" style={{ aspectRatio: `1 / ${ratio}` }} />;
}

/**
 * Fetches the PDF and draws it with pdf.js (bundled in unpdf) instead of the browser's PDF viewer,
 * so the frame is exactly the paper: no viewer chrome or backdrop around the page.
 */
function PdfFrame({ src, title, className }: { src: string; title: string; className?: string }) {
  const [frame, width] = useWidth<HTMLDivElement>();
  const [state, setState] = useState<{ pdf: Pdf | null; error: string | null; loading: boolean }>({ pdf: null, error: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    (async () => {
      const res = await fetch(src);
      if (!res.ok) throw new Error((await res.text()).slice(0, 1200));
      const data = new Uint8Array(await res.arrayBuffer());
      const { getDocumentProxy } = await import("unpdf");
      const pdf = await getDocumentProxy(data);
      if (cancelled) return void pdf.loadingTask.destroy();
      setState({ pdf, error: null, loading: false });
    })().catch((e: Error) => !cancelled && setState({ pdf: null, error: e.message, loading: false }));
    return () => {
      cancelled = true;
    };
  }, [src]);

  // Free the previous document once a newer one has replaced it.
  useEffect(() => () => void state.pdf?.loadingTask.destroy(), [state.pdf]);

  return (
    <div ref={frame} role="document" aria-label={title} aria-busy={state.loading} className={cx("relative overflow-y-auto rounded-card border border-rule bg-paper shadow-paper", className)}>
      {state.pdf ? (
        <div className="divide-y divide-rule-strong">
          {Array.from({ length: state.pdf.numPages }, (_, i) => (
            <PdfPage key={i} pdf={state.pdf!} n={i + 1} width={width} />
          ))}
        </div>
      ) : (
        <div style={{ aspectRatio: `1 / ${LETTER_RATIO}` }} />
      )}
      {state.loading && (
        <div className="absolute inset-0 grid place-items-center bg-veil text-sm text-ink-3">
          <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Rendering…</span>
        </div>
      )}
      {state.error && (
        <div className="absolute inset-0 overflow-auto bg-paper p-5 text-sm">
          <div className="mb-2 inline-flex items-center gap-2 font-semibold text-warn"><AlertTriangle className="h-4 w-4" /> Couldn&apos;t render the document</div>
          <pre className="whitespace-pre-wrap font-mono text-xs text-ink-2">{state.error}</pre>
        </div>
      )}
    </div>
  );
}

/** Stands in for the preview, page-shaped, before there is anything to render. */
export function PreviewEmpty({ children }: { children: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-card border border-dashed border-rule-strong p-6 text-center text-sm text-ink-3" style={{ aspectRatio: `1 / ${LETTER_RATIO}` }}>
      {children}
    </div>
  );
}

/** The sticky right-hand column that holds a preview next to an editor. */
export function PreviewPane({ children }: { children: ReactNode }) {
  return <div className="flex min-w-0 flex-col xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)]">{children}</div>;
}

/** Live PDF preview with source and download links, and optionally a link to the settings that shape it. */
export function PdfPreview({ query, version, settings }: { query: string; version: number | string; settings?: { href: string; label: string } }) {
  const src = (extra = "") => `/api/pdf?${query}&v=${encodeURIComponent(String(version))}${extra}`;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex gap-1">
        {settings && (
          <Link href={settings.href} className={buttonClass("ghost", "sm")}>
            <SlidersHorizontal className="h-3.5 w-3.5" /> {settings.label}
          </Link>
        )}
        <a href={src("&source=1")} target="_blank" rel="noreferrer" className={buttonClass("ghost", "sm", "ml-auto")}>
          <Code2 className="h-3.5 w-3.5" /> Source
        </a>
        <a href={src("&download=1")} className={buttonClass("secondary", "sm")}>
          <Download className="h-3.5 w-3.5" /> PDF
        </a>
      </div>
      <PdfFrame title="Preview" src={src()} className="min-h-0" />
    </div>
  );
}
