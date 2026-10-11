import { z } from "zod";
import type { ToolDefinition } from "./types.js";

const inputShape = {
  question: z.string().min(1).describe("The question text being answered."),
  answer: z.string().min(1).describe("The answer to save."),
  sourceUrl: z
    .string()
    .url()
    .optional()
    .describe("Optional URL of the application page this answer came from."),
  sourceCompany: z
    .string()
    .optional()
    .describe("Optional company name associated with this answer."),
};

type Args = z.infer<z.ZodObject<typeof inputShape>>;

/**
 * `save_answer` — persist a learned answer (Q&A pair) to the user's answer
 * bank. The web side dedupes on the normalized question and merges with any
 * existing entry, so calling this with the same question twice updates the
 * existing record.
 *
 * Maps to POST /api/extension/learned-answers.
 */
export const saveAnswerTool: ToolDefinition<typeof inputShape> = {
  name: "save_answer",
  title: "Save answer to answer bank",
  description:
    "Save a question/answer pair to the user's answer bank for future autofill. Updates the existing entry if a similar question already exists (dedupes on normalized question).",
  inputShape,
  annotations: {
    readOnlyHint: false,
    idempotentHint: true,
    destructiveHint: false,
    openWorldHint: false,
  },
  async handler(args: Args, client) {
    return client.post<unknown>("/api/extension/learned-answers", {
      question: args.question,
      answer: args.answer,
      sourceUrl: args.sourceUrl,
      sourceCompany: args.sourceCompany,
    });
  },
};
