"use client";

import { useMemo } from "react";
import {
  useRegisterShortcuts,
  type Shortcut,
} from "@/components/keyboard-shortcuts";

interface StudioShortcutHandlers {
  onSave: () => void;
  onExport: () => void;
  onToggleAiPanel: () => void;
  onToggleFilesPanel: () => void;
  onTogglePreviewOnly: () => void;
  onCommandPalette: () => void;
}

export function useStudioKeyboardShortcuts({
  onSave,
  onExport,
  onToggleAiPanel,
  onToggleFilesPanel,
  onTogglePreviewOnly,
  onCommandPalette,
}: StudioShortcutHandlers): void {
  const shortcuts = useMemo<Shortcut[]>(
    () => [
      {
        key: "s",
        ctrl: true,
        description: "Save document",
        category: "actions",
        action: onSave,
      },
      {
        key: "e",
        ctrl: true,
        description: "Export",
        category: "actions",
        action: onExport,
      },
      {
        key: "/",
        ctrl: true,
        description: "Toggle AI panel",
        category: "actions",
        action: onToggleAiPanel,
      },
      {
        key: "b",
        ctrl: true,
        description: "Toggle files panel",
        category: "actions",
        action: onToggleFilesPanel,
      },
      {
        key: "p",
        ctrl: true,
        description: "Preview only",
        category: "actions",
        action: onTogglePreviewOnly,
      },
      {
        key: "k",
        ctrl: true,
        description: "Focus AI assistant",
        category: "actions",
        action: onCommandPalette,
      },
    ],
    [
      onCommandPalette,
      onExport,
      onSave,
      onToggleAiPanel,
      onToggleFilesPanel,
      onTogglePreviewOnly,
    ],
  );

  useRegisterShortcuts("studio", shortcuts);
}
