import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import indexRoute from "./api";
import { cors } from "hono/cors";
import { cache } from "hono/cache";
import path from "path";

const app = new Hono();

const isDev = process.env.NODE_ENV !== 'production';

app.use("*", cors());
app.use("*", logger());

app.route("/api", indexRoute);

app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }));

const isDocker = process.cwd() === '/app';
const isProduction = process.env.NODE_ENV === 'production';
const STATIC_ROOT = isDocker || isProduction
  ? path.join(process.cwd(), 'apps/web/dist')
  : path.join(process.cwd(), '../web/dist');

if (!isDev) {
  app.use('/assets/*', cache({
    cacheName: 'static-assets',
    cacheControl: 'public, max-age=31536000, immutable'
  }));
}

app.use('/assets/*', serveStatic({ root: STATIC_ROOT }));

const staticFiles = [
  'favicon.ico', 'manifest.json', 'robots.txt',
  'buy-sell.svg', 'card.svg', 'invest.svg', 'network.svg', 
  'partner-app-icon.svg', 'scan.svg', 'test.svg',
  'logo192.png', 'logo512.png',
  'android-chrome-192x192.png', 'android-chrome-512x512.png',
  "dollor.svg"
];

staticFiles.forEach(file => {
  app.get(`/${file}`, serveStatic({ root: STATIC_ROOT }));
});

app.get('*', serveStatic({ 
  root: STATIC_ROOT,
  path: './index.html'
}));

app.notFound((c) => c.json({ error: "Not Found" }, 404));

app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
export type ApiRoutes = typeof indexRoute;