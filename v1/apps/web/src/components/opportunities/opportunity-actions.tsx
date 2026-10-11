"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  FileEdit,
  FileText,
  Info,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { CoverLetterDialog } from "@/components/cover-letter/cover-letter-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useErrorToast } from "@/hooks/use-error-toast";
import type { ATSAnalysisResult } from "@/lib/ats/analyzer";
import { readJsonResponse } from "@/lib/http";
import type { JobDescription, JobMatch } from "@/types";

const ATSScoreBreakdown = dynamic(
  () =>
    import("@/components/ats/score-breakdown").then(
      (module) => module.ATSScoreBreakdown,
    ),
  {
    loading: () => <div className="h-32 animate-pulse rounded-lg bg-muted" />,
  },
);

interface AnalyzeOpportunityResponse {
  analysis?: JobMatch;
  fallbackUsed?: boolean;
  providerError?: {
    message?: string;
  };
}

interface OpportunityActionsProps {
  opportunity: JobDescription;
  onApply: () => Promise<void> | void;
  onGeneratedDocument?: () => Promise<void> | void;
}

export function OpportunityActions({
  opportunity,
  onApply,
  onGeneratedDocument,
}: OpportunityActionsProps) {
  const [analysis, setAnalysis] = useState<JobMatch | null>(null);
  const [atsResult, setAtsResult] = useState<ATSAnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [atsAnalyzing, setAtsAnalyzing] = useState(false);
  const [atsDialogOpen, setAtsDialogOpen] = useState(false);
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const showErrorToast = useErrorToast();
  const { addToast } = useToast();

  const analyzeOpportunity = useCallback(async () => {
    setAnalyzing(true);
    try {
      const response = await fetch(
        `/api/opportunities/${opportunity.id}/analyze`,
        { method: "POST" },
      );
      const data = await readJsonResponse<AnalyzeOpportunityResponse>(
        response,
        "Failed to analyze opportunity",
      );
      setAnalysis(data.analysis ?? null);
      if (data.fallbackUsed) {
        addToast({
          type: "warning",
          title: "Used local fallback",
          description:
            data.providerError?.message ??
            "The AI provider was unavailable, so Slothing used deterministic matching.",
        });
      }
    } catch (error) {
      showErrorToast(error, {
        title: "Could not analyze opportunity",
        fallbackDescription: "Please try the analysis again.",
      });
    } finally {
      setAnalyzing(false);
    }
  }, [addToast, opportunity.id, showErrorToast]);

  const runAtsCheck = useCallback(async () => {
    setAtsAnalyzing(true);
    try {
      const response = await fetch("/api/ats/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: opportunity.id }),
      });
      const data = await readJsonResponse<ATSAnalysisResult>(
        response,
        "Failed to run ATS check",
      );
      setAtsResult(data);
      setAtsDialogOpen(true);
    } catch (error) {
      showErrorToast(error, {
        title: "Could not run ATS check",
        fallbackDescription: "Please try the ATS check again.",
      });
    } finally {
      setAtsAnalyzing(false);
    }
  }, [opportunity.id, showErrorToast]);

  return (
    <>
      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Actions
        </h2>
        <div className="mt-4 grid gap-3">
          <Button
            type="button"
            className="justify-start bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => void onApply()}
          >
            <Send className="mr-2 h-4 w-4" />
            Apply
          </Button>
          <Button
            type="button"
            variant="outline"
            className="justify-start"
            onClick={() => void analyzeOpportunity()}
            disabled={analyzing}
          >
            {analyzing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {analysis ? "Re-analyze Match" : "Analyze Match"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="justify-start"
            onClick={() => void runAtsCheck()}
            disabled={atsAnalyzing}
          >
            {atsAnalyzing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="mr-2 h-4 w-4" />
            )}
            {atsResult ? "Re-check ATS" : "ATS Check"}
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href={`/studio?opportunityId=${opportunity.id}`}>
              <FileText className="mr-2 h-4 w-4" />
              Tailor Resume in Studio
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="justify-start"
            onClick={() => setCoverLetterOpen(true)}
          >
            <FileEdit className="mr-2 h-4 w-4" />
            Cover Letter
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href={`/opportunities/${opportunity.id}/research`}>
              <Info className="mr-2 h-4 w-4" />
              Company Research
            </Link>
          </Button>
        </div>
      </section>

      {atsResult && (
        <ATSScoreBreakdown
          result={atsResult}
          open={atsDialogOpen}
          onOpenChange={setAtsDialogOpen}
        />
      )}
      <CoverLetterDialog
        open={coverLetterOpen}
        onOpenChange={(open) => {
          setCoverLetterOpen(open);
          if (!open) void onGeneratedDocument?.();
        }}
        jobId={opportunity.id}
        jobTitle={opportunity.title}
        company={opportunity.company}
      />
    </>
  );
}
