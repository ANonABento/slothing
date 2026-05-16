import type { LLMConfig } from "@/types";
import { DEFAULT_LLM_TIMEOUT_MS } from "@/lib/constants";
import {
  getBentoRouterClient,
  type BentoRouterClient,
  type BentoRunInput,
} from "./bentorouter-client";
import type { SlothingTaskId } from "./tasks";
export { parseJSONFromLLM } from "./json";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CompletionOptions {
  messages: Message[];
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface StreamCompletionOptions extends CompletionOptions {
  onChunk?: (chunk: string) => void;
}

export type BentoLLMConfig = LLMConfig & {
  userId?: string;
};

export type TaskCompletionInput = CompletionOptions & {
  task: SlothingTaskId;
  userId: string;
  metadata?: Record<string, unknown>;
};

export type TaskStreamInput = StreamCompletionOptions & {
  task: SlothingTaskId;
  userId: string;
  metadata?: Record<string, unknown>;
};

export async function getLLMClient(): Promise<BentoRouterClient> {
  return getBentoRouterClient();
}

export async function runLLMTask(input: TaskCompletionInput): Promise<string> {
  const client = await getBentoRouterClient();
  const result = await client.run(toBentoInput(input));
  if (result.status === "failed") {
    throw new Error(result.reason ?? "BentoRouter task failed");
  }
  return result.text;
}

export async function* streamLLMTask(
  input: TaskStreamInput,
): AsyncGenerator<string, string, unknown> {
  const client = await getBentoRouterClient();
  let fullContent = "";
  for await (const chunk of client.stream(toBentoInput(input))) {
    if (!chunk.text) continue;
    fullContent += chunk.text;
    input.onChunk?.(chunk.text);
    yield chunk.text;
  }
  return fullContent;
}

export function getLLMUserId(config: unknown): string {
  if (
    config &&
    typeof config === "object" &&
    "userId" in config &&
    typeof config.userId === "string" &&
    config.userId.trim()
  ) {
    return config.userId;
  }
  return "default";
}

function toBentoInput(input: TaskCompletionInput): BentoRunInput {
  return {
    task: input.task,
    userId: input.userId,
    messages: input.messages,
    temperature: input.temperature,
    metadata: {
      ...input.metadata,
      maxTokens: input.maxTokens,
      timeoutMs: input.timeoutMs ?? DEFAULT_LLM_TIMEOUT_MS,
    },
  };
}
