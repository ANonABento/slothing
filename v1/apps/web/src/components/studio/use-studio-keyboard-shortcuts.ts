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
  onFocusAiInput: () => void;
  onToggleFilesPanel: () => void;
  onTogglePreviewOnly: () => void;
}

export function useStudioKeyboardShortcuts({
  onSave,
  onExport,
  onToggleAiPanel,
  onFocusAiInput,
  onToggleFilesPanel,
  onTogglePreviewOnly,
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
        key: "k",
        ctrl: true,
        description: "Focus AI input",
        category: "actions",
        action: onFocusAiInput,
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
    ],
    [
      onExport,
      onFocusAiInput,
      onSave,
      onToggleAiPanel,
      onToggleFilesPanel,
      onTogglePreviewOnly,
    ],
  );

  useRegisterShortcuts("studio", shortcuts);
}
