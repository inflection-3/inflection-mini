//@ts-nocheck
//@ts-ignore

import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import {
  responseSchema,
  userSchema,
  userWithTokensSchema,
  partnerApplicationSchema,
  partnerInteractionSchema,
  rewardSchema,
  notificationSchema,
  notificationTokenSchema,
  categorySchema,
} from "@mini/types";
import { api } from "./api";

// ===== USER QUERIES =====
export const userQueries = {
  all: () => ["users"] as const,
  me: () => [...userQueries.all(), "me"] as const,
  notifications: () => [...userQueries.all(), "notifications"] as const,
  userRewards: (userId: string) => [...userQueries.all(), userId, "rewards"] as const,
  userApps: (userId: string) => [...userQueries.all(), userId, "apps"] as const,
  userTransactions: (userId: string) => [...userQueries.all(), userId, "transactions"] as const,

  meOptions: (enabled: boolean = true) =>
    queryOptions({
      queryKey: userQueries.me(),
      queryFn: async () => {
        const response = await api("/user/me", {
          schema: responseSchema(userSchema),
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      },
      retry: false,
      staleTime: 5 * 60 * 1000,
      enabled: enabled,
    }),

  notificationsOptions: (enabled: boolean = true) =>
    queryOptions({
      queryKey: userQueries.notifications(),
      queryFn: async () => {
        const response = await api("/user/me/notifications", {
          schema: responseSchema(z.array(notificationSchema)),
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      },
      staleTime: 1 * 60 * 1000,
      enabled: enabled,
    }),

  userRewardsOptions: (userId: string, enabled: boolean = true) =>
    queryOptions({
      queryKey: userQueries.userRewards(userId),
      queryFn: async () => {
        const response = await api(`/user/${userId}/rewards`, {
          schema: responseSchema(z.array(rewardSchema)),
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      },
      staleTime: 2 * 60 * 1000,
      enabled: enabled,
    }),

  userAppsOptions: (userId: string, enabled: boolean = true) =>
    queryOptions({
      queryKey: userQueries.userApps(userId),
      queryFn: async () => {
        const response = await api(`/user/${userId}/apps`, {
          schema: responseSchema(z.array(partnerApplicationSchema)),
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
      enabled: enabled,
    }),

  userTransactionsOptions: (userId: string, enabled: boolean = true) =>
    queryOptions({
      queryKey: userQueries.userTransactions(userId),
      queryFn: async () => {
        const response = await api(`/user/${userId}/transactions`, {
          schema: responseSchema(z.array(z.any())), // Define proper transaction schema
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      },
      staleTime: 1 * 60 * 1000,
      enabled: enabled,
    }),
};

// ===== AUTH QUERIES =====
export const authQueries = {
  all: () => ["auth"] as const,
  login: () => [...authQueries.all(), "login"] as const,
  refreshToken: () => [...authQueries.all(), "refresh-token"] as const,

  loginOptions: (enabled: boolean = false) =>
    queryOptions({
      queryKey: authQueries.login(),
      queryFn: async () => {
        const response = await api("/auth/login", {
          method: "POST",
          schema: responseSchema(userWithTokensSchema),
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      },
      enabled: enabled,
    }),

  refreshTokenOptions: (enabled: boolean = false) =>
    queryOptions({
      queryKey: authQueries.refreshToken(),
      queryFn: async () => {
        const response = await api("/auth/refresh-token", {
          method: "POST",
          schema: responseSchema(z.any()),
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      },
      enabled: enabled,
    }),
};

// ===== APPS QUERIES =====
export const appsQueries = {
  all: () => ["apps"] as const,
  list: () => [...appsQueries.all(), "list"] as const,
  featured: () => [...appsQueries.all(), "featured"] as const,
  detail: (id: string) => [...appsQueries.all(), "detail", id] as const,
  interactions: (id: string) => [...appsQueries.all(), "interactions", id] as const,
  interactionsSubmited: (id: string, interactionId: string) => [...appsQueries.all(), "interactions", id, "submited", interactionId] as const,

  listOptions: (enabled: boolean = true) =>
    queryOptions({
      queryKey: appsQueries.list(),
      queryFn: async () => {
        const response = await api("/apps", {
          schema: responseSchema(z.array(partnerApplicationSchema)),
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
      enabled: enabled,
    }),

  featuredOptions: (enabled: boolean = true) =>
    queryOptions({
      queryKey: appsQueries.featured(),
      queryFn: async () => {
        const response = await api("/apps/featured", {
          schema: responseSchema(z.array(partnerApplicationSchema)),
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      },
      staleTime: 10 * 60 * 1000,
      enabled: enabled,
    }),

  detailOptions: (id: string, enabled: boolean = true) =>
    queryOptions({
      queryKey: appsQueries.detail(id),
      queryFn: async () => {
         const response = await api(`/apps/${id}`, {
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;  
       
      },
      staleTime: 5 * 60 * 1000,
      enabled: enabled,
    }),

  interactionsOptions: (id: string, enabled: boolean = true) =>
    queryOptions({
      queryKey: appsQueries.interactions(id),
      queryFn: async () => {
        const response = await api(`/apps/${id}/interactions`, {
          schema: responseSchema(z.array(partnerInteractionSchema)),
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      },
      staleTime: 2 * 60 * 1000,
      enabled: enabled,
    }),

  interactionsSubmitedOptions: (id: string, enabled: boolean = true) =>
    queryOptions({
      queryKey: appsQueries.interactionsSubmited(id, id),
      queryFn: async () => {
        const response = await api(`/apps/interactions/${id}/submited`, {
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      },
    }),
};

// ===== REWARD QUERIES =====
export const rewardQueries = {
  all: () => ["rewards"] as const,
  list: () => [...rewardQueries.all(), "list"] as const,
  detail: (id: string) => [...rewardQueries.all(), "detail", id] as const,

  listOptions: (enabled: boolean = true) =>
    queryOptions({
      queryKey: rewardQueries.list(),
      queryFn: async () => {
        const response = await api("/reward", {
          schema: responseSchema(z.array(rewardSchema)),
        });
        console.log(response.data);
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
      enabled: enabled,
    }),

  detailOptions: (id: string, enabled: boolean = true) =>
    queryOptions({
      queryKey: rewardQueries.detail(id),
      queryFn: async () => {
        const response = await api(`/reward/${id}`, {
          schema: responseSchema(rewardSchema),
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
      enabled: enabled,
    }),
};

// ===== NOTIFICATION QUERIES =====
export const notificationQueries = {
  all: () => ["notifications"] as const,
  tokens: () => [...notificationQueries.all(), "tokens"] as const,

  tokensOptions: (enabled: boolean = true) =>
    queryOptions({
      queryKey: notificationQueries.tokens(),
      queryFn: async () => {
        const response = await api("/user/me/notification-token", {
          schema: responseSchema(z.array(notificationTokenSchema)),
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      },
      staleTime: 10 * 60 * 1000,
      enabled: enabled,
    }),
};

// ===== CATEGORY QUERIES =====
export const categoryQueries = {
  all: () => ["categories"] as const,
  list: () => [...categoryQueries.all(), "list"] as const,

  listOptions: (enabled: boolean = true) =>
    queryOptions({
      queryKey: categoryQueries.list(),
      queryFn: async () => {
        const response = await api("/apps/categories", {
          schema: responseSchema(z.array(categorySchema)),
        });
        if (!response.success) {
          throw new Error(response.message);
        }
        return response.data;
      },
      staleTime: 10 * 60 * 1000,
      enabled: enabled,
    }),
};
