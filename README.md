
---
# Nexysten API - SaaS Multi-Tenant MVP

> Backend para o sistema SaaS Nexysten, projetado para fornecer uma infraestrutura multi-tenant escalável e segura, voltada para pequenas empresas do segmento de varejo e vendas.

O Nexysten API foi desenvolvido sobre uma arquitetura **Backend-Driven Multi-Tenant**, garantindo o isolamento integral de dados entre diferentes lojistas, controle de segurança centralizado e flexibilidade na gestão de cadastros.

## Tecnologias Utilizadas

- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Autenticação:** JWT (JSON Web Tokens)
- **Infraestrutura:** Docker e Docker Compose
- **Documentação:** Swagger (OpenAPI)

## Principais Funcionalidades

- **Arquitetura Multi-Tenant Isolada:**
  - Segregação de dados: Entidades como Produtos, Categorias, Clientes e Pedidos são filtradas de forma automática pelo contexto da loja (`tenantId`).
  - **Identidade Contextualizada:** O modelo de dados permite que o mesmo endereço de e-mail seja utilizado para criar contas em lojas distintas, sem gerar conflitos de integridade (`@@unique([tenantId, email])`).
  - **Segurança Backend-Driven:** O contexto de autorização do usuário (vínculo com a loja) é injetado no token JWT no momento do login. As rotas autenticadas não dependem de headers customizados enviados pelo frontend, o que previne vulnerabilidades como *spoofing* de tenant.
- **Controle de Acesso Baseado em Regras (RBAC):** Sistema de hierarquia de permissões estruturado com as *roles* `MASTER_ADMIN`, `TENANT_ADMIN` e `CUSTOMER`.
- **Gestão de Lojas (Tenants):** Configuração pública de lojas, incluindo upload de logomarca, informações de contato e personalização de tema.
- **Catálogo de Vendas:** Operações de CRUD completas para gestão de Produtos (incluindo controle de estoque e status de visibilidade) e Categorias.

## Funcionamento do Contexto Multi-Tenant

A resolução do tenant (loja) opera sob duas abordagens distintas, dependendo do estado de autenticação da requisição:

1. **Rotas Públicas (Vitrine, Cadastro e Login):** 
   O cliente (frontend) é obrigado a enviar o header `X-Tenant-ID` contendo o ID ou o slug de identificação da loja. Esta informação permite ao backend carregar o contexto correto antes da existência de uma sessão.
2. **Rotas Autenticadas:** 
   O header `X-Tenant-ID` é estritamente ignorado. O backend extrai o parâmetro `tenantId` de maneira segura, decodificando-o diretamente do token JWT enviado via header padrão (`Authorization: Bearer <token>`).

## Execução do Projeto Localmente

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- [Docker](https://www.docker.com/) e Docker Compose
- Git

### 2. Instalação e Configuração

Clone o repositório e instale as dependências da aplicação:
```bash
git clone [https://github.com/seu-usuario/nexystenback.git](https://github.com/seu-usuario/nexystenback.git)
cd nexystenback
npm install

```

### 3. Variáveis de Ambiente

Crie um arquivo `.env` no diretório raiz do projeto, utilizando o `.env.example` como referência. Certifique-se de configurar os seguintes parâmetros obrigatórios:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nexysten_db?schema=public"
JWT_SECRET="sua_chave_secreta_aqui"

```

### 4. Inicialização do Banco de Dados

Utilize o Docker Compose para instanciar o contêiner do PostgreSQL:

```bash
docker-compose up -d

```

### 5. Execução das Migrations

Sincronize a estrutura lógica do banco de dados utilizando o Prisma ORM:

```bash
npx prisma migrate dev

```

*(Opcional)* Para popular o banco com dados de teste e usuários padrão, execute o processo de seed:

```bash
npx prisma db seed

```

### 6. Inicialização do Servidor

```bash
# Execução em ambiente de desenvolvimento
npm run start:dev

```

A API estará disponível para receber requisições no endereço: `http://localhost:3001`

## Documentação da API (Swagger)

A especificação técnica e documentação interativa de todos os *endpoints* está disponível através do Swagger UI. Com o servidor em execução, acesse o seguinte endereço no navegador:

**http://localhost:3001/api**

A interface provê os esquemas de requisição (payloads), modelos de resposta e permite a realização de chamadas de teste, incluindo o gerenciamento do Bearer Token e do header `X-Tenant-ID`.

## Estrutura de Diretórios (Clean Architecture Adaptada)

```text
src/
 ├── auth/              # Lógica de autenticação, registro, guards e estratégias JWT
 ├── category/          # Módulo de gestão de categorias de produtos
 ├── contact-request/   # Gestão de formulários de contato e leads
 ├── database/          # Configurações de conexão do Prisma ORM e arquivos de Seed
 ├── product/           # Módulo para gerenciamento de produtos e controle de estoque
 ├── shared/            # Decorators customizados (@TenantId, @Roles) e Exceções/Filtros globais
 ├── tenant/            # Interceptors e lógica principal de isolamento do contexto multi-tenant
 ├── tenant-admin/      # Operações de CRUD e configuração dos tenants (lojas)
 └── upload/            # Serviço de integração para upload e armazenamento de arquivos

```

## Deploy (Render)

- Certifique-se de configurar a variável de ambiente DATABASE_URL no painel do Render (ou outro provedor) antes de permitir que a aplicação aplique migrações automaticamente.
- O container só executa `npx prisma migrate deploy` durante o start se a variável DATABASE_URL estiver definida; caso contrário, a aplicação inicia sem aplicar migrações (comportamento seguro).
- Se preferir aplicar migrações manualmente: não defina DATABASE_URL no serviço, e execute `npx prisma migrate deploy` a partir de um job/CI ou de um container com acesso ao banco de dados de destino.

---
