# ---- Build stage (Debian) ----
FROM node:18-bookworm-slim AS builder
ENV NODE_ENV=development
WORKDIR /app

# System deps for native modules during build
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 build-essential ca-certificates git \
  && rm -rf /var/lib/apt/lists/*

# Install deps based on lockfile
COPY package*.json ./
# if your lockfile was created with npm 10+, npm 9 still understands it; npm ci will error if integrity mismatches
RUN npm ci

# Copy source and build
COPY . .
# Produce standalone server output for production
RUN npm run build

# ---- Runtime stage (Debian) ----
FROM node:18-bookworm-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

# Only prod deps in the final image
COPY package*.json ./
RUN npm ci --omit=dev

# Copy standalone server and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Cloud Run expects 0.0.0.0:8080
ENV PORT=8080
EXPOSE 8080

# The standalone output includes server.js at the root
CMD ["node", "server.js"]
