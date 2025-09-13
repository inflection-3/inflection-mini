import { Context, Next } from "hono";
import { AppBindings } from "../../types";
import { getUser } from "../../lib/users";

export const adminApiMiddleware = async (c: Context<AppBindings>, next: Next) => {
  const { userId } = c.get("jwtPayload");
  const user = await getUser(userId);
  if (user?.role !== "admin") {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
};