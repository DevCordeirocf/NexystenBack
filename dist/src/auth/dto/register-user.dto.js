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
exports.RegisterUserDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
const password_policy_1 = require("./password-policy");
class RegisterUserDto {
    email;
    password;
    name;
    phone;
    role;
    tenantId;
}
exports.RegisterUserDto = RegisterUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Endereco de e-mail do usuario', example: 'admin@nexysten.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'O email deve ser um endereco de e-mail valido.' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Senha do usuario', example: 'SenhaForte123', minLength: 10 }),
    (0, class_validator_1.IsString)({ message: 'A senha deve ser uma string.' }),
    (0, password_policy_1.StrongPassword)(),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Nome completo do usuario', example: 'Luis Eduardo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'O nome deve ser uma string.' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPhoneNumber)('BR', { message: 'O telefone deve ser um numero de telefone valido do Brasil.' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.UserRole, description: 'Papel do usuario no sistema', example: 'TENANT_ADMIN' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.UserRole, { message: 'A role deve ser MASTER_ADMIN, TENANT_ADMIN ou CUSTOMER.' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID do tenant (obrigatorio para TENANT_ADMIN e CUSTOMER)', example: 'uuid-do-tenant' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'O tenantId deve ser um UUID valido.' }),
    __metadata("design:type", String)
], RegisterUserDto.prototype, "tenantId", void 0);
//# sourceMappingURL=register-user.dto.js.map