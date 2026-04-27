"use client";

import { useCallback, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  History,
  Loader2,
  RotateCcw,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { readCoverLetterApiResult } from "@/lib/cover-letter/api-response";
import { cn } from "@/lib/utils";

interface Version {
  content: string;
  instruction: string;
  createdAt: string;
}

interface ChatEditorProps {
  jobDescription: string;
  jobTitle: string;
  company: string;
  initialContent: string;
}

export function ChatEditor({
  jobDescription,
  jobTitle,
  company,
  initialContent,
}: ChatEditorProps) {
  const [versions, setVersions] = useState<Version[]>([
    {
      content: initialContent,
      instruction: "Initial generation",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);
  const [instruction, setInstruction] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const currentVersion =
    currentVersionIndex >= 0 ? versions[currentVersionIndex] : null;

  const generate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          jobTitle,
          company,
          action: "generate",
        }),
      });

      const result = await readCoverLetterApiResult(
        res,
        "Failed to generate cover letter"
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }

      const newVersion: Version = {
        content: result.content,
        instruction: "Initial generation",
        createdAt: new Date().toISOString(),
      };
      setVersions([newVersion]);
      setCurrentVersionIndex(0);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [company, jobDescription, jobTitle]);

  async function handleRevise() {
    if (!instruction.trim() || !currentVersion) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          jobTitle,
          company,
          action: "revise",
          currentContent: currentVersion.content,
          instruction: instruction.trim(),
        }),
      });

      const result = await readCoverLetterApiResult(
        res,
        "Failed to revise cover letter"
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }

      const newVersion: Version = {
        content: result.content,
        instruction: instruction.trim(),
        createdAt: new Date().toISOString(),
      };
      const newVersions = [
        ...versions.slice(0, currentVersionIndex + 1),
        newVersion,
      ];
      setVersions(newVersions);
      setCurrentVersionIndex(newVersions.length - 1);
      setInstruction("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleRevise();
    }
  }

  async function handleCopy() {
    if (!currentVersion) return;
    await navigator.clipboard.writeText(currentVersion.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!currentVersion) return;
    const blob = new Blob([currentVersion.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName =
      company.toLowerCase().replace(/\s+/g, "-") || "cover-letter";
    a.download = `cover-letter-${safeName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleRevert(index: number) {
    setCurrentVersionIndex(index);
    setShowHistory(false);
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Cover Letter</h2>
          {versions.length > 0 && (
            <span className="text-xs text-muted-foreground">
              v{currentVersionIndex + 1} of {versions.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {versions.length > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentVersionIndex(Math.max(0, currentVersionIndex - 1))
                }
                disabled={currentVersionIndex <= 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentVersionIndex(
                    Math.min(versions.length - 1, currentVersionIndex + 1)
                  )
                }
                disabled={currentVersionIndex >= versions.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            disabled={versions.length <= 1}
          >
            <History className="mr-1 h-4 w-4" />
            History
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={generate}
            disabled={isGenerating}
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            Regenerate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!currentVersion}
          >
            {copied ? (
              <Check className="mr-1 h-4 w-4" />
            ) : (
              <Copy className="mr-1 h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!currentVersion}
          >
            <Download className="mr-1 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {showHistory && (
        <div className="space-y-2 rounded-lg border bg-muted/50 p-3">
          <h3 className="text-sm font-medium">Version History</h3>
          {versions.map((version, index) => (
            <button
              key={`${version.createdAt}-${index}`}
              onClick={() => handleRevert(index)}
              className={cn(
                "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                index === currentVersionIndex
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <span className="font-medium">v{index + 1}</span>
              <span className="ml-2 text-xs opacity-75">
                {version.instruction}
              </span>
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="min-h-[300px] flex-1 overflow-y-auto whitespace-pre-wrap rounded-lg border bg-card p-6 text-sm leading-relaxed">
        {isGenerating && !currentVersion ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating cover letter...
          </div>
        ) : currentVersion ? (
          currentVersion.content
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No cover letter generated yet.
          </div>
        )}
      </div>

      <div className="flex items-end gap-2">
        <Textarea
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Refine: "make it more concise", "emphasize leadership", "add more technical details"...'
          className="max-h-[120px] min-h-[44px] resize-none"
          disabled={isGenerating || !currentVersion}
          rows={1}
        />
        <Button
          onClick={handleRevise}
          disabled={isGenerating || !instruction.trim() || !currentVersion}
          className="shrink-0"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
