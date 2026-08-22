"use client";

/** One document as a list row: dense, scannable, with its actions in reach. */
import { FileText } from "lucide-react";

import { TimeAgo } from "@/components/format/time-ago";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/navigation";

import { DocumentActions } from "./document-actions";
import { KIND_LABEL, type TexDocumentSummary } from "./types";

export interface DocumentRowProps {
  document: TexDocumentSummary;
  busy: boolean;
  renaming: boolean;
  onStartRename: () => void;
  onSubmitRename: (title: string) => void;
  onCancelRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function DocumentRow({
  document,
  busy,
  renaming,
  onStartRename,
  onSubmitRename,
  onCancelRename,
  onDuplicate,
  onDelete,
}: DocumentRowProps) {
  const meta = (
    <span className="block text-[12px] text-ink-3">
      {KIND_LABEL[document.kind]} · edited <TimeAgo date={document.updatedAt} />
    </span>
  );

  if (renaming) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-brand bg-paper p-4">
        <FileText className="h-4 w-4 shrink-0 text-ink-3" />
        <div className="min-w-0 flex-1">
          <RenameField
            initial={document.title}
            onSubmit={onSubmitRename}
            onCancel={onCancelRename}
          />
          {meta}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-md border border-rule bg-paper pr-2 transition-all hover:border-brand hover:shadow-paper-card">
      <Link
        href={`/studio/tex/${document.id}`}
        className="flex min-w-0 flex-1 items-center gap-3 p-4"
      >
        <FileText className="h-4 w-4 shrink-0 text-ink-3" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-semibold text-ink">
            {document.title}
          </span>
          {meta}
        </span>
      </Link>
      <DocumentActions
        title={document.title}
        busy={busy}
        onRename={onStartRename}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    </div>
  );
}

/**
 * Inline rename. Enter commits, Escape reverts, blur commits — the same contract as
 * renaming a file in a file manager, which is the thing this is imitating.
 */
export function RenameField({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: string;
  onSubmit: (title: string) => void;
  onCancel: () => void;
}) {
  return (
    <Input
      autoFocus
      defaultValue={initial}
      aria-label="Document name"
      className="h-8 text-[14px] font-semibold"
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onSubmit(event.currentTarget.value);
        } else if (event.key === "Escape") {
          event.preventDefault();
          onCancel();
        }
      }}
      onBlur={(event) => onSubmit(event.currentTarget.value)}
      onFocus={(event) => event.currentTarget.select()}
    />
  );
}
