"use client";

/**
 * One document as a grid card, with a real render of its first page.
 *
 * The reason the grid exists at all: a list of titles like "Resume", "Resume (copy)",
 * "Untitled resume" tells you nothing about which is which. A thumbnail does, without
 * opening anything.
 */
import { FileText, Loader2 } from "lucide-react";

import { TimeAgo } from "@/components/format/time-ago";
import { Link } from "@/i18n/navigation";

import { DocumentActions } from "./document-actions";
import { RenameField } from "./document-row";
import { useDocumentThumbnail } from "./use-document-thumbnail";
import { KIND_LABEL, type TexDocumentSummary } from "./types";

export interface DocumentCardProps {
  document: TexDocumentSummary;
  busy: boolean;
  renaming: boolean;
  onStartRename: () => void;
  onSubmitRename: (title: string) => void;
  onCancelRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function DocumentCard({
  document,
  busy,
  renaming,
  onStartRename,
  onSubmitRename,
  onCancelRename,
  onDuplicate,
  onDelete,
}: DocumentCardProps) {
  const { state, ref } = useDocumentThumbnail(
    document.id,
    document.updatedAt,
    true,
  );

  return (
    <div className="group flex flex-col overflow-hidden rounded-md border border-rule bg-paper transition-all hover:border-brand hover:shadow-paper-card">
      {/*
        The observer watches this wrapper rather than the Link. A ref on Link depends on
        that component forwarding it, which is a silent failure if it ever stops — the
        thumbnail would simply never load, with nothing to indicate why.

        US Letter is 8.5 × 11, so the well matches the page it holds and a loaded
        thumbnail never changes the card's height.
      */}
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className="relative aspect-[8.5/11] overflow-hidden border-b border-rule bg-page-2"
      >
        <Link
          href={`/studio/tex/${document.id}`}
          aria-label={`Open ${document.title}`}
          className="block h-full w-full"
        >
          {state.status === "ready" ? (
            // eslint-disable-next-line @next/next/no-img-element -- a canvas data: URL, not an asset next/image can optimise
            <img
              src={state.src}
              alt=""
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-3">
              {state.status === "loading" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FileText className="h-6 w-6" />
              )}
              {state.status === "unavailable" ? (
                // Not an error: a document that has never compiled, or a server with no
                // LaTeX engine, both land here and both still open fine.
                <span className="px-3 text-center text-[11px] leading-snug">
                  No preview yet
                </span>
              ) : null}
            </span>
          )}
        </Link>
      </div>

      {/*
        The title gets the card's FULL width, with the actions on the line below beside
        the (short) kind and time. Sharing a line with three buttons cost it ~96px, which
        truncated even "Untitled cover letter" at common widths — a card you cannot read
        the name of defeats the point of the grid.
      */}
      <div className="min-w-0 p-3">
        {renaming ? (
          <RenameField
            initial={document.title}
            onSubmit={onSubmitRename}
            onCancel={onCancelRename}
          />
        ) : (
          <Link
            href={`/studio/tex/${document.id}`}
            className="block truncate text-[13.5px] font-semibold text-ink hover:text-brand"
          >
            {document.title}
          </Link>
        )}
        <div className="mt-1 flex items-center gap-2">
          <span className="min-w-0 flex-1 truncate text-[11.5px] text-ink-3">
            {KIND_LABEL[document.kind]} · <TimeAgo date={document.updatedAt} />
          </span>
          <DocumentActions
            title={document.title}
            busy={busy}
            onRename={onStartRename}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            className="-mr-1 shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
