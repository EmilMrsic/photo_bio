# --- Build stage (Debian, not Alpine) ---
FROM node:18-bookworm-slim AS builder
ENV NODE_ENV=production
WORKDIR /app

# System deps for any native modules during build
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 build-essential ca-certificates git \
  && rm -rf /var/lib/apt/lists/*

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
# Generate standalone output for Cloud Run
RUN npm run build

# --- Runtime stage ---
FROM node:18-bookworm-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy the standalone server and static assets produced by Next
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Cloud Run expects 0.0.0.0:8080
ENV PORT=8080
EXPOSE 8080

# Start the Next standalone server (present in .next/standalone)
CMD ["node", "server.js"]
