"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { Check, ExternalLink, MapPin, Settings, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StandardEmptyState } from "@/components/ui/page-layout";
import { cn } from "@/lib/utils";
import type { JobDescription } from "@/types";

import { toNullableEpoch } from "@/lib/format/time";
type QueueAction = "save" | "dismiss" | "apply";

const DESCRIPTION_PREVIEW_LENGTH = 260;
const SWIPE_DISTANCE_THRESHOLD = 110;
const SWIPE_VELOCITY_THRESHOLD = 650;

function getDeadlineTime(deadline?: string): number {
  if (!deadline) {
    return Number.POSITIVE_INFINITY;
  }

  return toNullableEpoch(deadline) ?? Number.POSITIVE_INFINITY;
}

function getCreatedAtTime(createdAt: string): number {
  return toNullableEpoch(createdAt) ?? 0;
}

export function getPendingOpportunities(
  jobs: JobDescription[],
): JobDescription[] {
  return jobs
    .filter((job) => job.status === "pending")
    .sort((a, b) => {
      const deadlineA = getDeadlineTime(a.deadline);
      const deadlineB = getDeadlineTime(b.deadline);

      if (deadlineA !== deadlineB) {
        return deadlineA - deadlineB;
      }

      return getCreatedAtTime(b.createdAt) - getCreatedAtTime(a.createdAt);
    });
}

export function getOpportunityTags(job: JobDescription, limit = 6): string[] {
  const tags = [...(job.keywords || []), ...(job.requirements || [])]
    .map((tag) => tag.trim())
    .filter(Boolean);

  return Array.from(new Set(tags)).slice(0, limit);
}

export function getDescriptionPreview(description: string): string {
  if (description.length <= DESCRIPTION_PREVIEW_LENGTH) {
    return description;
  }

  return `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trim()}...`;
}

interface OpportunityReviewQueueProps {
  jobs: JobDescription[];
  updating: boolean;
  onStatusChange: (
    job: JobDescription,
    status: JobDescription["status"],
  ) => Promise<void>;
  onApplyNow: (job: JobDescription) => Promise<void>;
}

export function OpportunityReviewQueue({
  jobs,
  updating,
  onStatusChange,
  onApplyNow,
}: OpportunityReviewQueueProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeAction, setActiveAction] = useState<QueueAction | null>(null);
  const queue = useMemo(() => getPendingOpportunities(jobs), [jobs]);
  const activeJob = queue[0];
  const remainingCount = queue.length;

  const runAction = async (action: QueueAction) => {
    if (!activeJob || updating || activeAction) {
      return;
    }

    setActiveAction(action);
    try {
      if (action === "save") {
        await onStatusChange(activeJob, "saved");
      } else if (action === "dismiss") {
        await onStatusChange(activeJob, "dismissed");
      } else if (activeJob.url) {
        await onApplyNow(activeJob);
      } else {
        return;
      }
      setExpanded(false);
    } finally {
      setActiveAction(null);
    }
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (
      info.offset.y < -SWIPE_DISTANCE_THRESHOLD ||
      info.velocity.y < -SWIPE_VELOCITY_THRESHOLD
    ) {
      void runAction("apply");
      return;
    }

    if (
      info.offset.x > SWIPE_DISTANCE_THRESHOLD ||
      info.velocity.x > SWIPE_VELOCITY_THRESHOLD
    ) {
      void runAction("save");
      return;
    }

    if (
      info.offset.x < -SWIPE_DISTANCE_THRESHOLD ||
      info.velocity.x < -SWIPE_VELOCITY_THRESHOLD
    ) {
      void runAction("dismiss");
    }
  };

  if (!activeJob) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl items-center justify-center px-5">
        <h1 className="sr-only">Review Queue</h1>
        <StandardEmptyState
          icon={Check}
          title="Queue cleared"
          description="New pending opportunities will appear here when Slothing finds roles that need review."
          className="w-full"
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild>
                <Link href="/opportunities">Open opportunities</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Review settings
                </Link>
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  const tags = getOpportunityTags(activeJob);
  const preview = expanded
    ? activeJob.description
    : getDescriptionPreview(activeJob.description);
  const canApply = Boolean(activeJob.url);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="px-5 pb-4 pt-6">
        <div className="mx-auto flex w-full max-w-md items-center justify-between">
          <div>
            <Badge variant="secondary">Pending review</Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight">
              Opportunities
            </h1>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">{remainingCount}</p>
            <p className="text-xs text-muted-foreground">remaining</p>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-28">
        <div className="relative h-[min(680px,72vh)] w-full max-w-md">
          {queue[1] && (
            <div
              className="absolute inset-x-3 top-5 h-[calc(100%-1.25rem)] rounded-lg border bg-card/50 shadow-sm"
              aria-hidden="true"
            />
          )}
          <AnimatePresence mode="popLayout">
            <motion.article
              key={activeJob.id}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.25}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x:
                  activeAction === "save"
                    ? 320
                    : activeAction === "dismiss"
                      ? -320
                      : 0,
                y: activeAction === "apply" ? -360 : 0,
                rotate:
                  activeAction === "save"
                    ? 12
                    : activeAction === "dismiss"
                      ? -12
                      : 0,
                transition: { duration: 0.22 },
              }}
              className="absolute inset-0 flex cursor-grab flex-col overflow-hidden rounded-lg border bg-card shadow-xl active:cursor-grabbing"
            >
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-primary">
                      {activeJob.company}
                    </p>
                    <h2 className="mt-2 text-3xl font-bold leading-tight">
                      {activeJob.title}
                    </h2>
                  </div>
                  {activeJob.remote && <Badge variant="info">Remote</Badge>}
                </div>

                <div className="mt-5 flex flex-wrap gap-2 text-sm text-muted-foreground">
                  {activeJob.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {activeJob.location}
                    </span>
                  )}
                  {activeJob.salary && <span>{activeJob.salary}</span>}
                  {activeJob.deadline && (
                    <span>Deadline {activeJob.deadline}</span>
                  )}
                </div>

                {tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {preview}
                  </p>
                  {activeJob.description.length >
                    DESCRIPTION_PREVIEW_LENGTH && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-3 px-0"
                      onClick={() => setExpanded((current) => !current)}
                    >
                      {expanded ? "Show less" : "Show more"}
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t bg-background/80 p-4 backdrop-blur">
                <ActionButton
                  label="Dismiss"
                  icon={<X className="h-5 w-5" />}
                  className="text-destructive"
                  disabled={updating || Boolean(activeAction)}
                  onClick={() => void runAction("dismiss")}
                />
                <ActionButton
                  label="Apply"
                  icon={<ExternalLink className="h-5 w-5" />}
                  disabled={!canApply || updating || Boolean(activeAction)}
                  onClick={() => void runAction("apply")}
                />
                <ActionButton
                  label="Save"
                  icon={<Check className="h-5 w-5" />}
                  className="text-primary"
                  disabled={updating || Boolean(activeAction)}
                  onClick={() => void runAction("save")}
                />
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  icon: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}

function ActionButton({
  label,
  icon,
  className,
  disabled,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-16 flex-col items-center justify-center gap-1 rounded-xl border bg-card text-xs font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
