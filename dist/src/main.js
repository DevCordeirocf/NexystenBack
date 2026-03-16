"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   🚀 NEXYSTEN MVP - Sistema SaaS Multi-tenant para Joias      ║
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
//# sourceMappingURL=main.js.map