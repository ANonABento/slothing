import { z } from "zod";
import type { ToolDefinition } from "./types.js";

const inputShape = {
  status: z
    .string()
    .optional()
    .describe(
      "Optional comma-separated status filter (e.g. 'pending,applied'). Omit for all statuses.",
    ),
  limit: z
    .number()
    .int()
    .positive()
    .max(200)
    .optional()
    .describe("Max opportunities to return. Defaults to 50, capped at 200."),
};

type Args = z.infer<z.ZodObject<typeof inputShape>>;

/**
 * `list_opportunities` — list opportunities tracked by the user.
 *
 * Maps to GET /api/extension/opportunities?status=...&limit=....
 */
export const listOpportunitiesTool: ToolDefinition<typeof inputShape> = {
  name: "list_opportunities",
  title: "List opportunities",
  description:
    "List opportunities (jobs + hackathons) tracked in the user's Slothing instance. Supports optional comma-separated status filter and a result limit.",
  inputShape,
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  async handler(args: Args, client) {
    return client.get<unknown>("/api/extension/opportunities", {
      status: args.status,
      limit: args.limit,
    });
  },
};
