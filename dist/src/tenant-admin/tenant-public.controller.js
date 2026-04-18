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
exports.TenantPublicController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../database/prisma.service");
let TenantPublicController = class TenantPublicController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByName(name) {
        const tenant = await this.prisma.tenantStore.findUnique({
            where: { name },
            select: {
                id: true,
                name: true,
                logoUrl: true,
                themeConfig: true,
                whatsapp: true,
                isActive: true,
            },
        });
        if (!tenant || !tenant.isActive) {
            throw new common_1.NotFoundException(`Loja '${name}' não encontrada ou inativa.`);
        }
        return tenant;
    }
};
exports.TenantPublicController = TenantPublicController;
__decorate([
    (0, common_1.Get)(':name'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter configurações públicas de um tenant pelo nome (subdomínio)' }),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantPublicController.prototype, "findByName", null);
exports.TenantPublicController = TenantPublicController = __decorate([
    (0, swagger_1.ApiTags)('Tenants Públicos'),
    (0, common_1.Controller)('tenants/public'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantPublicController);
//# sourceMappingURL=tenant-public.controller.js.map