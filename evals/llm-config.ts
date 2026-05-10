import type { LLMConfig } from "@/types";

const DEFAULT_MODEL_BY_PROVIDER: Record<LLMConfig["provider"], string> = {
  openai: "gpt-4o-mini",
  anthropic: "claude-sonnet-4-6",
  ollama: "llama3.2",
  openrouter: "openai/gpt-4o-mini",
};

function getProviderKey(provider: LLMConfig["provider"]): string | undefined {
  switch (provider) {
    case "openai":
      return process.env.OPENAI_API_KEY;
    case "anthropic":
      return process.env.ANTHROPIC_API_KEY;
    case "openrouter":
      return process.env.OPENROUTER_API_KEY;
    case "ollama":
      return process.env.OLLAMA_API_KEY;
  }
}

export function getEvalLLMConfig(): LLMConfig | null {
  if (process.env.EVAL_OFFLINE === "1") return null;

  const provider = (process.env.EVAL_PROVIDER ?? "openai") as LLMConfig["provider"];
  if (!["openai", "anthropic", "ollama", "openrouter"].includes(provider)) {
    throw new Error(`Unsupported EVAL_PROVIDER: ${provider}`);
  }

  const apiKey = getProviderKey(provider);
  if (provider !== "ollama" && !apiKey) {
    throw new Error(
      `${provider.toUpperCase()} API key is required. Set the provider key or EVAL_OFFLINE=1.`,
    );
  }

  return {
    provider,
    apiKey,
    baseUrl: process.env.EVAL_BASE_URL,
    model: process.env.EVAL_MODEL ?? DEFAULT_MODEL_BY_PROVIDER[provider],
  };
}

export function hasJudgeKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
