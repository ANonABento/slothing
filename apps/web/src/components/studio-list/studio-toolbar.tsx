"use client";

/**
 * Search, filter, sort, and the list/grid switch.
 *
 * Everything here is a view preference, so nothing in it hits the network — the whole
 * summary list is already in memory.
 */
import { LayoutGrid, List, Search, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TexDocumentKind } from "@/lib/db/tex-documents";
import {
  STUDIO_SORTS,
  type StudioSort,
  type StudioView,
} from "@/lib/studio/preferences";
import { cn } from "@/lib/utils";

import { KIND_LABEL } from "./types";

export interface StudioToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  kind: TexDocumentKind | null;
  onKindChange: (kind: TexDocumentKind | null) => void;
  counts: Record<TexDocumentKind, number>;
  total: number;
  sort: StudioSort;
  onSortChange: (sort: StudioSort) => void;
  view: StudioView;
  onViewChange: (view: StudioView) => void;
  settingsOpen: boolean;
  onToggleSettings: () => void;
}

function Chip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-[12px] transition-colors",
        active
          ? "border-brand bg-brand-soft text-ink"
          : "border-rule text-ink-2 hover:border-brand hover:text-ink",
      )}
    >
      {label}
      <span className="ml-1.5 font-mono text-[10px] text-ink-3">{count}</span>
    </button>
  );
}

export function StudioToolbar({
  query,
  onQueryChange,
  kind,
  onKindChange,
  counts,
  total,
  sort,
  onSortChange,
  view,
  onViewChange,
  settingsOpen,
  onToggleSettings,
}: StudioToolbarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-3" />
          <Input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search documents"
            aria-label="Search documents"
            className="h-9 pl-9"
          />
        </div>

        <Select
          value={sort}
          onValueChange={(next) => onSortChange(next as StudioSort)}
        >
          <SelectTrigger aria-label="Sort by" className="h-9 w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STUDIO_SORTS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div
          role="group"
          aria-label="View"
          className="flex items-center rounded-md border border-rule p-0.5"
        >
          {[
            { value: "list" as const, icon: List, label: "List view" },
            { value: "grid" as const, icon: LayoutGrid, label: "Grid view" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              aria-label={option.label}
              aria-pressed={view === option.value}
              onClick={() => onViewChange(option.value)}
              className={cn(
                "rounded-sm p-1.5 transition-colors",
                view === option.value
                  ? "bg-brand-soft text-ink"
                  : "text-ink-3 hover:text-ink",
              )}
            >
              <option.icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Document settings"
          aria-expanded={settingsOpen}
          title="Settings for new documents"
          onClick={onToggleSettings}
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Chip
          active={kind === null}
          label="All"
          count={total}
          onClick={() => onKindChange(null)}
        />
        {(Object.keys(counts) as TexDocumentKind[]).map((value) => (
          <Chip
            key={value}
            active={kind === value}
            label={KIND_LABEL[value]}
            count={counts[value]}
            onClick={() => onKindChange(kind === value ? null : value)}
          />
        ))}
      </div>
    </div>
  );
}
