import { z } from "zod";

export const insightsQuerySchema = z.object({
  refresh: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
});

export type InsightsQueryInput = z.infer<typeof insightsQuerySchema>;
