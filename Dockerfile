# =============================================================================
# Stage 1: Build
# =============================================================================
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files first (layer cache optimization)
COPY package.json package-lock.json ./

# Install dependencies (clean install, respects package-lock.json)
RUN npm ci

# Copy remaining source files
COPY . .

# Build production bundle
RUN npm run build

# =============================================================================
# Stage 2: Runtime
# =============================================================================
FROM nginx:alpine AS runtime

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# nginx starts automatically as the default CMD
