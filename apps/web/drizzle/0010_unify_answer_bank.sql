DROP INDEX IF EXISTS `idx_learned_answers_normalized`;--> statement-breakpoint
DROP INDEX IF EXISTS `idx_learned_answers_user`;--> statement-breakpoint
DROP INDEX IF EXISTS `idx_learned_answer_versions_answer`;--> statement-breakpoint
DROP INDEX IF EXISTS `idx_learned_answer_versions_user`;--> statement-breakpoint
ALTER TABLE `learned_answers` RENAME TO `answer_bank`;--> statement-breakpoint
ALTER TABLE `learned_answer_versions` RENAME TO `answer_bank_versions`;--> statement-breakpoint
ALTER TABLE `answer_bank` ADD `source` text DEFAULT 'manual' NOT NULL;--> statement-breakpoint
UPDATE `answer_bank`
SET `source` = 'extension'
WHERE `source` = 'manual'
  AND (`source_url` IS NOT NULL OR `source_company` IS NOT NULL);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_answer_bank_normalized` ON `answer_bank` (`question_normalized`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_answer_bank_user` ON `answer_bank` (`user_id`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_answer_bank_user_source` ON `answer_bank` (`user_id`,`source`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_answer_bank_versions_answer` ON `answer_bank_versions` (`answer_id`,`version`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_answer_bank_versions_user` ON `answer_bank_versions` (`user_id`);
