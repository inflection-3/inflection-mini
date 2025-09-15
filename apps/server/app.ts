// Alternative approach - serve everything from dist first, then handle API
import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import indexRoute from "./api";
import { cors } from "hono/cors";
import { existsSync } from "fs";
import path from "path";

const app = new Hono();

// Debug middleware
app.use('*', async (c, next) => {
  const url = new URL(c.req.url);
  console.log(`Request: ${c.req.method} ${url.pathname}`);
  await next();
});

app.use("*", logger());
app.use("*", cors());

const STATIC_ROOT = "../web/dist";
console.log(`Serving static files from: ${STATIC_ROOT}`);

// API routes first (more specific)
const apiRoutes = app.basePath("/api").route("/", indexRoute);

// Then serve static files with a custom middleware that checks file existence
app.use('*', async (c, next) => {
  const url = new URL(c.req.url);
  const pathname = url.pathname;
  
  // Skip API routes
  if (pathname.startsWith('/api/')) {
    await next();
    return;
  }
  
  // Check if the requested file exists in the static directory
  const filePath = path.join(process.cwd(), STATIC_ROOT, pathname);
  
  if (existsSync(filePath)) {
    console.log(`Serving static file: ${pathname} from ${filePath}`);
    return serveStatic({ root: STATIC_ROOT })(c, next);
  }
  
  // If it's not a file request (no extension) or file doesn't exist, 
  // serve index.html for SPA routing
  if (!pathname.includes('.') || pathname.endsWith('/')) {
    console.log(`Serving SPA route: ${pathname}`);
    return serveStatic({ 
      root: STATIC_ROOT,
      path: './index.html'
    })(c, next);
  }
  
  // File doesn't exist, continue to next middleware
  await next();
});

app.notFound((c) => c.json({ error: "Not Found" }, 404));

app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
export type ApiRoutes = typeof apiRoutes;