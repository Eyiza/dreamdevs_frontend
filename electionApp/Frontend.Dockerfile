# Dev only — runs Vite dev server with hot reload
ARG NODE_VERSION=24.14.1

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

WORKDIR /app

# Copy package files first for the same caching reason as the backend —
# node_modules only rebuilds when package.json actually changes
COPY package*.json ./
RUN npm install

# Copy the rest of the source
COPY . .

EXPOSE 5173

# --host makes Vite listen on 0.0.0.0 instead of just localhost,
# which is required for Docker to forward the port to your machine
CMD ["npm", "run", "dev", "--", "--host"]
