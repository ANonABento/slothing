CREATE TABLE `learned_answer_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`answer_id` text NOT NULL,
	`version` integer NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`source_url` text,
	`source_company` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `idx_learned_answer_versions_answer` ON `learned_answer_versions` (`answer_id`,`version`);--> statement-breakpoint
CREATE INDEX `idx_learned_answer_versions_user` ON `learned_answer_versions` (`user_id`);