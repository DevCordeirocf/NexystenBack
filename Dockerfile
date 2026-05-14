# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Instala dependências do sistema necessárias para o Prisma (OpenSSL)
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl libssl-dev ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Instala as dependências primeiro (aproveita o cache do Docker)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --legacy-peer-deps

# Copia o restante do código e faz o build
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-slim AS runner

WORKDIR /app

# Instala dependências de sistema necessárias para o Prisma em tempo de execução
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copia apenas o necessário do builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# O Render injeta a porta automaticamente na variável PORT
ENV PORT=3001
EXPOSE $PORT

# Comando para rodar as migrações e iniciar o servidor
CMD npx prisma generate && npx prisma migrate deploy && node dist/src/main.js
