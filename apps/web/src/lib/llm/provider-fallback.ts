import type { LLMConfig } from "@/types";

export interface ProviderFallbackInfo {
  code: "provider_not_configured" | "provider_unavailable";
  message: string;
  provider?: LLMConfig["provider"];
  model?: string;
  baseUrl?: string;
}

const TRANSPORT_ERROR_PATTERNS = [
  "aborterror",
  "econnrefused",
  "econnreset",
  "enotfound",
  "etimedout",
  "fetch failed",
  "network",
  "socket",
  "terminated",
  "timeout",
];

export function providerNotConfiguredFallback(): ProviderFallbackInfo {
  return {
    code: "provider_not_configured",
    message:
      "No AI provider is configured, so Slothing used deterministic local generation.",
  };
}

export function providerUnavailableFallback(
  llmConfig: LLMConfig,
): ProviderFallbackInfo {
  return {
    code: "provider_unavailable",
    message:
      "The configured AI provider was unavailable, so Slothing used deterministic local generation.",
    provider: llmConfig.provider,
    model: llmConfig.model,
    baseUrl: llmConfig.baseUrl,
  };
}

export function isProviderUnavailableError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === "AbortError") {
    return true;
  }

  if (error instanceof Error) {
    const text = [error.name, error.message, error.cause]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return TRANSPORT_ERROR_PATTERNS.some((pattern) => text.includes(pattern));
  }

  return String(error).toLowerCase().includes("fetch failed");
}
