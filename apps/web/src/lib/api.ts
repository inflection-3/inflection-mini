import { z } from "zod";
import { up } from "up-fetch";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:9999/api";

const upfetch = up(fetch, () => ({
  baseUrl: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
}));

type RequestOptions<T extends z.ZodType = z.ZodType> = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
  schema?: T;
};

export async function api<T extends z.ZodType>(
  endpoint: string,
  options: RequestOptions<T> = {}
): Promise<T extends z.ZodType ? z.infer<T> : any> {
  const {
    method = "GET",
    body,
    headers = {},
    params,
    schema,
  } = options;

  // Add authorization header if token exists
  const token = localStorage.getItem("accessToken");
  
  const requestHeaders = {
    ...headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const data = await upfetch(endpoint, {
      method,
      body,
      headers: requestHeaders,
      params,
      schema,
    });

    return data;
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
