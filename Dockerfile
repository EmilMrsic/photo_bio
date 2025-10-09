# Use the official Node 18 LTS image
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm ci

# Copy rest of the app and build it
COPY . .
RUN npm run build

# Production image
FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app ./

EXPOSE 8080

# Start the app
CMD ["npm", "start"]
