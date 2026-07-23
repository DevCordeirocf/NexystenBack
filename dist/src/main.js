"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const path_1 = require("path");
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
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.set('trust proxy', 1);
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads',
    });
    const allowedOrigins = getAllowedOrigins();
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error('Origem nao permitida pelo CORS'));
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    if (shouldEnableSwagger()) {
        const config = new swagger_1.DocumentBuilder()
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
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api', app, document);
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
//# sourceMappingURL=main.js.map