# ===== Estágio 1: build do frontend =====
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

# ===== Estágio 2: runtime (API + frontend) =====
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY --from=build /app/dist ./dist
COPY server ./server
EXPOSE 3001
CMD ["node", "server/index.js"]
