# Production Dockerfile for Yol Benício Legal Management System
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Production dependencies stage
FROM base AS dependencies
RUN pnpm install --frozen-lockfile --prod

# Development dependencies stage
FROM base AS dev-dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM dev-dependencies AS build

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S adonisjs -u 1001

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy built application
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public

# Copy configuration files
COPY ace ace
COPY .adonisrc.js .adonisrc.js
COPY tsconfig.json tsconfig.json

# Copy inertia build if exists
COPY --from=build /app/inertia/dist ./inertia/dist 2>/dev/null || true

# Create necessary directories
RUN mkdir -p storage/logs storage/tmp storage/uploads && \
    chown -R adonisjs:nodejs storage

# Switch to non-root user
USER adonisjs

# Expose port
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node ace healthcheck || exit 1

# Start the application
CMD ["node", "bin/server.js"]