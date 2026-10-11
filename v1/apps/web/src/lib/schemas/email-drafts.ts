import { z } from "zod";
import { emailTemplateTypeSchema } from "@/lib/constants/email";

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

const contextSchema = z.record(z.string(), z.string()).optional();

export const createEmailDraftSchema = z.object({
  type: emailTemplateTypeSchema,
  jobId: optionalTrimmedString,
  subject: z.string().trim().min(1).max(500),
  body: z.string().trim().min(1),
  context: contextSchema,
});

export const updateEmailDraftSchema = z
  .object({
    subject: optionalTrimmedString,
    body: optionalTrimmedString,
    context: contextSchema,
  })
  .refine(
    (value) => Object.values(value).some((field) => field !== undefined),
    {
      message: "No draft fields provided",
    },
  );

export type CreateEmailDraftInput = z.infer<typeof createEmailDraftSchema>;
export type UpdateEmailDraftInput = z.infer<typeof updateEmailDraftSchema>;
