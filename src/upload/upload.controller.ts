import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

/**
 * Controller responsável pelo upload de arquivos (imagens de produtos/imóveis).
 * Protegido por autenticação e restrito a administradores.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('upload')
export class UploadController {
  
  /**
   * Realiza o upload de uma única imagem.
   * Limite de 5MB. Formatos aceitos: jpg, jpeg, png, gif, webp.
   */
  @Post('image')
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new BadRequestException('Apenas arquivos de imagem são permitidos!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('O arquivo é obrigatório');
    }
    
    // Retorna a URL relativa para acesso estático à imagem
    return {
      url: `/uploads/${file.filename}`,
      filename: file.filename,
    };
  }

  /**
   * Realiza o upload de múltiplas imagens (até 10 por vez).
   */
  @Post('images')
  @Roles(UserRole.MASTER_ADMIN, UserRole.TENANT_ADMIN)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new BadRequestException('Apenas arquivos de imagem são permitidos!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Os arquivos são obrigatórios');
    }
    
    return files.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
    }));
  }
}
