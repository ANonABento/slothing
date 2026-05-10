import { z } from "zod";

const contactSchema = z.object({ name: z.string().min(1) }).passthrough();

const editableDocumentSchema = z
  .object({
    sections: z.array(z.unknown()),
  })
  .passthrough();

export const builderRequestSchema = z
  .object({
    entryIds: z.array(z.string().min(1)).optional(),
    templateId: z.string().min(1).optional().default("classic"),
    contact: contactSchema.optional(),
    document: editableDocumentSchema.optional(),
  })
  .superRefine((value, ctx) => {
    const hasDocument = Boolean(value.document?.sections.length);
    const hasEntryIds = Boolean(value.entryIds?.length);

    if (!hasDocument && !hasEntryIds) {
      ctx.addIssue({
        code: "custom",
        path: ["entryIds"],
        message: "Provide document or entryIds",
      });
    }
  });

export type BuilderRequestInput = z.infer<typeof builderRequestSchema>;
