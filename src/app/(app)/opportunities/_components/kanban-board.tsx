"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DragEvent } from "react";
import { Eye, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  CLOSED_SUB_STATUSES,
  CLOSED_SUB_STATUS_BADGE_VARIANTS,
  CLOSED_SUB_STATUS_LABELS,
  DEFAULT_KANBAN_VISIBLE_LANES,
  KANBAN_LANE_GROUPS,
  KANBAN_LANE_IDS,
  KANBAN_LANE_LABELS,
  formatOpportunityDate,
  formatOpportunityLocation,
  groupOpportunitiesByLane,
  inferLaneFromStatus,
  isClosedSubStatus,
  normalizeKanbanVisibleLanes,
  type ClosedSubStatus,
  type KanbanLaneId,
  type Opportunity,
  type OpportunityStatus,
} from "../utils";

interface KanbanBoardProps {
  opportunities: Opportunity[];
  visibleLanes: readonly KanbanLaneId[];
  onStatusChange: (opportunityId: string, status: OpportunityStatus) => void;
  onShowLane: (lane: KanbanLaneId) => void;
}

interface ClosedMove {
  opportunityId: string;
  title: string;
}

export function KanbanBoard({
  opportunities,
  visibleLanes,
  onStatusChange,
  onShowLane,
}: KanbanBoardProps) {
  const normalizedVisibleLanes = normalizeKanbanVisibleLanes(visibleLanes);
  const groupedOpportunities = useMemo(
    () => groupOpportunitiesByLane(opportunities),
    [opportunities],
  );
  const [draggedOpportunityId, setDraggedOpportunityId] = useState<
    string | null
  >(null);
  const [closedMove, setClosedMove] = useState<ClosedMove | null>(null);
  const [isHiddenPanelOpen, setIsHiddenPanelOpen] = useState(false);

  const hiddenLanes = KANBAN_LANE_IDS.filter(
    (lane) => !normalizedVisibleLanes.includes(lane),
  );
  const hiddenLaneSummaries = hiddenLanes
    .map((lane) => ({
      lane,
      label: KANBAN_LANE_LABELS[lane],
      opportunities: groupedOpportunities[lane],
    }))
    .filter((summary) => summary.opportunities.length > 0);
  const hiddenOpportunityCount = hiddenLaneSummaries.reduce(
    (total, summary) => total + summary.opportunities.length,
    0,
  );

  function handleDragStart(
    event: DragEvent<HTMLElement>,
    opportunityId: string,
  ) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", opportunityId);
    setDraggedOpportunityId(opportunityId);
  }

  function handleDrop(event: DragEvent<HTMLElement>, lane: KanbanLaneId) {
    event.preventDefault();
    const opportunityId =
      event.dataTransfer.getData("text/plain") || draggedOpportunityId;
    const opportunity = opportunities.find(
      (candidate) => candidate.id === opportunityId,
    );

    setDraggedOpportunityId(null);

    if (!opportunity) return;

    const currentLane = inferLaneFromStatus(opportunity.status);
    if (currentLane === lane) return;

    if (lane === "closed") {
      setClosedMove({
        opportunityId: opportunity.id,
        title: opportunity.title,
      });
      return;
    }

    const [status] = KANBAN_LANE_GROUPS[lane];
    onStatusChange(opportunity.id, status);
  }

  function resolveClosedMove(status: ClosedSubStatus) {
    if (!closedMove) return;

    onStatusChange(closedMove.opportunityId, status);
    setClosedMove(null);
  }

  return (
    <div
      className="space-y-3"
      role="region"
      aria-label="Opportunity kanban board"
      aria-roledescription="kanban board"
    >
      <div className="overflow-x-auto pb-4" tabIndex={0}>
        <div className="flex min-w-max gap-4">
          {normalizedVisibleLanes.map((lane) => {
            const laneOpportunities = groupedOpportunities[lane];

            return (
              <section
                key={lane}
                aria-label={`${KANBAN_LANE_LABELS[lane]} opportunities`}
                className="flex min-h-[560px] w-[300px] shrink-0 flex-col rounded-lg border bg-card/70 p-3 lg:w-[320px]"
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
                onDrop={(event) => handleDrop(event, lane)}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">
                    {KANBAN_LANE_LABELS[lane]}
                  </h2>
                  <Badge variant="secondary" className="shrink-0">
                    {laneOpportunities.length}
                  </Badge>
                </div>

                <div className="flex flex-1 flex-col gap-3">
                  {laneOpportunities.length === 0 ? (
                    <div className="grid min-h-28 place-items-center rounded-lg border border-dashed bg-background/50 px-3 text-center text-sm text-muted-foreground">
                      Drop opportunities here
                    </div>
                  ) : (
                    laneOpportunities.map((opportunity) => (
                      <OpportunityKanbanCard
                        key={opportunity.id}
                        opportunity={opportunity}
                        isDragging={draggedOpportunityId === opportunity.id}
                        onDragStart={(event) =>
                          handleDragStart(event, opportunity.id)
                        }
                        onDragEnd={() => setDraggedOpportunityId(null)}
                      />
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {hiddenOpportunityCount > 0 ? (
        <div className="flex justify-end">
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsHiddenPanelOpen((open) => !open)}
              aria-expanded={isHiddenPanelOpen}
            >
              <Eye className="mr-2 h-4 w-4" />
              {hiddenOpportunityCount} in hidden lanes
            </Button>
            {isHiddenPanelOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-lg border bg-popover p-3 text-popover-foreground shadow-lg">
                <div className="space-y-3">
                  {hiddenLaneSummaries.map((summary) => (
                    <div
                      key={summary.lane}
                      className="flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium">
                          {summary.label} · {summary.opportunities.length}
                        </div>
                        <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {summary.opportunities
                            .map((opportunity) => opportunity.title)
                            .join(", ")}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onShowLane(summary.lane);
                          setIsHiddenPanelOpen(false);
                        }}
                      >
                        Show
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <ClosedSubstateDialog
        move={closedMove}
        onResolve={resolveClosedMove}
        onCancel={() => setClosedMove(null)}
      />
    </div>
  );
}

export function ClosedSubstateDialog({
  move,
  onResolve,
  onCancel,
}: {
  move: ClosedMove | null;
  onResolve: (status: ClosedSubStatus) => void;
  onCancel: () => void;
}) {
  const isOpen = Boolean(move);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && move) {
          onResolve("dismissed");
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move to Closed</DialogTitle>
          <DialogDescription>
            Pick the final state for {move?.title ?? "this opportunity"}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 sm:grid-cols-3">
          {CLOSED_SUB_STATUSES.map((status) => (
            <Button
              key={status}
              type="button"
              variant={status === "rejected" ? "destructive" : "outline"}
              onClick={() => onResolve(status)}
            >
              {CLOSED_SUB_STATUS_LABELS[status]}
            </Button>
          ))}
        </div>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function OpportunityKanbanCard({
  opportunity,
  isDragging,
  onDragStart,
  onDragEnd,
}: {
  opportunity: Opportunity;
  isDragging: boolean;
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
}) {
  const location = formatOpportunityLocation(opportunity);
  const deadline = opportunity.deadline
    ? `Due ${formatOpportunityDate(opportunity.deadline)}`
    : undefined;

  return (
    <article
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "cursor-grab rounded-lg border bg-background p-3 shadow-sm transition hover:border-primary/30 hover:shadow-md active:cursor-grabbing",
        isDragging && "opacity-50",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            href={`/opportunities/${opportunity.id}`}
            className="group inline-flex min-h-11 items-center"
          >
            <h3
              className="line-clamp-2 text-base font-semibold leading-6 group-hover:text-primary"
              title={opportunity.title}
            >
              {opportunity.title}
            </h3>
          </Link>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {opportunity.company}
          </p>
        </div>
        <GripVertical
          className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </div>

      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant={opportunity.type === "hackathon" ? "warning" : "info"}
            className="capitalize"
          >
            {opportunity.type}
          </Badge>
          <Badge variant="outline" className="max-w-full truncate">
            {location}
          </Badge>
          {isClosedSubStatus(opportunity.status) ? (
            <Badge
              variant={CLOSED_SUB_STATUS_BADGE_VARIANTS[opportunity.status]}
            >
              {CLOSED_SUB_STATUS_LABELS[opportunity.status]}
            </Badge>
          ) : null}
        </div>
        {deadline ? <div className="truncate">{deadline}</div> : null}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[...(opportunity.techStack ?? []), ...opportunity.tags]
            .slice(0, 4)
            .map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="max-w-full truncate text-[11px]"
              >
                {tag}
              </Badge>
            ))}
        </div>
      </div>
    </article>
  );
}

export const ALL_KANBAN_LANES = DEFAULT_KANBAN_VISIBLE_LANES;
