"use client";

import { useMemo, useState } from "react";
import { Download, Loader2, Settings } from "lucide-react";
import { JDInput } from "@/components/tailor/jd-input";
import { GapAnalysis } from "@/components/tailor/gap-analysis";
import { ResumePreview } from "@/components/builder/resume-preview";
import { Button } from "@/components/ui/button";
import {
  downloadHtmlAsPdf,
  createDocumentFilename,
} from "@/lib/builder/document-export";
import { TEMPLATES } from "@/lib/resume/template-data";
import type { TailoredResume } from "@/lib/resume/generator";
import type { GapItem } from "@/lib/tailor/analyze";

interface AnalysisResult {
  matchScore: number;
  keywordsFound: string[];
  keywordsMissing: string[];
  gaps: GapItem[];
  matchedEntriesCount: number;
}

interface GenerateResult {
  success: boolean;
  html: string;
  resume: TailoredResume;
  analysis: AnalysisResult;
}

interface LastInput {
  jobDescription: string;
  jobTitle: string;
  company: string;
}

export function TailoredResumeWorkspace() {
  const [templateId, setTemplateId] = useState("classic");
  const [lastInput, setLastInput] = useState<LastInput | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedTemplate = useMemo(
    () => TEMPLATES.find((template) => template.id === templateId),
    [templateId]
  );

  async function generate(input: LastInput, nextTemplateId = templateId) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...input,
          templateId: nextTemplateId,
          action: "generate",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to generate tailored resume.");
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(input: LastInput) {
    setLastInput(input);
    generate(input);
  }

  function handleTemplateChange(nextTemplateId: string) {
    setTemplateId(nextTemplateId);
    if (lastInput) {
      generate(lastInput, nextTemplateId);
    }
  }

  async function handleDownloadPdf() {
    if (!result?.html) return;
    setIsExporting(true);
    setError(null);

    try {
      await downloadHtmlAsPdf(
        result.html,
        createDocumentFilename(
          "tailored-resume",
          lastInput?.company || lastInput?.jobTitle
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="grid h-full min-h-0 grid-cols-1 overflow-hidden lg:grid-cols-[360px_minmax(0,1fr)_360px]">
      <aside className="min-h-0 overflow-y-auto border-b p-4 lg:border-b-0 lg:border-r">
        <div className="mb-4">
          <h2 className="text-base font-semibold">Tailored Resume</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate from a job description and your knowledge bank.
          </p>
        </div>
        <JDInput onSubmit={handleSubmit} isLoading={isLoading} />
      </aside>

      <main className="relative min-h-[520px] overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Template</span>
            <select
              value={templateId}
              onChange={(event) => handleTemplateChange(event.target.value)}
              className="h-9 rounded-md border bg-background px-3 text-sm"
              aria-label="Resume template"
            >
              {TEMPLATES.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            {selectedTemplate && (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {selectedTemplate.description}
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleDownloadPdf}
            disabled={!result?.html || isExporting}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin md:mr-1.5" />
            ) : (
              <Download className="h-4 w-4 md:mr-1.5" />
            )}
            <span className="hidden md:inline">Download PDF</span>
          </Button>
        </div>

        {error && (
          <div className="border-b border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {result ? (
          <ResumePreview
            resume={result.resume}
            templateId={templateId}
            html={result.html}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <div className="max-w-sm text-center">
              <Settings className="mx-auto mb-3 h-8 w-8" />
              <p className="text-sm">
                Paste a job description to generate an optimized resume preview.
              </p>
            </div>
          </div>
        )}
      </main>

      <aside className="min-h-0 overflow-y-auto border-t p-4 lg:border-l lg:border-t-0">
        <h2 className="mb-4 text-base font-semibold">Gap Analysis</h2>
        {result ? (
          <GapAnalysis
            gaps={result.analysis.gaps}
            keywordsFound={result.analysis.keywordsFound}
            keywordsMissing={result.analysis.keywordsMissing}
            matchScore={result.analysis.matchScore}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Matched and missing keywords will appear after generation.
          </p>
        )}
      </aside>
    </div>
  );
}
