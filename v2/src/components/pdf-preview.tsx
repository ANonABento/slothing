"use client";

import { useEffect, useState } from "react";

import { Button } from "./ui";

const ENGINES = [
  { id: "html", label: "HTML" },
  { id: "typst", label: "Typst" },
  { id: "latex", label: "LaTeX" },
] as const;
type Engine = (typeof ENGINES)[number]["id"];
const STORAGE_KEY = "slothing:engine";

/** Live PDF preview with an engine toggle and a side-by-side compare mode. */
export function PdfPreview({ query, version }: { query: string; version: number | string }) {
  const [engine, setEngine] = useState<Engine>("typst");
  const [compare, setCompare] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Engine | null;
      if (saved && ENGINES.some((e) => e.id === saved)) setEngine(saved);
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
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1">
        <div className="flex rounded-md border border-rule-strong p-0.5">
          {ENGINES.map((e) => (
            <button
              key={e.id}
              onClick={() => pick(e.id)}
              className={`rounded px-2.5 py-1 text-xs font-medium ${engine === e.id ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"}`}
            >
              {e.label}
            </button>
          ))}
          <button
            onClick={() => setCompare(true)}
            className="rounded px-2.5 py-1 text-xs font-medium text-ink-2 hover:text-ink"
          >
            Compare all
          </button>
        </div>
        <div className="ml-auto flex gap-1">
          <a href={src(engine, "&source=1")} target="_blank" rel="noreferrer">
            <Button variant="ghost" className="text-xs">Source</Button>
          </a>
          <a href={src(engine, "&download=1")}>
            <Button variant="secondary" className="text-xs">Download PDF</Button>
          </a>
        </div>
      </div>
      {compare && (
        <div className="fixed inset-0 z-50 flex flex-col gap-3 bg-page p-4">
          <div className="flex items-center justify-between">
            <div className="font-display text-lg font-semibold tracking-tight">Compare engines</div>
            <Button variant="secondary" onClick={() => setCompare(false)}>Close</Button>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-3 overflow-y-auto lg:grid-cols-3">
            {ENGINES.map((e) => (
              <div key={e.id} className="flex min-h-[80vh] flex-col">
                <div className="mb-1 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
                  {e.label}
                  <span className="flex gap-3 normal-case tracking-normal">
                    <button className="text-brand hover:underline" onClick={() => pick(e.id)}>use this</button>
                    <a className="text-brand hover:underline" href={src(e.id, "&download=1")}>download</a>
                  </span>
                </div>
                <iframe title={e.label} src={`${src(e.id)}#toolbar=0&view=FitH`} className="w-full flex-1 rounded-md border border-rule bg-paper" />
              </div>
            ))}
          </div>
        </div>
      )}
      <iframe key={engine} title="Preview" src={`${src(engine)}#toolbar=0&view=FitH`} className="min-h-[75vh] w-full flex-1 rounded-md border border-rule bg-paper" />
    </div>
  );
}
