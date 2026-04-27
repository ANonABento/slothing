"use client";

import { useCallback, useRef, useState } from "react";
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

interface EditorSelection {
  start: number;
  end: number;
  text: string;
  baseContent: string;
}

interface PendingRewrite {
  before: string;
  after: string;
  start: number;
  end: number;
  baseContent: string;
}

interface ChatEditorProps {
  jobDescription: string;
  jobTitle: string;
  company: string;
  initialContent: string;
}

interface TextSelection {
  start: number;
  end: number;
  text: string;
}

interface RewriteSuggestion {
  before: string;
  after: string;
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
  const [editorContent, setEditorContent] = useState(initialContent);
  const [selection, setSelection] = useState<TextSelection | null>(null);
  const [rewriteSuggestion, setRewriteSuggestion] =
    useState<RewriteSuggestion | null>(null);
  const [instruction, setInstruction] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const rewriteSourceRef = useRef("");
  const editorContentRef = useRef(initialContent);
  const currentVersion =
    currentVersionIndex >= 0 ? versions[currentVersionIndex] : null;
  const currentContentRef = useRef(currentVersion?.content ?? "");
  currentContentRef.current = currentVersion?.content ?? "";
  const currentVersionIndexRef = useRef(currentVersionIndex);
  currentVersionIndexRef.current = currentVersionIndex;

  function commitContent(content: string, instructionLabel: string) {
    const newVersion: Version = {
      content,
      instruction: instructionLabel,
      createdAt: new Date().toISOString(),
    };
    const newVersions = [
      ...versions.slice(0, currentVersionIndex + 1),
      newVersion,
    ];
    setVersions(newVersions);
    setCurrentVersionIndex(newVersions.length - 1);
    editorContentRef.current = content;
    setEditorContent(content);
  }

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

      const newVersion = {
        content: result.content,
        instruction: "Initial generation",
        createdAt: new Date().toISOString(),
      };
      setVersions([newVersion]);
      setCurrentVersionIndex(0);
      editorContentRef.current = result.content;
      setEditorContent(result.content);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

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
          currentContent: editorContent,
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

      commitContent(result.content, instruction.trim());
      setInstruction("");
      setSelection(null);
      setRewrite(null);
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

  function updateCurrentContent(content: string) {
    setVersions((current) =>
      current.map((version, index) =>
        index === currentVersionIndex ? { ...version, content } : version
      )
    );
  }

