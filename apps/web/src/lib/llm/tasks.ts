import type {
  ModelProfile,
  TaskDefinition,
  TaskRegistry,
} from "@anonabento/bento-router";
import { defineBentoTask } from "@anonabento/bento-router";

export const SLOTHING_TASK_IDS = [
  "slothing.parse_resume",
  "slothing.profile_extract",
  "slothing.chunk_atomize",
  "slothing.opportunity_extract",
  "slothing.classify_email",
  "slothing.score_match",
  "slothing.tailor_resume",
  "slothing.cover_letter_generate",
  "slothing.answer_generate",
  "slothing.embedding",
] as const;

export type SlothingTaskId = (typeof SLOTHING_TASK_IDS)[number];

export const SLOTHING_TASKS: TaskDefinition[] = [
  {
    id: "slothing.parse_resume",
    appId: "slothing",
    name: "Parse resume",
    category: "documents",
    defaultPolicy: {
      primaryModel: "openrouter/anthropic/claude-haiku-4.5",
      fallbacks: [
        "openrouter/google/gemini-flash",
        "openrouter/openai/gpt-4o-mini",
      ],
      guardrails: { maxOutputTokens: 4096, timeoutMs: 60_000, maxRetries: 1 },
    },
  },
  {
    id: "slothing.profile_extract",
    appId: "slothing",
    name: "Profile extract",
    category: "documents",
    defaultPolicy: {
      primaryModel: "openrouter/anthropic/claude-haiku-4.5",
      fallbacks: ["openrouter/google/gemini-flash"],
      guardrails: { maxOutputTokens: 4096, timeoutMs: 60_000, maxRetries: 1 },
    },
  },
  {
    id: "slothing.chunk_atomize",
    appId: "slothing",
    name: "Chunk atomize",
    category: "documents",
    defaultPolicy: {
      primaryModel: "openrouter/google/gemini-flash",
      fallbacks: ["openrouter/anthropic/claude-haiku-4.5"],
      guardrails: { maxOutputTokens: 2500, timeoutMs: 45_000, maxRetries: 1 },
    },
  },
  {
    id: "slothing.opportunity_extract",
    appId: "slothing",
    name: "Opportunity extract",
    category: "opportunities",
    defaultPolicy: {
      primaryModel: "openrouter/anthropic/claude-haiku-4.5",
      fallbacks: ["openrouter/google/gemini-flash"],
      guardrails: { maxOutputTokens: 2500, timeoutMs: 45_000, maxRetries: 1 },
    },
  },
  {
    id: "slothing.classify_email",
    appId: "slothing",
    name: "Classify email",
    category: "email",
    defaultPolicy: {
      primaryModel: "openrouter/google/gemini-flash",
      fallbacks: ["openrouter/anthropic/claude-haiku-4.5"],
      guardrails: { maxOutputTokens: 800, timeoutMs: 30_000, maxRetries: 1 },
    },
  },
  {
    id: "slothing.score_match",
    appId: "slothing",
    name: "Score match",
    category: "ats",
    defaultPolicy: {
      primaryModel: "openrouter/anthropic/claude-sonnet-4.6",
      fallbacks: ["openrouter/openai/gpt-4o"],
      guardrails: { maxOutputTokens: 2500, timeoutMs: 60_000, maxRetries: 1 },
      modelRequirements: { minContextTokens: 100_000 },
    },
  },
  {
    id: "slothing.tailor_resume",
    appId: "slothing",
    name: "Tailor resume",
    category: "studio",
    defaultPolicy: {
      primaryModel: "openrouter/anthropic/claude-sonnet-4.6",
      fallbacks: ["openrouter/openai/gpt-4o"],
      guardrails: { maxOutputTokens: 4096, timeoutMs: 60_000, maxRetries: 1 },
    },
  },
  {
    id: "slothing.cover_letter_generate",
    appId: "slothing",
    name: "Cover letter",
    category: "studio",
    defaultPolicy: {
      primaryModel: "openrouter/anthropic/claude-sonnet-4.6",
      fallbacks: ["openrouter/openai/gpt-4o"],
      guardrails: { maxOutputTokens: 3000, timeoutMs: 60_000, maxRetries: 1 },
    },
  },
  {
    id: "slothing.answer_generate",
    appId: "slothing",
    name: "Answer generate",
    category: "interview",
    defaultPolicy: {
      primaryModel: "openrouter/anthropic/claude-sonnet-4.6",
      fallbacks: ["openrouter/openai/gpt-4o"],
      guardrails: { maxOutputTokens: 2500, timeoutMs: 60_000, maxRetries: 1 },
    },
  },
  {
    id: "slothing.embedding",
    appId: "slothing",
    name: "Embedding",
    category: "knowledge",
    defaultPolicy: {
      primaryModel: "openrouter/openai/text-embedding-3-small",
      fallbacks: ["local/nomic-embed-text"],
      guardrails: { timeoutMs: 30_000, maxRetries: 1 },
      modelRequirements: { caps: { embeddings: true } },
    },
  },
];

