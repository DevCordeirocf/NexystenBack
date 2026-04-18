import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

/**
 * Função de inicialização da aplicação Nexysten
 */
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuração para servir arquivos estáticos (uploads de imagens)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Configuração de CORS para permitir integração com o Front-end
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Configuração global de validação de dados (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Registro do filtro global de tratamento de erros
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuração do Swagger (OpenAPI)
  const config = new DocumentBuilder()
    .setTitle('Nexysten API')
    .setDescription('Documentação Nexysten - SaaS Multi-tenant')
    .setVersion('1.0')
    .addTag('Nexysten')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'X-Tenant-ID', in: 'header' }, 'X-Tenant-ID')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   NEXYSTEN MVP - Sistema SaaS Multi-tenant                     ║
║                                                                ║
║   ✅ Servidor iniciado com sucesso!                           ║
║   📍 URL: http://localhost:${port}                             ║
║   📖 Swagger: http://localhost:${port}/api                         ║
║   🔒 Isolamento Multi-tenant: ATIVO                           ║
║   📊 Banco de Dados: PostgreSQL (via Prisma)                  ║
║                                                                ║
║   ⚠️  Header obrigatório para operações de Tenant:             ║
║   X-Tenant-ID: {uuid-do-seu-tenant}                           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
