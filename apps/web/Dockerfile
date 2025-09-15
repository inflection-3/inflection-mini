# Multi-stage Dockerfile for React/Vite app with Bun and Turbo
FROM oven/bun:1.2.20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install Turbo globally
RUN bun add -g turbo@^2.5.6

# Copy the entire monorepo for pruning
COPY . .

# Generate a partial monorepo with a pruned lockfile for the web workspace
RUN turbo prune web --docker

# Install dependencies and build
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=deps /app/out/json/ .
COPY --from=deps /app/out/bun.lockb ./bun.lockb
RUN bun install --frozen-lockfile

# Build the project
COPY --from=deps /app/out/full/ .
RUN bun run build --filter=web

# Production image with nginx to serve static files
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built assets from builder stage
COPY --from=builder /app/apps/web/dist .

# Copy custom nginx configuration
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Handle client-side routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
EOF

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
