"use client";

/**
 * AI actions for one field.
 *
 * Nothing is ever written straight into the document. The route proposes; this component
 * shows the change as a word diff with Accept / Discard, and accepting goes through the
 * ordinary field-write path. That keeps `patchSpanField` the single write path and makes
 * every AI edit reviewable (spec §8).
 */
import { useState } from "react";
import { Check, Loader2, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { diffWords, type WordDiffSegment } from "@/lib/diff/word-diff";
import { SPAN_AI_ACTIONS, type SpanAiActionId } from "@/lib/latex/ai-revise";
import { pluralize } from "@/lib/text/pluralize";
import { cn } from "@/lib/utils";

export interface AiProposal {
  original: string;
  proposal: string;
  applied: boolean;
  ungroundedNumbers: string[];
  sources: string[];
  usedJobContext: boolean;
}

export interface AiActionsProps {
  disabled?: boolean;
  /** Rich fields cannot be revised safely — the plain projection is lossy. */
  unavailableReason?: string | null;
  onRequest: (action: SpanAiActionId) => Promise<AiProposal | null>;
  onAccept: (text: string) => void;
}

function DiffText({ segments }: { segments: WordDiffSegment[] }) {
  return (
    <p className="text-[13px] leading-relaxed text-ink">
      {segments.map((segment, index) => {
        // A "reworded" segment carries both sides; showing only `text` would hide half
        // the change, which is the opposite of what a review view is for.
        if (segment.type === "reworded") {
          return (
            <span key={index}>
              <span className="bg-destructive/15 text-ink-3 line-through">
                {segment.beforeText ?? ""}
              </span>
              <span className="bg-success/15 text-ink">
                {segment.afterText ?? segment.text}
              </span>
            </span>
          );
        }
        return (
          <span
            key={index}
            className={cn(
              segment.type === "added" && "bg-success/15 text-ink",
              segment.type === "removed" &&
                "bg-destructive/15 text-ink-3 line-through",
            )}
          >
            {segment.text}
          </span>
        );
      })}
    </p>
  );
}

export function AiActions({
  disabled,
  unavailableReason,
  onRequest,
  onAccept,
}: AiActionsProps) {
  const [pending, setPending] = useState<SpanAiActionId | null>(null);
  const [proposal, setProposal] = useState<AiProposal | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (unavailableReason) {
    return <p className="text-[12px] text-ink-3">{unavailableReason}</p>;
  }

  const run = async (action: SpanAiActionId) => {
    setPending(action);
    setError(null);
    setProposal(null);
    try {
      const result = await onRequest(action);
      if (result) setProposal(result);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "That did not work. Try again.",
      );
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-brand" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
          Ask AI
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {SPAN_AI_ACTIONS.map((action) => (
          <Button
            key={action.id}
            type="button"
            variant="outline"
            size="sm"
            title={action.hint}
            disabled={disabled || pending !== null}
            onClick={() => void run(action.id)}
          >
            {pending === action.id ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : null}
            {action.label}
          </Button>
        ))}
      </div>

      {error ? (
        <p className="text-[12px] text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {proposal ? (
        <div className="space-y-2 rounded-md border border-rule bg-page-2 p-3">
          {proposal.applied ? (
            <>
              <DiffText
                segments={diffWords(proposal.original, proposal.proposal)}
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    onAccept(proposal.proposal);
                    setProposal(null);
                  }}
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                  Accept
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setProposal(null)}
                >
                  <X className="mr-1.5 h-3.5 w-3.5" />
                  Discard
                </Button>
              </div>
            </>
          ) : (
            // The revision invented something, so it was rejected server-side. Say so
            // plainly rather than showing a change the user might accept on trust.
            <div className="space-y-1">
              <p className="text-[12.5px] font-medium text-ink">
                Rejected — the rewrite added something your document does not
                say.
              </p>
              {proposal.ungroundedNumbers.length > 0 ? (
                <p className="text-[12px] text-ink-3">
                  Unsupported{" "}
                  {pluralize(proposal.ungroundedNumbers.length, "figure")}:{" "}
                  {proposal.ungroundedNumbers.join(", ")}
                </p>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setProposal(null)}
              >
                Dismiss
              </Button>
            </div>
          )}

          <p className="text-[11px] text-ink-3">
            Based on {proposal.sources.join(", ")}
            {proposal.usedJobContext ? ", and the linked job posting" : ""}.
          </p>
        </div>
      ) : null}
    </div>
  );
}
