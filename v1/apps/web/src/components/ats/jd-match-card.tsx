"use client";

import { AlertTriangle, CheckCircle2, Copy, Target } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { JdMatchResult } from "@/lib/ats/match-score";

interface JdMatchCardProps {
  match: JdMatchResult;
  className?: string;
}

const CHIP_LIMIT = 10;

function KeywordChips({
  keywords,
  variant,
  onCopy,
}: {
  keywords: string[];
  variant: "evidence" | "mention" | "missing";
  onCopy?: (keyword: string) => void;
}) {
  if (keywords.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nothing in this bucket yet.
      </p>
    );
  }

  const colors = {
    evidence: "border-success/30 bg-success/10 text-success",
    mention: "border-warning/30 bg-warning/10 text-warning",
    missing:
      "border-border bg-muted/40 text-foreground hover:bg-primary/10 hover:text-primary",
  };

  return (
    <div className="flex flex-wrap gap-2">
      {keywords.slice(0, CHIP_LIMIT).map((keyword) =>
        onCopy ? (
          <button
            key={keyword}
            type="button"
            className={cn(
              "inline-flex min-h-8 items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              colors[variant],
            )}
            aria-label={`Copy missing keyword ${keyword}`}
            onClick={() => onCopy(keyword)}
          >
            {keyword}
            <Copy className="h-3 w-3" />
          </button>
        ) : (
          <span
            key={keyword}
            className={cn(
              "inline-flex min-h-8 items-center rounded-full border px-3 py-1 text-xs font-semibold",
              colors[variant],
            )}
          >
            {keyword}
          </span>
        ),
      )}
    </div>
  );
}

export function JdMatchCard({ match, className }: JdMatchCardProps) {
  const { addToast } = useToast();
  const missingKeywords = match.missingKeywords.slice(0, CHIP_LIMIT);
  const hasWarning =
    match.stuffedKeywords.length > 0 || match.warnings.length > 0;

  async function copyKeyword(keyword: string) {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(keyword);
      addToast({
        type: "success",
        title: "Keyword copied",
        description: keyword,
      });
    } catch {
      addToast({
        type: "error",
        title: "Could not copy keyword",
        description: "Select the chip text and copy it manually.",
      });
    }
  }

  return (
    <section
      className={cn("rounded-lg border border-border bg-card p-5", className)}
      aria-labelledby="jd-match-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h3 id="jd-match-heading" className="text-sm font-semibold">
              JD Match
            </h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Based on {match.totalKeywords} ranked JD keywords with evidence
            weighting
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-foreground">
            {match.score}%
          </div>
          <div className="text-xs text-muted-foreground">evidence match</div>
        </div>
      </div>

      {hasWarning ? (
        <div className="mt-5 flex gap-2 rounded-md border border-warning/30 bg-warning/10 p-3 text-sm text-warning">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Keyword stuffing or thin evidence</p>
            <p className="mt-1 text-xs">
              {match.warnings[0] ||
                `Repeated terms: ${match.stuffedKeywords.join(", ")}.`}
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-5">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <h4 className="text-sm font-medium">Matched with evidence</h4>
          </div>
          <KeywordChips
            keywords={match.matchedWithEvidence}
            variant="evidence"
          />
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h4 className="text-sm font-medium">Mentioned only</h4>
          </div>
          <KeywordChips keywords={match.mentionedOnly} variant="mention" />
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            {missingKeywords.length === 0 ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
            <h4 className="text-sm font-medium">
              {missingKeywords.length === 0
                ? "No major missing keywords"
                : "Missing"}
            </h4>
          </div>
          <KeywordChips
            keywords={missingKeywords}
            variant="missing"
            onCopy={(keyword) => void copyKeyword(keyword)}
          />
        </div>
      </div>
    </section>
  );
}
