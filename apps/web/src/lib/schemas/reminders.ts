import { z } from "zod";
import {
  createReminderSchema,
  reminderTypeSchema,
} from "@/lib/constants/reminders";

const reminderUpdateFieldsSchema = createReminderSchema
  .omit({ jobId: true })
  .partial()
  .extend({
    action: z.undefined().optional(),
    type: reminderTypeSchema.optional(),
  })
  .refine(
    (value) =>
      Object.entries(value).some(
        ([key, field]) => key !== "action" && field !== undefined,
      ),
    { message: "No reminder fields provided" },
  );

export const updateReminderSchema = z.union([
  z.object({ action: z.literal("complete") }).passthrough(),
  z.object({ action: z.literal("dismiss") }).passthrough(),
  reminderUpdateFieldsSchema,
]);

export type UpdateReminderInput = z.infer<typeof updateReminderSchema>;
