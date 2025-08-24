import { Hono } from "hono";
import { authenticateDynamic } from "../services/dynamic";

const indexRoute = new Hono();

indexRoute.get("/", (c) => c.json({ message: "Welcome to Inflective" }));

indexRoute.get("/test", authenticateDynamic(), (c) => c.json({ message: c.get("dynamicUserId") }));

export default indexRoute;