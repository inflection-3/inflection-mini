import { Hono } from "hono";
import { generateTokens } from "../lib/auth";
import { db, eq } from "@mini/db/connection";
import { users } from "@mini/db/schema";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { authenticateDynamic } from "../services/dynamic";

const authRouter = new Hono();

const loginSchema = z.object({
    name: z.string().optional(),
    phone: z.string(),
    walletAddress: z.string().optional(),
    email: z.string().optional(),
});


authRouter.post("/login", zValidator("json", loginSchema), authenticateDynamic(), async(c) => {
    const { name: userName, email, phone, walletAddress } = c.req.valid("json");
    const dynamicUserId = c.get("dynamicUserId");
    const user = await db.query.users.findFirst({
        where: eq(users.dynamicId, dynamicUserId),
    });
    if(!user) {
        const [newUser] = await db.insert(users).values({
            dynamicId: dynamicUserId,   
            phone: phone,
            email: email ?? "",
            walletAddress: walletAddress ?? "",
            name: userName ?? "",
        }).returning();
        if(!newUser) {
            return c.json({success: false, data: null, message: "Failed to create user" }, 500);
        }
        const tokens = await generateTokens(newUser.id);
        return c.json({success: true, data: {
            user: newUser,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        }, message: "Logged in successfully" });
    }
    const tokens = await generateTokens(user.id);
    return c.json({success: true, data: {
        user: user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    }, message: "Logged in successfully" });

});

authRouter.post("/refresh-token", (c) => {
  return c.json({ message: "Hello World" });
});

export type AppType = typeof authRouter;

export default authRouter;