import { z } from "zod";
import { kanbanVisibleLanesSchema } from "@/types/opportunity";
import {
  LLM_PROVIDERS,
  llmConfigSchema,
  llmProviderSchema,
  type LLMConfigInput,
  type LLMProvider,
} from "@slothing/shared/schemas";

// Re-export the LLM provider config from `@slothing/shared/schemas` so callers
// that already import these from `@/lib/constants` keep working. The schema +
// types live in the shared package now so the Zod validator and the
// `LLMConfig` TS type stay in lockstep (F6.2).
export { LLM_PROVIDERS, llmConfigSchema, llmProviderSchema };
export type { LLMConfigInput, LLMProvider };

// LLM configuration
export const DEFAULT_LLM_TIMEOUT_MS = 60000; // 60 seconds

export const updateSettingsSchema = z.object({
  llm: llmConfigSchema.optional(),
  opportunityReview: z
    .object({
      enabled: z.boolean(),
    })
    .optional(),
  digest: z
    .object({
      enabled: z.boolean(),
    })
    .optional(),
  gmailAutoStatus: z
    .object({
      enabled: z.boolean(),
    })
    .optional(),
  calendarSync: z
    .object({
      pullEnabled: z.boolean(),
    })
    .optional(),
  kanbanVisibleLanes: kanbanVisibleLanesSchema.optional(),
  locale: z.string().optional(),
});

export const LLM_ENDPOINTS = {
  openai: "https://api.openai.com/v1/chat/completions",
  anthropic: "https://api.anthropic.com/v1/messages",
  openrouter: "https://openrouter.ai/api/v1/chat/completions",
  ollama: "http://localhost:11434",
} as const satisfies Record<LLMProvider, string>;

// User-pasted model IDs always win in /settings/llm; this list is just the dropdown autocomplete.
export const DEFAULT_MODELS = {
  ollama: ["llama3.2", "llama3.1", "mistral", "codellama", "phi3"],
  openai: [
    "gpt-4o-mini",
    "gpt-4o",
    "gpt-4-turbo",
    "gpt-3.5-turbo",
    // Google models via the OpenAI-compat endpoint (set OPENAI_BASE_URL=
    // https://generativelanguage.googleapis.com/v1beta/openai/ and paste
    // your Google AI Studio key into the API Key field). Gemma 4 26B has
    // the highest free-tier daily allowance (1,500 RPD / unlimited TPM)
    // — use it for development. Flash Lite is the highest-RPD Gemini
    // option in the current free tier.
    "gemma-4-26b",
    "gemma-4-31b",
    "gemini-3.1-flash-lite",
    "gemini-3.1-pro",
    "gemini-3-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-pro",
  ],
  anthropic: [
    "claude-haiku-4-5-20251001",
    "claude-sonnet-4-6",
    "claude-opus-4-7",
  ],
  openrouter: [
    "meta-llama/llama-3.2-3b-instruct:free",
    "google/gemma-2-9b-it:free",
  ],
} as const satisfies Record<LLMProvider, readonly string[]>;

export const DEFAULT_MODEL_BY_PROVIDER = {
  openai: "gpt-4o-mini",
  anthropic: "claude-haiku-4-5-20251001",
  ollama: "llama3.2",
  openrouter: "meta-llama/llama-3.2-3b-instruct:free",
} as const satisfies Record<LLMProvider, string>;
