ALTER TABLE "partner_interaction" ALTER COLUMN "verfication_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "partner_interaction" ALTER COLUMN "verfication_type" SET DEFAULT 'none'::text;--> statement-breakpoint
DROP TYPE "public"."verification_type";--> statement-breakpoint
CREATE TYPE "public"."verification_type" AS ENUM('api', 'manual', 'none');--> statement-breakpoint
ALTER TABLE "partner_interaction" ALTER COLUMN "verfication_type" SET DEFAULT 'none'::"public"."verification_type";--> statement-breakpoint
ALTER TABLE "partner_interaction" ALTER COLUMN "verfication_type" SET DATA TYPE "public"."verification_type" USING "verfication_type"::"public"."verification_type";