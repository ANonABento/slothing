"use client";

import { Button } from "@/components/ui/button";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { THEME_SURFACE_CLASSES } from "@/lib/theme/component-classes";
import { cn } from "@/lib/utils";
import {
  Trash2,
  FileText,
  CheckSquare,
  XSquare,
  Download,
  MoveRight,
} from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDelete: () => void;
  onAddToResume: () => void;
  onExport: () => void;
  selectedBulletCount?: number;
  onMoveBullets?: () => void;
}

export function BulkActionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onDelete,
  onAddToResume,
  onExport,
  selectedBulletCount = 0,
  onMoveBullets,
}: BulkActionBarProps) {
  const { confirm, dialog: confirmDialog } = useConfirmDialog();

  if (selectedCount === 0) return null;

  const allSelected = selectedCount === totalCount;

  async function handleDelete() {
    const isOne = selectedCount === 1;
    const confirmed = await confirm({
      title: `Delete ${selectedCount} selected ${isOne ? "entry" : "entries"}?`,
      description: `This permanently removes the selected profile bank ${
        isOne ? "entry" : "entries"
      }. This cannot be undone.`,
      confirmLabel: "Delete",
    });
    if (confirmed) {
      onDelete();
    }
  }

  return (
    <>
      <div
        className={cn(
          "sticky top-0 z-10 flex items-center gap-3 p-3",
          THEME_SURFACE_CLASSES,
        )}
      >
        <span className="text-sm font-medium">{selectedCount} selected</span>
        <div className="h-4 w-px bg-border" />
        <Button
          variant="ghost"
          size="sm"
          onClick={allSelected ? onDeselectAll : onSelectAll}
        >
          {allSelected ? (
            <>
              <XSquare className="h-4 w-4 mr-1" />
              Deselect All
            </>
          ) : (
            <>
              <CheckSquare className="h-4 w-4 mr-1" />
              Select All
            </>
          )}
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
        {selectedBulletCount > 0 && onMoveBullets ? (
          <Button variant="ghost" size="sm" onClick={onMoveBullets}>
            <MoveRight className="h-4 w-4 mr-1" />
            Move {selectedBulletCount} bullet
            {selectedBulletCount === 1 ? "" : "s"}
          </Button>
        ) : null}
        <Button variant="ghost" size="sm" onClick={onAddToResume}>
          <FileText className="h-4 w-4 mr-1" />
          Add to Resume
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => void handleDelete()}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
      {confirmDialog}
    </>
  );
}
