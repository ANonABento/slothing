"use client";

import { useState, useEffect } from "react";
import {
  parseLLMStatusResponse,
  type LLMStatusResponse,
} from "@/lib/document-assistant-core";

/**
 * Hook to check if an LLM provider is configured.
 * Used by the sidebar to show a status indicator.
 */
export function useLLMStatus() {
  const [status, setStatus] = useState<LLMStatusResponse>({
    configured: false,
    provider: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function checkStatus() {
      try {
        const response = await fetch("/api/settings/status");
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled) {
          setStatus(parseLLMStatusResponse(data));
        }
      } catch {
        // Silently fail - sidebar indicator just stays gray
      }
    }

    checkStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
