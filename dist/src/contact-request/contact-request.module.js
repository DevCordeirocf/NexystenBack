"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRequestModule = void 0;
const common_1 = require("@nestjs/common");
const contact_request_service_1 = require("./contact-request.service");
const contact_request_controller_1 = require("./contact-request.controller");
const prisma_module_1 = require("../database/prisma.module");
const tenant_module_1 = require("../tenant/tenant.module");
let ContactRequestModule = class ContactRequestModule {
};
exports.ContactRequestModule = ContactRequestModule;
exports.ContactRequestModule = ContactRequestModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, tenant_module_1.TenantModule],
        controllers: [contact_request_controller_1.ContactRequestController],
        providers: [contact_request_service_1.ContactRequestService],
    })
], ContactRequestModule);
//# sourceMappingURL=contact-request.module.js.map