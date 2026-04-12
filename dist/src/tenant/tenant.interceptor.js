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
exports.TenantInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const tenant_context_service_1 = require("./tenant-context.service");
const prisma_service_1 = require("../database/prisma.service");
let TenantInterceptor = class TenantInterceptor {
    tenantContextService;
    prisma;
    constructor(tenantContextService, prisma) {
        this.tenantContextService = tenantContextService;
        this.prisma = prisma;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const tenantHeader = request.headers['x-tenant-id'];
        const url = request.url;
        const isPublicRoute = url.includes('/auth/login') ||
            url.includes('/auth/register') ||
            url.includes('/tenant-admin') ||
            url.includes('/tenants/public');
        if (!tenantHeader && !isPublicRoute) {
            throw new common_1.ForbiddenException('X-Tenant-ID é necessário no header');
        }
        return new rxjs_1.Observable(subscriber => {
            if (tenantHeader) {
                this.resolveTenantId(tenantHeader).then(resolvedId => {
                    if (!resolvedId && !isPublicRoute) {
                        subscriber.error(new common_1.ForbiddenException('Tenant inválido ou não encontrado.'));
                        return;
                    }
                    if (resolvedId) {
                        this.tenantContextService.run(resolvedId, () => {
                            this.executeNext(next, subscriber);
                        });
                    }
                    else {
                        this.executeNext(next, subscriber);
                    }
                }).catch(err => subscriber.error(err));
            }
            else {
                this.executeNext(next, subscriber);
            }
        });
    }
    async resolveTenantId(identifier) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
        if (isUuid)
            return identifier;
        const tenant = await this.prisma.tenantStore.findUnique({
            where: { name: identifier },
            select: { id: true }
        });
        return tenant?.id || null;
    }
    executeNext(next, subscriber) {
        next.handle().subscribe({
            next: (value) => subscriber.next(value),
            error: (err) => subscriber.error(err),
            complete: () => subscriber.complete(),
        });
    }
};
exports.TenantInterceptor = TenantInterceptor;
exports.TenantInterceptor = TenantInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_context_service_1.TenantContextService,
        prisma_service_1.PrismaService])
], TenantInterceptor);
//# sourceMappingURL=tenant.interceptor.js.map