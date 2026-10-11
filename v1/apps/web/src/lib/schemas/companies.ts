import { z } from "zod";

const nullableTrimmedSlug = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value ? value : null));

export const enrichCompanySchema = z.object({
  githubOrg: nullableTrimmedSlug,
});

export const setGithubSlugSchema = z.object({
  githubSlug: nullableTrimmedSlug,
});

export type EnrichCompanyInput = z.infer<typeof enrichCompanySchema>;
export type SetGithubSlugInput = z.infer<typeof setGithubSlugSchema>;
