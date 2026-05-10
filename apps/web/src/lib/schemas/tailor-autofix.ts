import { z } from "zod";
import { tailoredResumeSchema } from "./tailor";

export const tailorAutofixSchema = z.object({
  resume: tailoredResumeSchema,
  keywordsMissing: z.array(z.string().trim().min(1)).min(1),
  jobDescription: z.string().trim().min(1),
});

export type TailorAutofixInput = z.infer<typeof tailorAutofixSchema>;
