"use client";

import { Filter, Search, SortAsc, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getPageWidthClassName,
  type PageWidth,
} from "@/components/ui/page-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  JobRemoteFilter,
  JobSortOption,
  JobStatusFilter,
  JobTypeFilter,
} from "@/lib/jobs/filter-jobs";
import { cn } from "@/lib/utils";
import { TRACKED_JOB_STATUSES } from "@/lib/constants/jobs";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

interface JobsToolbarProps {
  searchQuery: string;
  statusFilter: JobStatusFilter;
  typeFilter: JobTypeFilter;
  remoteFilter: JobRemoteFilter;
  sortBy: JobSortOption;
  hasActiveFilters: boolean;
  filteredCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: JobStatusFilter) => void;
  onTypeChange: (value: JobTypeFilter) => void;
  onRemoteChange: (value: JobRemoteFilter) => void;
  onSortChange: (value: JobSortOption) => void;
  onClearFilters: () => void;
  width?: PageWidth;
}

export function JobsToolbar(props: JobsToolbarProps) {
  const t = useTranslations("jobs.toolbar");
  const commonT = useTranslations("common");
  const a11yT = useA11yTranslations();
  const {
    searchQuery,
    statusFilter,
    typeFilter,
    remoteFilter,
    sortBy,
    hasActiveFilters,
    filteredCount,
    totalCount,
    onSearchChange,
    onStatusChange,
    onTypeChange,
    onRemoteChange,
    onSortChange,
    onClearFilters,
    width = "wide",
  } = props;

  return (
    <div
      className={cn("border-b px-5 py-6 sm:px-8", getPageWidthClassName(width))}
    >
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="pl-10 pr-12"
          />
          {searchQuery && (
            <button
              aria-label={a11yT("clearSearch")}
              onClick={() => onSearchChange("")}
              className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => onStatusChange(value as JobStatusFilter)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t("filters.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
              {TRACKED_JOB_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {t(`statuses.${status}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={typeFilter}
            onValueChange={(value) => onTypeChange(value as JobTypeFilter)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t("filters.type")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allTypes")}</SelectItem>
              <SelectItem value="full-time">{t("types.fullTime")}</SelectItem>
              <SelectItem value="part-time">{t("types.partTime")}</SelectItem>
              <SelectItem value="contract">{t("types.contract")}</SelectItem>
              <SelectItem value="internship">
                {t("types.internship")}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={remoteFilter}
            onValueChange={(value) => onRemoteChange(value as JobRemoteFilter)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t("filters.location")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allLocations")}</SelectItem>
              <SelectItem value="remote">{t("locations.remote")}</SelectItem>
              <SelectItem value="onsite">{t("locations.onsite")}</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as JobSortOption)}
          >
            <SelectTrigger className="w-32">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("sort.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("sort.newest")}</SelectItem>
              <SelectItem value="oldest">{t("sort.oldest")}</SelectItem>
              <SelectItem value="company">{t("sort.company")}</SelectItem>
              <SelectItem value="title">{t("sort.title")}</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              {commonT("clear")}
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>{t("showing", { filteredCount, totalCount })}</span>
        </div>
      )}
    </div>
  );
}
