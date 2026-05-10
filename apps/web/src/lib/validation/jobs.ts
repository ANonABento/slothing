export {
  createJobSchema,
  jobStatusSchema,
  jobStatusUpdateSchema,
  jobTypeSchema,
  updateJobSchema,
  validateCreateJob,
  validateJobStatusUpdate,
  validateUpdateJob,
} from "@slothing/shared/schemas";

export type {
  CreateJobInput,
  JobStatusInput as JobStatus,
  JobStatusUpdateInput,
  JobTypeInput as JobType,
  UpdateJobInput,
} from "@slothing/shared/schemas";
