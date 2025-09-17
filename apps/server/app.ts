import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/bun';
import indexRoute from './api';
import { cors } from 'hono/cors';
import { cache } from 'hono/cache';
import path from 'path';

const app = new Hono();
const isDev = process.env.NODE_ENV !== 'production';
const isDocker = process.cwd() === '/app';
const isProduction = process.env.NODE_ENV === 'production';
const STATIC_ROOT =
  isDocker || isProduction
    ? path.join(process.cwd(), 'apps/web/dist')
    : path.join(process.cwd(), '../web/dist');

app.use('*', cors());
app.use('*', logger());
app.route('/api', indexRoute);
app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }));

// Cache hashed assets (JS, CSS, images, etc.) in /assets/*
app.use(
  '/assets/*',
  cache({
    cacheName: 'static-assets',
    cacheControl: 'public, max-age=31536000, immutable',
  })
);
app.use('/assets/*', serveStatic({ root: STATIC_ROOT }));

// Serve all other static files (e.g., favicon.ico, manifest.json) from dist root
app.use(
  '/*',
  cache({
    cacheName: 'static-files',
    cacheControl: 'public, max-age=31536000, immutable',
  }),
  serveStatic({
    root: STATIC_ROOT,
    rewriteRequestPath: (path) => {
      return path === '/' || !path.includes('.') ? './index.html' : path;
    },
  })
);

app.notFound((c) => c.json({ error: 'Not Found' }, 404));
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

export default app;
export type ApiRoutes = typeof indexRoute;