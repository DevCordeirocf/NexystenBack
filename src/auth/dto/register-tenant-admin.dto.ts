import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StrongPassword } from './password-policy';

export class RegisterTenantAdminDto {
  @ApiProperty({ description: 'Endereco de e-mail do administrador da loja', example: 'loja@email.com' })
  @IsEmail({}, { message: 'O email deve ser um endereco de e-mail valido.' })
  email!: string;

  @ApiProperty({ description: 'Senha do administrador da loja', example: 'SenhaForte123', minLength: 10 })
  @IsString({ message: 'A senha deve ser uma string.' })
  @StrongPassword()
  password!: string;

  @ApiPropertyOptional({ description: 'Nome completo do administrador', example: 'Joao Lojista' })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  name?: string;

  @ApiProperty({ description: 'ID do tenant ao qual este administrador pertence', example: 'uuid-do-tenant' })
  @IsUUID('4', { message: 'O tenantId deve ser um UUID valido.' })
  tenantId!: string;
}
