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
    async findAllIds() {
        return this.prisma.tenantStore.findMany({
            select: {
                id: true,
                name: true,
                isActive: true,
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
exports.TenantDevController = TenantDevController = __decorate([
    (0, swagger_1.ApiTags)('Desenvolvimento (Facilitado)'),
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('dev/tenants'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantDevController);
//# sourceMappingURL=tenant-dev.controller.js.map