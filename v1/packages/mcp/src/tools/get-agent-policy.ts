import { z } from "zod";
import type { ToolDefinition } from "./types.js";

/**
 * `get_agent_policy` — read the user's agent autonomy policy so the agent can
 * self-govern. The agent MUST NOT act beyond the returned level: at `source`
 * it only sources/ranks; `draft` adds drafting; submission is only allowed at
 * `submit_approval`/`auto_submit` and only when `dryRun` is false. The
 * `capabilities` block summarizes the submission gates.
 *
 * Maps to GET /api/extension/agent-policy.
 */
export const getAgentPolicyTool: ToolDefinition<Record<string, never>> = {
  name: "get_agent_policy",
  title: "Get agent policy",
  description:
    "Fetch the user's agent autonomy policy (autonomy level, match threshold, salary floor, company blocklist, daily submit cap, dry-run) plus capability flags. Call this first and never act beyond the configured autonomy level.",
  inputShape: {},
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  async handler(_args, client) {
    void z; // zero-arg tool: no schema to parse, keep the import referenced
    return client.get<unknown>("/api/extension/agent-policy");
  },
};
