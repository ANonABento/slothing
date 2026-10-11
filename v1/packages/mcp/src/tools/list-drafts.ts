import { z } from "zod";
import type { ToolDefinition } from "./types.js";

const inputShape = {
  status: z
    .enum([
      "pending_review",
      "approved",
      "rejected",
      "submitted",
      "failed",
    ])
    .optional()
    .describe("Filter by draft status. Omit for all."),
  limit: z
    .number()
    .int()
    .min(1)
    .max(200)
    .optional()
    .describe("Max drafts to return (default 50, capped server-side)."),
};

type Args = z.infer<z.ZodObject<typeof inputShape>>;

/**
 * `list_drafts` — list the user's drafted applications, optionally filtered by
 * status. Useful for an agent resuming work (skip jobs already drafted) or an
 * executor consuming `approved` drafts.
 *
 * Maps to GET /api/extension/drafts.
 */
export const listDraftsTool: ToolDefinition<typeof inputShape> = {
  name: "list_drafts",
  title: "List drafted applications",
  description:
    "List drafted applications for the user, optionally filtered by status (pending_review, approved, rejected, submitted, failed).",
  inputShape,
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  async handler(args: Args, client) {
    return client.get<unknown>("/api/extension/drafts", {
      status: args.status,
      limit: args.limit,
    });
  },
};
