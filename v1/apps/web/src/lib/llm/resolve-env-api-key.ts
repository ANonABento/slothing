import type { LLMProvider } from "@/lib/constants";

/**
 * Fall back to a process-env API key when the user hasn't configured one in
 * /settings. Keeps single-source-of-truth for the DB config (DB always wins
 * when set) while letting dev installs work with only an env var. Returns
 * undefined for Ollama since it doesn't take a key.
 *
 * Shared between `LLMClient` (which resolves the effective key at request
 * time) and `isLLMConfigured` (which reports "configured" status in
 * `/api/settings/status`) so the two stay in lockstep.
 */
export function resolveEnvApiKey(provider: LLMProvider): string | undefined {
  switch (provider) {
    case "openai":
      return process.env.OPENAI_API_KEY;
    case "anthropic":
      return process.env.ANTHROPIC_API_KEY;
    case "openrouter":
      return process.env.OPENROUTER_API_KEY;
    case "ollama":
      return undefined;
  }
}
