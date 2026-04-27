"use client";

import { useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Loader2,
  Minimize2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { readCoverLetterApiResult } from "@/lib/cover-letter/api-response";
import { cn } from "@/lib/utils";
import {
  applyTextReplacement,
  createAiActionInstruction,
  getParagraphRanges,
  type AiActionId,
} from "./ai-action-center-utils";

interface Version {
  content: string;
  instruction: string;
  createdAt: string;
}

interface TextSelection {
  start: number;
  end: number;
  text: string;
}

interface PendingDiff {
  before: string;
  after: string;
  baseContent: string;
  range: { start: number; end: number } | null;
  actionLabel: string;
}

interface ChatEditorProps {
  jobDescription: string;
  jobTitle: string;
  company: string;
  initialContent: string;
}

const CONTEXTUAL_ACTIONS: Array<{ id: AiActionId; label: string }> = [
  { id: "rewrite", label: "Rewrite" },
  { id: "concise", label: "Make concise" },
  { id: "metrics", label: "Add metrics" },
  { id: "keywords", label: "Match JD keywords" },
];

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
  const [content, setContent] = useState(initialContent);
  const [selection, setSelection] = useState<TextSelection | null>(null);
  const [pendingDiff, setPendingDiff] = useState<PendingDiff | null>(null);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const contentRef = useRef(content);
  contentRef.current = content;

  const sections = useMemo(() => getParagraphRanges(content), [content]);
  const selectedSection = sections[selectedSectionIndex] ?? sections[0] ?? null;

  function commitContent(nextContent: string, instruction: string) {
    const nextVersion: Version = {
      content: nextContent,
      instruction,
      createdAt: new Date().toISOString(),
    };
    const nextVersions = [
      ...versions.slice(0, currentVersionIndex + 1),
      nextVersion,
    ];
    setVersions(nextVersions);
    setCurrentVersionIndex(nextVersions.length - 1);
    setContent(nextContent);
  }

  function handleVersionNavigation(index: number) {
    const nextIndex = Math.max(0, Math.min(versions.length - 1, index));
    const version = versions[nextIndex];
    if (!version) return;

    setCurrentVersionIndex(nextIndex);
    setContent(version.content);
    setPendingDiff(null);
    setSelection(null);
  }

  function updateSelection(element: HTMLTextAreaElement) {
    const start = element.selectionStart;
    const end = element.selectionEnd;

    if (end > start) {
      setSelection({
        start,
        end,
        text: element.value.slice(start, end),
      });
      return;
    }

    setSelection(null);
  }

  function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
    setPendingDiff(null);
    updateSelection(event.target);
  }

  async function generateFromBank() {
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

      commitContent(result.content, "Generated from bank");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function runAssistantAction(
    action: AiActionId,
    actionLabel: string,
    target: TextSelection | null
  ) {
    const baseContent = contentRef.current;
    const before = target?.text ?? baseContent;
    const instruction = createAiActionInstruction({
      action,
      selectedText: before,
      jobDescription,
      sectionLabel:
        action === "rewrite-section" && selectedSection
          ? selectedSection.label
          : undefined,
    });

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
          currentContent: before,
          instruction,
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

      if (contentRef.current !== baseContent) return;

      setPendingDiff({
        before,
        after: result.content,
        baseContent,
        range: target ? { start: target.start, end: target.end } : null,
        actionLabel,
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleRewriteSection() {
    if (!selectedSection) return;
    runAssistantAction("rewrite-section", "Rewrite section", {
      start: selectedSection.start,
      end: selectedSection.end,
      text: selectedSection.text,
    });
  }

  function handleAcceptDiff() {
    if (!pendingDiff) return;
    const nextContent = pendingDiff.range
      ? applyTextReplacement(
          pendingDiff.baseContent,
          pendingDiff.after,
          pendingDiff.range
        )
      : pendingDiff.after;

    commitContent(nextContent, pendingDiff.actionLabel);
    setPendingDiff(null);
    setSelection(null);
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
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName =
      company.toLowerCase().replace(/\s+/g, "-") || "cover-letter";
    a.download = `cover-letter-${safeName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
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
                onClick={() => handleVersionNavigation(currentVersionIndex - 1)}
                disabled={currentVersionIndex <= 0}
                aria-label="Previous version"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVersionNavigation(currentVersionIndex + 1)}
                disabled={currentVersionIndex >= versions.length - 1}
                aria-label="Next version"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={generateFromBank}
            disabled={isGenerating}
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            Regenerate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!content}
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
            disabled={!content}
          >
            <Download className="mr-1 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div
        className={cn(
          "grid min-h-0 flex-1 grid-cols-1 overflow-hidden rounded-lg border bg-card lg:grid-cols-[minmax(0,1fr)_340px]",
          isPanelCollapsed && "lg:grid-cols-[minmax(0,1fr)_56px]"
        )}
      >
        <div className="relative min-h-[420px] border-b lg:border-b-0 lg:border-r">
          {isGenerating && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Working with AI...
              </span>
            </div>
          )}
          <Textarea
            aria-label="Cover letter editor"
            value={content}
            onChange={handleContentChange}
            onSelect={(event) => updateSelection(event.currentTarget)}
            className="h-full min-h-[420px] resize-none rounded-none border-0 p-6 text-sm leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <aside className="min-h-0 overflow-y-auto p-4">
          <div className="mb-4 flex items-center justify-between gap-2">
            {!isPanelCollapsed && (
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Assistant
              </h3>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPanelCollapsed((value) => !value)}
              aria-label={
                isPanelCollapsed
                  ? "Expand AI action center"
                  : "Collapse AI action center"
              }
            >
              {isPanelCollapsed ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <Minimize2 className="h-4 w-4" />
              )}
            </Button>
          </div>

          {!isPanelCollapsed && (
            <div className="space-y-5">
              <section className="space-y-2">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => setShowJobDescription((value) => !value)}
                >
                  Tailor to JD
                </Button>
                {showJobDescription && (
                  <div className="rounded-md border bg-muted/40 p-3">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Job description
                    </p>
                    <div className="max-h-36 overflow-y-auto whitespace-pre-wrap text-xs text-muted-foreground">
                      {jobDescription}
                    </div>
                    <Button
                      className="mt-3 w-full"
                      size="sm"
                      onClick={() => runAssistantAction("tailor", "Tailor to JD", null)}
                      disabled={isGenerating}
                    >
                      Apply JD Tailoring
                    </Button>
                  </div>
                )}
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={generateFromBank}
                  disabled={isGenerating}
                >
                  Generate from Bank
                </Button>
                <div className="space-y-2 rounded-md border p-3">
                  <label
                    htmlFor="rewrite-section"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Rewrite Section
                  </label>
                  <select
                    id="rewrite-section"
                    value={selectedSectionIndex}
                    onChange={(event) =>
                      setSelectedSectionIndex(Number(event.target.value))
                    }
                    className="h-9 w-full rounded-md border bg-background px-2 text-sm"
                    disabled={sections.length === 0}
                  >
                    {sections.map((section, index) => (
                      <option key={`${section.start}-${section.end}`} value={index}>
                        {section.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={handleRewriteSection}
                    disabled={!selectedSection || isGenerating}
                  >
                    Rewrite Section
                  </Button>
                </div>
              </section>

              <section className="space-y-2">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground">
                  Contextual actions
                </h4>
                {selection ? (
                  <div className="grid grid-cols-1 gap-2">
                    {CONTEXTUAL_ACTIONS.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          runAssistantAction(action.id, action.label, selection)
                        }
                        disabled={isGenerating}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                    <p>Select text in the editor to rewrite a specific passage.</p>
                    <p>Select relevant experience and match JD keywords.</p>
                  </div>
                )}
              </section>

              {pendingDiff && (
                <section className="space-y-3 rounded-md border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold">
                      {pendingDiff.actionLabel}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      Preview
                    </span>
                  </div>
                  <div className="grid gap-2">
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">
                        Before
                      </p>
                      <div className="max-h-32 overflow-y-auto rounded-md bg-muted p-2 text-xs whitespace-pre-wrap">
                        {pendingDiff.before}
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">
                        After
                      </p>
                      <div className="max-h-32 overflow-y-auto rounded-md bg-primary/10 p-2 text-xs whitespace-pre-wrap">
                        {pendingDiff.after}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={handleAcceptDiff}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setPendingDiff(null)}
                    >
                      Reject
                    </Button>
                  </div>
                </section>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
