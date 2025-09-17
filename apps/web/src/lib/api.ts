// @ts-ignore
// @ts-nocheck
// @ts-expect-error

import { z } from "zod";
import { up } from "up-fetch";
import { getAuthToken } from "@dynamic-labs/sdk-react-core";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://app.inflection.network/api";

const upfetch = up(fetch, () => ({
  baseUrl: API_BASE_URL,
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

  const token = localStorage.getItem("accessToken");
  const tokenDynamic = getAuthToken();
  
  const isFormData = body instanceof FormData;
  const baseHeaders = isFormData ? {} : { "Content-Type": "application/json" };
  
  const requestHeaders = {
    ...baseHeaders,
    ...headers,
    ...(token && { Authorization: `Bearer ${token}`, "x-dynamic-access-token": tokenDynamic }),
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
    // Log schema validation errors with detailed information
    if (error.name === 'ZodError' || error.issues) {
      console.error('🔴 Schema Validation Error:', {
        endpoint,
        method,
        error: error.issues || error.message,
        receivedData: error.data,
        expectedSchema: schema?.description || 'Unknown schema',
        timestamp: new Date().toISOString(),
      });
      
      // Format Zod errors for better readability
      if (error.issues) {
        const formattedErrors = error.issues.map((issue: any) => ({
          path: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
          received: issue.received,
          expected: issue.expected,
        }));
        console.error('📋 Detailed Validation Errors:', formattedErrors);
      }
    }
    
    // Log other API errors
    if (error.data?.message) {
      console.error('🔴 API Error:', {
        endpoint,
        method,
        message: error.data.message,
        status: error.status,
        timestamp: new Date().toISOString(),
      });
      throw new Error(error.data.message);
    }
    
    if (error.status) {
      console.error('🔴 HTTP Error:', {
        endpoint,
        method,
        status: error.status,
        statusText: error.statusText,
        timestamp: new Date().toISOString(),
      });
      throw new Error(`HTTP ${error.status}: ${error.statusText || 'Request failed'}`);
    }
    
    // Log unexpected errors
    console.error('🔴 Unexpected Error:', {
      endpoint,
      method,
      error: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    
    throw error;
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}