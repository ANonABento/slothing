"use client";

import { nowIso } from "@/lib/format/time";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Briefcase,
  CalendarClock,
  DollarSign,
  ExternalLink,
  FileDown,
  Filter,
  LayoutGrid,
  List,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";
import { ImportJobDialog } from "@/components/jobs/import-job-dialog";
import { AddOpportunityWizard } from "@/components/opportunities/add-opportunity-wizard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AppPage,
  PageContent,
  PageHeader,
  PagePanel,
  StandardEmptyState,
} from "@/components/ui/page-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SkeletonButton,
  SkeletonJobCard,
  SkeletonKanbanLane,
} from "@/components/ui/skeleton";
import { VirtualList } from "@/components/ui/virtual-list";
import { showAchievementToasts } from "@/components/streak/achievement-toast";
import { useToast } from "@/components/ui/toast";
import { useErrorToast } from "@/hooks/use-error-toast";
import { ESTIMATED_CARD_HEIGHT_OPPORTUNITY_ROW } from "@/lib/constants/virtualization";
import { readJsonResponse } from "@/lib/http";
import { extractUnlockedFromResponse } from "@/lib/streak/client";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import {
  DEFAULT_KANBAN_VISIBLE_LANES,
  DEFAULT_OPPORTUNITY_FILTERS,
  OPPORTUNITY_KANBAN_COLUMNS,
  OPPORTUNITY_SORT_OPTIONS,
  OPPORTUNITY_SOURCE_OPTIONS,
  OPPORTUNITY_STATUS_OPTIONS,
  OPPORTUNITY_TYPE_TAB_OPTIONS,
  REMOTE_TYPE_OPTIONS,
  SAMPLE_OPPORTUNITIES,
  countActiveOpportunityFilters,
  filterOpportunities,
  formatOpportunityDate,
  formatOpportunityLocation,
  formatOpportunitySalary,
  getOpportunitiesViewStorage,
  getOpportunityFiltersFromStatusSearchParam,
  getOpportunityFilterOptions,
  hasActiveOpportunityFilters,
  normalizeKanbanVisibleLanes,
  parseOpportunityStatusSearchParam,
  readOpportunityViewMode,
  writeOpportunityViewMode,
  type KanbanLaneId,
  type Opportunity,
  type OpportunityFilters,
  type OpportunityStatus,
  type OpportunityViewMode,
} from "./utils";
import type { SettingsResponse } from "@/types/api";
import { OpportunitiesEmptyHero } from "./_components/empty-hero";
import { KanbanBoard } from "./_components/kanban-board";
import { SegmentedToggle } from "./_components/segmented-toggle";

const STORAGE_KEY = "taida-opportunities";
const FILTERS_OPEN_STORAGE_KEY = "taida:opportunities:filters-open";

interface OpportunitiesResponse {
  opportunities?: Opportunity[];
  nextCursor?: string | null;
  hasMore?: boolean;
}

interface UpdateOpportunityResponse {
  opportunity?: Opportunity;
  unlocked?: unknown[];
}

