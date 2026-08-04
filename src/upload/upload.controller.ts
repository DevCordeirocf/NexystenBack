import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

type AllowedImage = {
  extension: string;
  mimeTypes: string[];
  matches: (buffer: Buffer) => boolean;
};

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_IMAGES: AllowedImage[] = [
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
    matches: (buffer) =>
      buffer.length > 12 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP',
  },
];

const uploadOptions = {
  storage: memoryStorage(),
  fileFilter: (_req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    const allowedMimeTypes = ALLOWED_IMAGES.flatMap((image) => image.mimeTypes);

    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(new BadRequestException('Apenas imagens jpg, png, gif ou webp sao permitidas.'), false);
      return;
    }

    callback(null, true);
  },
  limits: {
    fileSize: MAX_IMAGE_SIZE_BYTES,
  },
};

@ApiTags('Upload de Imagens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('upload')
export class UploadController {
  @Post('image')
  @ApiOperation({ summary: 'Realizar o upload de uma unica imagem' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  @UseInterceptors(FileInterceptor('file', uploadOptions))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Req() request: Request) {
    if (!file) {
      throw new BadRequestException('O arquivo e obrigatorio.');
    }

    return this.persistImage(file, request);
  }

  @Post('images')
  @ApiOperation({ summary: 'Realizar o upload de multiplas imagens, ate 10 por vez' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  @UseInterceptors(FilesInterceptor('files', 10, uploadOptions))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[], @Req() request: Request) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Os arquivos sao obrigatorios.');
    }

    return Promise.all(files.map((file) => this.persistImage(file, request)));
  }

  private async persistImage(file: Express.Multer.File, request: Request) {
    const tenantId = this.getTenantId(request);
    const imageType = this.detectImageType(file);
    const filename = `${randomUUID()}.${imageType.extension}`;

    // If R2/S3 is configured, upload to object storage; otherwise fallback to local filesystem
    const useObjectStorage = (process.env.USE_R2 === 'true') || !!process.env.R2_BUCKET;

    if (useObjectStorage) {
      // Lazy import to avoid forcing AWS deps when not used
      const { S3Service } = await import('./s3.service');

      const bucket = process.env.R2_BUCKET as string;
      if (!bucket) {
        throw new BadRequestException('R2_BUCKET nao configurado.');
      }

      const key = `${tenantId}/${filename}`;

      const s3 = new S3Service({
        region: process.env.R2_REGION,
        endpoint: process.env.R2_ENDPOINT,
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        forcePathStyle: process.env.R2_FORCE_PATH_STYLE === 'true',
      });

      // Upload object
      await s3.putObject(bucket, key, file.buffer, file.mimetype);

      // If a public base URL is provided (e.g., https://<account>.r2.dev), return that; otherwise return a signed GET URL
      const publicBase = process.env.R2_PUBLIC_BASE_URL;
      let url: string;
      if (publicBase) {
        const trimmed = publicBase.replace(/\/$/, '');
        url = `${trimmed}/${bucket}/${key}`;
      } else {
        url = await s3.getSignedUrl(bucket, key, 60 * 60); // 1 hour
      }

      return {
        url,
        filename,
        mimeType: file.mimetype,
        size: file.size,
      };
    }

    // Fallback: local filesystem (existing behavior)
    const uploadDirectory = join(process.cwd(), 'uploads', tenantId);
    const absolutePath = join(uploadDirectory, filename);

    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(absolutePath, file.buffer, { flag: 'wx' });

    return {
      url: `/uploads/${tenantId}/${filename}`,
      filename,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  private getTenantId(request: Request) {
    const tenantId = (request as Request & { tenantId?: string }).tenantId;

    if (!tenantId) {
      throw new BadRequestException('Tenant ID nao encontrado para o upload.');
    }

    return tenantId;
  }

  private detectImageType(file: Express.Multer.File) {
    const imageType = ALLOWED_IMAGES.find(
      (image) => image.mimeTypes.includes(file.mimetype) && image.matches(file.buffer),
    );

    if (!imageType) {
      throw new BadRequestException('Arquivo rejeitado: conteudo nao corresponde a uma imagem permitida.');
    }

    return imageType;
  }
}
