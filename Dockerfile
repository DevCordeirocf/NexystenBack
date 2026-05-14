# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Dependências necessárias para o Prisma
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl libssl-dev ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Instala dependências primeiro (cache otimizado)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --legacy-peer-deps

# Copia o restante do código e faz o build
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-slim AS runner

WORKDIR /app

# Dependências necessárias para o Prisma em tempo de execução
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copia apenas o necessário do builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Porta padrão (Render injeta automaticamente a variável PORT)
ENV PORT=3001
EXPOSE $PORT

# Gera o cliente Prisma e aplica migrações já com DATABASE_URL do Supabase
CMD npx prisma generate && npx prisma migrate deploy && node dist/src/main.js
