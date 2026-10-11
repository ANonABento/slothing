CREATE TABLE `analytics_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`snapshot_date` text NOT NULL,
	`total_jobs` integer DEFAULT 0,
	`jobs_saved` integer DEFAULT 0,
	`jobs_applied` integer DEFAULT 0,
	`jobs_interviewing` integer DEFAULT 0,
	`jobs_offered` integer DEFAULT 0,
	`jobs_rejected` integer DEFAULT 0,
	`total_interviews` integer DEFAULT 0,
	`interviews_completed` integer DEFAULT 0,
	`total_documents` integer DEFAULT 0,
	`total_resumes` integer DEFAULT 0,
	`profile_completeness` integer DEFAULT 0,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_analytics_snapshots_user_date` ON `analytics_snapshots` (`user_id`,`snapshot_date`);--> statement-breakpoint
CREATE TABLE `ats_scan_history` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`job_id` text,
	`overall_score` integer NOT NULL,
	`letter_grade` text NOT NULL,
	`formatting_score` integer NOT NULL,
	`structure_score` integer NOT NULL,
	`content_score` integer NOT NULL,
	`keywords_score` integer NOT NULL,
	`issue_count` integer DEFAULT 0 NOT NULL,
	`fix_count` integer DEFAULT 0 NOT NULL,
	`report_json` text NOT NULL,
	`scanned_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `idx_ats_scan_history_user` ON `ats_scan_history` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_ats_scan_history_date` ON `ats_scan_history` (`scanned_at`);--> statement-breakpoint
CREATE TABLE `certifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`profile_id` text NOT NULL,
	`name` text NOT NULL,
	`issuer` text NOT NULL,
	`issue_date` text,
	`expiry_date` text,
	`credential_id` text,
	`url` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `chunks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`content` text NOT NULL,
	`section_type` text NOT NULL,
	`source_file` text,
	`metadata` text,
	`confidence_score` real DEFAULT 0.8,
	`superseded_by` text,
	`hash` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `idx_chunks_user` ON `chunks` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_chunks_user_section` ON `chunks` (`user_id`,`section_type`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_chunks_user_hash` ON `chunks` (`user_id`,`hash`);--> statement-breakpoint
CREATE TABLE `company_research` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`company_name` text NOT NULL,
	`summary` text,
	`key_facts_json` text,
	`interview_questions_json` text,
	`culture_notes` text,
	`recent_news` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_company_research_user_company` ON `company_research` (`user_id`,`company_name`);--> statement-breakpoint
CREATE TABLE `cover_letters` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`job_id` text NOT NULL,
	`profile_id` text NOT NULL,
	`content` text NOT NULL,
	`highlights_json` text,
	`version` integer DEFAULT 1,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `custom_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`name` text NOT NULL,
	`source_document_id` text,
	`analyzed_styles` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `idx_custom_templates_user_created` ON `custom_templates` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `documents` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`filename` text NOT NULL,
	`type` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer NOT NULL,
	`path` text NOT NULL,
	`extracted_text` text,
	`parsed_data` text,
	`uploaded_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`profile_id` text NOT NULL,
	`institution` text NOT NULL,
	`degree` text NOT NULL,
	`field` text,
	`start_date` text,
	`end_date` text,
	`gpa` text,
	`highlights_json` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `email_drafts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`type` text NOT NULL,
	`job_id` text,
	`subject` text NOT NULL,
	`body` text NOT NULL,
	`context_json` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`profile_id` text NOT NULL,
	`company` text NOT NULL,
	`title` text NOT NULL,
	`location` text,
	`start_date` text,
	`end_date` text,
	`current` integer DEFAULT false,
	`description` text,
	`highlights_json` text,
	`skills_json` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `extension_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`token` text NOT NULL,
	`device_info` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`expires_at` text NOT NULL,
	`last_used_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `extension_sessions_token_unique` ON `extension_sessions` (`token`);--> statement-breakpoint
