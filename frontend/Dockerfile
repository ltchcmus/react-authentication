# Frontend Dockerfile for React + Vite Application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL
ARG VITE_X_API_KEY

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_X_API_KEY=$VITE_X_API_KEY

# Build the application
RUN npm run build

# Production stage - use nginx to serve static files
FROM nginx:alpine

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
