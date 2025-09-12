import { Hono } from "hono";
import { authenticateDynamic } from "../services/dynamic";
import authRouter from "./auth";
import appsRouter from "./apps";
import rewardRouter from "./reward";
import userRouter from "./user";

const indexRoute = new Hono();

indexRoute.get("/", (c) => c.json({ message: "Welcome to Inflective" }));

indexRoute.route("/auth", authRouter);
indexRoute.route("/apps", appsRouter);
indexRoute.route("/reward", rewardRouter);
indexRoute.route("/user", userRouter);

export type AppType = typeof indexRoute;

export default indexRoute;