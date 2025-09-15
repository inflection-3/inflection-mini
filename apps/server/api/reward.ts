import { Hono } from "hono";
import { AppBindings } from "../types";
import { zValidator } from "@hono/zod-validator";
import { idSchema } from "./apps";
import { createAppReward, getReward, getRewards } from "../lib/apps";
import z from "zod";
import { authMiddleware } from "../lib/auth";
import { adminApiMiddleware } from "./middleware/admin-api";

const rewardRouter = new Hono<AppBindings>();

const rewardSchema = z.object({
  title: z.string(),
  rewardType: z.enum(["points", "USDC", "NFT"]),
  amount: z.number(),
  appId: z.string(),
});

rewardRouter.get("/", async (c) => {
  const rewards = await getRewards();
  return c.json({ data: rewards, success: true, message: "Rewards fetched successfully" });
});


rewardRouter.get("/:id", zValidator("param", idSchema), async (c) => {
    const { id } = c.req.valid("param");
  const rewards = await getReward(id);
  if(!rewards) {
    return c.json({ rewards: null, success: false }, 404);
  }
  return c.json({ rewards, success: true, message: "Reward fetched successfully" });
});

rewardRouter.post("/", zValidator("json", rewardSchema), authMiddleware, adminApiMiddleware, async (c) => {
  const { rewardType, amount, appId, title } = c.req.valid("json");
  const { userId } = c.get("jwtPayload");
  const rewards = await createAppReward({
    title,
    rewardType,
    amount,
    userId,
    partnerApplicationId: appId,
  });
  if(!rewards) {
    return c.json({ rewards: null, success: false }, 404);
  }
  return c.json({ rewards, success: true, message: "Reward created successfully" });
});


export type AppType = typeof rewardRouter;


export default rewardRouter;