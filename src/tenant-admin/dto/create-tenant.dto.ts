import { IsString, IsBoolean, IsOptional, IsEmail, MinLength, IsEnum, IsUUID, IsNotEmpty } from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({ description: 'Nome/Subdomínio do tenant', example: 'loja-do-luis' })
  @IsString({ message: 'O nome do tenant deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome do tenant não pode ser vazio.' })
  name!: string;

  @ApiPropertyOptional({ description: 'Define se o tenant está ativo', default: true })
  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser um valor booleano.' })
  isActive?: boolean;

  @IsOptional()
  // @IsJSON({ message: 'themeConfig deve ser um JSON válido.' })
  themeConfig?: Record<string, any>; // Flexible JSON for theme configuration

  @ApiPropertyOptional({ description: 'URL da logomarca do tenant', example: 'https://exemplo.com/logo.png' })
  @IsString({ message: 'A URL da logo deve ser uma string.' })
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Número de WhatsApp para contato', example: '5511999999999' })
  @IsString({ message: 'O número do WhatsApp deve ser uma string.' })
  @IsOptional()
  whatsapp?: string;

  // Admin User for this tenant (optional, can be created later)
  @IsOptional()
  @IsEmail({}, { message: 'O email do administrador deve ser um endereço de e-mail válido.' })
  adminEmail?: string;

  @IsOptional()
  @IsString({ message: 'A senha do administrador deve ser uma string.' })
  @MinLength(6, { message: 'A senha do administrador deve ter no mínimo 6 caracteres.' })
  adminPassword?: string;
}
