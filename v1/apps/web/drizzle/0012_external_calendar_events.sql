CREATE TABLE `external_calendar_events` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`provider` text NOT NULL,
	`external_event_id` text NOT NULL,
	`calendar_id` text,
	`matched_opportunity_id` text,
	`action` text NOT NULL,
	`event_title` text,
	`event_start` text,
	`processed_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_external_calendar_events_provider_event` ON `external_calendar_events` (`user_id`,`provider`,`external_event_id`);--> statement-breakpoint
CREATE INDEX `idx_external_calendar_events_user_processed` ON `external_calendar_events` (`user_id`,`processed_at`);--> statement-breakpoint
CREATE TABLE `suggested_status_updates` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`notification_id` text NOT NULL,
	`opportunity_id` text NOT NULL,
	`suggested_status` text NOT NULL,
	`source_provider` text,
	`source_event_id` text,
	`state` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`resolved_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `suggested_status_updates_notification_id_unique` ON `suggested_status_updates` (`notification_id`);--> statement-breakpoint
CREATE INDEX `idx_suggested_status_updates_user_state` ON `suggested_status_updates` (`user_id`,`state`);
