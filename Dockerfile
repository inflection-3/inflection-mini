
# Build stage: Install dependencies and build everything
FROM oven/bun:1.2.20-alpine AS builder
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

# Install Turbo globally
RUN bun add turbo --global

# Copy workspace files
COPY package.json bun.lock turbo.json ./
COPY apps ./apps
COPY packages ./packages
# Copy .env file if it exists
COPY .env* ./

# Install all dependencies and build
RUN bun install 
RUN bun run turbo build

# Verify build artifacts exist
RUN ls -la apps/server/dist/ && \
    ls -la apps/web/dist/ && \
    ls -la packages/db/dist/ && \
    ls -la packages/types/dist/

# Production stage: Minimal runtime image
FROM oven/bun:1.2.20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 bunjs && \
    adduser --system --uid 1001 bunjs

# Copy ONLY the built artifacts (no source code, no node_modules)
COPY --from=builder --chown=bunjs:bunjs /app/apps/server/dist ./apps/server/dist
COPY --from=builder --chown=bunjs:bunjs /app/apps/web/dist ./apps/web/dist
COPY --from=builder --chown=bunjs:bunjs /app/packages/db/dist ./packages/db/dist
COPY --from=builder --chown=bunjs:bunjs /app/packages/types/dist ./packages/types/dist

# Copy .env file for runtime environment variables
COPY --from=builder --chown=bunjs:bunjs /app/.env* ./

# NO dependency installation needed - everything is bundled in dist!
# Switch to non-root user
USER bunjs

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:9999/health || exit 1
ENV NODE_ENV=production
CMD ["bun", "run", "apps/server/dist/index.js"]