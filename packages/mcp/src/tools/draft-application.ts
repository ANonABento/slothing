import { z } from "zod";
import type { ToolDefinition } from "./types.js";

const questionShape = z.object({
  id: z.string().min(1).max(200),
  label: z.string().min(1).max(2000),
  type: z
    .enum(["text", "textarea", "select", "boolean", "number", "file"])
    .optional(),
  required: z.boolean().optional(),
});

const answerShape = z.object({
  questionId: z.string().min(1).max(200),
  value: z.string().max(10000),
  groundedIn: z
    .string()
    .max(2000)
    .optional()
    .describe(
      "Evidence the answer is grounded in (profile_bank id or short quote). REQUIRED for trustworthy answers — leave empty only to flag a guess.",
    ),
  confidence: z.number().min(0).max(1).optional(),
  source: z.string().max(500).optional(),
});

const inputShape = {
  jobId: z
    .string()
    .min(1)
    .max(200)
    .describe("The Slothing opportunity id this draft is for."),
  questions: z
    .array(questionShape)
    .max(200)
    .describe("Screening questions detected on the application."),
  answers: z
    .array(answerShape)
    .max(200)
    .describe("Proposed answers, each grounded in the user's profile."),
  authoredBy: z
    .string()
    .max(200)
    .optional()
    .describe("Agent identifier, e.g. agent:choomfie. Defaults to 'agent'."),
};

type Args = z.infer<z.ZodObject<typeof inputShape>>;

/**
 * `draft_application` — create or update a drafted application for an
 * opportunity. The draft lands in `pending_review` for the user to approve or
 * edit; nothing is submitted. Re-drafting the same job updates its open draft.
 *
 * Maps to POST /api/extension/drafts.
 */
export const draftApplicationTool: ToolDefinition<typeof inputShape> = {
  name: "draft_application",
  title: "Draft an application",
  description:
    "Create/update a drafted application (questions + grounded answers) for an opportunity. Lands in pending_review for the user — never submitted. Ground every answer; leave groundedIn empty only to explicitly flag an unsupported guess.",
  inputShape,
  annotations: {
    readOnlyHint: false,
    idempotentHint: false,
    destructiveHint: false,
    openWorldHint: false,
  },
  async handler(args: Args, client) {
    return client.post<unknown>("/api/extension/drafts", args);
  },
};
