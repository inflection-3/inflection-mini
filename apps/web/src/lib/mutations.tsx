import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  responseSchema,
  userSchema,
  userWithTokensSchema,
  partnerApplicationSchema,
  partnerInteractionSchema,
  rewardSchema,
  notificationTokenSchema,
  createAppSchema,
  updateAppSchema,
  createInteractionSchema,
  createRewardSchema,
  createCategorySchema,
  categorySchema,
  uploadResponseSchema,
} from "@mini/types";
import { api } from "./api";
import {
  userQueries,
  appsQueries,
  rewardQueries,
  notificationQueries,
  categoryQueries,
} from "./queries";
import { toast } from "sonner";

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name?: string;
      email?: string;
      phone?: string;
      walletAddress?: string;
    }) => {
      const response = await api("/user/me", {
        method: "PUT",
        body: data,
        schema: responseSchema(userSchema),
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(userQueries.me(), data);
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
      toast.error(error.message || "Failed to update profile");
    },
  });
};

export const useCreateNotificationTokenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { token: string }) => {
      const response = await api("/user/me/notification-token", {
        method: "POST",
        body: data,
        schema: responseSchema(notificationTokenSchema),
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueries.tokens() });
      toast.success("Notification token registered successfully");
    },
    onError: (error) => {
      console.error("Failed to create notification token:", error);
      toast.error(error.message || "Failed to register notification token");
    },
  });
};

// ===== AUTH MUTATIONS =====
export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dynamicAccessToken: string) => {
      const response = await api("/auth/login", {
        method: "POST",
        headers: {
          "x-dynamic-access-token": dynamicAccessToken,
        },
        schema: responseSchema(userWithTokensSchema),
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data?.accessToken!);
      localStorage.setItem("refreshToken", data?.refreshToken!);
      localStorage.setItem("userId", data?.user?.id!);
      
      queryClient.setQueryData(userQueries.me(), { id: data?.user?.id! });
      toast.success("Logged in successfully");
    },
    onError: (error) => {
      console.error("Failed to login:", error);
      toast.error(error.message || "Failed to login");
    },
  });
};

export const useRefreshTokenMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await api("/auth/refresh-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
        schema: responseSchema(z.object({
          accessToken: z.string(),
          refreshToken: z.string(),
          user: userSchema,
        })),
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data?.accessToken!);
      localStorage.setItem("refreshToken", data?.refreshToken!);
    },
    onError: (error) => {
      console.error("Failed to refresh token:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      queryClient.clear();
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
      window.location.href = "/";
    },
  });
};

// ===== APP MUTATIONS =====
export const useCreateAppMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof createAppSchema>) => {
      const response = await api("/apps", {
        method: "POST",
        body: data,
        schema: responseSchema(partnerApplicationSchema),
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appsQueries.list() });
      queryClient.invalidateQueries({ queryKey: appsQueries.featured() });
      toast.success("App created successfully");
    },
    onError: (error) => {
      console.error("Failed to create app:", error);
      toast.error(error.message || "Failed to create app");
    },
  });
};

export const useUpdateAppMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof updateAppSchema>) => {
      const { id, ...updateData } = data;
      console.log('Updating app with data:', { id, updateData });
      const response = await api(`/apps/${id}`, {
        method: "PUT",
        body: updateData,
        schema: responseSchema(partnerApplicationSchema),
      });
      console.log('Update app response:', response);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: appsQueries.list() });
      queryClient.invalidateQueries({ queryKey: appsQueries.featured() });
      queryClient.invalidateQueries({ queryKey: appsQueries.detail(variables.id) });
      toast.success("App updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update app:", error);
      toast.error(error.message || "Failed to update app");
    },
  });
};

export const useDeleteAppMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appId: string) => {
      const response = await api(`/apps/${appId}`, {
        method: "DELETE",
        schema: responseSchema(partnerApplicationSchema),
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (_, appId) => {
      queryClient.invalidateQueries({ queryKey: appsQueries.list() });
      queryClient.invalidateQueries({ queryKey: appsQueries.featured() });
      queryClient.removeQueries({ queryKey: appsQueries.detail(appId) });
      toast.success("App deleted successfully");
    },
    onError: (error) => {
      console.error("Failed to delete app:", error);
      toast.error(error.message || "Failed to delete app");
    },
  });
};

