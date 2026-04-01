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
exports.CreateContactRequestDto = void 0;
const class_validator_1 = require("class-validator");
class CreateContactRequestDto {
    userId;
    productId;
    customerName;
    customerEmail;
    customerPhone;
    message;
}
exports.CreateContactRequestDto = CreateContactRequestDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)("4", { message: "O userId deve ser um UUID válido." }),
    __metadata("design:type", String)
], CreateContactRequestDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)("4", { message: "O productId deve ser um UUID válido." }),
    __metadata("design:type", String)
], CreateContactRequestDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: "O nome do cliente deve ser uma string." }),
    __metadata("design:type", String)
], CreateContactRequestDto.prototype, "customerName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: "O email do cliente deve ser um endereço de e-mail válido." }),
    __metadata("design:type", String)
], CreateContactRequestDto.prototype, "customerEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "O telefone do cliente deve ser uma string." }),
    __metadata("design:type", String)
], CreateContactRequestDto.prototype, "customerPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "A mensagem deve ser uma string." }),
    __metadata("design:type", String)
], CreateContactRequestDto.prototype, "message", void 0);
//# sourceMappingURL=create-contact-request.dto.js.map