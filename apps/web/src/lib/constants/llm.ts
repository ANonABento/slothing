import { z } from "zod";
import { kanbanVisibleLanesSchema } from "@/types/opportunity";

export const DEFAULT_LLM_TIMEOUT_MS = 60000; // 60 seconds

export const updateSettingsSchema = z.object({
  opportunityReview: z
    .object({
      enabled: z.boolean(),
    })
    .optional(),
  digest: z
    .object({
      enabled: z.boolean(),
    })
    .optional(),
  gmailAutoStatus: z
    .object({
      enabled: z.boolean(),
    })
    .optional(),
  calendarSync: z
    .object({
      pullEnabled: z.boolean(),
    })
    .optional(),
  kanbanVisibleLanes: kanbanVisibleLanesSchema.optional(),
  locale: z.string().optional(),
});
