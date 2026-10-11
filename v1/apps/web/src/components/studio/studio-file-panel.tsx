"use client";

import { useCallback, useState } from "react";
import {
  FileText,
  History,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import type { StudioDocument } from "./studio-documents";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

interface StudioFilePanelProps {
  documents: StudioDocument[];
  activeDocumentId: string;
  onCreate: () => void;
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export function StudioFilePanel({
  documents,
  activeDocumentId,
  onCreate,
  onSelect,
  onRename,
  onDelete,
  collapsed = false,
  onToggleCollapsed,
}: StudioFilePanelProps) {
  const a11yT = useA11yTranslations();

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const { confirm, dialog: confirmDialog } = useConfirmDialog();

  const startRename = useCallback((document: StudioDocument) => {
    setRenamingId(document.id);
    setDraftName(document.name);
  }, []);

  const finishRename = useCallback(() => {
    if (renamingId) {
      onRename(renamingId, draftName);
    }
    setRenamingId(null);
    setDraftName("");
  }, [draftName, onRename, renamingId]);

  const handleDelete = useCallback(
    async (documentId: string) => {
      const confirmed = await confirm({
        title: "Delete this studio file?",
        description:
          "This permanently removes the local studio file and any unsaved changes in it.",
        confirmLabel: "Delete",
      });
      if (confirmed) {
        onDelete(documentId);
      }
    },
    [confirm, onDelete],
  );

  const expandPanel = useCallback(() => {
    if (collapsed) onToggleCollapsed?.();
  }, [collapsed, onToggleCollapsed]);

  const handleCollapsedCreate = useCallback(() => {
    expandPanel();
    onCreate();
  }, [expandPanel, onCreate]);

  if (collapsed) {
    return (
      <div className="flex min-h-full w-12 flex-col items-center gap-2 border-b-[length:var(--border-width)] py-3 transition-[width] duration-200">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleCollapsed}
          aria-label={a11yT("expandFilesPanel")}
        >
          <PanelLeftOpen className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={expandPanel}
          aria-label={a11yT("showFiles")}
        >
          <FileText className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleCollapsedCreate}
          aria-label={a11yT("newStudioFile")}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={expandPanel}
          aria-label={a11yT("showVersionHistory")}
        >
          <History className="h-4 w-4" />
        </Button>
        {confirmDialog}
      </div>
    );
  }

  return (
    <div className="border-b-[length:var(--border-width)] transition-[width] duration-200">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="font-display text-sm font-semibold tracking-tight">
          Files
        </h2>
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="outline" onClick={onCreate}>
            <Plus className="h-4 w-4 md:mr-1.5" />
            <span className="hidden md:inline">New</span>
          </Button>
          {onToggleCollapsed && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onToggleCollapsed}
              aria-label={a11yT("collapseFilesPanel")}
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-1 px-2 pb-3">
        {documents.map((document) => {
          const isActive = document.id === activeDocumentId;
          const isRenaming = document.id === renamingId;

          return (
            <div
              key={document.id}
              className={cn(
                "group flex min-h-10 items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <FileText className="h-4 w-4 shrink-0" />
              {isRenaming ? (
                <input
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  onBlur={finishRename}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") finishRename();
                    if (event.key === "Escape") {
                      setRenamingId(null);
                      setDraftName("");
                    }
                  }}
                  className="min-w-0 flex-1 rounded-md border-[length:var(--border-width)] bg-background px-2 py-1 text-sm text-foreground"
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  onClick={() => onSelect(document.id)}
                  onDoubleClick={() => startRename(document)}
                  className="min-w-0 flex-1 truncate text-left"
                  title={document.name}
                >
                  {document.name}
                </button>
              )}
              <button
                type="button"
                onClick={() => void handleDelete(document.id)}
                className="rounded-md p-1 text-muted-foreground opacity-70 transition hover:bg-destructive/10 hover:text-destructive md:opacity-0 md:group-hover:opacity-100"
                aria-label={`Delete ${document.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
      {confirmDialog}
    </div>
  );
}
