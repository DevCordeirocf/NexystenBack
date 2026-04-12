# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instala as dependências primeiro (aproveita o cache do Docker)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copia o restante do código e faz o build
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Copia apenas o necessário do builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Expõe a porta que o NestJS usa (padrão 3000 ou 3001)
EXPOSE 3001

# Comando para rodar as migrações e iniciar o servidor
# O Prisma precisa das migrações aplicadas no banco de produção
CMD npx prisma migrate deploy && node dist/main
