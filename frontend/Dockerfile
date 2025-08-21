# # Build stage
# FROM node:18 AS build
# WORKDIR /virtual-assistant-frontend
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Nginx stage
# FROM nginx:alpine
# COPY --from=build /virtual-assistant-frontend/dist /usr/share/nginx/html
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# 🏗 Build stage
FROM node:18-alpine AS build

WORKDIR /virtual-assistant-frontend

# Install only prod dependencies — no dev bloating
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# 🧊 Nginx stage (minimal)
FROM nginx:alpine

# Copy built static site only
COPY --from=build /virtual-assistant-frontend/dist /usr/share/nginx/html

# Custom Nginx config for React routing
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
