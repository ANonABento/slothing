import { z } from "zod";
import type { ToolDefinition } from "./types.js";

/**
 * `get_profile` — read the authenticated user's profile + pre-computed
 * auto-fill values (firstName, mostRecentSchool, yearsExperience, etc.).
 *
 * Maps to GET /api/extension/profile.
 */
export const getProfileTool: ToolDefinition<Record<string, never>> = {
  name: "get_profile",
  title: "Get profile",
  description:
    "Fetch the authenticated Slothing user's profile (contact, experiences, education, skills) plus pre-computed auto-fill values used by the Slothing extension.",
  inputShape: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  async handler(_args, client) {
    void z; // ensure the import is preserved; zero-arg tools have no schema to parse
    return client.get<unknown>("/api/extension/profile");
  },
};
