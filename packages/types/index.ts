import { z } from "zod";

export const responseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema.optional(),
  });


export const loginSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  walletAddress: z.string().optional(),
  name: z.string().optional(),
});


export const userSchema = z.object({
  id: z.string().uuid(),
  dynamicId: z.string(),
  phone: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  walletAddress: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  role: z.enum(["admin", "user", "agent"]),
  onboardingAgentId: z.string().uuid().nullable(),
});

export const userWithTokensSchema = z.object({
  user: userSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

// Partner Category schemas
export const partnerCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const partnerApplicationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  categoryId: z.string().uuid().nullable(),
  categoryName: z.string().nullable(),
  slug: z.string(),
  appName: z.string(),
  bannerImage: z.string().nullable(),
  appLogo: z.string(),
  appUrl: z.string(),
  appDescription: z.string(),
  openForClaim: z.boolean(),
  appBadgeLabel: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});


export const createAppSchema = z.object({
  categoryId: z.string().min(1),
  slug: z.string().min(1),
  appName: z.string().min(1),
  appUrl: z.string().min(1),
  appDescription: z.string().min(1),
  appBadgeLabel: z.string().min(1),
});

export const updateAppSchema = createAppSchema.partial().extend({
  id: z.string(),
});

// Partner Interaction schemas
export const partnerInteractionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  actionTitle: z.string().nullable(),
  interactionUrl: z.string(),
  verificationType: z.enum(["auto", "api", "manual", "none"]),
  rewardId: z.string(),
  appId: z.string(),
});

export const createInteractionSchema = z.object({
  actionTitle: z.string(),  
  title: z.string(),
  description: z.string(),
  interactionUrl: z.string(),
  verificationType: z.enum(["auto", "api", "manual", "none"]),
  rewardId: z.string(),
  appId: z.string(),
});

// User App Interaction schemas
export const userAppInteractionSchema = z.object({
  actionTitle: z.string().nullable(),
  id: z.string().uuid(),
  interactionId: z.string().uuid().nullable(),
  userId: z.string().uuid().nullable(),
  verified: z.boolean(),
  verifiedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Reward schemas
export const rewardSchema = z.object({
  title: z.string().nullable(),
  id: z.string().uuid(),
  userId: z.string().uuid(),
  partnerApplicationId: z.string().uuid(),
  rewardType: z.enum(["points", "USDC", "NFT"]),
  amount: z.number(),
  issuedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createRewardSchema = z.object({
  title: z.string(),
  rewardType: z.enum(["points", "USDC", "NFT"]),
  amount: z.number(),
  appId: z.string(),
});

// User App Reward schemas
export const userAppRewardSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  partnerApplicationId: z.string().uuid(),
  rewardId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Notification schemas
export const notificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable(),
  title: z.string(),
  message: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const notificationTokenSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  token: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Extended schemas with relations

export const userWithDetailsSchema = userSchema.extend({
  appInteractions: z.array(userAppInteractionSchema).optional(),
  rewards: z.array(rewardSchema).optional(),
  appRewards: z.array(userAppRewardSchema).optional(),
  partnerApplications: z.array(partnerApplicationSchema).optional(),
});


export const createCategorySchema = z.object({
  name: z.string().min(1),
});

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Upload schemas
export const uploadSchema = z.object({
  resourceType: z.enum(['appbanner', 'applogo', "userprofile", "userbanner"]),
  resourceId: z.string(),
  file: z.instanceof(File),
});

export const uploadResponseSchema = z.object({
  publicUrl: z.string(),
  key: z.string(),
  response: z.any(),
});


export const partnerApplicationWithDetailsSchema = z.any();

export type User = z.infer<typeof userSchema>;
export type UserWithTokens = z.infer<typeof userWithTokensSchema>;
export type PartnerCategory = z.infer<typeof partnerCategorySchema>;
export type PartnerApplication = z.infer<typeof partnerApplicationSchema>;
export type PartnerApplicationWithDetails = z.infer<typeof partnerApplicationWithDetailsSchema>;
export type CreateApp = z.infer<typeof createAppSchema>;
export type UpdateApp = z.infer<typeof updateAppSchema>;
export type PartnerInteraction = z.infer<typeof partnerInteractionSchema>;
export type CreateInteraction = z.infer<typeof createInteractionSchema>;
export type UserAppInteraction = z.infer<typeof userAppInteractionSchema>;
export type Reward = z.infer<typeof rewardSchema>;
export type CreateReward = z.infer<typeof createRewardSchema>;
export type UserAppReward = z.infer<typeof userAppRewardSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type NotificationToken = z.infer<typeof notificationTokenSchema>;
export type UserWithDetails = z.infer<typeof userWithDetailsSchema>;
export type Login = z.infer<typeof loginSchema>;
export type CreateCategory = z.infer<typeof createCategorySchema>;
export type Category = z.infer<typeof categorySchema>;
export type Upload = z.infer<typeof uploadSchema>;
export type UploadResponse = z.infer<typeof uploadResponseSchema>;

// API Response wrapper
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};