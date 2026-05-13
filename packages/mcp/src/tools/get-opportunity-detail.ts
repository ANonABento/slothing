import { z } from "zod";
import type { ToolDefinition } from "./types.js";

const inputShape = {
  opportunityId: z
    .string()
    .min(1)
    .describe("Opportunity id (returned from list_opportunities)."),
};

type Args = z.infer<z.ZodObject<typeof inputShape>>;

/**
 * `get_opportunity_detail` — read one opportunity by id.
 *
 * Maps to GET /api/extension/opportunities/[id].
 */
export const getOpportunityDetailTool: ToolDefinition<typeof inputShape> = {
  name: "get_opportunity_detail",
  title: "Get opportunity detail",
  description:
    "Fetch a single opportunity by id, scoped to the authenticated user. Returns the full job record including description, requirements, status, deadline, and notes.",
  inputShape,
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  async handler(args: Args, client) {
    const encoded = encodeURIComponent(args.opportunityId);
    return client.get<unknown>(`/api/extension/opportunities/${encoded}`);
  },
};
