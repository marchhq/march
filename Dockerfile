# Use the official Bun image as base
FROM oven/bun:1.0.25

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy package files for both frontend and backend
COPY package.json bun.lockb ./
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN bun install

# Copy the rest of the application
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# The actual command will be specified in docker-compose.yml for each service 