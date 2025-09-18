# Build stage: Install dependencies and build everything
FROM oven/bun:1.2.20-alpine AS builder
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

# Accept DATABASE_URL as build argument (if needed for build-time operations)
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Install Turbo globally
RUN bun add turbo --global

# Copy workspace files
COPY package.json bun.lock turbo.json ./
COPY apps/web ./apps/web
COPY packages ./packages

# Copy .env file if it exists
COPY .env* ./

# Install all dependencies and build
RUN bun install 
RUN bun run turbo build

# Verify web app build artifacts exist (should be static files for Vite)
RUN ls -la apps/web/dist/

# Production stage: Serve static files
FROM oven/bun:1.2.20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 bunjs && \
    adduser --system --uid 1001 bunjs

# Install serve globally for static file serving
RUN bun add serve --global

# Copy ONLY the built web app static files
COPY --from=builder --chown=bunjs:bunjs /app/apps/web/dist ./dist

# Switch to non-root user
USER bunjs

# Expose port 3000
EXPOSE 3000

ENV NODE_ENV=production

# Serve static files with SPA routing support
CMD ["bunx", "serve", "-s", "dist", "-l", "3000"]