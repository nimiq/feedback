CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`reset_time` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `rate_limits_reset_time_idx` ON `rate_limits` (`reset_time`);--> statement-breakpoint
ALTER TABLE `submissions` ADD `idempotency_key` text;--> statement-breakpoint
ALTER TABLE `submissions` ADD `status` text DEFAULT 'processing' NOT NULL;--> statement-breakpoint
ALTER TABLE `submissions` ADD `logs_url` text;--> statement-breakpoint
ALTER TABLE `submissions` ADD `linear_identifier` text;--> statement-breakpoint
ALTER TABLE `submissions` ADD `slack_sent` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `submissions_idempotency_key_unique` ON `submissions` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX `submissions_status_idx` ON `submissions` (`status`);