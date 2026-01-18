
# -----------------------------------------------------------------------------
# INDUSTRIAL GRADE DEPLOYMENT - DOCKERFILE
# Platform: Linux/amd64 (Railway / DigitalOcean / AWS)
# -----------------------------------------------------------------------------

# 1. Base Image - Install Dependencies only when needed
FROM node:20-alpine AS base

# Install libc6-compat for some native modules if needed
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2. Dependencies - Install node_modules
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# 3. Builder - Rebuild the source code
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build time (add public env vars here if needed)
ENV NEXT_TELEMETRY_DISABLED 1

# Run the build
RUN npm run build

# 4. Production Image - Copy only the necessary files
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
