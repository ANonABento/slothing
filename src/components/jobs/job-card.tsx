"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  AlertTriangle,
  Briefcase,
  Building2,
  ChevronDown,
  CheckCircle,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileEdit,
  Info,
  Loader2,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingUp,
  Wifi,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ATSAnalysisResult } from "@/lib/ats/analyzer";
import {
  TRACKED_JOB_STATUSES,
  TRACKED_JOB_STATUS_LABELS,
  type TrackedJobStatus,
} from "@/lib/constants/jobs";
import {
  THEME_INTERACTIVE_SURFACE_CLASSES,
  THEME_MUTED_SURFACE_CLASSES,
} from "@/lib/theme/component-classes";
import { cn } from "@/lib/utils";
import type { JobDescription, JobMatch } from "@/types";
import { getJobStatusValue } from "@/app/(app)/jobs/filter-jobs";

const ATSScoreBadge = dynamic(
  () =>
    import("@/components/ats/score-breakdown").then(
      (module) => module.ATSScoreBadge,
    ),
  {
    loading: () => (
      <div className="h-6 w-16 animate-pulse rounded-[var(--radius)] bg-muted" />
    ),
  },
);

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
}

const STATUS_STYLES: Record<TrackedJobStatus, { bg: string; text: string }> = {
  pending: { bg: "bg-muted", text: "text-muted-foreground" },
  saved: { bg: "bg-muted", text: "text-muted-foreground" },
  applied: { bg: "bg-info/10", text: "text-info" },
  interviewing: { bg: "bg-warning/10", text: "text-warning" },
  offered: { bg: "bg-success/10", text: "text-success" },
  rejected: { bg: "bg-destructive/10", text: "text-destructive" },
};

interface JobCardProps {
  job: JobDescription;
  analysis?: JobMatch;
  analyzing: boolean;
  generating: boolean;
  templates: ResumeTemplate[];
  selectedTemplate: string;
  expanded: boolean;
  atsResult?: ATSAnalysisResult;
  atsAnalyzing: boolean;
  onSelectTemplate: (id: string) => void;
  onAnalyze: () => void;
  onGenerate: () => void;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
  onToggleExpand: () => void;
  onAtsCheck: () => void;
  onAtsDialogOpen: () => void;
  onCoverLetter: () => void;
}

