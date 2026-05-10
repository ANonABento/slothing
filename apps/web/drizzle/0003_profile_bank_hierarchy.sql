ALTER TABLE `profile_bank` ADD `parent_id` text;--> statement-breakpoint
ALTER TABLE `profile_bank` ADD `component_type` text;--> statement-breakpoint
ALTER TABLE `profile_bank` ADD `component_order` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `profile_bank` ADD `source_section` text;--> statement-breakpoint
CREATE INDEX `idx_profile_bank_parent` ON `profile_bank` (`user_id`,`parent_id`);--> statement-breakpoint
CREATE INDEX `idx_profile_bank_component_type` ON `profile_bank` (`user_id`,`component_type`);