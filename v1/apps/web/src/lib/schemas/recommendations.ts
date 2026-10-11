import { z } from "zod";

export const recommendationsQuerySchema = z.object({
  limit: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.coerce.number().int().min(1).max(100).default(10),
  ),
});

export type RecommendationsQueryInput = z.infer<
  typeof recommendationsQuerySchema
>;
