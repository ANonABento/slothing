CREATE INDEX IF NOT EXISTS `idx_jobs_user_status_created_id` ON `jobs` (`user_id`, `status`, `created_at`, `id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_jobs_user_deadline_created_id` ON `jobs` (`user_id`, `deadline`, `created_at`, `id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_jobs_user_company_title_created_id` ON `jobs` (`user_id`, `company`, `title`, `created_at`, `id`);
