import { Hono } from "hono";
import { authMiddleware, protectedMiddleware } from "../lib/auth";
import { AppBindings } from "../types";
import { getUser } from "../lib/users";
import { getUserPoints, getUserPointsByApp } from "../lib/apps";


const userRouter = new Hono<AppBindings>();

userRouter.get("/me", protectedMiddleware, async(c) => {
  const {
    id:userId
  } = c.get("user")
  const user = await getUser(userId)
  if(!user) {
    return c.json({ message: "User not found", success: false}, 404)
  }
  return c.json({ data: user , message: "User fetched successfully", success: true})
});


userRouter.get("/me/points", protectedMiddleware, async(c) => {
  const {
    id:userId
  } = c.get("user")
  const points = await getUserPoints(userId)
  return c.json({ data: points, message: "Points fetched successfully", success: true})
});


userRouter.get("/me/points/:appId", protectedMiddleware, async(c) => {
  const {
    id:userId
  } = c.get("user")
  const {appId} = c.req.param()
  if(!appId) {
    return c.json({ message: "App ID is required", success: false}, 400)
  }
  const points = await getUserPointsByApp(appId, userId)
  return c.json({ data: points, message: "Points fetched successfully", success: true})
});

userRouter.post("/me/notification-token", (c) => {
  return c.json({ message: "Hello World" });
});

userRouter.get("/me/notifications", (c) => {
  return c.json({ message: "Hello World" });
});

userRouter.get("/:id/rewards", authMiddleware, (c) => {
  return c.json({ message: "Hello World" });
});

userRouter.get("/:id/apps", (c) => {
  return c.json({ message: "Hello World" });
});

userRouter.get("/:id/transactions", authMiddleware, (c) => {
  return c.json({ message: "Hello World" });
});



export type AppType = typeof userRouter;


export default userRouter;