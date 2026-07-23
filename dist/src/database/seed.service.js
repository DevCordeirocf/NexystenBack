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
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("./prisma.service");
let SeedService = SeedService_1 = class SeedService {
    prisma;
    logger = new common_1.Logger(SeedService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        try {
            await this.bootstrapFirstMasterAdmin();
        }
        catch (error) {
            this.logger.warn('Bootstrap do MASTER_ADMIN falhou: ' + (error?.message || String(error)));
            if (process.env.NODE_ENV === 'production') {
                throw error;
            }
        }
    }
    async bootstrapFirstMasterAdmin() {
        const existingMasterCount = await this.prisma.user.count({
            where: { tenantId: null, role: client_1.UserRole.MASTER_ADMIN },
        });
        if (existingMasterCount > 0) {
            return;
        }
        const email = process.env.MASTER_ADMIN_EMAIL?.trim().toLowerCase();
        const password = process.env.MASTER_ADMIN_PASSWORD;
        const name = process.env.MASTER_ADMIN_NAME?.trim() || 'Owner';
        if (!email || !password) {
            const message = 'Nenhum MASTER_ADMIN encontrado. Defina MASTER_ADMIN_EMAIL e MASTER_ADMIN_PASSWORD para criar o primeiro acesso.';
            if (process.env.NODE_ENV === 'production') {
                throw new Error(message);
            }
            this.logger.warn(message);
            return;
        }
        if (process.env.NODE_ENV === 'production' && password.length < 12) {
            throw new Error('MASTER_ADMIN_PASSWORD deve ter pelo menos 12 caracteres em producao.');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await this.prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: client_1.UserRole.MASTER_ADMIN,
            },
        });
        this.logger.log(`Primeiro MASTER_ADMIN criado: ${email}`);
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeedService);
//# sourceMappingURL=seed.service.js.map