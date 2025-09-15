# Multi-stage Dockerfile for Hono server with Bun and Turbo
FROM oven/bun:1.2.20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install Turbo globally
RUN bun add -g turbo@^2.5.6

# Copy the entire monorepo for pruning
COPY . .

# Generate a partial monorepo with a pruned lockfile for the server workspace
RUN turbo prune server --docker

# Install dependencies
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=deps /app/out/json/ .
COPY --from=deps /app/out/bun.lockb ./bun.lockb
RUN bun install --frozen-lockfile

# Build the project
COPY --from=deps /app/out/full/ .
RUN bun run build --filter=server

# Production image, copy all the files and run bun
FROM base AS runner
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 bunjs && \
    adduser --system --uid 1001 bunjs

# Copy the built application
COPY --from=installer --chown=bunjs:bunjs /app/apps/server/dist ./dist
COPY --from=installer --chown=bunjs:bunjs /app/apps/server/package.json ./package.json

# Copy shared packages that are needed at runtime
COPY --from=installer --chown=bunjs:bunjs /app/packages ./packages

# Install only production dependencies
RUN bun install --production --frozen-lockfile

USER bunjs

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun --version || exit 1

CMD ["bun", "run", "dist/index.js"]
