# NEXYSTEN MVP - Sistema SaaS Multi-tenant para Joias

Bem-vindo ao **NEXYSTEN MVP**, uma plataforma simplificada de vitrine de joias com geração de leads, desenvolvida em **NestJS** com **PostgreSQL** e **Prisma**.

## 🎯 Objetivo

Permitir que múltiplas empresas de joias operem suas próprias vitrines de forma isolada, com clientes interessados podendo solicitar contato direto com a empresa vendedora.

## 🏗️ Arquitetura

- **Backend**: NestJS 10.x
- **ORM**: Prisma 5.x
- **Banco de Dados**: PostgreSQL 16
- **Containerização**: Docker Compose
- **Linguagem**: TypeScript 5.x

## 📁 Estrutura de Diretórios

```
src/
├── common/              # Utilitários compartilhados
├── config/              # Configurações
├── database/            # Prisma Service e Module
├── tenant/              # Gerenciamento de contexto multi-tenant
├── product/             # Módulo de Produtos (Joias)
├── contact-request/     # Módulo de Solicitações de Contato
├── app.module.ts        # Módulo raiz
├── app.controller.ts    # Controller raiz
├── app.service.ts       # Service raiz
└── main.ts              # Bootstrap
```

## 🚀 Quick Start

### 1. Clonar o Repositório

```bash
git clone https://github.com/DevCordeirocf/Nexysten.git
cd Nexysten
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

### 4. Iniciar o Banco de Dados

```bash
docker-compose up -d db
```

### 5. Executar Migrations

```bash
npx prisma migrate dev
```

### 6. Iniciar o Servidor

```bash
npm run start:dev
```

O servidor estará disponível em: **http://localhost:3000**

## 📚 API Endpoints

### Produtos

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/products` | Listar produtos do tenant |
| POST | `/products` | Criar novo produto |
| GET | `/products/:id` | Obter detalhes de um produto |
| PATCH | `/products/:id` | Atualizar um produto |
| DELETE | `/products/:id` | Deletar um produto |

### Solicitações de Contato

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/contact-requests` | Listar solicitações do tenant |
| POST | `/contact-requests` | Criar nova solicitação |
| GET | `/contact-requests/:id` | Obter detalhes de uma solicitação |
| PATCH | `/contact-requests/:id` | Atualizar status de uma solicitação |
| DELETE | `/contact-requests/:id` | Deletar uma solicitação |

## 🔐 Headers Obrigatórios

Todas as requisições devem incluir o header `X-Tenant-ID`:

```bash
curl -H "X-Tenant-ID: seu-uuid-do-tenant" http://localhost:3000/products
```

## 📝 Exemplos de Requisições

### Criar um Produto

```bash
curl -X POST http://localhost:3000/products \
  -H "X-Tenant-ID: 550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Anel de Ouro 18k",
    "description": "Anel clássico com diamante",
    "price": 1500.00,
    "images": ["https://cdn.example.com/anel-1.webp"],
    "specifications": {
      "material": "ouro-18k",
      "weight": 5.2
    }
  }'
```

### Criar uma Solicitação de Contato

```bash
curl -X POST http://localhost:3000/contact-requests \
  -H "X-Tenant-ID: 550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "uuid-do-produto",
    "customerName": "João Silva",
    "customerEmail": "joao@email.com",
    "customerPhone": "11999999999",
    "message": "Gostaria de saber mais sobre este anel"
  }'
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📦 Comandos Úteis

```bash
# Desenvolvimento
npm run start:dev          # Inicia com hot-reload
npm run build              # Compila TypeScript
npm run start:prod         # Inicia em produção

# Prisma
npx prisma migrate dev     # Criar nova migration
npx prisma migrate deploy  # Aplicar migrations em produção
npx prisma studio         # UI visual para explorar banco de dados

# Linting
npm run lint              # Executar ESLint
npm run format            # Formatar código com Prettier

# Docker
docker-compose up -d      # Iniciar todos os serviços
docker-compose down       # Parar todos os serviços
docker-compose logs -f    # Ver logs em tempo real
```

## 🔒 Segurança Multi-tenant

O sistema implementa múltiplas camadas de isolamento:

1. **Interceptor**: Valida o header `X-Tenant-ID` em toda requisição
2. **Middleware do Prisma**: Adiciona automaticamente `WHERE tenantId = 'xxx'` em queries
3. **Índices no Banco**: Otimizam queries filtradas por tenant
4. **Validação de Autorização**: Endpoints protegidos validam JWT token

## 📖 Documentação Completa

Para documentação detalhada, consulte o arquivo `MVP_NEXYSTEN_DOCUMENTACAO_COMPLETA.md` na raiz do projeto.

## 🛣️ Roadmap

### Fase 1: MVP Base ✅
- [x] Estrutura de pastas
- [x] Modelo de dados
- [x] TenantInterceptor
- [x] ProductModule
- [x] ContactRequestModule
- [ ] Testes automatizados

### Fase 2: Frontend
- [ ] Aplicação Next.js
- [ ] Página de vitrine
- [ ] Formulário de contato
- [ ] Dashboard admin

### Fase 3: Melhorias
- [ ] Paginação e filtros
- [ ] Busca de produtos
- [ ] Notificações por email
- [ ] Upload de imagens

### Fase 4: Monetização
- [ ] Sistema de planos
- [ ] Processamento de pagamentos
- [ ] Cobrança mensal

### Fase 5: Infraestrutura
- [ ] Migração para AWS
- [ ] CI/CD com GitHub Actions
- [ ] Monitoramento e alertas

## 🤝 Contribuindo

Para contribuir com o projeto, siga estas etapas:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório ou entre em contato:

**Email**: luiscordeiro2006@gmail.com  
**Repositório**: https://github.com/DevCordeirocf/Nexysten

## 📄 Licença

Este projeto está sob a licença UNLICENSED. Veja o arquivo LICENSE para mais detalhes.

---

**Última atualização**: Fevereiro 2026  
**Versão**: 1.0.0  
**Desenvolvedor**: Luis Eduardo Cordeiro
