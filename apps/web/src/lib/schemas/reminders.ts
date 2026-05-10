import { z } from "zod";
import { reminderTypeSchema } from "@/lib/constants/reminders";

const reminderUpdateFieldsSchema = z
  .object({
    action: z.undefined().optional(),
    type: reminderTypeSchema.optional(),
    title: z.string().min(1, "Title is required").max(200).optional(),
    description: z.string().max(2000).optional(),
    dueDate: z.string().min(1, "Due date is required").optional(),
    notifyByEmail: z.boolean().optional(),
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
