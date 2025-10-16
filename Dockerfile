# ---- Build stage (Debian) ----
FROM node:18-bookworm-slim AS builder
WORKDIR /app

# Accept build arguments for Next.js public environment variables
ARG NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY
ARG NEXT_PUBLIC_MEMBERSTACK_APP_ID
ARG NEXT_PUBLIC_XANO_API_URL

# Set them as environment variables so Next.js can embed them at build time
ENV NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY=$NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY
ENV NEXT_PUBLIC_MEMBERSTACK_APP_ID=$NEXT_PUBLIC_MEMBERSTACK_APP_ID
ENV NEXT_PUBLIC_XANO_API_URL=$NEXT_PUBLIC_XANO_API_URL

# System deps for native modules during build
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 build-essential ca-certificates git \
  && rm -rf /var/lib/apt/lists/*

# Install deps using npm install (more tolerant than npm ci in CI)
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
# Ensure standalone output (set in next.config.js)
RUN npm run build

# ---- Runtime stage (Debian) ----
FROM node:18-bookworm-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

# Only prod deps in final image
COPY package*.json ./
RUN npm install --omit=dev

# Copy standalone server and static assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Cloud Run expects 0.0.0.0:8080
ENV PORT=8080
EXPOSE 8080

# The standalone output includes server.js at the root
CMD ["node", "server.js"]