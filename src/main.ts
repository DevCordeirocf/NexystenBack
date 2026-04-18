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
    .setDescription(`
      Documentação Nexysten - SaaS Multi-tenant para Joias
      
      Esta API gerencia múltiplas vitrines de joias de forma isolada.
      
      Instruções de Uso:
      1. X-Tenant-ID: Todas as requisições de domínio (produtos, categorias, leads) exigem este header. Você pode usar o UUID ou o nome (subdomínio) da loja.
      2. Autenticação: Use o endpoint \`/auth/login\` para obter o token Bearer.
      3. Uploads: Imagens devem ser enviadas primeiro para \`/upload/image\` e a URL retornada deve ser usada nos produtos.
    `)
    .setVersion('1.1')
    .addTag('Desenvolvimento', 'Ferramentas de auxílio ao front-end (Seed e Reset)')
    .addTag('Autenticação', 'Endpoints de login e registro de usuários')
    .addTag('Tenants Públicos', 'Configurações iniciais da loja para a vitrine')
    .addTag('Produtos', 'Gestão e visualização de joias')
    .addTag('Categorias', 'Organização de produtos')
    .addTag('Solicitações de Contato', 'Geração de leads para os lojistas')
    .addTag('Upload de Imagens', 'Serviço de armazenamento de mídia')
    .addTag('Administração Master', 'Gestão global de tenants (Apenas Super Admin)')
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
