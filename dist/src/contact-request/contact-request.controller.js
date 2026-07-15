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
exports.ContactRequestController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const contact_request_service_1 = require("./contact-request.service");
const create_contact_request_dto_1 = require("./dto/create-contact-request.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
const update_contact_request_dto_1 = require("./dto/update-contact-request.dto");
const public_decorator_1 = require("../auth/public.decorator");
let ContactRequestController = class ContactRequestController {
    contactRequestService;
    constructor(contactRequestService) {
        this.contactRequestService = contactRequestService;
    }
    create(createContactRequestDto, user) {
        if (user) {
            createContactRequestDto.userId = user.userId;
        }
        return this.contactRequestService.create(createContactRequestDto);
    }
    findAll(status) {
        return this.contactRequestService.findAll(status);
    }
    findOne(id) {
        return this.contactRequestService.findOne(id);
    }
    update(id, updateContactRequestDto) {
        return this.contactRequestService.update(id, updateContactRequestDto);
    }
    remove(id) {
        return this.contactRequestService.remove(id);
    }
};
exports.ContactRequestController = ContactRequestController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar uma nova solicitação de contato (Lead)' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contact_request_dto_1.CreateContactRequestDto, Object]),
    __metadata("design:returntype", void 0)
], ContactRequestController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as solicitações de contato do tenant' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['PENDING', 'CONTACTED', 'CLOSED'] }),
    (0, roles_decorator_1.Roles)(client_1.UserRole.MASTER_ADMIN, client_1.UserRole.TENANT_ADMIN),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContactRequestController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.MASTER_ADMIN, client_1.UserRole.TENANT_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContactRequestController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.MASTER_ADMIN, client_1.UserRole.TENANT_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_contact_request_dto_1.UpdateContactRequestDto]),
    __metadata("design:returntype", void 0)
], ContactRequestController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(client_1.UserRole.MASTER_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContactRequestController.prototype, "remove", null);
exports.ContactRequestController = ContactRequestController = __decorate([
    (0, swagger_1.ApiTags)('Solicitações de Contato'),
    (0, swagger_1.ApiHeader)({ name: 'X-Tenant-ID', description: 'ID ou nome do tenant para rotas publicas. Rotas autenticadas usam o tenantId do JWT.', required: false }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('contact-requests'),
    __metadata("design:paramtypes", [contact_request_service_1.ContactRequestService])
], ContactRequestController);
//# sourceMappingURL=contact-request.controller.js.map