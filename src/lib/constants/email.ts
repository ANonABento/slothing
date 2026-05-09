import { z } from "zod";

// Email template types
export const EMAIL_TEMPLATE_TYPES = [
  "follow_up",
  "thank_you",
  "networking",
  "cold_outreach",
  "status_inquiry",
  "recruiter_reply",
  "negotiation",
  "reference_request",
] as const;

export type EmailTemplateType = (typeof EMAIL_TEMPLATE_TYPES)[number];

export const emailTemplateTypeSchema = z.enum(EMAIL_TEMPLATE_TYPES);

// Email generation schema
export const generateEmailSchema = z.object({
  type: emailTemplateTypeSchema,
  jobId: z.string().optional(),
  interviewerName: z.string().max(200).optional(),
  interviewDate: z.string().optional(),
  daysAfter: z.number().int().min(1).max(365).optional(),
  targetCompany: z.string().max(200).optional(),
  connectionName: z.string().max(200).optional(),
  referenceName: z.string().max(200).optional(),
  recruiterName: z.string().max(200).optional(),
  recruiterCompany: z.string().max(200).optional(),
  recruiterStance: z.enum(["interested", "not_a_fit"]).optional(),
  applyingRole: z.string().max(200).optional(),
  interviewStage: z.string().max(200).optional(),
  hookNote: z.string().max(2000).optional(),
  customNote: z.string().max(2000).optional(),
  useLLM: z.boolean().optional().default(true),
});

export type GenerateEmailInput = z.infer<typeof generateEmailSchema>;

export const createEmailSendSchema = z.object({
  type: emailTemplateTypeSchema,
  jobId: z.string().optional(),
  recipient: z.string().min(1).max(320),
  subject: z.string().min(1).max(500),
  body: z.string().min(1),
  inReplyToDraftId: z.string().optional(),
  gmailMessageId: z.string().optional(),
  status: z.enum(["sent", "failed"]).optional().default("sent"),
  errorMessage: z.string().max(2000).optional(),
});

export type CreateEmailSendInput = z.infer<typeof createEmailSendSchema>;
