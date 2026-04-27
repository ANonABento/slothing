"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Loader2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChatEditor } from "@/components/cover-letter/chat-editor";
import { readCoverLetterApiResult } from "@/lib/cover-letter/api-response";

type Step = "input" | "editor";

interface CoverLetterWorkspaceProps {
  documentName?: string;
  documentContent?: string;
  onDocumentContentChange?: (content: string) => void;
}

export function CoverLetterWorkspace({
  documentName,
  documentContent,
  onDocumentContentChange,
}: CoverLetterWorkspaceProps = {}) {
  const [step, setStep] = useState<Step>("input");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [llmError, setLlmError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate() {
    if (jobDescription.trim().length < 20) return;
    setIsLoading(true);
    setLlmError(null);

    try {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: jobDescription.trim(),
          jobTitle: jobTitle.trim() || undefined,
          company: company.trim() || undefined,
          action: "generate",
        }),
      });

      const result = await readCoverLetterApiResult(
        res,
        "Failed to generate cover letter"
      );

      if (!result.ok) {
        setLlmError(result.error);
        return;
      }

      if (onDocumentContentChange) {
        onDocumentContentChange(result.content);
        return;
      }

      setInitialContent(result.content);
      setStep("editor");
    } catch {
      setLlmError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  if (onDocumentContentChange) {
    return (
      <div className="flex h-full flex-col gap-4 p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              {documentName || "Cover Letter"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Draft, generate, and revise the active cover letter.
            </p>
          </div>
          <Button
            onClick={handleGenerate}
            disabled={jobDescription.trim().length < 20 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                Generate
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {llmError && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{llmError}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label
              htmlFor="studioCoverLetterJobTitle"
              className="mb-1 block text-sm font-medium"
            >
              Job Title (optional)
            </label>
            <Input
              id="studioCoverLetterJobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Software Engineer"
            />
          </div>
          <div>
            <label
              htmlFor="studioCoverLetterCompany"
              className="mb-1 block text-sm font-medium"
            >
              Company (optional)
            </label>
            <Input
              id="studioCoverLetterCompany"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Corp"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="studioCoverLetterJobDescription"
            className="mb-1 block text-sm font-medium"
          >
            Job Description
          </label>
          <Textarea
            id="studioCoverLetterJobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            className="min-h-[120px]"
          />
        </div>

        <div className="min-h-0 flex-1">
          <label
            htmlFor="studioCoverLetterContent"
            className="mb-1 block text-sm font-medium"
          >
            Cover Letter
          </label>
          <Textarea
            id="studioCoverLetterContent"
            aria-label="Cover letter editor"
            value={documentContent ?? ""}
            onChange={(e) => onDocumentContentChange(e.target.value)}
            placeholder="Start writing your cover letter..."
            className="h-[calc(100%-1.75rem)] min-h-[300px] resize-none"
          />
        </div>
      </div>
    );
  }

  if (step === "editor") {
    return (
      <div className="flex h-full flex-col p-4 md:p-6 lg:p-8">
        <div className="mb-4">
          <button
            onClick={() => setStep("input")}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to input
          </button>
        </div>
        <ChatEditor
          jobDescription={jobDescription.trim()}
          jobTitle={jobTitle.trim() || "the position"}
          company={company.trim() || "the company"}
          initialContent={initialContent}
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6 lg:p-8">
        <div>
          <h2 className="text-2xl font-bold">Cover Letter Generator</h2>
          <p className="mt-1 text-muted-foreground">
            Generate a personalized cover letter from your knowledge bank and
            iterate with chat.
          </p>
        </div>

        {llmError && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Settings className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                <div className="space-y-2">
                  <p className="text-sm text-destructive">{llmError}</p>
                  {llmError.includes("Settings") && (
                    <Link href="/settings">
                      <Button variant="outline" size="sm">
                        Go to Settings
                      </Button>
                    </Link>
                  )}
                  {llmError.includes("bank") && (
                    <Link href="/bank">
                      <Button variant="outline" size="sm">
                        Go to Documents
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Job Description
            </CardTitle>
            <CardDescription>
              Paste the job description and optionally add the job title and
              company name.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="jobTitle"
                  className="mb-1 block text-sm font-medium"
                >
                  Job Title (optional)
                </label>
                <Input
                  id="jobTitle"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div>
                <label
                  htmlFor="company"
                  className="mb-1 block text-sm font-medium"
                >
                  Company (optional)
                </label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Corp"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="jobDescription"
                className="mb-1 block text-sm font-medium"
              >
                Job Description
              </label>
              <Textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="min-h-[200px]"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Minimum 20 characters required.
              </p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={jobDescription.trim().length < 20 || isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Cover Letter
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
