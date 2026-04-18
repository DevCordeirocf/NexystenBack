import { IsEmail, IsString, MinLength, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterTenantAdminDto {
  @ApiProperty({ description: 'Endereço de e-mail do administrador da loja', example: 'loja@email.com' })
  @IsEmail({}, { message: 'O email deve ser um endereço de e-mail válido.' })
  email!: string;

  @ApiProperty({ description: 'Senha do administrador da loja', example: 'senha123', minLength: 6 })
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password!: string;

  @ApiPropertyOptional({ description: 'Nome completo do administrador', example: 'João Lojista' })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  name?: string;

  @ApiProperty({ description: 'ID do tenant ao qual este administrador pertence', example: 'uuid-do-tenant' })
  @IsUUID('4', { message: 'O tenantId deve ser um UUID válido.' })
  tenantId!: string;
}
