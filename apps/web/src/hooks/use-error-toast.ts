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
      addToast({
        type: "error",
        title: options.title,
        description: getErrorToastDescription(
          error,
          options.fallbackDescription,
        ),
      });
    },
    [addToast],
  );
}
