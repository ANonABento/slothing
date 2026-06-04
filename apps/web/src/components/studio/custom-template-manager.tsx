"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { clearCustomTemplateCache } from "@/lib/templates/use-custom-templates";

/**
 * Manage saved (imported) résumé templates — list, rename, delete, select. Importing
 * a new template lives in `ImportResumeDialog`; this dialog is purely management over
 * the collapsed `document_templates` store via /api/templates (spec §12). Replaces the
 * former 4.8k-line V2/V3/V4 draft-review manager.
 */

interface CustomTemplateItem {
  id: string;
  name: string;
  description?: string;
  type: "built-in" | "custom";
  sourceFilename?: string | null;
  sourceType?: string | null;
}

interface CustomTemplateManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplatesChanged: () => void | Promise<void>;
  /** Retained for API compatibility; import now happens in ImportResumeDialog. */
  onTemplateImported?: (templateId: string) => void | Promise<void>;
  onTemplateSelected?: (templateId: string) => void | Promise<void>;
}

export function CustomTemplateManagerDialog({
  open,
  onOpenChange,
  onTemplatesChanged,
  onTemplateSelected,
}: CustomTemplateManagerProps) {
  const { addToast } = useToast();
  const { confirm, dialog } = useConfirmDialog();
  const [templates, setTemplates] = useState<CustomTemplateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/templates");
      if (!res.ok) throw new Error("Failed to load templates");
      const data = (await res.json()) as { templates?: CustomTemplateItem[] };
      setTemplates((data.templates ?? []).filter((t) => t.type === "custom"));
    } catch (err) {
      addToast({
        type: "error",
        title: "Couldn't load templates",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  async function handleRename(id: string) {
    const name = editName.trim();
    if (!name) return;
    setBusyId(id);
    try {
      const res = await fetch("/api/templates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name }),
      });
      if (!res.ok) throw new Error("Rename failed");
      setEditingId(null);
      clearCustomTemplateCache();
      await load();
      await onTemplatesChanged();
    } catch (err) {
      addToast({
        type: "error",
        title: "Rename failed",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(item: CustomTemplateItem) {
    const ok = await confirm({
      title: `Delete “${item.name}”?`,
      description:
        "This permanently removes the imported template. Résumés already created keep their content.",
      confirmLabel: "Delete template",
      confirmVariant: "destructive",
    });
    if (!ok) return;
    setBusyId(item.id);
    try {
      const res = await fetch(
        `/api/templates?id=${encodeURIComponent(item.id)}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Delete failed");
      clearCustomTemplateCache();
      await load();
      await onTemplatesChanged();
      addToast({ type: "success", title: "Template deleted" });
    } catch (err) {
      addToast({
        type: "error",
        title: "Delete failed",
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage custom templates</DialogTitle>
            <DialogDescription>
              Rename, delete, or apply a template you imported. To clone a new
              one, use “Import résumé”.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex items-center justify-center py-10 text-ink-3">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : templates.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-3">
              No imported templates yet. Use “Import résumé (clone style)” to
              create one.
            </p>
          ) : (
            <ul className="max-h-[420px] divide-y divide-rule overflow-auto">
              {templates.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    {editingId === t.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && void handleRename(t.id)
                          }
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => void handleRename(t.id)}
                          disabled={busyId === t.id}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="truncate text-sm font-medium text-ink">
                          {t.name}
                        </p>
                        {t.sourceFilename ? (
                          <p className="truncate text-xs text-ink-3">
                            {t.sourceFilename}
                          </p>
                        ) : null}
                      </>
                    )}
                  </div>
                  {editingId === t.id ? null : (
                    <div className="flex items-center gap-1">
                      {onTemplateSelected ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={async () => {
                            await onTemplateSelected(t.id);
                            onOpenChange(false);
                          }}
                        >
                          Use
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Rename"
                        onClick={() => {
                          setEditingId(t.id);
                          setEditName(t.name);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Delete"
                        disabled={busyId === t.id}
                        onClick={() => void handleDelete(t)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {dialog}
    </>
  );
}
