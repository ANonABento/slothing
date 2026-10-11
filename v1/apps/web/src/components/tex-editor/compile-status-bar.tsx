"use client";

/**
 * Compile status.
 *
 * Deliberately additive: this renders ABOVE the canvas and never replaces it. A failed
 * compile annotates a still-legible stale preview rather than blanking the document —
 * spec §5.5, and the rule this editor is least willing to break.
 *
 * The progress bar is suppressed for the first 250ms so a sub-second compile does not
 * flicker a bar on every keystroke batch.
 */
import { useEffect, useState } from "react";
import { AlertTriangle, PlugZap, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CompileLogEntry } from "@/lib/latex/compile";
import { pluralize } from "@/lib/text/pluralize";
import type { PreviewProblem } from "./tex-editor-state";

const PROGRESS_DELAY_MS = 250;

export interface CompileStatusBarProps {
  busy: boolean;
  problem: PreviewProblem | null;
  suspended: boolean;
  onRetry: () => void;
}

function firstErrors(entries: CompileLogEntry[]): CompileLogEntry[] {
  return entries.filter((entry) => entry.severity === "error").slice(0, 3);
}

export function CompileStatusBar({
  busy,
  problem,
  suspended,
  onRetry,
}: CompileStatusBarProps) {
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    if (!busy) {
      setShowProgress(false);
      return;
    }
    const timer = setTimeout(() => setShowProgress(true), PROGRESS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [busy]);

  if (!problem && !showProgress) return null;

  if (problem?.kind === "engine_unavailable") {
    return (
      <div className="flex items-start gap-2 border-b border-rule bg-brand-soft px-4 py-2.5 text-[12.5px] text-ink-2">
        <PlugZap className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <div className="flex-1">
          <p className="font-medium text-ink">No LaTeX engine on this server</p>
          <p>
            Editing still works. Download the .tex bundle and compile it in
            Overleaf, or install Tectonic to restore live preview.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Retry
        </Button>
      </div>
    );
  }

  if (problem?.kind === "compile_failed") {
    const errors = firstErrors(problem.entries);
    return (
      <div
        role="alert"
        className="flex items-start gap-2 border-b border-rule bg-destructive/10 px-4 py-2.5 text-[12.5px] text-ink-2"
      >
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
        <div className="flex-1">
          <p className="font-medium text-ink">
            {errors.length > 0
              ? `${pluralize(errors.length, "error")} in this document`
              : "This document did not compile"}
          </p>
          {errors.map((entry, index) => (
            <p key={index} className="font-mono text-[11.5px]">
              {entry.line !== null ? `line ${entry.line}: ` : ""}
              {entry.message}
            </p>
          ))}
          <p className="mt-1 text-ink-3">
            Showing the last version that compiled.
          </p>
        </div>
      </div>
    );
  }

  if (problem && (problem.kind === "network" || problem.kind === "stale_key")) {
    return (
      <div className="flex items-center gap-2 border-b border-rule bg-page-2 px-4 py-2 text-[12.5px] text-ink-2">
        <AlertTriangle className="h-4 w-4 shrink-0 text-ink-3" />
        <span className="flex-1">
          {problem.kind === "stale_key"
            ? "That preview expired — recompiling."
            : "Preview could not update. Showing the last good version."}
        </span>
        <Button type="button" variant="ghost" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    );
  }

  if (suspended) {
    return (
      <div className="border-b border-rule bg-page-2 px-4 py-2 text-[12.5px] text-ink-3">
        Preview paused — resuming shortly.
      </div>
    );
  }

  return (
    <div
      className="h-0.5 w-full overflow-hidden bg-page-2"
      role="progressbar"
      aria-label="Updating preview"
    >
      <div className="h-full w-1/3 animate-pulse bg-brand" />
    </div>
  );
}