CREATE INDEX `idx_extension_sessions_token` ON `extension_sessions` (`token`);--> statement-breakpoint
CREATE INDEX `idx_extension_sessions_user` ON `extension_sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `field_mappings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`site_pattern` text NOT NULL,
	`field_selector` text NOT NULL,
	`field_type` text NOT NULL,
	`custom_value` text,
	`enabled` integer DEFAULT true,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `generated_resumes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`job_id` text NOT NULL,
	`profile_id` text NOT NULL,
	`content_json` text NOT NULL,
	`pdf_path` text,
	`match_score` real,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `interview_answers` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`session_id` text NOT NULL,
	`question_index` integer NOT NULL,
	`answer` text NOT NULL,
	`feedback` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `interview_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`job_id` text NOT NULL,
	`profile_id` text NOT NULL,
	`mode` text DEFAULT 'text',
	`questions_json` text NOT NULL,
	`status` text DEFAULT 'in_progress',
	`started_at` text DEFAULT CURRENT_TIMESTAMP,
	`completed_at` text
);
--> statement-breakpoint
CREATE TABLE `job_status_history` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`job_id` text NOT NULL,
	`from_status` text,
	`to_status` text NOT NULL,
	`changed_at` text DEFAULT CURRENT_TIMESTAMP,
	`notes` text
);
--> statement-breakpoint
CREATE INDEX `idx_job_status_history_user_job` ON `job_status_history` (`user_id`,`job_id`,`changed_at`);--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`title` text NOT NULL,
	`company` text NOT NULL,
	`location` text,
	`type` text,
	`remote` integer DEFAULT false,
	`salary` text,
	`description` text NOT NULL,
	`requirements_json` text,
	`responsibilities_json` text,
	`keywords_json` text,
	`url` text,
	`status` text DEFAULT 'saved',
	`applied_at` text,
	`deadline` text,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `knowledge_chunks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`document_id` text NOT NULL,
	`section_type` text NOT NULL,
	`content` text NOT NULL,
	`content_hash` text NOT NULL,
	`embedding` blob,
	`metadata_json` text DEFAULT '{}',
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `idx_knowledge_chunks_user` ON `knowledge_chunks` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_knowledge_chunks_document` ON `knowledge_chunks` (`document_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_knowledge_chunks_user_hash` ON `knowledge_chunks` (`user_id`,`content_hash`);--> statement-breakpoint
CREATE INDEX `idx_knowledge_chunks_section` ON `knowledge_chunks` (`user_id`,`section_type`);--> statement-breakpoint
CREATE TABLE `learned_answers` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`question` text NOT NULL,
	`question_normalized` text NOT NULL,
	`answer` text NOT NULL,
	`source_url` text,
	`source_company` text,
	`times_used` integer DEFAULT 1,
	`last_used_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `idx_learned_answers_normalized` ON `learned_answers` (`question_normalized`);--> statement-breakpoint
CREATE INDEX `idx_learned_answers_user` ON `learned_answers` (`user_id`);--> statement-breakpoint
CREATE TABLE `llm_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`provider` text DEFAULT 'openai',
	`model` text,
	`api_key` text,
	`base_url` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `llm_settings_user_id_unique` ON `llm_settings` (`user_id`);--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`message` text,
	`link` text,
	`read` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`contact_json` text,
	`summary` text,
	`raw_text` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profile_user_id_unique` ON `profile` (`user_id`);--> statement-breakpoint
CREATE TABLE `profile_bank` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`category` text NOT NULL,
	`content` text NOT NULL,
	`source_document_id` text,
	`confidence_score` real DEFAULT 0.8,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `idx_profile_bank_user` ON `profile_bank` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_profile_bank_category` ON `profile_bank` (`user_id`,`category`);--> statement-breakpoint
CREATE TABLE `profile_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text DEFAULT 'default' NOT NULL,
	`version` integer NOT NULL,
	`snapshot_json` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `idx_profile_versions_profile` ON `profile_versions` (`profile_id`,`version`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`profile_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`url` text,
	`technologies_json` text,
	`highlights_json` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `prompt_variant_results` (
	`id` text PRIMARY KEY NOT NULL,
	`prompt_variant_id` text NOT NULL,
	`job_id` text,
	`resume_id` text,
	`match_score` real,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX `idx_prompt_variant_results_variant` ON `prompt_variant_results` (`prompt_variant_id`);--> statement-breakpoint
CREATE TABLE `prompt_variants` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`content` text NOT NULL,
	`active` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`job_id` text NOT NULL,
	`type` text DEFAULT 'follow_up',
	`title` text NOT NULL,
	`description` text,
	`due_date` text NOT NULL,
	`completed` integer DEFAULT false,
	`dismissed` integer DEFAULT false,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`completed_at` text
);
--> statement-breakpoint
CREATE TABLE `resume_ab_tracking` (
	`id` text PRIMARY KEY NOT NULL,
	`resume_id` text NOT NULL,
	`job_id` text NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`outcome` text DEFAULT 'applied' NOT NULL,
	`sent_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`notes` text
);
--> statement-breakpoint
CREATE INDEX `idx_resume_ab_tracking_resume` ON `resume_ab_tracking` (`resume_id`);--> statement-breakpoint
CREATE INDEX `idx_resume_ab_tracking_job` ON `resume_ab_tracking` (`job_id`);--> statement-breakpoint
CREATE INDEX `idx_resume_ab_tracking_user` ON `resume_ab_tracking` (`user_id`);--> statement-breakpoint
CREATE TABLE `salary_offers` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`job_id` text,
	`company` text NOT NULL,
	`role` text NOT NULL,
	`base_salary` real NOT NULL,
	`signing_bonus` real,
	`annual_bonus` real,
	`equity_value` real,
	`vesting_years` integer,
	`location` text,
	`status` text DEFAULT 'pending',
	`notes` text,
	`negotiation_outcome` text,
	`final_base_salary` real,
	`final_total_comp` real,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`value` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY(`key`, `user_id`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text DEFAULT 'default' NOT NULL,
	`profile_id` text NOT NULL,
	`name` text NOT NULL,
	`category` text DEFAULT 'other',
	`proficiency` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
