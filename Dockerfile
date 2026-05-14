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

# Copia o restante do código
COPY . .

# Gera o cliente Prisma antes do build (com DATABASE_URL dummy)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost/dummy" npx prisma generate

# Build do aplicativo
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

# Script de inicialização que trata migrações opcionalmente
RUN echo '#!/bin/sh\n\
if [ -z "$DATABASE_URL" ]; then\n\
  echo "DATABASE_URL não definido, iniciando sem migrações"\n\
else\n\
  echo "Aplicando migrações do Prisma..."\n\
  npx prisma migrate deploy || echo "Migrações já aplicadas ou falharam"\n\
fi\n\
echo "Iniciando aplicação..."\n\
node dist/src/main.js' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
