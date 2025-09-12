import { Hono } from "hono";


const userRouter = new Hono();

userRouter.get("/me", (c) => {
  return c.json({ message: "Hello World" });
});

userRouter.post("/me/notification-token", (c) => {
  return c.json({ message: "Hello World" });
});

userRouter.get("/me/notifications", (c) => {
  return c.json({ message: "Hello World" });
});

userRouter.get("/:id/rewards", (c) => {
  return c.json({ message: "Hello World" });
});

userRouter.get("/:id/apps", (c) => {
  return c.json({ message: "Hello World" });
});

userRouter.get("/:id/transactions", (c) => {
  return c.json({ message: "Hello World" });
});


userRouter.put("/me", (c) => {
  return c.json({ message: "Hello World" });
});


export type AppType = typeof userRouter;


export default userRouter;