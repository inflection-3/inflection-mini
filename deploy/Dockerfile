# Combined Dockerfile for Hono server + React frontend
FROM oven/bun:1.2.20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install Turbo globally
RUN bun add -g turbo@^2.5.6

# Copy the entire monorepo for pruning
COPY . .

# Generate a partial monorepo with pruned lockfiles for both workspaces
RUN turbo prune server --docker

# Install dependencies and build everything
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=deps /app/out/json/ .
COPY --from=deps /app/out/bun.lockb ./bun.lockb
RUN bun install --frozen-lockfile

# Build both server and web
COPY --from=deps /app/out/full/ .
RUN bun run build --filter=server
RUN bun run build --filter=web

# Production image with both server and frontend
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 bunjs && \
    adduser --system --uid 1001 bunjs

# Copy the built server
COPY --from=builder --chown=bunjs:bunjs /app/apps/server/dist ./dist

# Copy the built frontend to where Hono expects it
COPY --from=builder --chown=bunjs:bunjs /app/apps/web/dist ./frontend/dist

# Copy server package.json and shared packages
COPY --from=builder --chown=bunjs:bunjs /app/apps/server/package.json ./package.json
COPY --from=builder --chown=bunjs:bunjs /app/packages ./packages

# Install only production dependencies for the server
RUN bun install --production --frozen-lockfile

USER bunjs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun --version || exit 1

CMD ["bun", "run", "dist/index.js"]