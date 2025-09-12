import { InferSelectModel } from "@mini/db/connection";
import { users } from "@mini/db/schema";
import { Hono } from "hono";


export interface AppBindings {
  Variables: {
    requestId: string;
    dynamicUserId: string;
    user: InferSelectModel<typeof users>;
    jwtPayload: {
      userId: string;
    };
  };
}

export type HonoApi = Hono<AppBindings>;
