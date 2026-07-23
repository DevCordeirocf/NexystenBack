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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
let CategoryService = class CategoryService {
    prisma;
    tenantContextService;
    constructor(prisma, tenantContextService) {
        this.prisma = prisma;
        this.tenantContextService = tenantContextService;
    }
    async create(createCategoryDto) {
        const tenantId = this.tenantContextService.getRequiredTenantId();
        const { tenantId: _ignoredTenantId, ...data } = createCategoryDto;
        return this.prisma.category.create({
            data: {
                ...data,
                tenantId,
            },
        });
    }
    async findAll() {
        const tenantId = this.tenantContextService.getRequiredTenantId();
        return this.prisma.category.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const tenantId = this.tenantContextService.getRequiredTenantId();
        const category = await this.prisma.category.findFirst({
            where: {
                id,
                tenantId,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Categoria com ID "${id}" nao encontrada para este tenant.`);
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        const tenantId = this.tenantContextService.getRequiredTenantId();
        const { tenantId: _ignoredTenantId, ...data } = updateCategoryDto;
        await this.findOne(id);
        return this.prisma.category.update({
            where: {
                id,
                tenantId,
            },
            data,
        });
    }
    async remove(id) {
        const tenantId = this.tenantContextService.getRequiredTenantId();
        await this.findOne(id);
        return this.prisma.category.delete({
            where: {
                id,
                tenantId,
            },
        });
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenant_context_service_1.TenantContextService])
], CategoryService);
//# sourceMappingURL=category.service.js.map