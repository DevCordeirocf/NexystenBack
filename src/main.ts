import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

function getAllowedOrigins() {
  const configuredOrigins = process.env.CORS_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configuredOrigins?.length) {
    return configuredOrigins;
  }

  return process.env.NODE_ENV === 'production'
    ? []
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];
}

function shouldEnableSwagger() {
  return process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true';
}

/**
 * Função de inicialização da aplicação Nexysten
 */
async function bootstrap() {
  // Optional: initialize Sentry if available and configured
  if (process.env.SENTRY_DSN) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Sentry = require('@sentry/node');
      Sentry.init({ dsn: process.env.SENTRY_DSN });
      console.log('Sentry initialized');
    } catch (err) {
      console.warn('Sentry requested but package not installed or failed to init:', err.message || err);
    }
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });
  app.set('trust proxy', 1);

  // Use nestjs-pino logger as Nest's logger if available
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Logger } = require('nestjs-pino');
    app.useLogger(app.get(Logger));
  } catch (err) {
    // ignore if package missing or injection fails
  }

  // Configuração para servir arquivos estáticos (uploads de imagens)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Configuração de CORS para permitir integração com o Front-end
  const allowedOrigins = getAllowedOrigins();

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no Origin only in non-production (local development).
      // In production, reject requests without an Origin header to avoid
      // accidental CORS bypasses by non-browser clients or forged requests.
      if (!origin) {
        if (process.env.NODE_ENV !== 'production') {
          callback(null, true);
          return;
        }
        callback(new Error('Origem ausente nao permitida pelo CORS em producao'));
        return;
      }

      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, origin);
        return;
      }

      callback(new Error('Origem nao permitida pelo CORS'));
    },
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

  if (shouldEnableSwagger()) {
  // Configuração do Swagger (OpenAPI)
  const config = new DocumentBuilder()
    .setTitle('Nexysten API')
    .setDescription(`
      Documentação Nexysten - SaaS Multi-tenant para Joias
      
      Esta API gerencia múltiplas vitrines de joias de forma isolada.
      
      Instruções de Uso:
      1. Autenticação: Use o endpoint \`/auth/login\` para obter o token Bearer. Em rotas autenticadas, o tenant vem do JWT.
      2. X-Tenant-ID: Use apenas em rotas públicas que precisam descobrir a loja antes do login. Você pode usar o UUID ou o nome (subdomínio) da loja.
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
  }

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
