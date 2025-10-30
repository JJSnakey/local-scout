# ----- BUILD STAGE -----
ARG NODE_VERSION=22.20.0
FROM node:${NODE_VERSION}-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy dependency files first (for caching)
COPY package*.json ./

# Install all dependencies (including devDependencies to build TypeScript)
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the TypeScript project (output goes to /app/dist)
RUN npm run build

# ----- PRODUCTION STAGE -----
ARG NODE_VERSION=22.20.0
FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app

# Copy only the necessary files from builder
COPY package*.json ./
RUN npm install --production

# Copy compiled JavaScript files from builder
COPY --from=builder /app/dist ./dist

# Copy .env if you need runtime environment variables
COPY .env .env

# Expose backend port
EXPOSE 3000

# Start the server from compiled JS
CMD ["node", "dist/server.js"]