CREATE TABLE `email_sends` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`type` text NOT NULL,
	`job_id` text,
	`recipient` text NOT NULL,
	`subject` text NOT NULL,
	`body` text NOT NULL,
	`in_reply_to_draft_id` text,
	`gmail_message_id` text,
	`status` text DEFAULT 'sent' NOT NULL,
	`error_message` text,
	`sent_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `idx_email_sends_user_sent_at` ON `email_sends` (`user_id`,`sent_at`);--> statement-breakpoint
CREATE INDEX `idx_email_sends_user_recipient_type` ON `email_sends` (`user_id`,`recipient`,`type`);