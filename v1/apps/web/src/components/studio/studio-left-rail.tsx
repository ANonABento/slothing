"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AlertCircle,
  Briefcase,
  FolderOpen,
  Library,
  Link2,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from "lucide-react";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";
import { useToast } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@slothing/shared";

export type LeftRailTab = "files" | "knowledge" | "jobs";

interface StudioLeftRailProps {
  activeTab: LeftRailTab;
  onTabChange: (tab: LeftRailTab) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;

  /** Files-tab content — file list + version history. */
  filesContent: ReactNode;
  filesCount: number;

  /**
   * Knowledge-tab content — bank entries + section grouping +
   * drag-reorder. This used to be a duplicated category list in
   * `KnowledgePane`; the SectionList from the Files tab now lives
   * here as the single source of truth for "what's in this doc".
   */
  knowledgeContent: ReactNode;
  knowledgeCount: number;

  linkedOpportunityId: string;
  onLinkOpportunity: (opportunity: Opportunity) => void;
}

interface OpportunitiesResponse {
  opportunities: Opportunity[];
}

export function StudioLeftRail({
  activeTab,
  onTabChange,
  collapsed = false,
  onToggleCollapsed,
  filesContent,
  filesCount,
  knowledgeContent,
  knowledgeCount,
  linkedOpportunityId,
  onLinkOpportunity,
}: StudioLeftRailProps) {
  const a11yT = useA11yTranslations();

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={200}>
        <div
          className="flex min-h-full w-12 flex-col items-center gap-1 border-r border-rule py-3"
          style={{ borderColor: "var(--rule)" }}
        >
          <CollapsedIconButton
            label={a11yT("expandFilesPanel")}
            onClick={onToggleCollapsed}
            icon={<PanelLeftOpen className="h-4 w-4" />}
          />
          <CollapsedIconButton
            label="Files"
            onClick={() => {
              onTabChange("files");
              onToggleCollapsed?.();
            }}
            icon={<FolderOpen className="h-4 w-4" />}
            active={activeTab === "files"}
          />
          <CollapsedIconButton
            label="Knowledge"
            onClick={() => {
              onTabChange("knowledge");
              onToggleCollapsed?.();
            }}
            icon={<Library className="h-4 w-4" />}
            active={activeTab === "knowledge"}
          />
          <CollapsedIconButton
            label="Jobs"
            onClick={() => {
              onTabChange("jobs");
              onToggleCollapsed?.();
            }}
            icon={<Briefcase className="h-4 w-4" />}
            active={activeTab === "jobs"}
          />
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-full flex-col">
        <div
          role="tablist"
          aria-label="Left rail tabs"
          className="flex items-center gap-0 overflow-x-hidden border-b border-rule px-1.5 py-1.5"
          style={{ borderColor: "var(--rule)" }}
        >
          <RailTab
            label="Files"
            count={filesCount}
            active={activeTab === "files"}
            onClick={() => onTabChange("files")}
          />
          <RailTab
            label="Knowledge"
            count={knowledgeCount}
            active={activeTab === "knowledge"}
            onClick={() => onTabChange("knowledge")}
          />
          <RailTab
            label="Jobs"
            active={activeTab === "jobs"}
            onClick={() => onTabChange("jobs")}
          />
          <span className="flex-1" />
          {onToggleCollapsed && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={onToggleCollapsed}
                  aria-label={a11yT("collapseFilesPanel")}
                  className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-rule-strong-bg hover:text-foreground"
                >
                  <PanelLeftClose className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Collapse</TooltipContent>
            </Tooltip>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {activeTab === "files" && filesContent}
          {activeTab === "knowledge" && knowledgeContent}
          {activeTab === "jobs" && (
            <JobsPane
              linkedOpportunityId={linkedOpportunityId}
              onLinkOpportunity={onLinkOpportunity}
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

function RailTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-sm px-1.5 text-[11px] font-medium transition-colors",
        active
          ? "bg-card text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      {typeof count === "number" && count > 0 && (
        <span
          className="ml-0.5 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-1 font-mono text-[9px] font-semibold tabular-nums"
          style={{
            backgroundColor: active
              ? "var(--brand-soft)"
              : "var(--rule-strong-bg)",
            color: active ? "var(--brand-dark)" : "var(--ink-3)",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function CollapsedIconButton({
  label,
  onClick,
  icon,
  active = false,
}: {
  label: string;
  onClick?: () => void;
  icon: ReactNode;
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          className={cn(
            "grid h-8 w-8 place-items-center rounded-sm transition-colors",
            active
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:bg-rule-strong-bg hover:text-foreground",
          )}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function JobsPane({
  linkedOpportunityId,
  onLinkOpportunity,
}: {
  linkedOpportunityId: string;
  onLinkOpportunity: (opportunity: Opportunity) => void;
}) {
  const { addToast } = useToast();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          "/api/opportunities?status=saved,applied&limit=50",
        );
        if (!response.ok) {
          throw new Error("Failed to load opportunities");
        }
        const data = (await response.json()) as OpportunitiesResponse;
        if (!cancelled) setOpportunities(data.opportunities ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load opportunities.",
          );
          setOpportunities([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return opportunities;
    return opportunities.filter((opp) => {
      return (
        opp.title.toLowerCase().includes(q) ||
        opp.company.toLowerCase().includes(q) ||
        (opp.summary ?? "").toLowerCase().includes(q)
      );
    });
  }, [opportunities, search]);

  const handlePick = useCallback(
    (opportunity: Opportunity) => {
      onLinkOpportunity(opportunity);
      addToast({
        type: "success",
        title: "Linked to opportunity",
        description: `Tailoring will use ${opportunity.title} at ${opportunity.company}.`,
      });
    },
    [addToast, onLinkOpportunity],
  );

  return (
    <div className="flex flex-col gap-2 px-3 py-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search opportunities…"
          aria-label="Search opportunities"
          className="h-8 w-full rounded-sm border border-rule bg-paper pl-8 pr-2 text-[12.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{
            backgroundColor: "var(--paper)",
            borderColor: "var(--rule)",
          }}
        />
      </div>

      {loading && (
        <div
          className="flex items-center gap-2 rounded-sm border border-rule bg-paper px-3 py-3 text-[12px]"
          style={{
            backgroundColor: "var(--paper)",
            borderColor: "var(--rule)",
            color: "var(--ink-3)",
          }}
        >
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading saved opportunities…
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-2 text-[12px] text-destructive"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div
          className="rounded-sm border border-rule bg-paper px-3 py-6 text-center text-[12px]"
          style={{
            backgroundColor: "var(--paper)",
            borderColor: "var(--rule)",
            color: "var(--ink-3)",
          }}
        >
          {opportunities.length === 0
            ? "No saved opportunities yet. Save jobs from /opportunities to tailor against them."
            : "No opportunities match your search."}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <ul className="space-y-1">
          {filtered.map((opportunity) => {
            const isLinked = linkedOpportunityId === opportunity.id;
            return (
              <li key={opportunity.id}>
                <button
                  type="button"
                  onClick={() => handlePick(opportunity)}
                  className={cn(
                    "group flex w-full flex-col items-start gap-1 rounded-sm border border-rule bg-paper px-2.5 py-2 text-left transition-colors hover:border-rule-strong",
                    isLinked && "border-brand",
                  )}
                  style={{
                    backgroundColor: "var(--paper)",
                    borderColor: isLinked ? "var(--brand)" : "var(--rule)",
                  }}
                >
                  <div className="flex w-full items-center gap-1.5">
                    <span
                      aria-hidden
                      className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-sm font-mono text-[10px] font-semibold uppercase"
                      style={{
                        backgroundColor: "var(--brand-soft)",
                        color: "var(--brand-dark)",
                      }}
                    >
                      {opportunity.company.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium leading-tight">
                      {opportunity.title}
                    </span>
                    {isLinked && (
                      <Link2
                        className="h-3 w-3 flex-shrink-0"
                        style={{ color: "var(--brand)" }}
                        aria-label="Linked"
                      />
                    )}
                  </div>
                  <p
                    className="truncate text-[11px] leading-tight"
                    style={{ color: "var(--ink-3)" }}
                  >
                    {opportunity.company}
                    {opportunity.city && ` · ${opportunity.city}`}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
