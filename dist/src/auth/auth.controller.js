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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const register_master_dto_1 = require("./dto/register-master.dto");
const register_tenant_admin_dto_1 = require("./dto/register-tenant-admin.dto");
const register_customer_dto_1 = require("./dto/register-customer.dto");
const tenant_id_decorator_1 = require("../shared/decorators/tenant-id.decorator");
const login_user_dto_1 = require("./dto/login-user.dto");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const get_user_decorator_1 = require("./get-user.decorator");
const public_decorator_1 = require("./public.decorator");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    registerMaster(registerMasterDto, currentUser) {
        return this.authService.registerMaster(registerMasterDto, currentUser);
    }
    registerTenantAdmin(registerTenantAdminDto, currentUser) {
        return this.authService.registerTenantAdmin(registerTenantAdminDto, currentUser);
    }
    registerCustomer(registerCustomerDto, tenantId) {
        return this.authService.registerCustomer(registerCustomerDto, tenantId);
    }
    login(loginUserDto) {
        return this.authService.login(loginUserDto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register-master'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar um novo MASTER_ADMIN (Apenas Master Admin)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_master_dto_1.RegisterMasterDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerMaster", null);
__decorate([
    (0, common_1.Post)('register-tenant'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar um novo TENANT_ADMIN (Apenas Master Admin)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_tenant_admin_dto_1.RegisterTenantAdminDto, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerTenantAdmin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('register-customer'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar um novo cliente (Lead)' }),
    (0, swagger_1.ApiHeader)({ name: 'X-Tenant-ID', description: 'ID ou nome do tenant', required: true }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, tenant_id_decorator_1.TenantId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_customer_dto_1.RegisterCustomerDto, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "registerCustomer", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Realizar login e obter token JWT' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Autenticação'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map