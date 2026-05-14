"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  Loader2,
  PanelRightClose,
  PanelRightOpen,
  PenLine,
  Sparkles,
  Wand2,
} from "lucide-react";
import {
  DOCUMENT_ASSISTANT_ACTION_LABELS,
  buildDocumentAssistantRequestPayload,
  isMissingLLMSetupError,
  parseLLMStatusResponse,
  stripDocumentHtml,
  type DocumentAssistantAction,
} from "@/lib/document-assistant";
import { coverLetterHtmlToText } from "@/lib/editor/cover-letter-tiptap";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/billing/billing-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { showAchievementToasts } from "@/components/streak/achievement-toast";
import { useToast } from "@/components/ui/toast";
import { extractUnlockedFromResponse } from "@/lib/streak/client";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/types";
import {
  COVER_LETTER_CRITIQUE_AXES,
  type CoverLetterCritique,
} from "@/lib/ai/critique-prompts";
import type { DocumentMode } from "./studio-documents";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

type AssistantRunAction =
  | DocumentAssistantAction
  | "critique"
  | "generate-from-bank"
  | "rewrite-section";

interface AiAssistantPanelProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  documentContent: string;
  documentMode?: DocumentMode;
  selectedEntryCount: number;
  selectedEntryIds?: string[];
  coverLetterCritique?: CoverLetterCritique;
  onCoverLetterCritique?: (critique: CoverLetterCritique) => void;
  onCoverLetterGenerated?: (content: string) => void;
  onCoverLetterSuggestionApply?: (
    rangeInLetter: string,
    suggestion: string,
  ) => boolean;
  onOpenBank: () => void;
  onOpportunityClear?: () => void;
  onOpportunitySelect?: (opportunityId: string) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

interface AssistantResponse {
  content?: string;
  error?: string;
  unlocked?: unknown[];
}

interface CritiqueResponse {
  critique?: CoverLetterCritique;
  error?: string;
}

interface OpportunitiesResponse {
  opportunities?: Opportunity[];
  opportunity?: Opportunity;
  error?: string;
}

const QUICK_ACTIONS: DocumentAssistantAction[] = [
  "rewrite",
  "make-concise",
  "add-metrics",
];

const REWRITE_SECTIONS = [
  { value: "summary", label: "Summary" },
  { value: "experience", label: "Experience" },
  { value: "skills", label: "Skills" },
  { value: "projects", label: "Projects" },
] as const;

type RewriteSection = (typeof REWRITE_SECTIONS)[number]["value"];

function isRewriteSection(value: string): value is RewriteSection {
  return REWRITE_SECTIONS.some((section) => section.value === value);
}

async function readApiError(
  response: Response,
  fallback = "Assistant request failed.",
): Promise<string> {
  try {
    const data = (await response.json()) as AssistantResponse;
    return data.error ?? fallback;
  } catch {
    return fallback;
  }
}