export const useCreateInteractionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof createInteractionSchema> & { appId: string }) => {
      const { appId, ...interactionData } = data;
      const response = await api(`/apps/${appId}/interactions`, {
        method: "POST",
        body: interactionData,
        schema: responseSchema(partnerInteractionSchema),
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: appsQueries.interactions(variables.appId) });
      queryClient.invalidateQueries({ queryKey: appsQueries.detail(variables.appId) });
      toast.success("Interaction created successfully");
    },
    onError: (error) => {
      console.error("Failed to create interaction:", error);
      toast.error(error.message || "Failed to create interaction");
    },
  });
};

export const useUpdateInteractionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      interactionId: string;
      interactionUrl?: string;
      verficationType?: "auto" | "api" | "manual" | "none";
      rewardId?: string;
    }) => {
      const { interactionId, ...updateData } = data;
      const response = await api(`/apps/interactions/${interactionId}`, {
        method: "PUT",
        body: updateData,
        schema: responseSchema(partnerInteractionSchema),
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appsQueries.all() });
      toast.success("Interaction updated successfully");
    },
    onError: (error) => {
      console.error("Failed to update interaction:", error);
      toast.error(error.message || "Failed to update interaction");
    },
  });
};

export const useSubmitInteractionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (interactionId: string) => {
      const response = await api(`/apps/interactions/${interactionId}/submit`, {
        method: "POST",
        schema: responseSchema(z.object({
          userInteraction: z.any(),
          reward: z.any(),
        })),
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueries.all() });
      queryClient.invalidateQueries({ queryKey: rewardQueries.all() });
      toast.success("Interaction submitted successfully");
    },
    onError: (error) => {
      console.error("Failed to submit interaction:", error);
      toast.error(error.message || "Failed to submit interaction");
    },
  });
};

// ===== REWARD MUTATIONS =====
export const useCreateRewardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof createRewardSchema>) => {
      const response = await api("/reward", {
        method: "POST",
        body: data,
        schema: responseSchema(rewardSchema),
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rewardQueries.all() });
      queryClient.invalidateQueries({ queryKey: appsQueries.all() });
      toast.success("Reward created successfully");
    },
    onError: (error) => {
      console.error("Failed to create reward:", error);
      toast.error(error.message || "Failed to create reward");
    },
  });
};

// ===== CATEGORY MUTATIONS =====
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof createCategorySchema>) => {
      const response = await api("/apps/categories", {
        method: "POST",
        body: data,
        schema: responseSchema(categorySchema),
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueries.list() });
      toast.success("Category created successfully");
    },
    onError: (error) => {
      console.error("Failed to create category:", error);
      toast.error(error.message || "Failed to create category");
    },
  });
};

// ===== UTILITY MUTATIONS =====
export const useInvalidateQueriesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (queryKey: string[]) => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useClearCacheMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      queryClient.clear();
    },
  });
};


export const useUploadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      file: File;
      resourceType: "appbanner" | "applogo" | "userprofile" | "userbanner";
      resourceId: string;
      endpoint: "user" | "apps";
    }) => {
      const { file, resourceType, resourceId, endpoint } = data;
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("resourceType", resourceType);
      formData.append("resourceId", resourceId);

      const response = await api(`/upload/${endpoint}`, {
        method: "POST",
        body: formData,
        schema: responseSchema(uploadResponseSchema),
      });
      
      if (!response.success) {
        throw new Error(response.message);
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries based on the upload type
      if (variables.endpoint === "user") {
        queryClient.invalidateQueries({ queryKey: userQueries.me() });
      } else if (variables.endpoint === "apps") {
        queryClient.invalidateQueries({ queryKey: appsQueries.detail(variables.resourceId) });
        queryClient.invalidateQueries({ queryKey: appsQueries.list() });
      }
      toast.success("File uploaded successfully");
    },
    onError: (error) => {
      console.error("Failed to upload file:", error);
      toast.error(error.message || "Failed to upload file");
    },
  });
};