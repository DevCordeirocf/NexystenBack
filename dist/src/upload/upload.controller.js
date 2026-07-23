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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const crypto_1 = require("crypto");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const client_1 = require("@prisma/client");
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGES = [
    {
        extension: 'jpg',
        mimeTypes: ['image/jpeg'],
        matches: (buffer) => buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,
    },
    {
        extension: 'png',
        mimeTypes: ['image/png'],
        matches: (buffer) => buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    },
    {
        extension: 'gif',
        mimeTypes: ['image/gif'],
        matches: (buffer) => ['GIF87a', 'GIF89a'].includes(buffer.subarray(0, 6).toString('ascii')),
    },
    {
        extension: 'webp',
        mimeTypes: ['image/webp'],
        matches: (buffer) => buffer.length > 12 &&
            buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
            buffer.subarray(8, 12).toString('ascii') === 'WEBP',
    },
];
const uploadOptions = {
    storage: (0, multer_1.memoryStorage)(),
    fileFilter: (_req, file, callback) => {
        const allowedMimeTypes = ALLOWED_IMAGES.flatMap((image) => image.mimeTypes);
        if (!allowedMimeTypes.includes(file.mimetype)) {
            callback(new common_1.BadRequestException('Apenas imagens jpg, png, gif ou webp sao permitidas.'), false);
            return;
        }
        callback(null, true);
    },
    limits: {
        fileSize: MAX_IMAGE_SIZE_BYTES,
    },
};
let UploadController = class UploadController {
    async uploadImage(file, request) {
        if (!file) {
            throw new common_1.BadRequestException('O arquivo e obrigatorio.');
        }
        return this.persistImage(file, request);
    }
    async uploadImages(files, request) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('Os arquivos sao obrigatorios.');
        }
        return Promise.all(files.map((file) => this.persistImage(file, request)));
    }
    async persistImage(file, request) {
        const tenantId = this.getTenantId(request);
        const imageType = this.detectImageType(file);
        const filename = `${(0, crypto_1.randomUUID)()}.${imageType.extension}`;
        const uploadDirectory = (0, path_1.join)(process.cwd(), 'uploads', tenantId);
        const absolutePath = (0, path_1.join)(uploadDirectory, filename);
        await (0, promises_1.mkdir)(uploadDirectory, { recursive: true });
        await (0, promises_1.writeFile)(absolutePath, file.buffer, { flag: 'wx' });
        return {
            url: `/uploads/${tenantId}/${filename}`,
            filename,
            mimeType: file.mimetype,
            size: file.size,
        };
    }
    getTenantId(request) {
        const tenantId = request.tenantId;
        if (!tenantId) {
            throw new common_1.BadRequestException('Tenant ID nao encontrado para o upload.');
        }
        return tenantId;
    }
    detectImageType(file) {
        const imageType = ALLOWED_IMAGES.find((image) => image.mimeTypes.includes(file.mimetype) && image.matches(file.buffer));
        if (!imageType) {
            throw new common_1.BadRequestException('Arquivo rejeitado: conteudo nao corresponde a uma imagem permitida.');
        }
        return imageType;
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('image'),
    (0, swagger_1.ApiOperation)({ summary: 'Realizar o upload de uma unica imagem' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, roles_decorator_1.Roles)(client_1.UserRole.MASTER_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', uploadOptions)),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('images'),
    (0, swagger_1.ApiOperation)({ summary: 'Realizar o upload de multiplas imagens, ate 10 por vez' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    }),
    (0, roles_decorator_1.Roles)(client_1.UserRole.MASTER_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, uploadOptions)),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImages", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('Upload de Imagens'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('upload')
], UploadController);
//# sourceMappingURL=upload.controller.js.map