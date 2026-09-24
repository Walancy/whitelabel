# syntax=docker/dockerfile:1

# ---- Base: toolchain fixo (Bun + Node, mesmas versões do .mise.toml) ----
FROM oven/bun:1.3.14 AS base
WORKDIR /app

# ---- Deps: cache de dependências isolado do código-fonte ----
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---- Build: compila TypeScript + gera bundle estático (Vite) ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# ---- Runtime: serve os arquivos estáticos via Nginx ----
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
