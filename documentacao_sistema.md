Documento Geral do Sistema — Nexysten API (Português)

Resumo

O Nexysten API é um backend SaaS multi-tenant implementado em NestJS (TypeScript) e Prisma (PostgreSQL). Foi projetado para gerenciar múltiplas lojas (tenants) de forma isolada, fornecendo autenticação baseada em JWT, controle de acesso por roles (RBAC), gestão de catálogo (produtos e categorias), uploads de mídia e captura de leads (contact requests).

Tecnologias principais

- Node.js (recomendado >= 18)
- TypeScript
- NestJS (framework)
- Prisma ORM (+ migrations)
- PostgreSQL (via Docker Compose no repositório)
- Docker & Docker Compose
- JWT para autenticação
- Swagger (OpenAPI) para documentação interativa
- Redis (usado como dependência/serviço no docker-compose)
- Uploads via AWS S3 SDK (opcional/implementado no módulo de upload)
- Logger: pino / nestjs-pino

Visão geral da arquitetura

- Arquitetura Backend-Driven Multi-Tenant: o isolamento de dados é feito principalmente por filtragem/associação via campo tenantId nas entidades. Algumas rotas públicas aceitam X-Tenant-ID no header para resolução da loja pré-login; rotas autenticadas ignoram esse header e extraem tenantId do JWT.
- Organização em módulos NestJS por domínio (auth, product, category, tenant, tenant-admin, contact-request, upload, shared, database).
- Prisma gerencia o esquema e migrations; existe pasta prisma/ com schema.prisma e migrations já geradas.

Estrutura de pastas (trecho relevante)

- src/
  - auth/: autenticação, DTOs, jwt strategy, guards, roles
  - product/: controllers, services e DTOs para produtos
  - category/: gestão de categorias
  - tenant/: interceptors e serviços para resolução de tenant
  - tenant-admin/: endpoints administrativos para gerenciar tenants
  - contact-request/: lógica de captura de leads/contato por produto
  - upload/: integração com provedores de armazenamento (S3)
  - database/: PrismaService e seed
  - shared/: middlewares, filtros, decorators (ex.: @TenantId)
  - main.ts: bootstrap da aplicação e configuração Swagger/CORS

Modelos de dados (resumo do prisma/schema.prisma)

- User
  - id: uuid
  - email, password, name, phone
  - role: enum (MASTER_ADMIN, TENANT_ADMIN, CUSTOMER)
  - tenantId: string? (vínculo ao TenantStore para TENANT_ADMIN/CUSTOMER)
  - unique: @@unique([tenantId, email]) — permite mesmo e-mail em tenants distintos

- TenantStore
  - id, name, isActive, themeConfig (JSON), logoUrl, whatsapp
  - relações: products, categories, users, contactRequests

- Category
  - id, tenantId, name, description
  - unique por tenant: @@unique([tenantId, name])

- Product
  - id, tenantId, name, description, price (Decimal), stock, isActive, images (String[]), specifications (Json)
  - unique por tenant: @@unique([tenantId, name])

- ContactRequest
  - id, tenantId, productId, userId?, customerName, customerEmail, message, status
  - status default: PENDING

Módulos e responsabilidades

- auth/
  - Registro e login (vários DTOs: register-master, register-tenant-admin, register-customer, login)
  - JWT strategy e guards (jwt-auth.guard.ts)
  - Roles e decorators (roles.guard.ts, roles.decorator.ts)

- product/
  - CRUD de produtos, controle de estoque e visibilidade (isActive)
  - Upload de imagens referenciadas por URLs

- category/
  - CRUD de categorias, exclusivas por tenant

- tenant/ e tenant-admin/
  - tenant/ contém interceptors e serviços para resolver o contexto multi-tenant
  - tenant-admin/ contém endpoints administrativos para criar/atualizar tenants (lojas)

- upload/
  - serviço para enviar arquivos ao provedor configurado (ex.: S3)
  - upload.controller e s3.service indicam integração com AWS SDK

- contact-request/
  - endpoints para criar solicitações de contato/lead associadas a produtos
  - atrelamento opcional ao usuário autenticado

Fluxo de autenticação e tenant

- Rotas públicas: frontend envia X-Tenant-ID para identificar a loja. Backend carrega contexto do TenantStore correspondente.
- Rotas autenticadas: o token JWT contém informações de tenant (para usuários atrelados), e o header X-Tenant-ID é ignorado para evitar spoofing.
- Roles: MASTER_ADMIN tem alcance global, TENANT_ADMIN atua dentro do tenant, CUSTOMER é cliente da loja.

Endpoints (visão geral)

Observação: esta é uma visão resumida — a especificação completa está disponível via Swagger ao rodar a aplicação (/api).

