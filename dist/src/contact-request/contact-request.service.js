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
exports.ContactRequestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const tenant_context_service_1 = require("../tenant/tenant-context.service");
let ContactRequestService = class ContactRequestService {
    prisma;
    tenantContextService;
    constructor(prisma, tenantContextService) {
        this.prisma = prisma;
        this.tenantContextService = tenantContextService;
    }
    async create(createContactRequestDto) {
        const tenantId = this.tenantContextService.getRequiredTenantId();
        const product = await this.prisma.product.findFirst({
            where: {
                id: createContactRequestDto.productId,
                tenantId,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Produto com ID ${createContactRequestDto.productId} não encontrado.`);
        }
        return this.prisma.contactRequest.create({
            data: {
                ...createContactRequestDto,
                tenantId,
            },
        });
    }
    async findAll() {
        const tenantId = this.tenantContextService.getRequiredTenantId();
        return this.prisma.contactRequest.findMany({
            where: { tenantId },
            include: {
                product: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const tenantId = this.tenantContextService.getRequiredTenantId();
        const contactRequest = await this.prisma.contactRequest.findFirst({
            where: {
                id,
                tenantId,
            },
            include: {
                product: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                    },
                },
            },
        });
        if (!contactRequest) {
            throw new common_1.NotFoundException(`Solicitação de contato com ID ${id} não encontrada.`);
        }
        return contactRequest;
    }
    async update(id, updateContactRequestDto) {
        const tenantId = this.tenantContextService.getRequiredTenantId();
        await this.findOne(id);
        return this.prisma.contactRequest.update({
            where: { id },
            data: updateContactRequestDto,
            include: {
                product: true,
            },
        });
    }
    async remove(id) {
        const tenantId = this.tenantContextService.getRequiredTenantId();
        await this.findOne(id);
        return this.prisma.contactRequest.delete({
            where: { id },
        });
    }
};
exports.ContactRequestService = ContactRequestService;
exports.ContactRequestService = ContactRequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenant_context_service_1.TenantContextService])
], ContactRequestService);
//# sourceMappingURL=contact-request.service.js.map