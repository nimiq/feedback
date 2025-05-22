CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`app` text NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`email` text,
	`rating` integer,
	`attachments` text,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`github_issue` text,
	CONSTRAINT "rating" CHECK("submissions"."rating" >= 1 AND "submissions"."rating" <= 5)
);
--> statement-breakpoint
CREATE INDEX `submissions_app_idx` ON `submissions` (`app`);--> statement-breakpoint
CREATE INDEX `submissions_type_idx` ON `submissions` (`type`);