- Auth
  - POST /auth/login — autenticar e receber Bearer token
  - POST /auth/register (várias rotas de registro dependendo do DTO)

- Produtos
  - GET /products — listar (filtrado por tenant/contexto)
  - POST /products — criar (TENANT_ADMIN)
  - GET /products/:id — detalhar
  - PATCH /products/:id — atualizar
  - DELETE /products/:id — remover
  - PATCH /products/:id/stock — atualizar estoque

- Categorias
  - GET /categories
  - POST /categories
  - PATCH /categories/:id
  - DELETE /categories/:id

- Upload
  - POST /upload/image — upload de imagem e retorno de URL (integração com S3 ou provedor local)

- Tenant Público
  - GET /tenant/public/:slug ou /tenant/public/:id — informações públicas da loja (nome, logo, whatsapp, theme)

- Tenant Admin (administração de tenants — MASTER_ADMIN ou endpoint de tenant-admin para própria loja)
  - CRUD para TenantStore

- Contact Requests
  - POST /contact-requests — criar lead (productId, customerName, customerEmail, message)
  - GET /contact-requests — listar leads (TENANT_ADMIN)

Configurações e Variáveis de Ambiente

Principais variáveis encontradas em .env.example:

- NODE_ENV (development|production)
- PORT (padrão 3001)
- CORS_ORIGINS (lista separada por vírgula)
- ENABLE_SWAGGER (true/false)
- DATABASE_URL (string de conexão Prisma/Postgres)
- JWT_SECRET (chave para assinar tokens)
- JWT_EXPIRATION (ex: 1d)
- MASTER_ADMIN_EMAIL / MASTER_ADMIN_PASSWORD / MASTER_ADMIN_NAME (usuário inicial quando não há MASTER_ADMIN)
- STORAGE_PROVIDER, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME (para uploads S3)
- POSTGRES_* e REDIS_* são usados no docker-compose (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT, REDIS_PORT)

Scripts úteis (package.json)

- npm run start:dev — iniciar em modo desenvolvimento (watch)
- npm run start — iniciar app compilada
- npm run build — compilar TypeScript
- npm run lint — executar ESLint e aplicar correções
- npm run test — rodar Jest
- npm run test:cov — rodar cobertura

Banco de dados e Migrations

- Prisma está configurado (prisma/schema.prisma). Existem migrations já geradas em prisma/migrations.
- Com Docker Compose (postgres) ativo, rodar: npx prisma migrate dev
- Opcionalmente: npx prisma db seed para popular dados de exemplo (há seed.service.ts)

Observabilidade e logs

- Usa pino (nestjs-pino) para logging estruturado. Sentry pode ser habilitado com SENTRY_DSN.
- Logger configurable via env e integrado ao Nest (tentativa de injeção em main.ts).

Testes e Qualidade

- Testes com Jest (configuração padrão presente em devDependencies).
- ESLint + Prettier para lint/format.

Docker / docker-compose

- docker-compose.yml inclui serviços: db (Postgres) e redis. Configurar variáveis de ambiente em .env para uso local.
- Volumes: postgres_data para persistência.

Deploy

- Instruções no README apontam para uso no Render (ou outro provedor). Recomenda-se definir DATABASE_URL no painel do provedor para habilitar execução de migrations durante o start (ou aplicar migrations via job/CI manualmente).

Segurança e boas práticas

- Não confiar em X-Tenant-ID em rotas autenticadas — o código já ignora o header em rotas autenticadas e usa tenant no JWT.
- Garantir JWT_SECRET forte em produção e rotacionar MASTER_ADMIN_PASSWORD após primeiro uso.
- Proteger credenciais do S3 e outras chaves em cofres de segredos do provedor.

Recomendações e próximos passos

- Gerar um diagrama ER visual a partir do schema.prisma (ferramentas como dbdiagram.io ou prisma-dbml-generator ajudam).
- Documentar em Swagger exemplos de uso para cada endpoint protegido (ex.: exemplo de Bearer token e uso de X-Tenant-ID em rotas públicas).
- Adicionar CI para rodar lint e testes automaticamente em PRs.
- Se houver necessidade de alta disponibilidade, externalizar o Postgres para um serviço gerenciado e habilitar backups.

Anexos e referências rápidas

- Arquivo principal: src/main.ts — bootstrap e configuração (CORS, Swagger, Static assets)
- Schema Prisma: prisma/schema.prisma
- Docker Compose: docker-compose.yml
- Variáveis de ambiente de referência: .env.example
- Scripts: package.json


Se desejar, posso:
- Gerar um diagrama ER simplificado em ASCII ou em Markdown.
- Extrair automaticamente a lista completa de endpoints (rota, método, DTOs) diretamente do código/Swagger JSON.
- Criar exemplos práticos (curl/postman) para os endpoints principais.

Fim do documento.