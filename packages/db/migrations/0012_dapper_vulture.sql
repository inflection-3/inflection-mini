ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "notification_tokens" DROP CONSTRAINT "notification_tokens_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "partner_applications" DROP CONSTRAINT "partner_applications_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "partner_applications" DROP CONSTRAINT "partner_applications_category_id_partner_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "partner_applications" DROP CONSTRAINT "partner_applications_category_name_partner_categories_name_fk";
--> statement-breakpoint
ALTER TABLE "partner_interaction" DROP CONSTRAINT "partner_interaction_app_id_partner_applications_id_fk";
--> statement-breakpoint
ALTER TABLE "partner_interaction" DROP CONSTRAINT "partner_interaction_partner_application_id_partner_applications_id_fk";
--> statement-breakpoint
ALTER TABLE "partner_interaction" DROP CONSTRAINT "partner_interaction_reward_id_rewards_id_fk";
--> statement-breakpoint
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "rewards" DROP CONSTRAINT "rewards_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "rewards" DROP CONSTRAINT "rewards_partner_application_id_partner_applications_id_fk";
--> statement-breakpoint
ALTER TABLE "user_app_interaction" DROP CONSTRAINT "user_app_interaction_interaction_id_partner_interaction_id_fk";
--> statement-breakpoint
ALTER TABLE "user_app_interaction" DROP CONSTRAINT "user_app_interaction_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_app_rewards" DROP CONSTRAINT "user_app_rewards_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_app_rewards" DROP CONSTRAINT "user_app_rewards_partner_application_id_partner_applications_id_fk";
--> statement-breakpoint
ALTER TABLE "user_app_rewards" DROP CONSTRAINT "user_app_rewards_reward_id_rewards_id_fk";
--> statement-breakpoint
ALTER TABLE "user_onboarding_rewards" DROP CONSTRAINT "user_onboarding_rewards_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_onboarding_rewards" DROP CONSTRAINT "user_onboarding_rewards_reward_id_rewards_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_tokens" ADD CONSTRAINT "notification_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_applications" ADD CONSTRAINT "partner_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_applications" ADD CONSTRAINT "partner_applications_category_id_partner_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."partner_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_applications" ADD CONSTRAINT "partner_applications_category_name_partner_categories_name_fk" FOREIGN KEY ("category_name") REFERENCES "public"."partner_categories"("name") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_interaction" ADD CONSTRAINT "partner_interaction_app_id_partner_applications_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."partner_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_interaction" ADD CONSTRAINT "partner_interaction_partner_application_id_partner_applications_id_fk" FOREIGN KEY ("partner_application_id") REFERENCES "public"."partner_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_interaction" ADD CONSTRAINT "partner_interaction_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_partner_application_id_partner_applications_id_fk" FOREIGN KEY ("partner_application_id") REFERENCES "public"."partner_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_app_interaction" ADD CONSTRAINT "user_app_interaction_interaction_id_partner_interaction_id_fk" FOREIGN KEY ("interaction_id") REFERENCES "public"."partner_interaction"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_app_interaction" ADD CONSTRAINT "user_app_interaction_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_app_rewards" ADD CONSTRAINT "user_app_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_app_rewards" ADD CONSTRAINT "user_app_rewards_partner_application_id_partner_applications_id_fk" FOREIGN KEY ("partner_application_id") REFERENCES "public"."partner_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_app_rewards" ADD CONSTRAINT "user_app_rewards_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_onboarding_rewards" ADD CONSTRAINT "user_onboarding_rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_onboarding_rewards" ADD CONSTRAINT "user_onboarding_rewards_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "public"."rewards"("id") ON DELETE cascade ON UPDATE no action;