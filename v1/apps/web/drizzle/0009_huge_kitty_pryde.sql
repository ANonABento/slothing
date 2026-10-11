CREATE INDEX `idx_documents_user_uploaded` ON `documents` (`user_id`,`uploaded_at`);--> statement-breakpoint
CREATE INDEX `idx_generated_resumes_user_created` ON `generated_resumes` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_interview_sessions_user_started` ON `interview_sessions` (`user_id`,`started_at`);--> statement-breakpoint
CREATE INDEX `idx_jobs_user_created` ON `jobs` (`user_id`,`created_at`);