export function AiAssistantPanel({
  className,
  documentContent,
  documentMode = "resume",
  selectedEntryCount,
  selectedEntryIds = [],
  coverLetterCritique,
  onCoverLetterCritique,
  onCoverLetterGenerated,
  onCoverLetterSuggestionApply,
  onOpenBank,
  onOpportunityClear,
  onOpportunitySelect,
  collapsed = false,
  onToggleCollapsed,
  ...asideProps
}: AiAssistantPanelProps) {
  const dialogsT = useTranslations("dialogs.studio.aiAssistant");
  const a11yT = useA11yTranslations();
  const { addToast } = useToast();
  const panelRef = useRef<HTMLElement>(null);
  const runningActionRef = useRef<AssistantRunAction | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState("");
  const [selectedOpportunityLabel, setSelectedOpportunityLabel] = useState("");
  const [selectedOpportunityCompany, setSelectedOpportunityCompany] =
    useState("");
  const [selectedOpportunityRole, setSelectedOpportunityRole] = useState("");
  const [opportunityPickerOpen, setOpportunityPickerOpen] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [opportunitiesLoading, setOpportunitiesLoading] = useState(false);
  const [opportunityError, setOpportunityError] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [rewriteSection, setRewriteSection] = useState<RewriteSection | "">("");
  const [runningAction, setRunningAction] = useState<AssistantRunAction | null>(
    null,
  );
  const [setupPrompt, setSetupPrompt] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [assistantResult, setAssistantResult] = useState("");

  useEffect(() => {
    function syncSelection() {
      const selection = window.getSelection();
      const text = selection?.toString().trim() ?? "";
      const activeElement = document.activeElement;
      const focusIsInPanel =
        activeElement instanceof Element &&
        panelRef.current?.contains(activeElement);

      if (!text) {
        if (focusIsInPanel) return;
        setSelectedText("");
        return;
      }

      const root = document.querySelector("[data-document-editor-root='true']");
      const anchorNode = selection?.anchorNode;
      const anchorElement =
        anchorNode instanceof Element ? anchorNode : anchorNode?.parentElement;

      if (root && anchorElement && root.contains(anchorElement)) {
        setSelectedText(text);
      } else if (!focusIsInPanel) {
        setSelectedText("");
      }
    }

    document.addEventListener("selectionchange", syncSelection);
    return () => {
      document.removeEventListener("selectionchange", syncSelection);
    };
  }, []);

  useEffect(() => {
    const opportunityId = new URLSearchParams(window.location.search)
      .get("opportunityId")
      ?.trim();
    if (!opportunityId) return;

    const encodedOpportunityId = encodeURIComponent(opportunityId);
    let cancelled = false;

    async function preloadOpportunity() {
      try {
        const response = await fetch(
          `/api/opportunities/${encodedOpportunityId}`,
        );
        if (!response.ok) {
          throw new Error(
            await readApiError(response, "Opportunity not found."),
          );
        }
        const data = (await response.json()) as OpportunitiesResponse;
        if (!data.opportunity) throw new Error("Opportunity not found.");
        if (cancelled) return;

        setJobDescription(data.opportunity.summary);
        setSelectedOpportunityId(data.opportunity.id);
        setSelectedOpportunityLabel(
          `${data.opportunity.title} at ${data.opportunity.company}`,
        );
        setSelectedOpportunityCompany(data.opportunity.company);
        setSelectedOpportunityRole(data.opportunity.title);
        onOpportunitySelect?.(data.opportunity.id);
      } catch (error) {
        if (!cancelled) {
          setOpportunityError(
            error instanceof Error
              ? error.message
              : "Could not load the selected opportunity.",
          );
        }
      }
    }

    preloadOpportunity();

    return () => {
      cancelled = true;
    };
  }, [onOpportunitySelect]);

  const ensureLLMConfigured = useCallback(async () => {
    const response = await fetch("/api/settings/status");
    if (!response.ok) {
      setStatusMessage(
        await readApiError(response, "Could not check LLM setup."),
      );
      setAssistantResult("");
      return false;
    }

    const status = parseLLMStatusResponse(await response.json());
    if (!status.configured) {
      setSetupPrompt(true);
      setStatusMessage("");
      setAssistantResult("");
      return false;
    }

    setSetupPrompt(false);
    return true;
  }, []);

  const loadOpportunities = useCallback(async () => {
    setOpportunitiesLoading(true);
    setOpportunityError("");
    try {
      const response = await fetch(
        "/api/opportunities?status=saved,applied&limit=50",
      );
      if (!response.ok) {
        throw new Error(
          await readApiError(response, "Could not load saved opportunities."),
        );
      }
      const data = (await response.json()) as OpportunitiesResponse;
      setOpportunities(data.opportunities ?? []);
    } catch (error) {
      setOpportunities([]);
      setOpportunityError(
        error instanceof Error
          ? error.message
          : "Could not load saved opportunities.",
      );
    } finally {
      setOpportunitiesLoading(false);
    }
  }, []);

  const handleOpenOpportunityPicker = useCallback(() => {
    setOpportunityPickerOpen(true);
    void loadOpportunities();
  }, [loadOpportunities]);

  const handleSelectOpportunity = useCallback(
    (opportunity: Opportunity) => {
      setJobDescription(opportunity.summary);
      setSelectedOpportunityId(opportunity.id);
      setSelectedOpportunityLabel(
        `${opportunity.title} at ${opportunity.company}`,
      );
      setSelectedOpportunityCompany(opportunity.company);
      setSelectedOpportunityRole(opportunity.title);
      onOpportunitySelect?.(opportunity.id);
      setOpportunityPickerOpen(false);
      setOpportunityError("");
      setStatusMessage(
        `Loaded ${opportunity.title} from the opportunity bank.`,
      );
      setAssistantResult("");
    },
    [onOpportunitySelect],
  );

  const runRewrite = useCallback(
    async (action: DocumentAssistantAction, fallbackText: string) => {
      const textToRewrite = selectedText || fallbackText;
      if (!textToRewrite.trim()) {
        setStatusMessage("Select text in the document first.");
        setAssistantResult("");
        return;
      }

      const response = await fetch("/api/documents/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          buildDocumentAssistantRequestPayload({
            action,
            selectedText: textToRewrite,
            documentContent,
            jobDescription,
            ...(selectedOpportunityId
              ? { opportunityId: selectedOpportunityId }
              : {}),
          }),
        ),
      });

      if (!response.ok) {
        const error = await readApiError(response);
        if (isMissingLLMSetupError(error)) {
          setSetupPrompt(true);
          setStatusMessage("");
        } else {
          setStatusMessage(error);
        }
        setAssistantResult("");
        return;
      }

      const data = (await response.json()) as AssistantResponse;
      setAssistantResult(data.content ?? "");
      setStatusMessage(
        "Review the rewrite before applying it to the document.",
      );
    },
    [documentContent, jobDescription, selectedOpportunityId, selectedText],
  );

  const runCoverLetterGenerate = useCallback(async () => {
    if (!jobDescription.trim()) {
      setStatusMessage("Paste a job description first.");
      return;
    }

    if (selectedEntryIds.length === 0) {
      onOpenBank();
      setStatusMessage("Choose bank entries to generate a stronger draft.");
      return;
    }

    const response = await fetch("/api/cover-letter/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generate",
        jobDescription,
        selectedBankEntryIds: selectedEntryIds,
        ...(selectedOpportunityId
          ? { opportunityId: selectedOpportunityId }
          : {}),
      }),
    });

    if (!response.ok) {
      const error = await readApiError(
        response,
        "Could not generate cover letter.",
      );
      if (isMissingLLMSetupError(error)) {
        setSetupPrompt(true);
        setStatusMessage("");
      } else {
        setStatusMessage(error);
      }
      return;
    }

    const data = (await response.json()) as AssistantResponse;
    if (!data.content?.trim()) {
      setStatusMessage("The assistant returned an empty cover letter.");
      return;
    }

    onCoverLetterGenerated?.(data.content);
    showAchievementToasts(extractUnlockedFromResponse(data), addToast);
    setStatusMessage("Generated a cover letter draft.");
  }, [
    addToast,
    jobDescription,
    onCoverLetterGenerated,
    onOpenBank,
    selectedEntryIds,
    selectedOpportunityId,
  ]);

  const runCoverLetterCritique = useCallback(async () => {
    const letter = coverLetterHtmlToText(documentContent);
    if (!letter.trim()) {
      setStatusMessage("Write or generate a cover letter draft first.");
      return;
    }

    if (!jobDescription.trim()) {
      setStatusMessage("Paste a job description first.");
      return;
    }

    const response = await fetch("/api/ai/critique-cover-letter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        letter,
        jd: jobDescription,
        ...(selectedOpportunityCompany
          ? { company: selectedOpportunityCompany }
          : {}),
        ...(selectedOpportunityRole ? { role: selectedOpportunityRole } : {}),
      }),
    });

    if (!response.ok) {
      const error = await readApiError(response, "Could not critique draft.");
      if (isMissingLLMSetupError(error)) {
        setSetupPrompt(true);
        setStatusMessage("");
      } else {
        setStatusMessage(error);
      }
      return;
    }

    const data = (await response.json()) as CritiqueResponse;
    if (!data.critique) {
      setStatusMessage("The assistant returned an empty critique.");
      return;
    }

    onCoverLetterCritique?.(data.critique);
    setStatusMessage("Critique ready.");
  }, [
    documentContent,
    jobDescription,
    onCoverLetterCritique,
    selectedOpportunityCompany,
    selectedOpportunityRole,
  ]);

  const handleAssistantAction = useCallback(
    async (action: AssistantRunAction) => {
      if (runningActionRef.current) return;

      runningActionRef.current = action;
      setRunningAction(action);
      setStatusMessage("");
      setAssistantResult("");

      try {
        if (action === "match-jd-keywords" && !jobDescription.trim()) {
          setStatusMessage("Paste a job description first.");
          return;
        }

        if (action === "rewrite-section") {
          const sectionLabel = REWRITE_SECTIONS.find(
            (section) => section.value === rewriteSection,
          )?.label;

          if (!sectionLabel) {
            setStatusMessage("Choose a section to rewrite.");
            return;
          }

          if (!selectedText) {
            setStatusMessage(
              `Select text in the ${sectionLabel.toLowerCase()} section first.`,
            );
            return;
          }
        }

        const configured = await ensureLLMConfigured();
        if (!configured) return;

        if (action === "generate-from-bank") {
          if (documentMode === "cover_letter") {
            await runCoverLetterGenerate();
            return;
          }

          onOpenBank();
          setStatusMessage(
            selectedEntryCount > 0
              ? "Bank entries are ready for the next generation step."
              : "Choose bank entries to generate a stronger draft.",
          );
          return;
        }

        if (action === "critique") {
          await runCoverLetterCritique();
          return;
        }

        if (action === "rewrite-section") {
          await runRewrite("rewrite", "");
          return;
        }

        await runRewrite(
          action,
          action === "match-jd-keywords"
            ? stripDocumentHtml(documentContent)
            : "",
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Assistant request failed.";
        if (isMissingLLMSetupError(message)) {
          setSetupPrompt(true);
          setStatusMessage("");
        } else {
          setStatusMessage(message);
        }
      } finally {
        runningActionRef.current = null;
        setRunningAction(null);
      }
    },
    [
      documentContent,
      documentMode,
      ensureLLMConfigured,
      jobDescription,
      onOpenBank,
      rewriteSection,
      runCoverLetterGenerate,
      runCoverLetterCritique,
      runRewrite,
      selectedEntryCount,
      selectedText,
    ],
  );

  const isRunning = (action: AssistantRunAction) => runningAction === action;
  const isBusy = runningAction !== null;
  const hasSelection = selectedText.length > 0;
  const isCoverLetter = documentMode === "cover_letter";
  const generateBankLabel = isRunning("generate-from-bank")
    ? isCoverLetter
      ? "Generating..."
      : "Preparing..."
    : isCoverLetter
      ? "AI Generate"
      : "Generate from Bank";
  const critiqueScoreRows = coverLetterCritique
    ? COVER_LETTER_CRITIQUE_AXES.map(({ key, label }) => ({
        key,
        label,
        value: coverLetterCritique.scores[key],
        rationale: coverLetterCritique.rationale_per_axis[key],
      }))
    : [];

  const expandPanel = useCallback(() => {
    if (collapsed) onToggleCollapsed?.();
  }, [collapsed, onToggleCollapsed]);

  if (collapsed) {
    return (
      <aside
        ref={panelRef}
        {...asideProps}
        className={cn(
          "flex w-full shrink-0 flex-col items-center gap-2 border-l-[length:var(--border-width)] bg-background py-3 transition-[width] duration-200 md:w-12",
          className,
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleCollapsed}
          aria-label={a11yT("expandAiAssistantPanel")}
        >
          <PanelRightOpen className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={expandPanel}
          aria-label={a11yT("showAiAssistant")}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={expandPanel}
          aria-label={a11yT("showTailorToJd")}
        >
          <Wand2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={expandPanel}
          aria-label={a11yT("showGenerateFromBank")}
        >
          <FileText className="h-4 w-4" />
        </Button>
      </aside>
    );
  }

  return (
    <aside
      ref={panelRef}
      {...asideProps}
      className={cn(
        "flex w-full shrink-0 flex-col border-l-[length:var(--border-width)] bg-background transition-[width] duration-200 md:w-[360px]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b-[length:var(--border-width)] px-4 py-3">
        <h2 className="font-display text-sm font-semibold tracking-tight">
          AI Assistant
        </h2>
        <div className="flex items-center gap-1.5">
          <Sparkles
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          {onToggleCollapsed && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onToggleCollapsed}
              aria-label={a11yT("collapseAiAssistantPanel")}
            >
              <PanelRightClose className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        {setupPrompt && (
          <div
            className="rounded-[var(--radius)] border-[length:var(--border-width)] border-primary/30 bg-primary/5 p-3 text-sm"
            role="status"
          >
            <p className="font-medium">AI tools need BYOK or Pro credits.</p>
            <p className="mt-1 text-muted-foreground">
              Add your own provider key in Settings, or upgrade to a hosted Pro
              plan and use Slothing credits.
            </p>
            <div className="mt-3 grid gap-2">
              <CheckoutButton plan="pro_weekly" variant="default">
                Upgrade Weekly
              </CheckoutButton>
              <CheckoutButton plan="pro_monthly" variant="outline">
                Upgrade Monthly
              </CheckoutButton>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/settings">Use my own key</Link>
              </Button>
            </div>
          </div>
        )}

        <section className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="studio-jd-input">Job description</Label>
            {selectedOpportunityLabel && (
              <span className="truncate text-xs text-muted-foreground">
                {selectedOpportunityLabel}
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isBusy}
            onClick={handleOpenOpportunityPicker}
          >
            <BriefcaseBusiness className="mr-2 h-4 w-4" />
            Select from Opportunity Bank
          </Button>
          <Textarea
            id="studio-jd-input"
            value={jobDescription}
            onChange={(event) => {
              setJobDescription(event.target.value);
              setSelectedOpportunityId("");
              setSelectedOpportunityLabel("");
              setSelectedOpportunityCompany("");
              setSelectedOpportunityRole("");
              onOpportunityClear?.();
            }}
            placeholder={a11yT("pasteTheJdHere")}
            className="min-h-[132px] resize-none"
          />
          <Button
            type="button"
            className="w-full"
            disabled={isBusy}
            onClick={() => handleAssistantAction("match-jd-keywords")}
          >
            {isRunning("match-jd-keywords") ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {isRunning("match-jd-keywords") ? "Tailoring..." : "Tailor to JD"}
          </Button>
        </section>

        <section className="space-y-2">
          <div className={isCoverLetter ? "grid grid-cols-2 gap-2" : undefined}>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isBusy}
              onClick={() => handleAssistantAction("generate-from-bank")}
            >
              {isRunning("generate-from-bank") ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileText className="mr-2 h-4 w-4" />
              )}
              {generateBankLabel}
            </Button>
            {isCoverLetter && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isBusy}
                onClick={() => handleAssistantAction("critique")}
              >
                {isRunning("critique") ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BarChart3 className="mr-2 h-4 w-4" />
                )}
                {isRunning("critique") ? "Scoring..." : "Critique"}
              </Button>
            )}
          </div>
        </section>

        <section className="space-y-2">
          <Label htmlFor="rewrite-section-trigger">Rewrite section</Label>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Select
              value={rewriteSection}
              onValueChange={(value) => {
                if (isRewriteSection(value)) setRewriteSection(value);
              }}
            >
              <SelectTrigger
                id="rewrite-section-trigger"
                aria-label={a11yT("rewriteSection")}
              >
                <SelectValue placeholder={a11yT("chooseSection")} />
              </SelectTrigger>
              <SelectContent>
                {REWRITE_SECTIONS.map((section) => (
                  <SelectItem key={section.value} value={section.value}>
                    {section.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              disabled={isBusy}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleAssistantAction("rewrite-section")}
              aria-label={a11yT("rewriteSelectedSection")}
            >
              {isRunning("rewrite-section") ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PenLine className="h-4 w-4" />
              )}
            </Button>
          </div>
        </section>

        {hasSelection && (
          <section
            className="space-y-3 rounded-[var(--radius)] border-[length:var(--border-width)] bg-muted/30 p-3"
            aria-label={a11yT("selectedTextQuickActions")}
          >
            <div>
              <p className="text-sm font-medium">Selected text</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {selectedText}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action}
                  type="button"
                  size="sm"
                  variant="secondary"
                  className={cn(
                    "px-2 text-xs",
                    action === "make-concise" && "text-[11px]",
                  )}
                  disabled={isBusy}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleAssistantAction(action)}
                >
                  {isRunning(action) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    DOCUMENT_ASSISTANT_ACTION_LABELS[action]
                  )}
                </Button>
              ))}
            </div>
          </section>
        )}

        {coverLetterCritique && isCoverLetter && (
          <section
            className="space-y-4 rounded-[var(--radius)] border-[length:var(--border-width)] bg-muted/30 p-3"
            aria-label={a11yT("coverLetterCritique")}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Critique</p>
              <span className="text-sm font-semibold">
                {coverLetterCritique.overall}/10
              </span>
            </div>

            <div className="space-y-3">
              {critiqueScoreRows.map((score) => (
                <div key={score.key} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-medium">{score.label}</span>
                    <span className="text-muted-foreground">
                      {score.value}/10
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${score.value * 10}%` }}
                    />
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {score.rationale}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Suggested rewrites
              </p>
              {coverLetterCritique.suggested_rewrites.map((rewrite, index) => (
                <button
                  key={`${rewrite.range_in_letter}-${index}`}
                  type="button"
                  className="w-full rounded-md border bg-background p-3 text-left transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                  onClick={() => {
                    const applied = onCoverLetterSuggestionApply?.(
                      rewrite.range_in_letter,
                      rewrite.suggestion,
                    );
                    setStatusMessage(
                      applied
                        ? "Applied suggested rewrite."
                        : "Could not find that text in the current draft.",
                    );
                  }}
                >
                  <span className="line-clamp-2 block text-xs text-muted-foreground">
                    {rewrite.range_in_letter}
                  </span>
                  <span className="mt-2 block text-sm font-medium">
                    {rewrite.suggestion}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {rewrite.why}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {(statusMessage || assistantResult) && (
          <section className="space-y-2 text-sm" role="status">
            {statusMessage && (
              <p className="text-muted-foreground">{statusMessage}</p>
            )}
            {assistantResult && (
              <div className="rounded-[var(--radius)] border-[length:var(--border-width)] bg-muted/30 p-3 text-foreground">
                {assistantResult}
              </div>
            )}
          </section>
        )}
      </div>

      <Dialog
        open={opportunityPickerOpen}
        onOpenChange={setOpportunityPickerOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dialogsT("opportunityPickerTitle")}</DialogTitle>
            <DialogDescription>
              {dialogsT("opportunityPickerDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[420px] space-y-2 overflow-y-auto">
            {opportunitiesLoading && (
              <div className="flex items-center gap-2 rounded-md border p-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading opportunities...
              </div>
            )}
            {opportunityError && (
              <p className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {opportunityError}
              </p>
            )}
            {!opportunitiesLoading &&
              !opportunityError &&
              opportunities.length === 0 && (
                <p className="rounded-md border p-3 text-sm text-muted-foreground">
                  No saved or applied opportunities found.
                </p>
              )}
            {opportunities.map((opportunity) => (
              <button
                key={opportunity.id}
                type="button"
                className="w-full rounded-md border p-3 text-left transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={() => handleSelectOpportunity(opportunity)}
              >
                <span className="block text-sm font-medium">
                  {opportunity.title}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {opportunity.company} · {opportunity.status}
                </span>
                <span className="mt-2 line-clamp-2 block text-xs text-muted-foreground">
                  {opportunity.summary}
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
