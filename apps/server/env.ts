import { z } from "zod";

const envSchema = z.object({
  ACCESS_TOKEN_SECRETE: z.string(),
  REFRESH_TOKEN_SECRETE: z.string(),
  DYNAMIC_ENVIRONMENT_ID: z.string(),
});

export const env = envSchema.parse(Bun.env);