import { Hono } from "hono";
import { generateTokens, verifyDynamicAccessTokenMiddleware } from "../lib/auth";
import { db, eq } from "@mini/db/connection";
import { users } from "@mini/db/schema";

const authRouter = new Hono();


authRouter.post("/login", verifyDynamicAccessTokenMiddleware, async(c) => {
    const dynamicUserId = c.get("dynamicUserId");
    const user = await db.query.users.findFirst({
        where: eq(users.dynamicId, dynamicUserId),
    });
    if(!user) {
        const [newUser] = await db.insert(users).values({
            dynamicId: dynamicUserId,
            phone: "",
            name: "",
            email: "",
            walletAddress: "",
        }).returning();
        if(!newUser) {
            return c.json({success: false, data: null, message: "Failed to create user" }, 500);
        }
        const tokens = await generateTokens(newUser.id);
        return c.json({success: true, data: {
            userId: newUser.id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        }, message: "Logged in successfully" });
    }
    const tokens = await generateTokens(user.id);
    return c.json({success: true, data: {
        userId: user.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    }, message: "Logged in successfully" });

});

authRouter.post("/refresh-token", (c) => {
  return c.json({ message: "Hello World" });
});

export type AppType = typeof authRouter;

export default authRouter;