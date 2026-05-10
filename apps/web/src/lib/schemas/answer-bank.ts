import { z } from "zod";

const answerSourceSchema = z.enum(["extension", "curated", "manual"]);

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

export const createAnswerSchema = z.object({
  question: z.string().trim().min(1).max(1000),
  answer: z.string().trim().min(1).max(20000),
  source: answerSourceSchema.optional(),
  sourceUrl: optionalTrimmedString,
  sourceCompany: optionalTrimmedString,
});

export const updateAnswerSchema = z
  .object({
    question: optionalTrimmedString,
    answer: optionalTrimmedString,
    sourceUrl: optionalTrimmedString,
    sourceCompany: optionalTrimmedString,
  })
  .refine(
    (value) => Object.values(value).some((field) => field !== undefined),
    {
      message: "No answer fields provided",
    },
  );

export type CreateAnswerInput = z.infer<typeof createAnswerSchema>;
export type UpdateAnswerInput = z.infer<typeof updateAnswerSchema>;
