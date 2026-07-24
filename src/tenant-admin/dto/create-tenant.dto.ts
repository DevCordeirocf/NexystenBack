import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StrongPassword } from '../../auth/dto/password-policy';

export class CreateTenantDto {
  @ApiProperty({ description: 'Nome/Subdominio do tenant', example: 'loja-do-luis' })
  @IsString({ message: 'O nome do tenant deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome do tenant nao pode ser vazio.' })
  name!: string;

  @ApiPropertyOptional({ description: 'Define se o tenant esta ativo', default: true })
  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser um valor booleano.' })
  isActive?: boolean;

  @IsOptional()
  themeConfig?: Record<string, any>;

  @ApiPropertyOptional({ description: 'URL da logomarca do tenant', example: 'https://exemplo.com/logo.png' })
  @IsString({ message: 'A URL da logo deve ser uma string.' })
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Numero de WhatsApp para contato', example: '5511999999999' })
  @IsString({ message: 'O numero do WhatsApp deve ser uma string.' })
  @IsOptional()
  whatsapp?: string;

  @IsOptional()
  @IsEmail({}, { message: 'O email do administrador deve ser um endereco de e-mail valido.' })
  adminEmail?: string;

  @IsOptional()
  @IsString({ message: 'A senha do administrador deve ser uma string.' })
  @StrongPassword()
  adminPassword?: string;
}
