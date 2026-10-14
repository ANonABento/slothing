"use client";

import { AlertTriangle, Code2, Columns3, Download, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button, Segmented, buttonClass } from "./ui";

const ENGINES = [
  { value: "html", label: "HTML" },
  { value: "typst", label: "Typst" },
  { value: "latex", label: "LaTeX" },
] as const;
type Engine = (typeof ENGINES)[number]["value"];
const STORAGE_KEY = "slothing:engine";

/** Fetches the PDF itself so we can show a loading state and a readable error instead of raw text. */
function PdfFrame({ src, title, className }: { src: string; title: string; className: string }) {
  const [state, setState] = useState<{ url: string | null; error: string | null; loading: boolean }>({ url: null, error: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetch(src)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.text()).slice(0, 1200));
        objectUrl = URL.createObjectURL(await res.blob());
        if (!cancelled) setState({ url: objectUrl, error: null, loading: false });
      })
      .catch((e: Error) => !cancelled && setState({ url: null, error: e.message, loading: false }));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-rule bg-paper shadow-paper ${className}`}>
      {state.url && <iframe title={title} src={`${state.url}#toolbar=0&view=FitH`} className="absolute inset-0 h-full w-full" />}
      {state.loading && (
        <div className="absolute inset-0 grid place-items-center [background:color-mix(in_srgb,var(--paper)_80%,transparent)] text-sm text-ink-3">
          <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Rendering…</span>
        </div>
      )}
      {state.error && (
        <div className="absolute inset-0 overflow-auto p-5 text-sm">
          <div className="mb-2 inline-flex items-center gap-2 font-semibold text-warn"><AlertTriangle className="h-4 w-4" /> This engine couldn&apos;t render the document</div>
          <pre className="whitespace-pre-wrap font-mono text-xs text-ink-2">{state.error}</pre>
        </div>
      )}
    </div>
  );
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
    <div className="flex h-full flex-col gap-3">
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

      {engine ? <PdfFrame title="Preview" src={src(engine)} className="min-h-[75vh] w-full flex-1" /> : <div className="min-h-[75vh] flex-1 rounded-xl border border-rule bg-paper" />}

      {compare && (
        <div role="dialog" aria-modal="true" aria-label="Compare engines" className="fixed inset-0 z-50 flex flex-col gap-4 bg-page p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">Same content, three renderers</div>
              <div className="font-display text-2xl font-bold tracking-tight">Compare engines</div>
            </div>
            <Button variant="secondary" onClick={() => setCompare(false)} autoFocus>
              <X className="h-4 w-4" /> Close <kbd className="font-mono text-[10px] opacity-60">Esc</kbd>
            </Button>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto lg:grid-cols-3">
            {ENGINES.map((e) => (
              <div key={e.value} className="flex min-h-[80vh] flex-col gap-2">
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
                <PdfFrame title={e.label} src={src(e.value)} className="w-full flex-1" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
