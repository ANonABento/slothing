"use client";

import { CheckCircle2, Copy, Target } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { JdMatchResult } from "@/lib/ats/match-score";

interface JdMatchCardProps {
  match: JdMatchResult;
  className?: string;
}

const CHIP_LIMIT = 10;

export function JdMatchCard({ match, className }: JdMatchCardProps) {
  const { addToast } = useToast();
  const missingKeywords = match.missingKeywords.slice(0, CHIP_LIMIT);

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
            Based on {match.totalKeywords} ranked JD keywords
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-foreground">
            {match.score}%
          </div>
          <div className="text-xs text-muted-foreground">keyword overlap</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center gap-2">
          {missingKeywords.length === 0 ? (
            <CheckCircle2 className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
          <h4 className="text-sm font-medium">
            {missingKeywords.length === 0
              ? "No major missing keywords"
              : "Missing keywords"}
          </h4>
        </div>

        {missingKeywords.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Your resume already covers the strongest terms found in this job
            description.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((keyword) => (
              <button
                key={keyword}
                type="button"
                className="inline-flex min-h-8 items-center gap-1 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label={`Copy missing keyword ${keyword}`}
                onClick={() => void copyKeyword(keyword)}
              >
                {keyword}
                <Copy className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
