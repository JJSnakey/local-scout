# ----- BUILD STAGE -----
ARG NODE_VERSION=22.20.0
FROM node:${NODE_VERSION}-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the frontend (assumes `npm run build` outputs to /dist)
RUN npm run build

# ----- PRODUCTION STAGE -----
FROM nginx:stable-alpine

# Copy build output (ensure dist and HTML exist)
COPY --from=build /app/dist /usr/share/nginx/html/scripts
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/index.html /usr/share/nginx/html/index.html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]