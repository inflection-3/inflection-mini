import { relations } from "drizzle-orm";
import {varchar, boolean, integer, pgEnum, pgTable, serial, text, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";


export const userRole = pgEnum("user_role", ["admin", "user"]);
export const verficationTYpe = pgEnum("verification_type", ["auto", "api", "manual"])
export const rewardType = pgEnum("reward_type", ["points", "USDC", "NFT"])

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  dynamicId: varchar("dynamic_id").notNull().unique(),
  phone: text("phone").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  walletAddress: varchar("wallet_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


export const refreshTokens = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  token: text("token").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})


export const partnerApplications = pgTable("partner_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  slug: text("slug").notNull().unique(),
  appName: text("app_name").notNull(),
  appLogo: text("app_logo").notNull(),
  appUrl: text("app_url").notNull(),
  appDescription: text("app_description").notNull(),
  appBadgeLabel: text("app_badge_label"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


export const partnerInteraction = pgTable("partner_interaction", {
  id: serial("id").primaryKey(),
  interactionUrl: text("interaction_url").notNull(),
  partnerApplicationId: integer("partner_application_id").references(() => partnerApplications.id),
  verficationType: verficationTYpe("verfication_type").default("auto"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


export const userAppInteraction = pgTable("user_app_interaction", {
  id: serial("id").primaryKey(),
  partnerApplicationId: integer("partner_application_id").references(() => partnerApplications.id),
  userId: integer("user_id").references(() => users.id),
  verfied: boolean("verfied_at").notNull().default(false),
  verfiedAt: timestamp("verfied_at").$onUpdate(() => new Date()),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("user_app_interaction_index").on(table.userId, table.partnerApplicationId),
  uniqueIndex("user_app_interaction_unique").on(table.userId, table.partnerApplicationId),
]);


export const reward = pgTable("rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  partnerApplicationId: integer("partner_application_id").references(() => partnerApplications.id),
  rewardType: rewardType("reward_type").notNull(),
  amount: integer("amount").notNull(),
  issuedAt: timestamp("issued_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("user_reward_index").on(table.userId, table.partnerApplicationId, table.rewardType),
])


export const userAppReward = pgTable("user_app_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  partnerApplicationId: integer("partner_application_id").references(() => partnerApplications.id),
  rewardId: integer("reward_id").references(() => reward.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  uniqueIndex("user_app_reward_unique").on(table.userId, table.partnerApplicationId, table.rewardId),
  index("user_app_reward_index").on(table.userId, table.partnerApplicationId, table.rewardId),
])


export const notification = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})


export const notificationToken = pgTable("notification_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  token: text("token").notNull(),
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
  appInteractions: many(userAppInteraction),
  rewards: many(reward),
  appRewards: many(userAppReward),
}));

// Partner Interaction relations
export const partnerInteractionRelations = relations(partnerInteraction, ({ one }) => ({
  partnerApplication: one(partnerApplications, {
    fields: [partnerInteraction.partnerApplicationId],
    references: [partnerApplications.id],
  }),
}));

export const userAppInteractionRelations = relations(userAppInteraction, ({ one }) => ({
  user: one(users, {
    fields: [userAppInteraction.userId],
    references: [users.id],
  }),
  partnerApplication: one(partnerApplications, {
    fields: [userAppInteraction.partnerApplicationId],
    references: [partnerApplications.id],
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