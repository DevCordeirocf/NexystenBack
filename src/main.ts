// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   NEXYSTEN MVP - Sistema SaaS Multi-tenant para Joias      ║
║                                                                ║
║   ✅ Servidor iniciado com sucesso!                           ║
║   📍 URL: http://localhost:${port}                             ║
║   🔒 Isolamento Multi-tenant: ATIVO                           ║
║   📊 Banco de Dados: PostgreSQL (via Prisma)                  ║
║                                                                ║
║   Endpoints disponíveis:                                       ║
║   • GET  /                  - Mensagem de boas-vindas         ║
║   • GET  /health            - Status da aplicação             ║
║   • GET  /products          - Listar produtos                 ║
║   • POST /products          - Criar produto                   ║
║   • GET  /contact-requests  - Listar solicitações             ║
║   • POST /contact-requests  - Criar solicitação               ║
║                                                                ║
║   ⚠️  Não esqueça de enviar o header:                          ║
║   X-Tenant-ID: {uuid-do-seu-tenant}                           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
}
bootstrap();