export function JobCard(props: JobCardProps) {
  const {
    job,
    analysis,
    analyzing,
    generating,
    templates,
    selectedTemplate,
    expanded,
    atsResult,
    atsAnalyzing,
    onSelectTemplate,
    onAnalyze,
    onGenerate,
    onDelete,
    onStatusChange,
    onToggleExpand,
    onAtsCheck,
    onAtsDialogOpen,
    onCoverLetter,
  } = props;

  const status = getJobStatusValue(job);
  const statusStyle = STATUS_STYLES[status];
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const moreMenuItemRefs = useRef<
    Array<HTMLButtonElement | HTMLAnchorElement | null>
  >([]);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  useEffect(() => {
    if (!moreMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!moreMenuRef.current?.contains(event.target as Node)) {
        setMoreMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMoreMenuOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [moreMenuOpen]);

  function openMoreMenu(focusIndex = 0) {
    setMoreMenuOpen(true);
    requestAnimationFrame(() => {
      moreMenuItemRefs.current[focusIndex]?.focus();
    });
  }

  function closeMoreMenu({ returnFocus = false } = {}) {
    setMoreMenuOpen(false);
    if (returnFocus) {
      requestAnimationFrame(() => moreMenuTriggerRef.current?.focus());
    }
  }

  function handleMoreMenuTriggerKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) {
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      openMoreMenu();
    }
  }

  function handleMoreMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const items = moreMenuItemRefs.current.filter(
      (item): item is HTMLButtonElement | HTMLAnchorElement =>
        Boolean(item) && !(item instanceof HTMLButtonElement && item.disabled),
    );
    const currentIndex = items.findIndex(
      (item) => item === document.activeElement,
    );

    if (items.length === 0) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMoreMenu({ returnFocus: true });
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex =
        currentIndex === -1
          ? 0
          : (currentIndex + step + items.length) % items.length;
      items[nextIndex]?.focus();
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus();
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  }

  return (
    <div
      className={cn(
        "group overflow-visible",
        THEME_INTERACTIVE_SURFACE_CLASSES,
      )}
    >
      <div className="rounded-t-[var(--radius)] p-5 border-b-[length:var(--border-width)] bg-muted/30 [backdrop-filter:var(--backdrop-blur)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="p-3 rounded-[var(--radius)] bg-primary/10 text-primary shrink-0">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold text-lg truncate">{job.title}</h3>
                <Select value={status} onValueChange={onStatusChange}>
                  <SelectTrigger
                    className={`h-6 w-auto px-2 text-xs border-0 ${statusStyle.bg} ${statusStyle.text}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRACKED_JOB_STATUSES.map((statusOption) => (
                      <SelectItem key={statusOption} value={statusOption}>
                        {TRACKED_JOB_STATUS_LABELS[statusOption]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {atsResult && (
                  <ATSScoreBadge
                    score={atsResult.score.overall}
                    onClick={onAtsDialogOpen}
                  />
                )}
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">{job.company}</span>
                </span>
                {job.location && (
                  <span className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                )}
                {job.remote && (
                  <span className="flex items-center gap-1 text-sm text-success">
                    <Wifi className="h-3.5 w-3.5" />
                    Remote
                  </span>
                )}
              </div>
            </div>
          </div>

          {analysis && (
            <CircularProgress
              value={analysis.overallScore}
              size={56}
              strokeWidth={5}
              className="shrink-0"
            />
          )}
        </div>

        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
          >
            <ExternalLink className="h-3 w-3" />
            View Job Posting
          </a>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">
              Description
            </p>
            <button
              onClick={onToggleExpand}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              {expanded ? (
                <>
                  <EyeOff className="h-3 w-3" /> Show less
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3" /> Show more
                </>
              )}
            </button>
          </div>
          <p
            className={`text-sm text-muted-foreground ${expanded ? "" : "line-clamp-3"}`}
          >
            {job.description}
          </p>
        </div>

        {job.keywords && job.keywords.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Key Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {job.keywords.slice(0, 8).map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {job.keywords.length > 8 && (
                <Badge variant="outline" className="text-xs">
                  +{job.keywords.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {analysis && (
          <div className={cn(THEME_MUTED_SURFACE_CLASSES, "p-4 space-y-3")}>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-medium">Match Analysis</span>
            </div>
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div>
                <p className="text-xs font-medium text-success flex items-center gap-1 mb-1">
                  <CheckCircle className="h-3 w-3" /> Suggestions
                </p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {analysis.suggestions.slice(0, 2).map((suggestion, index) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
            {analysis.gaps && analysis.gaps.length > 0 && (
              <div>
                <p className="text-xs font-medium text-warning flex items-center gap-1 mb-1">
                  <AlertTriangle className="h-3 w-3" /> Gaps to Address
                </p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {analysis.gaps.slice(0, 2).map((gap, index) => (
                    <li key={index}>• {gap}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Button
            size="sm"
            onClick={onGenerate}
            disabled={generating}
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Tailor Resume
          </Button>
          <div className="relative" ref={moreMenuRef}>
            <Button
              ref={moreMenuTriggerRef}
              type="button"
              variant="outline"
              size="sm"
              aria-haspopup="menu"
              aria-expanded={moreMenuOpen}
              onClick={() => setMoreMenuOpen((open) => !open)}
              onKeyDown={handleMoreMenuTriggerKeyDown}
              className="gap-1.5"
            >
              More
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
            {moreMenuOpen && (
              <div
                role="menu"
                aria-label={`${job.title} secondary actions`}
                onKeyDown={handleMoreMenuKeyDown}
                className="absolute left-0 top-full z-50 mt-2 w-64 rounded-md border bg-popover p-1 text-popover-foreground shadow-[var(--shadow-elevated)]"
              >
                <button
                  ref={(node) => {
                    moreMenuItemRefs.current[0] = node;
                  }}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    closeMoreMenu();
                    onAnalyze();
                  }}
                  disabled={analyzing}
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {analyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {analysis ? "Re-analyze Match" : "Analyze Match"}
                </button>
                <button
                  ref={(node) => {
                    moreMenuItemRefs.current[1] = node;
                  }}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    closeMoreMenu();
                    onAtsCheck();
                  }}
                  disabled={atsAnalyzing}
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {atsAnalyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  {atsResult ? "Re-check ATS" : "ATS Check"}
                </button>
                <button
                  ref={(node) => {
                    moreMenuItemRefs.current[2] = node;
                  }}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    closeMoreMenu();
                    onCoverLetter();
                  }}
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm hover:bg-accent/10"
                >
                  <FileEdit className="h-4 w-4" />
                  Cover Letter
                </button>
                <Link
                  ref={(node) => {
                    moreMenuItemRefs.current[3] = node;
                  }}
                  href={`/jobs/research/${job.id}`}
                  role="menuitem"
                  onClick={() => closeMoreMenu()}
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm hover:bg-accent/10"
                >
                  <Info className="h-4 w-4" />
                  Company Research
                </Link>
                <div className="my-1 border-t" />
                <div className="px-3 py-2">
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Resume template
                  </label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={onSelectTemplate}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-9 w-9 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {status === "interviewing" && (
          <div className="flex flex-wrap items-center gap-2 border-t pt-3 mt-1">
            <Link
              href={`/interview?jobId=${job.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-[var(--radius)] bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Interview Prep
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