export default function OpportunitiesPage({
  searchParams = {},
}: {
  searchParams?: { status?: string | string[] };
}) {
  const t = useTranslations("opportunities");
  const commonT = useTranslations("common");
  const statusSearchParam = Array.isArray(searchParams.status)
    ? searchParams.status.join(",")
    : searchParams.status;
  const opportunityStatusQuery = useMemo(() => {
    if (!statusSearchParam) return "";
    const params = new URLSearchParams();
    params.set("status", statusSearchParam);
    return params.toString();
  }, [statusSearchParam]);
  const urlStatusFilters = useMemo(
    () => parseOpportunityStatusSearchParam(statusSearchParam),
    [statusSearchParam],
  );
  const [opportunities, setOpportunities] =
    useState<Opportunity[]>(SAMPLE_OPPORTUNITIES);
  const [filters, setFilters] = useState<OpportunityFilters>(() =>
    getOpportunityFiltersFromStatusSearchParam(statusSearchParam),
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [viewMode, setViewMode] = useState<OpportunityViewMode>("list");
  const [visibleKanbanLanes, setVisibleKanbanLanes] = useState<KanbanLaneId[]>([
    ...DEFAULT_KANBAN_VISIBLE_LANES,
  ]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [hasLoadedFiltersPreference, setHasLoadedFiltersPreference] =
    useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMoreOpportunities, setHasMoreOpportunities] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasCachedData, setHasCachedData] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.localStorage.getItem(STORAGE_KEY));
  });
  const showErrorToast = useErrorToast();
  const { addToast } = useToast();

  const fetchOpportunities = useCallback(async () => {
    try {
      const response = await fetch(
        opportunityStatusQuery
          ? `/api/opportunities?${opportunityStatusQuery}`
          : "/api/opportunities",
      );
      const data = await readJsonResponse<OpportunitiesResponse>(
        response,
        "Failed to load opportunities",
      );
      if (data.opportunities) {
        setOpportunities(data.opportunities);
        setNextCursor(data.nextCursor ?? null);
        setHasMoreOpportunities(Boolean(data.hasMore));
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(data.opportunities),
        );
      }
    } catch (error) {
      showErrorToast(error, {
        title: "Could not load opportunities",
        fallbackDescription: "Showing locally saved opportunities instead.",
      });
    } finally {
      setHasFetched(true);
    }
  }, [opportunityStatusQuery, showErrorToast]);

  const loadMoreOpportunities = useCallback(async () => {
    if (!nextCursor) return;

    setIsLoadingMore(true);
    try {
      const response = await fetch(
        `/api/opportunities?${new URLSearchParams({
          ...(statusSearchParam ? { status: statusSearchParam } : {}),
          cursor: nextCursor,
        }).toString()}`,
      );
      const data = await readJsonResponse<OpportunitiesResponse>(
        response,
        "Failed to load more opportunities",
      );
      setOpportunities((current) => [
        ...current,
        ...(data.opportunities ?? []),
      ]);
      setNextCursor(data.nextCursor ?? null);
      setHasMoreOpportunities(Boolean(data.hasMore));
    } catch (error) {
      showErrorToast(error, {
        title: "Could not load more opportunities",
        fallbackDescription: "Please try again.",
      });
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextCursor, showErrorToast, statusSearchParam]);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Opportunity[];
      if (Array.isArray(parsed)) {
        setOpportunities(parsed);
        setHasCachedData(true);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      setHasCachedData(false);
    }
  }, []);

  useEffect(() => {
    setViewMode(readOpportunityViewMode(getOpportunitiesViewStorage()));
    void fetchOpportunities();
  }, [fetchOpportunities]);

  useEffect(() => {
    setFilters(getOpportunityFiltersFromStatusSearchParam(statusSearchParam));
  }, [statusSearchParam]);

  useEffect(() => {
    async function fetchKanbanSettings() {
      try {
        const response = await fetch("/api/settings");
        const data = await readJsonResponse<SettingsResponse>(
          response,
          "Failed to load kanban lane settings",
        );
        setVisibleKanbanLanes(
          normalizeKanbanVisibleLanes(data.kanbanVisibleLanes ?? null),
        );
      } catch (error) {
        showErrorToast(error, {
          title: "Could not load kanban lane settings",
          fallbackDescription: "Showing the default pipeline lanes.",
        });
      }
    }

    void fetchKanbanSettings();
  }, [showErrorToast]);

  useEffect(() => {
    setIsFiltersOpen(readFiltersOpenPreference());
    setHasLoadedFiltersPreference(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedFiltersPreference) return;
    writeFiltersOpenPreference(isFiltersOpen);
  }, [hasLoadedFiltersPreference, isFiltersOpen]);

  const filteredOpportunities = useMemo(
    () => filterOpportunities(opportunities, filters, urlStatusFilters),
    [opportunities, filters, urlStatusFilters],
  );

  const filterOptions = useMemo(
    () => getOpportunityFilterOptions(opportunities),
    [opportunities],
  );

  const counts = useMemo(
    () => ({
      all: opportunities.length,
      job: opportunities.filter((opportunity) => opportunity.type === "job")
        .length,
      hackathon: opportunities.filter(
        (opportunity) => opportunity.type === "hackathon",
      ).length,
      pending: opportunities.filter(
        (opportunity) => opportunity.status === "pending",
      ).length,
    }),
    [opportunities],
  );

  const hasActiveFilters = hasActiveOpportunityFilters(filters);
  const activeFilterCount = countActiveOpportunityFilters(filters);

  function updateFilter<T extends keyof OpportunityFilters>(
    key: T,
    value: OpportunityFilters[T],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function clearFilters() {
    setFilters(DEFAULT_OPPORTUNITY_FILTERS);
  }

  function handleViewModeChange(mode: OpportunityViewMode) {
    setViewMode(mode);
    writeOpportunityViewMode(getOpportunitiesViewStorage(), mode);
  }

  function saveOpportunities(nextOpportunities: Opportunity[]) {
    setOpportunities(nextOpportunities);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOpportunities));
  }

  async function handleStatusChange(
    opportunityId: string,
    status: OpportunityStatus,
  ) {
    const previousOpportunity = opportunities.find(
      (opportunity) => opportunity.id === opportunityId,
    );
    const nextOpportunities = opportunities.map((opportunity) =>
      opportunity.id === opportunityId
        ? { ...opportunity, status, updatedAt: nowIso() }
        : opportunity,
    );

    saveOpportunities(nextOpportunities);

    try {
      const response = await fetch(
        `/api/opportunities/${encodeURIComponent(opportunityId)}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      const data = await readJsonResponse<UpdateOpportunityResponse>(
        response,
        "Failed to update opportunity status",
      );

      if (data.opportunity) {
        saveOpportunities(
          nextOpportunities.map((opportunity) =>
            opportunity.id === opportunityId ? data.opportunity! : opportunity,
          ),
        );
      }
      showAchievementToasts(extractUnlockedFromResponse(data), addToast);
    } catch (error) {
      if (previousOpportunity) {
        setOpportunities((current) => {
          const rolledBackOpportunities = current.map((opportunity) =>
            opportunity.id === opportunityId && opportunity.status === status
              ? previousOpportunity
              : opportunity,
          );
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(rolledBackOpportunities),
          );
          return rolledBackOpportunities;
        });
      }
      showErrorToast(error, {
        title: "Could not update opportunity",
        fallbackDescription: "The status change was not saved.",
      });
    }
  }

  async function handleShowKanbanLane(lane: KanbanLaneId) {
    const previousVisibleLanes = visibleKanbanLanes;
    const nextVisibleLanes = normalizeKanbanVisibleLanes([
      ...visibleKanbanLanes,
      lane,
    ]);

    setVisibleKanbanLanes(nextVisibleLanes);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kanbanVisibleLanes: nextVisibleLanes }),
      });
      await readJsonResponse<unknown>(
        response,
        "Failed to save kanban lane settings",
      );
    } catch (error) {
      setVisibleKanbanLanes(previousVisibleLanes);
      showErrorToast(error, {
        title: "Could not update kanban lanes",
        fallbackDescription: "The lane visibility change was not saved.",
      });
    }
  }

  function getOpportunityKey(opportunity: Opportunity): string {
    return opportunity.id;
  }

  function renderOpportunityRow({ item: opportunity }: { item: Opportunity }) {
    function updateRowStatus(status: OpportunityStatus) {
      void handleStatusChange(opportunity.id, status);
    }

    return (
      <OpportunityRow
        opportunity={opportunity}
        onStatusChange={updateRowStatus}
      />
    );
  }

  return (
    <AppPage>
      <PageHeader
        icon={Sparkles}
        title={t("title")}
        description={t("description")}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SegmentedToggle
              ariaLabel={t("viewMode")}
              options={[
                { value: "list", label: t("list"), icon: List },
                { value: "kanban", label: t("kanban"), icon: LayoutGrid },
              ]}
              value={viewMode}
              onChange={handleViewModeChange}
            />
            {viewMode === "list" ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFiltersOpen((open) => !open)}
                aria-expanded={isFiltersOpen}
                aria-controls="opportunities-filters-panel"
              >
                <Filter className="mr-2 h-4 w-4" />
                {commonT("filters")}
                {hasActiveFilters ? (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 px-1.5 text-[11px]"
                  >
                    {activeFilterCount}
                  </Badge>
                ) : null}
              </Button>
            ) : null}
            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
              <FileDown className="mr-2 h-4 w-4" />
              {commonT("import")}
            </Button>
            <Button variant="gradient" onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t("addOpportunity")}
            </Button>
          </div>
        }
      />

      <PageContent className="space-y-6">
        {opportunities.length === 0 ? (
          <OpportunitiesEmptyHero
            onAdd={() => setIsFormOpen(true)}
            onImport={() => setIsImportOpen(true)}
          />
        ) : (
          <div
            className={cn(
              "grid gap-6",
              viewMode === "list" &&
                isFiltersOpen &&
                "lg:grid-cols-[280px_1fr]",
            )}
          >
            {viewMode === "list" && isFiltersOpen ? (
              <div id="opportunities-filters-panel">
                <PagePanel as="aside">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Filter className="h-4 w-4" />
                      {t("filters.panel")}
                    </div>
                    {hasActiveFilters ? (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="mr-2 h-4 w-4" />
                        {commonT("clear")}
                      </Button>
                    ) : null}
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="opportunity-type">
                        {t("filters.type")}
                      </Label>
                      <Select
                        value={filters.typeTab}
                        onValueChange={(value) =>
                          updateFilter(
                            "typeTab",
                            value as OpportunityFilters["typeTab"],
                          )
                        }
                      >
                        <SelectTrigger id="opportunity-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {OPPORTUNITY_TYPE_TAB_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {translateOpportunityOption(t, option.label)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="opportunity-status">
                        {t("filters.status")}
                      </Label>
                      <Select
                        value={filters.status}
                        onValueChange={(value) =>
                          updateFilter(
                            "status",
                            value as OpportunityFilters["status"],
                          )
                        }
                      >
                        <SelectTrigger id="opportunity-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {OPPORTUNITY_STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {translateOpportunityOption(t, option.label)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="opportunity-source">
                        {t("filters.source")}
                      </Label>
                      <Select
                        value={filters.source}
                        onValueChange={(value) =>
                          updateFilter(
                            "source",
                            value as OpportunityFilters["source"],
                          )
                        }
                      >
                        <SelectTrigger id="opportunity-source">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {OPPORTUNITY_SOURCE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {translateOpportunityOption(t, option.label)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="opportunity-tag">
                        {t("filters.tags")}
                      </Label>
                      <Select
                        value={filters.tag}
                        onValueChange={(value) => updateFilter("tag", value)}
                      >
                        <SelectTrigger id="opportunity-tag">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {t("filters.allTags")}
                          </SelectItem>
                          {filterOptions.tags.map((tag) => (
                            <SelectItem key={tag} value={tag}>
                              {tag}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="opportunity-remote">
                        {t("filters.remote")}
                      </Label>
                      <Select
                        value={filters.remoteType}
                        onValueChange={(value) =>
                          updateFilter(
                            "remoteType",
                            value as OpportunityFilters["remoteType"],
                          )
                        }
                      >
                        <SelectTrigger id="opportunity-remote">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {REMOTE_TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {translateOpportunityOption(t, option.label)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="opportunity-tech">
                        {t("filters.tech")}
                      </Label>
                      <Select
                        value={filters.techStack}
                        onValueChange={(value) =>
                          updateFilter("techStack", value)
                        }
                      >
                        <SelectTrigger id="opportunity-tech">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {t("filters.anyStack")}
                          </SelectItem>
                          {filterOptions.techStacks.map((tech) => (
                            <SelectItem key={tech} value={tech}>
                              {tech}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PagePanel>
              </div>
            ) : null}

            <section aria-label={t("title")} className="min-w-0">
              {hasActiveFilters ? (
                <ActiveFiltersChips
                  filters={filters}
                  onClear={clearFilters}
                  onRemove={updateFilter}
                  t={t}
                  commonT={commonT}
                />
              ) : null}

              <Suspense fallback={<OpportunitiesFiltersSkeleton />}>
                <div
                  className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
                  data-testid="opportunities-filters"
                >
                  <div className="inline-flex w-full rounded-lg border bg-card p-1 sm:w-auto">
                    {OPPORTUNITY_TYPE_TAB_OPTIONS.map((tab) => (
                      <button
                        key={tab.value}
                        type="button"
                        onClick={() => updateFilter("typeTab", tab.value)}
                        className={cn(
                          "min-h-11 flex-1 rounded-md px-4 text-sm font-medium transition-colors sm:flex-none",
                          filters.typeTab === tab.value
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {translateOpportunityOption(t, tab.label)}
                      </button>
                    ))}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_200px] xl:w-[560px]">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={filters.searchQuery}
                        onChange={(event) =>
                          updateFilter("searchQuery", event.target.value)
                        }
                        placeholder={t("filters.searchPlaceholder")}
                        className="pl-9"
                        aria-label={t("filters.searchAria")}
                      />
                    </div>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) =>
                        updateFilter(
                          "sortBy",
                          value as OpportunityFilters["sortBy"],
                        )
                      }
                    >
                      <SelectTrigger aria-label={t("filters.sortAria")}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OPPORTUNITY_SORT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {t("filters.sortBy", {
                              label: translateOpportunityOption(
                                t,
                                option.label,
                              ),
                            })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Suspense>

              <div className="mb-4 text-sm text-muted-foreground">
                {t("summary", {
                  shown: filteredOpportunities.length,
                  total: opportunities.length,
                })}
                <span className="mx-2 text-muted-foreground/50">·</span>
                {t("counts.jobs", { count: counts.job })}
                <span className="mx-2 text-muted-foreground/50">·</span>
                {t("counts.hackathons", { count: counts.hackathon })}
                <span className="mx-2 text-muted-foreground/50">·</span>
                {t("counts.pending", { count: counts.pending })}
              </div>

              <Suspense fallback={<OpportunitiesKanbanSettingsSkeleton />}>
                <div data-testid="opportunities-kanban-settings" />
              </Suspense>

              <Suspense
                fallback={
                  viewMode === "kanban" ? (
                    <OpportunitiesKanbanBodySkeleton />
                  ) : (
                    <OpportunitiesListBodySkeleton />
                  )
                }
              >
                {!hasFetched && !hasCachedData ? (
                  viewMode === "kanban" ? (
                    <OpportunitiesKanbanBodySkeleton />
                  ) : (
                    <OpportunitiesListBodySkeleton />
                  )
                ) : filteredOpportunities.length === 0 ? (
                  <StandardEmptyState
                    icon={Briefcase}
                    title={t("empty.noMatchesTitle")}
                    description={t("empty.noMatchesDescription")}
                    action={
                      <Button variant="outline" onClick={clearFilters}>
                        {t("empty.clearFilters")}
                      </Button>
                    }
                  />
                ) : viewMode === "kanban" ? (
                  <div data-testid="opportunities-list">
                    <KanbanBoard
                      opportunities={filteredOpportunities}
                      visibleLanes={visibleKanbanLanes}
                      onStatusChange={(opportunityId, status) =>
                        void handleStatusChange(opportunityId, status)
                      }
                      onShowLane={(lane) => void handleShowKanbanLane(lane)}
                    />
                  </div>
                ) : (
                  <div data-testid="opportunities-list" className="space-y-4">
                    <VirtualList
                      items={filteredOpportunities}
                      getKey={getOpportunityKey}
                      estimateSize={ESTIMATED_CARD_HEIGHT_OPPORTUNITY_ROW}
                      className="max-h-[calc(100vh-22rem)]"
                      itemClassName="pb-4"
                      renderItem={renderOpportunityRow}
                    />
                    {hasMoreOpportunities ? (
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          onClick={() => void loadMoreOpportunities()}
                          disabled={isLoadingMore}
                        >
                          {isLoadingMore
                            ? "Loading..."
                            : "Load more opportunities"}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                )}
              </Suspense>
            </section>
          </div>
        )}
      </PageContent>

      <AddOpportunityWizard
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSaved={fetchOpportunities}
      />

      <ImportJobDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onJobImported={fetchOpportunities}
      />
    </AppPage>
  );
}

function OpportunitiesFiltersSkeleton() {
  return (
    <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonButton key={index} className="h-11 w-24" />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_200px] xl:w-[560px]">
        <SkeletonButton className="h-10 w-full" />
        <SkeletonButton className="h-10 w-full" />
      </div>
    </div>
  );
}

function OpportunitiesKanbanSettingsSkeleton() {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonButton key={index} className="h-9 w-28" />
      ))}
    </div>
  );
}

function OpportunitiesListBodySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonJobCard key={index} />
      ))}
    </div>
  );
}

function OpportunitiesKanbanBodySkeleton() {
  return (
    <div className="grid gap-3 lg:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonKanbanLane key={index} cards={index === 0 ? 3 : 1} />
      ))}
    </div>
  );
}

function readFiltersOpenPreference(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(FILTERS_OPEN_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeFiltersOpenPreference(isOpen: boolean): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(FILTERS_OPEN_STORAGE_KEY, String(isOpen));
  } catch {
    // Keep the in-memory panel state when localStorage writes are unavailable.
  }
}

function ActiveFiltersChips({
  filters,
  onClear,
  onRemove,
  t,
  commonT,
}: {
  filters: OpportunityFilters;
  onClear: () => void;
  onRemove: <K extends keyof OpportunityFilters>(
    key: K,
    value: OpportunityFilters[K],
  ) => void;
  t: (key: string, values?: Record<string, string>) => string;
  commonT: (key: string) => string;
}) {
  const chips = [
    filters.searchQuery.trim()
      ? {
          key: "search",
          label: t("filters.activeSearch", {
            value: filters.searchQuery.trim(),
          }),
          onRemove: () => onRemove("searchQuery", ""),
        }
      : null,
    filters.typeTab !== DEFAULT_OPPORTUNITY_FILTERS.typeTab
      ? {
          key: "type",
          label: t("filters.activeType", {
            value: translateOpportunityOption(
              t,
              getOptionLabel(OPPORTUNITY_TYPE_TAB_OPTIONS, filters.typeTab),
            ),
          }),
          onRemove: () =>
            onRemove("typeTab", DEFAULT_OPPORTUNITY_FILTERS.typeTab),
        }
      : null,
    filters.status !== DEFAULT_OPPORTUNITY_FILTERS.status
      ? {
          key: "status",
          label: t("filters.activeStatus", {
            value: translateOpportunityOption(
              t,
              getOptionLabel(OPPORTUNITY_STATUS_OPTIONS, filters.status),
            ),
          }),
          onRemove: () =>
            onRemove("status", DEFAULT_OPPORTUNITY_FILTERS.status),
        }
      : null,
    filters.source !== DEFAULT_OPPORTUNITY_FILTERS.source
      ? {
          key: "source",
          label: t("filters.activeSource", {
            value: translateOpportunityOption(
              t,
              getOptionLabel(OPPORTUNITY_SOURCE_OPTIONS, filters.source),
            ),
          }),
          onRemove: () =>
            onRemove("source", DEFAULT_OPPORTUNITY_FILTERS.source),
        }
      : null,
    filters.remoteType !== DEFAULT_OPPORTUNITY_FILTERS.remoteType
      ? {
          key: "remoteType",
          label: t("filters.activeRemote", {
            value: translateOpportunityOption(
              t,
              getOptionLabel(REMOTE_TYPE_OPTIONS, filters.remoteType),
            ),
          }),
          onRemove: () =>
            onRemove("remoteType", DEFAULT_OPPORTUNITY_FILTERS.remoteType),
        }
      : null,
    filters.tag !== DEFAULT_OPPORTUNITY_FILTERS.tag
      ? {
          key: "tag",
          label: t("filters.activeTag", { value: filters.tag }),
          onRemove: () => onRemove("tag", DEFAULT_OPPORTUNITY_FILTERS.tag),
        }
      : null,
    filters.techStack !== DEFAULT_OPPORTUNITY_FILTERS.techStack
      ? {
          key: "techStack",
          label: t("filters.activeTech", { value: filters.techStack }),
          onRemove: () =>
            onRemove("techStack", DEFAULT_OPPORTUNITY_FILTERS.techStack),
        }
      : null,
  ].filter(
    (chip): chip is { key: string; label: string; onRemove: () => void } =>
      Boolean(chip),
  );

  if (chips.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Badge
          key={chip.key}
          variant="secondary"
          className="gap-1.5 pr-1 text-sm"
        >
          {chip.label}
          <button
            type="button"
            className="inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            onClick={chip.onRemove}
            aria-label={t("filters.remove", { label: chip.label })}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" onClick={onClear}>
        {commonT("clearAll")}
      </Button>
    </div>
  );
}

function getOptionLabel<T extends string>(
  options: ReadonlyArray<{ value: T; label: string }>,
  value: T,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

function translateOpportunityOption(
  t: (key: string) => string,
  label: string,
): string {
  const keyByLabel: Record<string, string> = {
    Roles: "tabs.job",
    Hackathons: "tabs.hackathon",
    All: "tabs.all",
    "All statuses": "status.all",
    Pending: "status.pending",
    Saved: "status.saved",
    Applied: "status.applied",
    Interviewing: "status.interviewing",
    Offer: "status.offer",
    Rejected: "status.rejected",
    Expired: "status.expired",
    Dismissed: "status.dismissed",
    Job: "types.job",
    Hackathon: "types.hackathon",
    "All sources": "sources.all",
    WaterlooWorks: "sources.waterlooworks",
    LinkedIn: "sources.linkedin",
    Indeed: "sources.indeed",
    Greenhouse: "sources.greenhouse",
    Lever: "sources.lever",
    Devpost: "sources.devpost",
    Manual: "sources.manual",
    URL: "sources.url",
    "Any remote type": "remote.all",
    Remote: "remote.remote",
    Hybrid: "remote.hybrid",
    Onsite: "remote.onsite",
    Deadline: "sort.deadline",
    "Date scraped": "sort.scrapedAt",
    Company: "sort.company",
    Salary: "sort.salary",
  };

  const key = keyByLabel[label];
  return key ? t(key) : label;
}

function OpportunityRow({
  opportunity,
  onStatusChange,
}: {
  opportunity: Opportunity;
  onStatusChange: (status: OpportunityStatus) => void;
}) {
  const isHackathon = opportunity.type === "hackathon";

  return (
    <PagePanel as="article" className="p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={isHackathon ? "warning" : "info"}
              className="capitalize"
            >
              {isHackathon ? "Hackathon" : "Job"}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {opportunity.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {opportunity.source}
            </span>
          </div>

          <div>
            <Link
              href={`/opportunities/${opportunity.id}`}
              className="group inline-flex min-h-11 items-center"
            >
              <h2 className="break-words text-xl font-semibold tracking-normal text-foreground group-hover:text-primary">
                {opportunity.title}
              </h2>
            </Link>
            <div className="mt-1 text-sm font-medium text-muted-foreground">
              {opportunity.company}
            </div>
          </div>

          <p className="max-w-prose text-sm leading-6 text-muted-foreground">
            {opportunity.summary}
          </p>

          <div className="flex flex-wrap gap-2">
            {(opportunity.techStack ?? []).slice(0, 5).map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
            {opportunity.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid shrink-0 gap-3 text-sm text-muted-foreground sm:grid-cols-2 xl:w-80 xl:grid-cols-1">
          <Meta icon={MapPin} value={formatOpportunityLocation(opportunity)} />
          <Meta
            icon={CalendarClock}
            value={
              opportunity.deadline
                ? `Due ${formatOpportunityDate(opportunity.deadline)}`
                : "No deadline"
            }
          />
          <Meta
            icon={DollarSign}
            value={formatOpportunitySalary(opportunity)}
          />
          <Select
            value={opportunity.status}
            onValueChange={(value) =>
              onStatusChange(value as OpportunityStatus)
            }
          >
            <SelectTrigger
              aria-label={`Update status for ${opportunity.title}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPPORTUNITY_KANBAN_COLUMNS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isHackathon && opportunity.teamSize && (
            <Meta
              icon={Trophy}
              value={`Team ${opportunity.teamSize.min}-${opportunity.teamSize.max}`}
            />
          )}
          {opportunity.sourceUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={opportunity.sourceUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open source
              </a>
            </Button>
          )}
        </div>
      </div>
    </PagePanel>
  );
}

function Meta({ icon: Icon, value }: { icon: LucideIcon; value: string }) {
  return (
    <div className="flex min-h-9 items-center gap-2 rounded-md bg-muted/60 px-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <span className="min-w-0 break-words">{value}</span>
    </div>
  );
}
