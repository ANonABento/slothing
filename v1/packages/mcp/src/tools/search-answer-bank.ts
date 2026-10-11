import { z } from "zod";
import type { ToolDefinition } from "./types.js";

const inputShape = {
  question: z
    .string()
    .min(1)
    .describe(
      "Question text to search for similar previously-answered questions in the user's answer bank.",
    ),
};

type Args = z.infer<z.ZodObject<typeof inputShape>>;

/**
 * `search_answer_bank` — find similar previously-answered questions.
 *
 * Maps to POST /api/extension/learned-answers/search.
 */
export const searchAnswerBankTool: ToolDefinition<typeof inputShape> = {
  name: "search_answer_bank",
  title: "Search answer bank",
  description:
    "Search the user's answer bank for previously-saved answers to similar questions. Returns up to 5 ranked matches with similarity scores.",
  inputShape,
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  async handler(args: Args, client) {
    return client.post<unknown>("/api/extension/learned-answers/search", {
      question: args.question,
    });
  },
};
