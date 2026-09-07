# Multi-stage build untuk optimize image size

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Stage 2: Runtime
FROM node:24-alpine

WORKDIR /app

# Install OpenSSL (required for Prisma)
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Copy prisma schema SEBELUM npm install
COPY prisma ./prisma

# Install production dependencies only
RUN npm install --production

# Generate Prisma Client for runtime
RUN npx prisma generate

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start Next.js
CMD ["npm", "start"]
