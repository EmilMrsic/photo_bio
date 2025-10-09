# --- Build stage ---
FROM node:18-alpine AS builder
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# --- Runtime stage ---
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy the standalone server and static assets produced by Next
# The standalone output contains a minimal node_modules
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Cloud Run expects the app to listen on 0.0.0.0:8080
ENV PORT=8080
EXPOSE 8080

# Start the Next standalone server
CMD ["node", "server.js"]