  function handleEditorChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    updateCurrentContent(e.target.value);
    setSelection(null);
    setRewrite(null);
  }

  function handleEditorSelect(e: React.SyntheticEvent<HTMLTextAreaElement>) {
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const text = target.value.slice(start, end);
    setSelection(
      start < end && text.trim()
        ? { start, end, text, baseContent: target.value }
        : null
    );
  }

  async function handleSelectionRewrite(rewriteInstruction = "Rewrite") {
    if (!selection || !currentVersion) return;
    if (selection.baseContent !== currentVersion.content) {
      setSelection(null);
      return;
    }

    const baseSelection = selection;
    const baseVersionIndex = currentVersionIndex;
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
          action: "rewrite",
          currentContent: baseSelection.baseContent,
          selectedText: baseSelection.text,
          instruction: rewriteInstruction,
        }),
      });

      const result = await readCoverLetterApiResult(
        res,
        "Failed to rewrite selection"
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (
        currentContentRef.current !== baseSelection.baseContent ||
        currentVersionIndexRef.current !== baseVersionIndex
      ) {
        return;
      }

      setRewrite({
        before: baseSelection.text,
        after: result.content,
        start: baseSelection.start,
        end: baseSelection.end,
        baseContent: baseSelection.baseContent,
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleAcceptRewrite() {
    if (!rewrite || currentContentRef.current !== rewrite.baseContent) return;
    const beforeSelection = rewrite.baseContent.slice(0, rewrite.start);
    const afterSelection = rewrite.baseContent.slice(rewrite.end);
    updateCurrentContent(
      `${beforeSelection}${rewrite.after}${afterSelection}`
    );
    setRewrite(null);
    setSelection(null);
  }

  function handleRejectRewrite() {
    setRewrite(null);
  }

  function handleVersionChange(index: number) {
    setCurrentVersionIndex(index);
    setSelection(null);
    setRewrite(null);
  }

  async function handleCopy() {
    if (!editorContent) return;
    await navigator.clipboard.writeText(editorContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!editorContent) return;
    const blob = new Blob([editorContent], { type: "text/plain" });
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
    const content = versions[index]?.content ?? "";
    editorContentRef.current = content;
    setEditorContent(content);
    setShowHistory(false);
  }

  function handleEditorChange(value: string) {
    editorContentRef.current = value;
    setEditorContent(value);
    setRewriteSuggestion(null);
    setSelection(null);
  }

  function handleEditorSelect(event: React.SyntheticEvent<HTMLTextAreaElement>) {
    const target = event.currentTarget;
    if (target.selectionStart === target.selectionEnd) {
      setSelection(null);
      return;
    }

    setSelection({
      start: target.selectionStart,
      end: target.selectionEnd,
      text: target.value.slice(target.selectionStart, target.selectionEnd),
    });
  }

  async function handleSelectionRewrite(nextInstruction: string) {
    if (!selection) return;
    setIsGenerating(true);
    setError(null);
    rewriteSourceRef.current = editorContentRef.current;

    try {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          jobTitle,
          company,
          action: "revise",
          currentContent: selection.text,
          instruction: nextInstruction,
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

      if (rewriteSourceRef.current !== editorContentRef.current) return;
      setRewriteSuggestion({ before: selection.text, after: result.content });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleAcceptRewrite() {
    if (!selection || !rewriteSuggestion) return;
    const nextContent = `${editorContent.slice(0, selection.start)}${
      rewriteSuggestion.after
    }${editorContent.slice(selection.end)}`;
    commitContent(nextContent, "Selection rewrite");
    setSelection(null);
    setRewriteSuggestion(null);
  }

  function handleRejectRewrite() {
    setRewriteSuggestion(null);
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
                  handleVersionChange(Math.max(0, currentVersionIndex - 1))
                }
                disabled={currentVersionIndex <= 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleVersionChange(
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

      <div className="rounded-lg border bg-muted/30 p-3">
        <h3 className="text-sm font-medium">AI Assistant</h3>
        {!selection ? (
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p>Select text in the editor to rewrite a specific passage.</p>
            <p>Select relevant experience and match JD keywords.</p>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectionRewrite("Rewrite")}
              disabled={isGenerating}
            >
              Rewrite
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectionRewrite("Make concise")}
              disabled={isGenerating}
            >
              Make concise
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectionRewrite("Add metrics")}
              disabled={isGenerating}
            >
              Add metrics
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectionRewrite("Match JD keywords")}
              disabled={isGenerating}
            >
              Match JD keywords
            </Button>
          </div>
        )}

        {rewriteSuggestion && (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div>
              <h4 className="mb-1 text-xs font-medium text-muted-foreground">
                Before
              </h4>
              <div className="rounded-md border bg-background p-3 text-sm">
                {rewriteSuggestion.before}
              </div>
            </div>
            <div>
              <h4 className="mb-1 text-xs font-medium text-muted-foreground">
                After
              </h4>
              <div className="rounded-md border bg-background p-3 text-sm">
                {rewriteSuggestion.after}
              </div>
            </div>
            <div className="flex gap-2 md:col-span-2">
              <Button size="sm" onClick={handleAcceptRewrite}>
                Accept
              </Button>
              <Button variant="outline" size="sm" onClick={handleRejectRewrite}>
                Reject
              </Button>
            </div>
          </div>
        )}
      </div>

      <Textarea
        aria-label="Cover letter editor"
        value={editorContent}
        onChange={(event) => handleEditorChange(event.target.value)}
        onSelect={handleEditorSelect}
        className="min-h-[300px] flex-1 resize-none"
      />

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
