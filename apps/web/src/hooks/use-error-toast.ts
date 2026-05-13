"use client";

import { useCallback } from "react";
import { getErrorMessage } from "@/components/ui/error-state";
import { useToast } from "@/components/ui/toast";

interface ShowErrorToastOptions {
  title: string;
  fallbackDescription?: string;
}

const GENERIC_ERROR_MESSAGE = "An unexpected error occurred";
const MAX_DESCRIPTION_LENGTH = 180;

export function getErrorToastDescription(
  error: unknown,
  fallbackDescription?: string,
): string | undefined {
  const message = getErrorMessage(error).trim();

  if (!message || message === GENERIC_ERROR_MESSAGE) {
    return fallbackDescription;
  }

  const firstLine = message.split(/\r?\n/)[0].trim();
  if (!firstLine) {
    return fallbackDescription;
  }

  if (firstLine.length > MAX_DESCRIPTION_LENGTH) {
    return `${firstLine.slice(0, MAX_DESCRIPTION_LENGTH - 3)}...`;
  }

  return firstLine;
}

export function useErrorToast() {
  const { addToast } = useToast();

  return useCallback(
    (error: unknown, options: ShowErrorToastOptions) => {
      const description = getErrorToastDescription(
        error,
        options.fallbackDescription,
      );
      addToast({
        type: "error",
        title: options.title,
        description,
        // Multiple parallel fetches with the same failure (opportunities +
        // settings + kanban, all 500ing on the same dev environment) would
        // each stack their own copy of the same toast. Collapse on title +
        // description so the third repeat replaces the second instead of
        // piling up.
        dedupeKey: `${options.title}␟${description ?? ""}`,
      });
    },
    [addToast],
  );
}
