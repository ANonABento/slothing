"use client";

import { AlertTriangle, Code2, Columns3, Download, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { Button, Eyebrow, Segmented, buttonClass, cx } from "./ui";

const ENGINES = [
  { value: "html", label: "HTML" },
  { value: "typst", label: "Typst" },
  { value: "latex", label: "LaTeX" },
] as const;
type Engine = (typeof ENGINES)[number]["value"];
const STORAGE_KEY = "slothing:engine";

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
          <div className="mb-2 inline-flex items-center gap-2 font-semibold text-warn"><AlertTriangle className="h-4 w-4" /> This engine couldn&apos;t render the document</div>
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

/** Live PDF preview with an engine toggle and a full-screen side-by-side compare. */
export function PdfPreview({ query, version }: { query: string; version: number | string }) {
  // null until mounted: the stored engine is read first, so we never render Typst only to throw it away.
  const [engine, setEngine] = useState<Engine | null>(null);
  const [compare, setCompare] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {}
    setEngine(ENGINES.some((e) => e.value === saved) ? (saved as Engine) : "typst");
  }, []);

  const pick = (e: Engine) => {
    setEngine(e);
    setCompare(false);
    try {
      localStorage.setItem(STORAGE_KEY, e);
    } catch {}
  };

  useEffect(() => {
    if (!compare) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCompare(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [compare]);

  const src = (e: Engine, extra = "") => `/api/pdf?${query}&engine=${e}&v=${encodeURIComponent(String(version))}${extra}`;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented size="sm" value={engine} onChange={pick} options={[...ENGINES]} />
        <Button size="sm" variant="ghost" onClick={() => setCompare(true)}>
          <Columns3 className="h-3.5 w-3.5" /> Compare
        </Button>
        {engine && (
          <div className="ml-auto flex gap-1">
            <a href={src(engine, "&source=1")} target="_blank" rel="noreferrer" className={buttonClass("ghost", "sm")}>
              <Code2 className="h-3.5 w-3.5" /> Source
            </a>
            <a href={src(engine, "&download=1")} className={buttonClass("secondary", "sm")}>
              <Download className="h-3.5 w-3.5" /> PDF
            </a>
          </div>
        )}
      </div>

      {engine && <PdfFrame title="Preview" src={src(engine)} className="min-h-0" />}

      {compare && (
        <div role="dialog" aria-modal="true" aria-label="Compare engines" className="fixed inset-0 z-50 flex flex-col gap-4 bg-page p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <Eyebrow>Same content, three renderers</Eyebrow>
              <div className="font-display text-2xl font-bold tracking-tight">Compare engines</div>
            </div>
            <Button variant="secondary" onClick={() => setCompare(false)} autoFocus>
              <X className="h-4 w-4" /> Close <kbd className="font-mono text-eyebrow opacity-60">Esc</kbd>
            </Button>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto lg:grid-cols-3">
            {ENGINES.map((e) => (
              <div key={e.value} className="flex min-h-0 flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-display text-base font-semibold">{e.label}</span>
                  <span className="flex gap-1">
                    <Button size="sm" variant={engine === e.value ? "primary" : "secondary"} onClick={() => pick(e.value)}>
                      {engine === e.value ? "In use" : "Use this"}
                    </Button>
                    <a href={src(e.value, "&download=1")} aria-label={`Download ${e.label} PDF`} className={buttonClass("ghost", "sm")}>
                      <Download className="h-3.5 w-3.5" />
                    </a>
                  </span>
                </div>
                <PdfFrame title={e.label} src={src(e.value)} className="min-h-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
