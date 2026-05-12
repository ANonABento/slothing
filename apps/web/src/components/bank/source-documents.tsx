"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { TimeAgo } from "@/components/format/time-ago";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileText, Loader2, Trash2 } from "lucide-react";
import type { SourceDocument } from "@/lib/db/profile-bank";
import { useErrorToast } from "@/hooks/use-error-toast";
import { cn } from "@/lib/utils";
import { THEME_INTERACTIVE_SURFACE_CLASSES } from "@/lib/theme/component-classes";
import { pluralize } from "@/lib/text/pluralize";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

interface SourceDocumentsProps {
  refreshKey: number;
  onFilterByDocument: (documentId: string | null) => void;
  activeDocumentId: string | null;
  onDelete?: () => void;
  onDocumentsChange?: (documents: SourceDocument[]) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SourceDocuments({
  refreshKey,
  onFilterByDocument,
  activeDocumentId,
  onDelete,
  onDocumentsChange,
}: SourceDocumentsProps) {
  const t = useTranslations("dialogs.bank.sourceDocuments");
  const commonT = useTranslations("common");
  const a11yT = useA11yTranslations();
  const [documents, setDocuments] = useState<SourceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<SourceDocument | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<Set<string>>(
    new Set(),
  );
  const [deleting, setDeleting] = useState(false);
  const selectAllRef = useRef<HTMLInputElement>(null);
  const showErrorToast = useErrorToast();

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/bank/documents");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const nextDocuments = data.documents || [];
      setDocuments(nextDocuments);
      onDocumentsChange?.(nextDocuments);
    } catch (error) {
      showErrorToast(error, {
        title: t("errors.loadTitle"),
        fallbackDescription: t("errors.loadDescription"),
      });
    } finally {
      setLoading(false);
    }
  }, [onDocumentsChange, showErrorToast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments, refreshKey]);

  useEffect(() => {
    const documentIds = new Set(documents.map((doc) => doc.id));
    setSelectedDocumentIds((prev) => {
      const next = new Set([...prev].filter((id) => documentIds.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [documents]);

  const selectedCount = selectedDocumentIds.size;
  const allSelected =
    documents.length > 0 && selectedCount === documents.length;
  const someSelected = selectedCount > 0 && !allSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  function toggleDocument(documentId: string) {
    setSelectedDocumentIds((prev) => {
      const next = new Set(prev);
      if (next.has(documentId)) {
        next.delete(documentId);
      } else {
        next.add(documentId);
      }
      return next;
    });
  }

  function toggleAllDocuments() {
    setSelectedDocumentIds(
      allSelected ? new Set() : new Set(documents.map((doc) => doc.id)),
    );
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/bank/documents/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      if (activeDocumentId === deleteTarget.id) {
        onFilterByDocument(null);
      }
      onDelete?.();
    } catch (err) {
      showErrorToast(err, {
        title: t("errors.deleteOneTitle"),
        fallbackDescription: t("errors.deleteOneDescription"),
      });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  async function handleBulkDelete() {
    if (selectedDocumentIds.size === 0) return;
    setDeleting(true);
    const ids = [...selectedDocumentIds];
    const idsToDelete = new Set(ids);
    try {
      const res = await fetch("/api/bank/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentIds: ids }),
      });
      if (!res.ok) throw new Error("Bulk delete failed");
      setDocuments((prev) => prev.filter((doc) => !idsToDelete.has(doc.id)));
      if (activeDocumentId && idsToDelete.has(activeDocumentId)) {
        onFilterByDocument(null);
      }
      setSelectedDocumentIds(new Set());
      onDelete?.();
    } catch (err) {
      showErrorToast(err, {
        title: t("errors.deleteManyTitle"),
        fallbackDescription: t("errors.deleteManyDescription"),
      });
    } finally {
      setDeleting(false);
      setBulkDeleteDialogOpen(false);
    }
  }

  if (loading) return null;
  if (documents.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-lg font-semibold">
          <input
            ref={selectAllRef}
            type="checkbox"
            checked={allSelected}
            onChange={toggleAllDocuments}
            className="h-4 w-4 rounded border-input accent-primary"
            aria-label={a11yT("selectAllSourceFiles")}
          />
          {t("sourceFiles")}
        </label>
        {selectedCount > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {t("selected", { count: selectedCount })}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t("actions.deleteSelected")}
            </Button>
          </div>
        )}
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={cn(
              "flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50",
              THEME_INTERACTIVE_SURFACE_CLASSES,
              activeDocumentId === doc.id ? "border-primary bg-accent/30" : "",
            )}
            onClick={() =>
              onFilterByDocument(activeDocumentId === doc.id ? null : doc.id)
            }
          >
            <input
              type="checkbox"
              checked={selectedDocumentIds.has(doc.id)}
              onChange={(e) => {
                e.stopPropagation();
                toggleDocument(doc.id);
              }}
              onClick={(e) => e.stopPropagation()}
              className="h-4 w-4 shrink-0 rounded border-input accent-primary"
              aria-label={t("actions.selectFile", { filename: doc.filename })}
            />
            <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{doc.filename}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(doc.size)} &middot;{" "}
                {pluralize(doc.chunkCount, "bullet")} &middot;{" "}
                <TimeAgo date={doc.uploadedAt} />
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(doc);
              }}
              aria-label={t("actions.deleteFile", { filename: doc.filename })}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteOne.title")}</DialogTitle>
            <DialogDescription>
              {t.rich("deleteOne.description", {
                filename: deleteTarget?.filename ?? "",
                count: deleteTarget?.chunkCount ?? 0,
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              {commonT("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {commonT("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={bulkDeleteDialogOpen}
        onOpenChange={(open) => !open && setBulkDeleteDialogOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteMany.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteMany.description", { count: selectedCount })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBulkDeleteDialogOpen(false)}
              disabled={deleting}
            >
              {commonT("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={deleting || selectedCount === 0}
            >
              {deleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t("actions.deleteSelected")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
