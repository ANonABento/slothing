"use client";

import { useCallback } from "react";
import { useToast } from "@/components/ui/toast";

interface UndoableActionOptions<TInput> {
  action: (input: TInput) => Promise<void> | void;
  undoAction: (input: TInput) => Promise<void> | void;
  message: string;
  description?: string;
  undoLabel?: string;
  durationMs?: number;
}

export function useUndoableAction<TInput>({
  action,
  undoAction,
  message,
  description,
  undoLabel = "Undo",
  durationMs = 5000,
}: UndoableActionOptions<TInput>) {
  const { addToast } = useToast();

  return useCallback(
    async (input: TInput) => {
      await action(input);
      addToast(
        {
          type: "info",
          title: message,
          description,
          action: {
            label: undoLabel,
            onClick: () => {
              void undoAction(input);
            },
          },
        },
        durationMs,
      );
    },
    [action, addToast, description, durationMs, message, undoAction, undoLabel],
  );
}
