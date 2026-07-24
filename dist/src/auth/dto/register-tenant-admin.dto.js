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
exports.RegisterTenantAdminDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const password_policy_1 = require("./password-policy");
class RegisterTenantAdminDto {
    email;
    password;
    name;
    tenantId;
}
exports.RegisterTenantAdminDto = RegisterTenantAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Endereco de e-mail do administrador da loja', example: 'loja@email.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'O email deve ser um endereco de e-mail valido.' }),
    __metadata("design:type", String)
], RegisterTenantAdminDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Senha do administrador da loja', example: 'SenhaForte123', minLength: 10 }),
    (0, class_validator_1.IsString)({ message: 'A senha deve ser uma string.' }),
    (0, password_policy_1.StrongPassword)(),
    __metadata("design:type", String)
], RegisterTenantAdminDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nome completo do administrador', example: 'Joao Lojista' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'O nome deve ser uma string.' }),
    __metadata("design:type", String)
], RegisterTenantAdminDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID do tenant ao qual este administrador pertence', example: 'uuid-do-tenant' }),
    (0, class_validator_1.IsUUID)('4', { message: 'O tenantId deve ser um UUID valido.' }),
    __metadata("design:type", String)
], RegisterTenantAdminDto.prototype, "tenantId", void 0);
//# sourceMappingURL=register-tenant-admin.dto.js.map