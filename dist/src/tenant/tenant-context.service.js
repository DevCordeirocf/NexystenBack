"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantContextService = exports.tenantStore = void 0;
const common_1 = require("@nestjs/common");
const async_hooks_1 = require("async_hooks");
exports.tenantStore = new async_hooks_1.AsyncLocalStorage();
let TenantContextService = class TenantContextService {
    run(tenantId, callback) {
        if (!tenantId) {
            throw new common_1.InternalServerErrorException('Tenant ID deve ser fornecido para iniciar o contexto.');
        }
        exports.tenantStore.run({ tenantId }, callback);
    }
    getTenantId() {
        const store = exports.tenantStore.getStore();
        return store?.tenantId;
    }
    getRequiredTenantId() {
        const tenantId = this.getTenantId();
        if (!tenantId) {
            throw new common_1.InternalServerErrorException('Falha de contexto multi-tenant: Tenant ID não disponível para esta operação.');
        }
        return tenantId;
    }
};
exports.TenantContextService = TenantContextService;
exports.TenantContextService = TenantContextService = __decorate([
    (0, common_1.Injectable)()
], TenantContextService);
//# sourceMappingURL=tenant-context.service.js.map