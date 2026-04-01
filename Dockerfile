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

# Build-time env vars (override at build: --build-arg VITE_API_URL=https://api.example.com)
ARG VITE_API_URL=http://localhost:5029
ARG VITE_KEYCLOAK_URL=https://auth-dev.invoicy.com.br
ARG VITE_KEYCLOAK_REALM=Migrate
ARG VITE_KEYCLOAK_CLIENT_ID=docmigrate-frontend
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID

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
