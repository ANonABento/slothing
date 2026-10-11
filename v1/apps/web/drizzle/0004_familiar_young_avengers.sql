-- Future restore hook: set this column back to NULL to show onboarding again.
ALTER TABLE `user` ADD `onboarding_dismissed_at` text;