export const SLOTHING_MODEL_PROFILES: ModelProfile[] = [
  model(
    "openrouter/anthropic/claude-haiku-4.5",
    "openrouter",
    "Claude Haiku 4.5 via OpenRouter",
    "standard",
    1,
    5,
    200_000,
  ),
  model(
    "openrouter/anthropic/claude-sonnet-4.6",
    "openrouter",
    "Claude Sonnet 4.6 via OpenRouter",
    "premium",
    3,
    15,
    200_000,
  ),
  model(
    "openrouter/google/gemini-flash",
    "openrouter",
    "Gemini Flash via OpenRouter",
    "cheap",
    0.1,
    0.4,
    1_000_000,
  ),
  model(
    "openrouter/openai/gpt-4o-mini",
    "openrouter",
    "GPT-4o Mini via OpenRouter",
    "standard",
    0.15,
    0.6,
    128_000,
  ),
  model(
    "openrouter/openai/gpt-4o",
    "openrouter",
    "GPT-4o via OpenRouter",
    "premium",
    2.5,
    10,
    128_000,
  ),
  model(
    "openrouter/openai/text-embedding-3-small",
    "openrouter",
    "Text Embedding 3 Small via OpenRouter",
    "cheap",
    0.02,
    0,
    8191,
    { embeddings: true },
  ),
  model(
    "openai/gpt-4o-mini",
    "openai",
    "GPT-4o Mini",
    "standard",
    0.15,
    0.6,
    128_000,
  ),
  model("openai/gpt-4o", "openai", "GPT-4o", "premium", 2.5, 10, 128_000),
  model(
    "anthropic/claude-3-haiku-20240307",
    "anthropic",
    "Claude 3 Haiku",
    "standard",
    0.25,
    1.25,
    200_000,
  ),
  model(
    "anthropic/claude-3-5-sonnet-20241022",
    "anthropic",
    "Claude 3.5 Sonnet",
    "premium",
    3,
    15,
    200_000,
  ),
  model("local/llama3.2", "local", "Local Llama 3.2", "cheap", 0, 0, 32_000),
  model(
    "local/nomic-embed-text",
    "local",
    "Local Nomic Embed Text",
    "cheap",
    0,
    0,
    8192,
    { embeddings: true },
  ),
];

export function registerSlothingTasks(registry: TaskRegistry): void {
  for (const task of SLOTHING_TASKS) {
    defineBentoTask(task, registry);
  }
}

function model(
  id: string,
  provider: string,
  displayName: string,
  qualityTier: ModelProfile["qualityTier"],
  inputCostPerMillionTokens: number,
  outputCostPerMillionTokens: number,
  maxContextTokens: number,
  caps: Partial<ModelProfile["caps"]> = {},
): ModelProfile {
  return {
    id,
    provider,
    displayName,
    qualityTier,
    inputCostPerMillionTokens,
    outputCostPerMillionTokens,
    maxContextTokens,
    caps: { json: true, vision: false, tools: false, streaming: true, ...caps },
  };
}
