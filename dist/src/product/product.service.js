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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
const client_1 = require("@prisma/client");
let ProductService = class ProductService {
    prisma;
    tenantContextService;
    constructor(prisma, tenantContextService) {
        this.prisma = prisma;
        this.tenantContextService = tenantContextService;
    }
    async create(createProductDto) {
        try {
            const tenantId = this.tenantContextService.getRequiredTenantId();
            const { categoryIds, stock, isActive, ...productData } = createProductDto;
            if (categoryIds?.length) {
                await this.ensureCategoriesBelongToTenant(categoryIds, tenantId);
            }
            return await this.prisma.product.create({
                data: {
                    ...productData,
                    stock: stock !== undefined ? stock : 1,
                    isActive: isActive !== undefined ? isActive : true,
                    tenantId,
                    categories: categoryIds ? {
                        connect: categoryIds.map(id => ({ id }))
                    } : undefined,
                },
                include: {
                    categories: true
                }
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Erro ao criar o produto.');
        }
    }
    async findAll(categoryId, userRole) {
        try {
            const tenantId = this.tenantContextService.getRequiredTenantId();
            const where = {
                tenantId,
                categories: categoryId ? {
                    some: { id: categoryId }
                } : undefined,
            };
            if (!userRole || userRole === client_1.UserRole.CUSTOMER) {
                where.isActive = true;
                where.stock = { gt: 0 };
            }
            return await this.prisma.product.findMany({
                where,
                include: {
                    categories: true
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Erro ao listar os produtos.');
        }
    }
    async findOne(id) {
        const tenantId = this.tenantContextService.getRequiredTenantId();
        const product = await this.prisma.product.findFirst({
            where: {
                id,
                tenantId,
            },
            include: {
                categories: true
            }
        });
        if (!product) {
            throw new common_1.NotFoundException(`Produto com ID "${id}" não encontrado.`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        try {
            const tenantId = this.tenantContextService.getRequiredTenantId();
            const { categoryIds, ...productData } = updateProductDto;
            await this.findOne(id);
            if (categoryIds?.length) {
                await this.ensureCategoriesBelongToTenant(categoryIds, tenantId);
            }
            return await this.prisma.product.update({
                where: { id, tenantId },
                data: {
                    ...productData,
                    categories: categoryIds ? {
                        set: categoryIds.map(id => ({ id }))
                    } : undefined,
                },
                include: {
                    categories: true
                }
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Erro ao atualizar o produto.');
        }
    }
    async remove(id) {
        const tenantId = this.tenantContextService.getRequiredTenantId();
        await this.findOne(id);
        try {
            return await this.prisma.product.delete({
                where: { id, tenantId },
            });
        }
        catch (error) {
            if (error.code === 'P2003') {
                throw new common_1.ConflictException('Não é possível excluir este produto pois existem solicitações de contato (leads) ou histórico vinculados a ele. Recomendamos inativar o produto.');
            }
            this.handlePrismaError(error, 'Erro ao excluir o produto.');
        }
    }
    async updateStockAndAvailability(id, stock, isActive) {
        try {
            const tenantId = this.tenantContextService.getRequiredTenantId();
            await this.findOne(id);
            const dataToUpdate = {};
            if (stock !== undefined) {
                dataToUpdate.stock = stock;
            }
            if (isActive !== undefined) {
                dataToUpdate.isActive = isActive;
            }
            return await this.prisma.product.update({
                where: { id, tenantId },
                data: dataToUpdate,
                include: {
                    categories: true
                }
            });
        }
        catch (error) {
            this.handlePrismaError(error, 'Erro ao atualizar a disponibilidade do produto.');
        }
    }
    handlePrismaError(error, defaultMessage) {
        if (error.status) {
            throw error;
        }
        switch (error.code) {
            case 'P2002':
                throw new common_1.ConflictException('Já existe um registro com estes dados únicos neste tenant.');
            case 'P2025':
                throw new common_1.NotFoundException('Registro não encontrado na base de dados.');
            case 'P2014':
                throw new common_1.BadRequestException('A alteração solicitada viola uma relação exigida pelo banco de dados.');
            default:
                console.error(`[ProductService Error]: ${error.message || error}`);
                throw new common_1.InternalServerErrorException(defaultMessage);
        }
    }
    async ensureCategoriesBelongToTenant(categoryIds, tenantId) {
        const uniqueCategoryIds = [...new Set(categoryIds)];
        const ownedCategoriesCount = await this.prisma.category.count({
            where: {
                id: { in: uniqueCategoryIds },
                tenantId,
            },
        });
        if (ownedCategoriesCount !== uniqueCategoryIds.length) {
            throw new common_1.BadRequestException('Uma ou mais categorias nao pertencem ao tenant atual.');
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenant_context_service_1.TenantContextService])
], ProductService);
//# sourceMappingURL=product.service.js.map