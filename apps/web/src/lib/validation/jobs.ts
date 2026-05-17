/**
 * Canonical job/opportunity validation schemas — single source of truth.
 *
 * Why this file exists (F2.2 consolidation): `createJobSchema` used to be
 * defined twice — once in `packages/shared/src/schemas.ts` and once locally
 * in `apps/web/src/lib/constants/jobs.ts` with slightly different rules
 * (the local copy enforced `description.min(10)`). The shared copy was
 * removed in the F2.1 status-consolidation pass, leaving the local copy as
 * the only definition — but it lived next to status constants and was
 * easy to lose track of. We now keep the **legacy flat-shape** job
 * validation here so consumers can import from a clearly-named location,
 * and the status constants stay in `lib/constants/jobs.ts`.
 *
 * Note: the canonical opportunity-shape schemas (rich location, salary
 * range, team-size, etc.) live in `@slothing/shared/schemas` —
 * `createOpportunitySchema`, `updateOpportunitySchema`, etc. The schemas
 * below are the *flat legacy* shape (`description`, `location`, `url`,
 * `salary` as string) that `POST /api/opportunities` still accepts to keep
 * the extension and import paths working.
 */

import { z } from "zod";

import { jobStatusSchema, jobTypeSchema } from "@/lib/constants/jobs";

export const createJobSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  company: z.string().min(1, "Company is required").max(200),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(50000),
  location: z.string().max(200).optional(),
  type: jobTypeSchema.optional(),
  remote: z.boolean().optional(),
  salary: z.string().max(100).optional(),
  requirements: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  url: z.string().url().optional().or(z.literal("")),
  status: jobStatusSchema.optional().default("saved"),
  deadline: z.string().optional(),
  notes: z.string().max(5000).optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;

export const updateJobSchema = createJobSchema.partial().extend({
  appliedAt: z.string().optional(),
});

export type UpdateJobInput = z.infer<typeof updateJobSchema>;

// Import job schema (single job) — like `createJobSchema` but doesn't
// enforce the `description.min(10)` floor since imported jobs may have
// already-summarised descriptions, and rejects `status` default so the
// importer can decide whether to bucket into `saved` or preserve the
// incoming value.
export const importJobSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  company: z.string().min(1, "Company is required").max(200),
  description: z.string().min(1, "Description is required").max(50000),
  location: z.string().max(200).optional(),
  type: jobTypeSchema.optional(),
  remote: z.boolean().optional(),
  salary: z.string().max(100).optional(),
  requirements: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  url: z.string().url().optional().or(z.literal("")),
  status: jobStatusSchema.optional(),
  deadline: z.string().optional(),
  notes: z.string().max(5000).optional(),
});

export type ImportJobInput = z.infer<typeof importJobSchema>;

// Import jobs schema (bulk)
export const importJobsArraySchema = z.array(importJobSchema);
