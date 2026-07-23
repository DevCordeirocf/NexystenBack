"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantDevController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../database/prisma.service");
const public_decorator_1 = require("../auth/public.decorator");
let TenantDevController = class TenantDevController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    ensureDevelopmentEnvironment() {
        if (process.env.NODE_ENV === 'production') {
            throw new common_1.ForbiddenException('Rotas de desenvolvimento desabilitadas em producao.');
        }
    }
    async findAllIds() {
        this.ensureDevelopmentEnvironment();
        return this.prisma.tenantStore.findMany({
            select: {
                id: true,
                name: true,
                isActive: true,
            },
        });
    }
    async resetTenant(tenantId) {
        this.ensureDevelopmentEnvironment();
        const tenant = await this.prisma.tenantStore.findUnique({ where: { id: tenantId } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant não encontrado');
        await this.prisma.$transaction([
            this.prisma.contactRequest.deleteMany({ where: { tenantId } }),
            this.prisma.product.deleteMany({ where: { tenantId } }),
            this.prisma.category.deleteMany({ where: { tenantId } }),
        ]);
        return { message: `Dados do tenant ${tenant.name} foram resetados com sucesso.` };
    }
    async seedTenant(tenantId) {
        this.ensureDevelopmentEnvironment();
        const tenant = await this.prisma.tenantStore.findUnique({ where: { id: tenantId } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant não encontrado');
        const uniqueSuffix = Date.now().toString().slice(-4);
        return this.prisma.$transaction(async (tx) => {
            const catAneis = await tx.category.create({
                data: { name: `Anéis ${uniqueSuffix}`, description: 'Anéis de ouro e prata', tenantId }
            });
            const catColares = await tx.category.create({
                data: { name: `Colares ${uniqueSuffix}`, description: 'Colares e gargantilhas', tenantId }
            });
            const p1 = await tx.product.create({
                data: {
                    name: `Anel Solitário Diamante ${uniqueSuffix}`,
                    description: 'Anel clássico em ouro 18k com diamante de 15 pontos.',
                    price: 2500.00,
                    stock: 5,
                    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500'],
                    tenantId,
                    categories: { connect: { id: catAneis.id } }
                }
            });
            const p2 = await tx.product.create({
                data: {
                    name: `Colar de Pérolas ${uniqueSuffix}`,
                    description: 'Colar elegante com pérolas naturais e fecho em prata.',
                    price: 850.00,
                    stock: 10,
                    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'],
                    tenantId,
                    categories: { connect: { id: catColares.id } }
                }
            });
            await tx.contactRequest.create({
                data: {
                    tenantId,
                    productId: p1.id,
                    customerName: `João Silva (Teste ${uniqueSuffix})`,
                    customerEmail: `joao.teste.${uniqueSuffix}@email.com`,
                    customerPhone: '11999999999',
                    message: 'Tenho interesse neste anel, qual o prazo de entrega?',
                    status: 'PENDING'
                }
            });
            return {
                message: `Seed finalizado para ${tenant.name}`,
                data: {
                    categories: 2,
                    products: 2,
                    leads: 1,
                    loteGerado: uniqueSuffix
                }
            };
        });
    }
    async findAllUsers() {
        this.ensureDevelopmentEnvironment();
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                tenantId: true,
                createdAt: true,
            },
        });
    }
    async findAllProducts() {
        this.ensureDevelopmentEnvironment();
        return this.prisma.product.findMany({
            include: {
                tenant: { select: { name: true } },
                categories: { select: { name: true } },
            },
        });
    }
    async findAllCategories() {
        this.ensureDevelopmentEnvironment();
        return this.prisma.category.findMany({
            include: {
                tenant: { select: { name: true } },
            },
        });
    }
    async findAllLeads() {
        this.ensureDevelopmentEnvironment();
        return this.prisma.contactRequest.findMany({
            include: {
                tenant: { select: { name: true } },
                product: { select: { name: true } },
            },
        });
    }
};
exports.TenantDevController = TenantDevController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os IDs e nomes de tenants (Público)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TenantDevController.prototype, "findAllIds", null);
__decorate([
    (0, common_1.Post)('reset/:tenantId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Limpar todos os dados de um tenant (Produtos, Categorias, Leads)' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantDevController.prototype, "resetTenant", null);
__decorate([
    (0, common_1.Post)('seed/:tenantId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Popular tenant com dados de teste (Joias)' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantDevController.prototype, "seedTenant", null);
__decorate([
    (0, common_1.Get)('all-users'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os usuários do sistema (Debug)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TenantDevController.prototype, "findAllUsers", null);
__decorate([
    (0, common_1.Get)('all-products'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os produtos de todos os tenants (Debug)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TenantDevController.prototype, "findAllProducts", null);
__decorate([
    (0, common_1.Get)('all-categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as categorias de todos os tenants (Debug)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TenantDevController.prototype, "findAllCategories", null);
__decorate([
    (0, common_1.Get)('all-leads'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as solicitações de contato de todos os tenants (Debug)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TenantDevController.prototype, "findAllLeads", null);
exports.TenantDevController = TenantDevController = __decorate([
    (0, swagger_1.ApiTags)('Desenvolvimento'),
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('dev/tenants'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantDevController);
//# sourceMappingURL=tenant-dev.controller.js.map