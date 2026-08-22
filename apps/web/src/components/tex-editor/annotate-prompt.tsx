"use client";

/**
 * The annotate prompt shown on an imported document.
 *
 * Annotation is structural surgery on someone's resume, so this presents the RESULT of
 * the server's verification rather than a raw source diff. A 60-line preamble diff would
 * be noise; what the user actually needs to judge is "did it find the right structure",
 * because "does it still render identically" has already been proven server-side.
 */
import { useState } from "react";
import {
  AlertTriangle,
  Check,
  Loader2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AnnotateOutcome } from "./tex-editor-api";

export interface AnnotatePromptProps {
  onRequest: () => Promise<AnnotateOutcome>;
  onAccept: (annotated: string) => Promise<void> | void;
}

export function AnnotatePrompt({ onRequest, onAccept }: AnnotatePromptProps) {
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<AnnotateOutcome | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const run = async () => {
    setBusy(true);
    setError(null);
    setOutcome(null);
    try {
      setOutcome(await onRequest());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "That did not work.");
    } finally {
      setBusy(false);
    }
  };

  if (outcome?.ok) {
    return (
      <div className="mx-2 space-y-3 rounded-md border border-rule bg-paper p-3">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <div className="space-y-1">
            <p className="text-[13px] font-medium text-ink">
              Found {outcome.summary}
            </p>
            <p className="text-[12px] leading-relaxed text-ink-3">
              Verified to render identically to your current document — the
              wording, spacing and layout are unchanged.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            disabled={applying}
            onClick={async () => {
              setApplying(true);
              try {
                await onAccept(outcome.annotated);
                setOutcome(null);
              } finally {
                setApplying(false);
              }
            }}
          >
            {applying ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="mr-1.5 h-3.5 w-3.5" />
            )}
            Apply
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={applying}
            onClick={() => setOutcome(null)}
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Discard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-2 space-y-2">
      {outcome && !outcome.ok ? (
        <div className="space-y-1 rounded-md border border-rule bg-page-2 p-3">
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-ink">
            <AlertTriangle className="h-3.5 w-3.5 text-ink-3" />
            Annotation was discarded
          </p>
          {outcome.issues.map((issue, index) => (
            <p key={index} className="text-[12px] leading-relaxed text-ink-3">
              {issue.message}
            </p>
          ))}
          <p className="text-[12px] text-ink-3">Your document is unchanged.</p>
        </div>
      ) : null}

      {error ? (
        <p className="text-[12px] text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        disabled={busy}
        onClick={() => void run()}
      >
        {busy ? (
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
        ) : (
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
        )}
        {busy ? "Reading the document…" : "Find structure with AI"}
      </Button>
    </div>
  );
}
