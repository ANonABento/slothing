import { z } from "zod";

const contactSchema = z.object({ name: z.string() }).passthrough();

const resumeExperienceSchema = z
  .object({
    company: z.string(),
    title: z.string(),
    dates: z.string(),
    highlights: z.array(z.string()),
  })
  .passthrough();

const resumeEducationSchema = z
  .object({
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    date: z.string(),
  })
  .passthrough();

export const tailoredResumeSchema = z
  .object({
    contact: contactSchema,
    summary: z.string(),
    experiences: z.array(resumeExperienceSchema),
    skills: z.array(z.string()),
    education: z.array(resumeEducationSchema),
  })
  .passthrough();

const templateFieldsSchema = z.object({
  templateId: z.string().min(1).optional().default("classic"),
});

const jobFieldsSchema = z.object({
  jobDescription: z
    .string()
    .trim()
    .min(20, "Job description is too short. Please paste the full JD."),
  jobTitle: z.string().trim().min(1).optional().default("Unknown Position"),
  company: z.string().trim().min(1).optional().default("Unknown Company"),
  opportunityId: z.string().trim().optional().default(""),
});

const tailorRequestUnionSchema = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("analyze"),
    })
    .merge(templateFieldsSchema)
    .merge(jobFieldsSchema),
  z
    .object({
      action: z.literal("generate"),
    })
    .merge(templateFieldsSchema)
    .merge(jobFieldsSchema),
  z
    .object({
      action: z.literal("render"),
      resume: tailoredResumeSchema,
    })
    .merge(templateFieldsSchema),
]);

export const tailorRequestSchema = z.preprocess((value) => {
  if (typeof value !== "object" || value === null || "action" in value) {
    return value;
  }

  return { ...value, action: "analyze" };
}, tailorRequestUnionSchema);

export type TailorRequestInput = z.infer<typeof tailorRequestSchema>;
