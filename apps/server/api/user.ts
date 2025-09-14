import { Hono } from "hono";
import { authMiddleware, protectedMiddleware } from "../lib/auth";
import { AppBindings } from "../types";
import { getUser } from "../lib/users";


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