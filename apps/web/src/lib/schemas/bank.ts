import { z } from "zod";
import { BANK_CATEGORIES } from "@/types";

export const createBankEntrySchema = z.object({
  category: z.enum(BANK_CATEGORIES),
  content: z
    .record(z.string(), z.unknown())
    .refine((value) => Object.keys(value).length > 0, {
      message: "Content is required",
    }),
  sourceDocumentId: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  confidenceScore: z.number().min(0).max(1).optional().default(1.0),
});

export type CreateBankEntryInput = z.infer<typeof createBankEntrySchema>;
