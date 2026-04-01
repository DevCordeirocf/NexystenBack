import { IsString, IsBoolean, IsOptional, IsEmail, MinLength, IsEnum, IsUUID, IsNotEmpty } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateTenantDto {
  @IsString({ message: 'O nome do tenant deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome do tenant não pode ser vazio.' })
  name!: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser um valor booleano.' })
  isActive?: boolean;

  @IsOptional()
  // @IsJSON({ message: 'themeConfig deve ser um JSON válido.' })
  themeConfig?: Record<string, any>; // Flexible JSON for theme configuration

  @IsString({ message: 'A URL da logo deve ser uma string.' })
  @IsOptional()
  logoUrl?: string;

  @IsString({ message: 'O número do WhatsApp deve ser uma string.' })
  @IsOptional()
  whatsappNumber?: string;

  // Admin User for this tenant (optional, can be created later)
  @IsOptional()
  @IsEmail({}, { message: 'O email do administrador deve ser um endereço de e-mail válido.' })
  adminEmail?: string;

  @IsOptional()
  @IsString({ message: 'A senha do administrador deve ser uma string.' })
  @MinLength(6, { message: 'A senha do administrador deve ter no mínimo 6 caracteres.' })
  adminPassword?: string;
}
