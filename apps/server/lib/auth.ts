import {  users } from "@mini/db/schema";
import { jwt, sign } from "hono/jwt";
import { createMiddleware } from "hono/factory";
import {db} from "@mini/db/connection";
import { eq, InferSelectModel } from "drizzle-orm";
import { env } from "../env";
import { AppBindings } from "../types";
import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { authenticateDynamic, extractToken, verifyTokenDynamicToken } from "../services/dynamic";


export type AUTH_TOKENS = {
  refreshToken: string;
  accessToken: string;
  refreshTokenExpiryDate: Date;
  accessTokenExpiryDate: Date;
};

export const authMiddleware = jwt({
    secret: env.ACCESS_TOKEN_SECRETE,
    alg: "HS256",
  });


export const protectedMiddleware = async (
    c: Context<AppBindings>,
    next: () => Promise<void>
  ) => {
    try {
      const authHeader = c.req.header('x-dynamic-access-token');
      const token = extractToken(authHeader);

      if (!token) {
        return c.json({ error: 'Authorization token required' }, 401);
      }

      const decodedToken = await verifyTokenDynamicToken(token);
      await authMiddleware(c, async () => {
        const payload = c.get("jwtPayload");
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, payload.userId));
  
        if (!user) {
          throw new HTTPException(401, { message: "User not found" });
        }
  
        c.set("user", user);
        await next();
      });
    } catch (error) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }
  };

export const protectedRouteMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const payload = c.get("jwtPayload");

  if (!payload || !payload.userId) {
    return c.json(
      {
        success: false,
        error: "Unauthorized",
      },
      401
    );
  }

  const [userRecord] = await db
    .select()
    .from(users)
    .where(eq(users.id, payload.userId));

  if (!userRecord) {
    return c.json(
      {
        success: false,
        error: "User not found",
      },
      404
    );
  }

  c.set("user", userRecord);
  await next();
});


// export const verifyDynamicAccessTokenMiddleware = createMiddleware<AppBindings>(async (c, next,) => {
//     const dynamicAccessToken = c.req.header("x-dynamic-access-token");
//     console.log(dynamicAccessToken);

//     if (!dynamicAccessToken) {
//         return c.json({ error: "Forbidden" }, 403);
//     }

//     const user = await db.select().from(users).where(eq(users.dynamicId, dynamicAccessToken));
    
//   if (!user?.length) {
//     return c.json({ error: "Not found" }, 404);
//   }
//   console.log(user);
//   await next();
// });


export async function generateTokens(userId: string) {
  const accessToken = await sign(
    { userId, exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 },
    env.ACCESS_TOKEN_SECRETE,
    "HS256"
  );

  const refreshToken = await sign(
    { userId, exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 },
    env.REFRESH_TOKEN_SECRETE,
    "HS256"
  );
  return { accessToken, refreshToken };
}