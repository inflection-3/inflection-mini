import { z } from "zod";
import { up } from "up-fetch";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:9999/api";

const upfetch = up(fetch, () => ({
  baseUrl: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  onRequest: (options) => {
    const token = localStorage.getItem("accessToken");
    console.log("API Request - Token:", token ? "Present" : "Missing");
    if (token) {
      (options as any).headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  },
}));

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  schema?: z.ZodType;
};

export async function api<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    params,
    schema,
  } = options;

  try {
    const data = await upfetch<T>(endpoint, {
      method,
      body,
      headers,
      params,
      schema,
    });

    return data as T;
  } catch (error: any) {
    if (error.data?.message) {
      throw new Error(error.data.message);
    }
    
    if (error.status) {
      throw new Error(`HTTP ${error.status}: ${error.statusText || 'Request failed'}`);
    }
    
    throw error;
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}
