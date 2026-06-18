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
      kind: z.enum(["raw_input", "entry", "url"]),
      refId: z.string().optional(),
      rawText: z.string().optional(),
      url: z.string().optional(),
    })
    .optional(),
});

export type CreateBankEntryInput = z.infer<typeof createBankEntrySchema>;

const jobContextSchema = z
  .object({
    jobTitle: z.string().optional(),
    company: z.string().optional(),
    jobDescription: z.string().optional(),
  })
  .optional();

/** POST /api/bank/ai/research — fetch a URL and draft a grounded project (preview, no persist). */
export const researchBankSchema = z.object({
  url: z.string().trim().url(),
  jobContext: jobContextSchema,
});
export type ResearchBankInput = z.infer<typeof researchBankSchema>;

/** POST /api/bank/from-source — commit a reviewed project + its bullets to the bank. */
export const fromSourceBankSchema = z.object({
  url: z.string().trim().url().optional(),
  name: z.string().trim().min(1).max(200),
  technologies: z
    .array(z.string().trim().min(1))
    .max(40)
    .optional()
    .default([]),
  bullets: z.array(z.string().trim().min(1)).min(1).max(20),
});
export type FromSourceBankInput = z.infer<typeof fromSourceBankSchema>;
