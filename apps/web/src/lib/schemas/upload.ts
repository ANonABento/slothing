import { z } from "zod";

export const uploadQuerySchema = z.object({
  force: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),
});

export type UploadQueryInput = z.infer<typeof uploadQuerySchema>;
