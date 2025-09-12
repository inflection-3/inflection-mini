CREATE TYPE "public"."reward_type" AS ENUM('points', 'USDC', 'NFT');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."verification_type" AS ENUM('auto', 'api', 'manual', 'none');--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"title" varchar NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"category_id" uuid,
	"category_name" varchar,
	"slug" varchar NOT NULL,
	"app_name" varchar NOT NULL,
	"banner_image" varchar,
	"app_logo" varchar NOT NULL,
	"app_url" varchar NOT NULL,
	"app_description" text NOT NULL,
	"open_for_claim" boolean DEFAULT false NOT NULL,
	"app_badge_label" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "partner_applications_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "partner_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "partner_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "partner_interaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"app_id" uuid NOT NULL,
	"interaction_url" text NOT NULL,
	"partner_application_id" uuid NOT NULL,
	"verfication_type" "verification_type" DEFAULT 'auto',
	"reward_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"partner_application_id" uuid NOT NULL,
	"reward_type" "reward_type" NOT NULL,
	"amount" integer NOT NULL,
	"issued_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_app_interaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interaction_id" uuid,
	"user_id" uuid,
	"verfied_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_app_rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"partner_application_id" uuid NOT NULL,
	"reward_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dynamic_id" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar,
	"wallet_address" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_dynamic_id_unique" UNIQUE("dynamic_id"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_tokens" ADD CONSTRAINT "notification_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_applications" ADD CONSTRAINT "partner_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_applications" ADD CONSTRAINT "partner_applications_category_id_partner_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."partner_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_applications" ADD CONSTRAINT "partner_applications_category_name_partner_categories_name_fk" FOREIGN KEY ("category_name") REFERENCES "public"."partner_categories"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_interaction" ADD CONSTRAINT "partner_interaction_app_id_partner_applications_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."partner_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_interaction" ADD CONSTRAINT "partner_interaction_partner_application_id_partner_applications_id_fk" FOREIGN KEY ("partner_application_id") REFERENCES "public"."partner_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_interaction" ADD CONSTRAINT "partner_interaction_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_partner_application_id_partner_applications_id_fk" FOREIGN KEY ("partner_application_id") REFERENCES "public"."partner_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_app_interaction" ADD CONSTRAINT "user_app_interaction_interaction_id_partner_interaction_id_fk" FOREIGN KEY ("interaction_id") REFERENCES "public"."partner_interaction"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_app_interaction" ADD CONSTRAINT "user_app_interaction_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_app_rewards" ADD CONSTRAINT "user_app_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_app_rewards" ADD CONSTRAINT "user_app_rewards_partner_application_id_partner_applications_id_fk" FOREIGN KEY ("partner_application_id") REFERENCES "public"."partner_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_app_rewards" ADD CONSTRAINT "user_app_rewards_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_reward_index" ON "rewards" USING btree ("user_id","partner_application_id","reward_type");--> statement-breakpoint
CREATE INDEX "user_app_interaction_index" ON "user_app_interaction" USING btree ("user_id","interaction_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_app_interaction_unique" ON "user_app_interaction" USING btree ("user_id","interaction_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_app_reward_unique" ON "user_app_rewards" USING btree ("user_id","partner_application_id","reward_id");--> statement-breakpoint
CREATE INDEX "user_app_reward_index" ON "user_app_rewards" USING btree ("user_id","partner_application_id","reward_id");