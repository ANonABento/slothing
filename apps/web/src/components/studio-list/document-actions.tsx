"use client";

/**
 * Per-document actions, shared by the list row and the grid card.
 *
 * Always rendered rather than revealed on hover. Hover-only affordances are invisible to
 * keyboard and touch users, and "how do I delete this" was the complaint that started
 * this work — hiding the answer behind a pointer would not have fixed it.
 */
import { Copy, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DocumentActionsProps {
  title: string;
  busy: boolean;
  onRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  className?: string;
}

export function DocumentActions({
  title,
  busy,
  onRename,
  onDuplicate,
  onDelete,
  className,
}: DocumentActionsProps) {
  // The card and row wrap the document in a link. Without this, every action click would
  // also navigate into the editor.
  const stop = (run: () => void) => (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    run();
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={busy}
        aria-label={`Rename ${title}`}
        title="Rename"
        onClick={stop(onRename)}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        disabled={busy}
        aria-label={`Duplicate ${title}`}
        title="Duplicate"
        onClick={stop(onDuplicate)}
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-ink-3 hover:text-destructive"
        disabled={busy}
        aria-label={`Delete ${title}`}
        title="Delete"
        onClick={stop(onDelete)}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
