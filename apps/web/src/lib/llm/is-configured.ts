import type { LLMConfig } from "@/types";
import { resolveEnvApiKey } from "@/lib/llm/resolve-env-api-key";

/**
 * Check if an LLM config has enough info to be usable.
 *
 * Mirrors the effective-key resolution in `LLMClient` (DB key wins, env var
 * fills in when DB is empty) so `/api/settings/status` reports the same
 * "configured" verdict as the runtime client. Ollama is a special case — it
 * doesn't need an API key, just a reachable `baseUrl` (reachability isn't
 * checked here; presence of a model is enough).
 */
export function isLLMConfigured(config: LLMConfig | null): boolean {
  if (!config) return false;
  if (!config.model) return false;

  if (config.provider === "ollama") return true;

  if (config.apiKey) return true;

  const envKey = resolveEnvApiKey(config.provider);
  return !!envKey && envKey.length > 0;
}
