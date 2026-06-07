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
  // AI Bank Authoring (spec §2). Defaults preserve today's behavior: a manual create is a
  // user-authored verified fact. AI flows pass status:"draft" + an authoredBy + groundedIn.
  status: z
    .enum(["verified", "draft", "suggested"])
    .optional()
    .default("verified"),
  authoredBy: z
    .enum(["user", "import", "ai_articulated", "ai_strengthened"])
    .optional()
    .default("user"),
  groundedIn: z
    .object({
      kind: z.enum(["raw_input", "entry"]),
      refId: z.string().optional(),
      rawText: z.string().optional(),
    })
    .optional(),
});

export type CreateBankEntryInput = z.infer<typeof createBankEntrySchema>;
