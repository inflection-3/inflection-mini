CREATE TYPE "public"."reward_type" AS ENUM('points', 'USDC', 'NFT');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."verification_type" AS ENUM('auto', 'api', 'manual');--> statement-breakpoint
CREATE TABLE "partner_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"slug" text NOT NULL,
	"app_name" text NOT NULL,
	"app_logo" text NOT NULL,
	"app_url" text NOT NULL,
	"app_description" text NOT NULL,
	"app_badge_label" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "partner_applications_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "partner_interaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"interaction_url" text NOT NULL,
	"partner_application_id" integer,
	"verfication_type" "verification_type" DEFAULT 'auto',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"partner_application_id" integer,
	"reward_type" "reward_type" NOT NULL,
	"amount" integer NOT NULL,
	"issued_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_app_interaction" (
	"id" serial PRIMARY KEY NOT NULL,
	"partner_application_id" integer,
	"user_id" integer,
	"verfied_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_app_rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"partner_application_id" integer,
	"reward_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"dynamic_id" varchar NOT NULL,
	"phone" text NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"wallet_address" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_dynamic_id_unique" UNIQUE("dynamic_id"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "partner_applications" ADD CONSTRAINT "partner_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_interaction" ADD CONSTRAINT "partner_interaction_partner_application_id_partner_applications_id_fk" FOREIGN KEY ("partner_application_id") REFERENCES "public"."partner_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_partner_application_id_partner_applications_id_fk" FOREIGN KEY ("partner_application_id") REFERENCES "public"."partner_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_app_interaction" ADD CONSTRAINT "user_app_interaction_partner_application_id_partner_applications_id_fk" FOREIGN KEY ("partner_application_id") REFERENCES "public"."partner_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_app_interaction" ADD CONSTRAINT "user_app_interaction_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_app_rewards" ADD CONSTRAINT "user_app_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_app_rewards" ADD CONSTRAINT "user_app_rewards_partner_application_id_partner_applications_id_fk" FOREIGN KEY ("partner_application_id") REFERENCES "public"."partner_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_app_rewards" ADD CONSTRAINT "user_app_rewards_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_reward_index" ON "rewards" USING btree ("user_id","partner_application_id","reward_type");--> statement-breakpoint
CREATE INDEX "user_app_interaction_index" ON "user_app_interaction" USING btree ("user_id","partner_application_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_app_interaction_unique" ON "user_app_interaction" USING btree ("user_id","partner_application_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_app_reward_unique" ON "user_app_rewards" USING btree ("user_id","partner_application_id","reward_id");--> statement-breakpoint
CREATE INDEX "user_app_reward_index" ON "user_app_rewards" USING btree ("user_id","partner_application_id","reward_id");