ALTER TABLE "user_app_interaction" ADD COLUMN "verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user_app_interaction" ADD COLUMN "verified_at" timestamp;