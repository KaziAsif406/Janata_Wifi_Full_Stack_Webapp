# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Accept build argument for API URL
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Copy dependency files
COPY package.json package-lock.json* yarn.lock* ./

# Install dependencies
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the React app
RUN npm run build


# Production stage (Nginx)
FROM nginx:alpine

# Copy nginx template (for envsubst)
COPY nginx.template.conf /etc/nginx/templates/default.conf.template

# Copy built frontend from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Render provides PORT dynamically
ENV PORT=8080
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/ || exit 1

# Start nginx with environment variable substitution
CMD ["sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
