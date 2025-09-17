import { relations } from "drizzle-orm";
import {varchar, boolean, integer, pgEnum, pgTable, text, timestamp, uniqueIndex, index, uuid } from "drizzle-orm/pg-core";


export const userRole = pgEnum("user_role", ["admin", "user", "agent"]);
export const verificationType = pgEnum("verification_type", [ "api", "manual", "none"])
export const rewardType = pgEnum("reward_type", ["points", "USDC", "NFT"])

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  dynamicId: varchar("dynamic_id").notNull().unique(),
  phone: varchar("phone").notNull().unique(),
  name: varchar("name").notNull(),
  email: varchar("email"),
  role: userRole("role").notNull().default("user"),
  onboardingAgentId: uuid("onboarding_agent_id"),
  walletAddress: varchar("wallet_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  token: text("token").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})


export const partnerCategories = pgTable("partner_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})


export const partnerApplications = pgTable("partner_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  categoryId: uuid("category_id").references(() => partnerCategories.id),
  categoryName: varchar("category_name").references(() => partnerCategories.name),
  slug: varchar("slug").notNull().unique(),
  appName: varchar("app_name").notNull(),
  bannerImage: varchar("banner_image"),
  appLogo: varchar("app_logo").notNull(),
  appUrl: varchar("app_url").notNull(),
  appDescription: text("app_description").notNull(),
  openForClaim: boolean("open_for_claim").notNull().default(false),
  appBadgeLabel: varchar("app_badge_label"),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


export const partnerInteraction = pgTable("partner_interaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title"),
  description: text("description"),
  actionTitle: varchar(),
  appId: uuid("app_id").notNull().references(() => partnerApplications.id),
  interactionUrl: text("interaction_url").notNull(),
  partnerApplicationId: uuid("partner_application_id").notNull().references(() => partnerApplications.id),
  verficationType: verificationType("verfication_type").default("none"),
  rewardId: uuid("reward_id").notNull().references(() => reward.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


export const userAppInteraction = pgTable("user_app_interaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  interactionId: uuid("interaction_id").references(() => partnerInteraction.id),
  userId: uuid("user_id").references(() => users.id),
  verified: boolean("verified").notNull().default(false),
  verifiedAt: timestamp("verified_at").$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("user_app_interaction_index").on(table.userId, table.interactionId),
  uniqueIndex("user_app_interaction_unique").on(table.userId, table.interactionId),
]);


export const reward = pgTable("rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title"),
  userId: uuid("user_id").notNull().references(() => users.id),
  partnerApplicationId: uuid("partner_application_id").notNull().references(() => partnerApplications.id),
  rewardType: rewardType("reward_type").notNull(),
  amount: integer("amount").notNull(),
  issuedAt: timestamp("issued_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("user_reward_index").on(table.userId, table.partnerApplicationId, table.rewardType),
])


export const userAppReward = pgTable("user_app_rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  partnerApplicationId: uuid("partner_application_id").notNull().references(() => partnerApplications.id),
  rewardId: uuid("reward_id").references(() => reward.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  uniqueIndex("user_app_reward_unique").on(table.userId, table.partnerApplicationId, table.rewardId),
  index("user_app_reward_index").on(table.userId, table.partnerApplicationId, table.rewardId),
])


export const notification = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})


export const notificationToken = pgTable("notification_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  token: text("token").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})


export const userOnboardingReward = pgTable("user_onboarding_rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  rewardId: uuid("reward_id").notNull().references(() => reward.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})



// Relations
// User relations
export const userRelations = relations(users, ({ many }) => ({
  appInteractions: many(userAppInteraction),
  rewards: many(reward),
  appRewards: many(userAppReward),
  partnerApplications: many(partnerApplications),
}));

// Partner Applications relations
export const partnerApplicationsRelations = relations(partnerApplications, ({ one, many }) => ({
  user: one(users, {
    fields: [partnerApplications.userId],
    references: [users.id],
  }),
  interactions: many(partnerInteraction),
  userInteractions: many(userAppInteraction),
  rewards: many(reward),
  userAppRewards: many(userAppReward),
}));

// Partner Interaction relations
export const partnerInteractionRelations = relations(partnerInteraction, ({ one, many }) => ({
  partnerApplication: one(partnerApplications, {
    fields: [partnerInteraction.partnerApplicationId],
    references: [partnerApplications.id],
  }),
  reward: one(reward, {
    fields: [partnerInteraction.rewardId],
    references: [reward.id],
  }),
  userInteraction: many(userAppInteraction),
}));

export const userAppInteractionRelations = relations(userAppInteraction, ({ one }) => ({
  user: one(users, {
    fields: [userAppInteraction.userId],
    references: [users.id],
  }),
  interaction: one(partnerInteraction, {
    fields: [userAppInteraction.interactionId],
    references: [partnerInteraction.id],
  }),
}));

export const userAppRewardRelations = relations(userAppReward, ({ one }) => ({
  user: one(users, {
    fields: [userAppReward.userId],
    references: [users.id],
  }),
  partnerApplication: one(partnerApplications, {
    fields: [userAppReward.partnerApplicationId],
    references: [partnerApplications.id],
  }),
  reward: one(reward, {
    fields: [userAppReward.rewardId],
    references: [reward.id],
  }),
}));

// Reward relations
export const rewardRelations = relations(reward, ({ one }) => ({
  user: one(users, {
    fields: [reward.userId],
    references: [users.id],
  }),
  partnerApplication: one(partnerApplications, {
    fields: [reward.partnerApplicationId],
    references: [partnerApplications.id],
  }),
}));

// Refresh Tokens relations
export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));


// Notification relations
export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(users, {
    fields: [notification.userId],
    references: [users.id],
  }),
}));

// Notification Token relations
export const notificationTokenRelations = relations(notificationToken, ({ one }) => ({
  user: one(users, {
    fields: [notificationToken.userId],
    references: [users.id],
  }),
}));