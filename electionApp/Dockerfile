# Stage 1: Build React app
ARG NODE_VERSION=24.14.1
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# This ARG lets GitHub Actions inject the real backend URL at build time
ARG VITE_APP_BASE_URL=http://localhost:8080
RUN echo "VITE_APP_BASE_URL=${VITE_APP_BASE_URL}" > .env.production.local

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]