"use client";

import { useMemo, useState } from "react";
import { Clock, Search, Trash2 } from "lucide-react";
import { TimeAgo } from "@/components/format/time-ago";
import { Button } from "@/components/ui/button";
import { VirtualList } from "@/components/ui/virtual-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ESTIMATED_CARD_HEIGHT_DRAFT } from "@/lib/constants/virtualization";
import { TEMPLATE_CONFIG } from "../_data/templates";
import type { EmailTemplateType } from "@/types";
import type { Opportunity } from "@/types/opportunity";

export interface EmailDraftForSheet {
  id: string;
  type: EmailTemplateType;
  jobId?: string;
  subject: string;
  body: string;
  context?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

interface DraftsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drafts: EmailDraftForSheet[];
  jobs: Opportunity[];
  onLoadDraft: (draft: EmailDraftForSheet) => void;
  onDeleteDraft: (draftId: string) => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

export function DraftsSheet({
  open,
  onOpenChange,
  drafts,
  jobs,
  onLoadDraft,
  onDeleteDraft,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
}: DraftsSheetProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();
  const showSearch = drafts.length > 10;

  const filteredDrafts = useMemo(() => {
    if (!normalizedQuery) return drafts;

    return drafts.filter((draft) => {
      const template = TEMPLATE_CONFIG[draft.type];
      return (
        draft.subject.toLowerCase().includes(normalizedQuery) ||
        template.title.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [drafts, normalizedQuery]);

  function getDraftKey(draft: EmailDraftForSheet): string {
    return draft.id;
  }

  function renderDraft({ item: draft }: { item: EmailDraftForSheet }) {
    const config = TEMPLATE_CONFIG[draft.type];
    const Icon = config.icon;
    const job = draft.jobId
      ? jobs.find((candidate) => candidate.id === draft.jobId)
      : null;

    return (
      <article className="border-b p-4">
        <div className="flex items-start gap-3">
          <div className={`rounded-lg bg-muted p-2 ${config.color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium">{draft.subject}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {config.title}
              {job ? ` - ${job.company}` : ""}
            </p>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <TimeAgo date={draft.updatedAt} />
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLoadDraft(draft)}
          >
            Continue
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteDraft(draft.id)}
            className="text-muted-foreground hover:text-destructive"
            aria-label={`Delete draft ${draft.subject}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </article>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-auto right-0 top-0 flex h-dvh max-h-dvh w-full max-w-md translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none p-0 sm:rounded-none">
        <DialogHeader className="border-b p-5 pr-14">
          <DialogTitle>Drafts ({drafts.length})</DialogTitle>
          <DialogDescription>
            Generated emails are saved here automatically.
          </DialogDescription>
        </DialogHeader>

        {showSearch ? (
          <div className="border-b p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search drafts"
                className="pl-9"
              />
            </div>
          </div>
        ) : null}

        <div className="min-h-0 flex-1">
          {drafts.length === 0 ? (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
              No drafts yet. Generated emails are saved here automatically.
            </div>
          ) : filteredDrafts.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No drafts match your search.
            </div>
          ) : (
            <VirtualList
              items={filteredDrafts}
              getKey={getDraftKey}
              estimateSize={ESTIMATED_CARD_HEIGHT_DRAFT}
              className="h-full min-h-0"
              renderItem={renderDraft}
            />
          )}
        </div>
        {hasMore ? (
          <div className="border-t p-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={onLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load more drafts"}
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
