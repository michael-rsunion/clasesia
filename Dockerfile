# ============================================================================
# Dockerfile — RSUNION IA (Next.js standalone) para Coolify / Docker.
# La app es 100% cliente; aquí se construye con output "standalone" (servidor
# Node mínimo). Para GitHub Pages se usa el export estático (sin este archivo).
# ============================================================================
ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-bookworm-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ---- Dependencias ----
FROM base AS deps
ENV NODE_ENV=development
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# ---- Build ----
FROM deps AS build
ENV NODE_ENV=production
ENV BUILD_STANDALONE=1
COPY . .
RUN --mount=type=cache,target=/app/.next/cache npm run build

# ---- Producción ----
FROM node:${NODE_VERSION}-bookworm-slim AS production
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${PORT}/ || exit 1
EXPOSE 3000
CMD ["node", "server.js"]
