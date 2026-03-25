"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantAdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const client_1 = require("@prisma/client");
let TenantAdminService = class TenantAdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTenantDto) {
        const { name, isActive, themeConfig, adminEmail, adminPassword } = createTenantDto;
        const existingTenant = await this.prisma.tenantStore.findUnique({ where: { name } });
        if (existingTenant) {
            throw new common_1.BadRequestException(`Tenant with name '${name}' already exists.`);
        }
        return this.prisma.$transaction(async (prisma) => {
            const tenant = await prisma.tenantStore.create({
                data: {
                    name,
                    isActive,
                    themeConfig,
                },
            });
            if (adminEmail && adminPassword) {
                const existingAdminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
                if (existingAdminUser) {
                    throw new common_1.BadRequestException(`User with email '${adminEmail}' already exists.`);
                }
                const hashedPassword = await bcrypt.hash(adminPassword, 10);
                await prisma.user.create({
                    data: {
                        email: adminEmail,
                        password: hashedPassword,
                        role: client_1.UserRole.TENANT_ADMIN,
                        tenantId: tenant.id,
                    },
                });
            }
            return tenant;
        });
    }
    async findAll() {
        return this.prisma.tenantStore.findMany({
            include: { users: { select: { id: true, email: true } } },
        });
    }
    async findOne(id) {
        const tenant = await this.prisma.tenantStore.findUnique({
            where: { id },
            include: { users: { select: { id: true, email: true } } },
        });
        if (!tenant) {
            throw new common_1.NotFoundException(`Tenant with ID ${id} not found.`);
        }
        return tenant;
    }
    async update(id, updateTenantDto) {
        await this.findOne(id);
        return this.prisma.tenantStore.update({
            where: { id },
            data: updateTenantDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.tenantStore.delete({ where: { id } });
    }
};
exports.TenantAdminService = TenantAdminService;
exports.TenantAdminService = TenantAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantAdminService);
//# sourceMappingURL=tenant-admin.service.js.map