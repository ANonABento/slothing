"use client";

import { Code2, Columns3, Download, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button, Segmented } from "./ui";

const ENGINES = [
  { value: "html", label: "HTML" },
  { value: "typst", label: "Typst" },
  { value: "latex", label: "LaTeX" },
] as const;
type Engine = (typeof ENGINES)[number]["value"];
const STORAGE_KEY = "slothing:engine";

/** Live PDF preview with an engine toggle and a full-screen side-by-side compare. */
export function PdfPreview({ query, version }: { query: string; version: number | string }) {
  const [engine, setEngine] = useState<Engine>("typst");
  const [compare, setCompare] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Engine | null;
      if (saved && ENGINES.some((e) => e.value === saved)) setEngine(saved);
    } catch {}
  }, []);

  const pick = (e: Engine) => {
    setEngine(e);
    setCompare(false);
    try {
      localStorage.setItem(STORAGE_KEY, e);
    } catch {}
  };

  const src = (e: Engine, extra = "") => `/api/pdf?${query}&engine=${e}&v=${encodeURIComponent(String(version))}${extra}`;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented size="sm" value={engine} onChange={pick} options={[...ENGINES]} />
        <Button size="sm" variant="ghost" onClick={() => setCompare(true)}>
          <Columns3 className="h-3.5 w-3.5" /> Compare
        </Button>
        <div className="ml-auto flex gap-1">
          <a href={src(engine, "&source=1")} target="_blank" rel="noreferrer">
            <Button size="sm" variant="ghost"><Code2 className="h-3.5 w-3.5" /> Source</Button>
          </a>
          <a href={src(engine, "&download=1")}>
            <Button size="sm" variant="secondary"><Download className="h-3.5 w-3.5" /> PDF</Button>
          </a>
        </div>
      </div>

      <iframe
        key={engine}
        title="Preview"
        src={`${src(engine)}#toolbar=0&view=FitH`}
        className="min-h-[75vh] w-full flex-1 rounded-xl border border-rule bg-paper shadow-paper"
      />

      {compare && (
        <div className="fixed inset-0 z-50 flex flex-col gap-4 bg-page p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">Same content, three renderers</div>
              <div className="font-display text-2xl font-bold tracking-tight">Compare engines</div>
            </div>
            <Button variant="secondary" onClick={() => setCompare(false)}>
              <X className="h-4 w-4" /> Close
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
                    <a href={src(e.value, "&download=1")}>
                      <Button size="sm" variant="ghost" aria-label={`Download ${e.label} PDF`}><Download className="h-3.5 w-3.5" /></Button>
                    </a>
                  </span>
                </div>
                <iframe title={e.label} src={`${src(e.value)}#toolbar=0&view=FitH`} className="w-full flex-1 rounded-xl border border-rule bg-paper shadow-paper" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
