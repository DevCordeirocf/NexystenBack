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
exports.CreateTenantDto = void 0;
const class_validator_1 = require("class-validator");
class CreateTenantDto {
    name;
    isActive;
    themeConfig;
    logoUrl;
    whatsappNumber;
    adminEmail;
    adminPassword;
}
exports.CreateTenantDto = CreateTenantDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'O nome do tenant deve ser uma string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome do tenant não pode ser vazio.' }),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'isActive deve ser um valor booleano.' }),
    __metadata("design:type", Boolean)
], CreateTenantDto.prototype, "isActive", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateTenantDto.prototype, "themeConfig", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'A URL da logo deve ser uma string.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "logoUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'O número do WhatsApp deve ser uma string.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "whatsappNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'O email do administrador deve ser um endereço de e-mail válido.' }),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "adminEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'A senha do administrador deve ser uma string.' }),
    (0, class_validator_1.MinLength)(6, { message: 'A senha do administrador deve ter no mínimo 6 caracteres.' }),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "adminPassword", void 0);
//# sourceMappingURL=create-tenant.dto.js.map