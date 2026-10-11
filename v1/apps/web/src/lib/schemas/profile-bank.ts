import { z } from "zod";

export const bankSearchQuerySchema = z.object({
  q: z.string().trim().min(1, "Search query is required"),
});

export type BankSearchQueryInput = z.infer<typeof bankSearchQuerySchema>;
