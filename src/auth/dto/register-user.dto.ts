import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StrongPassword } from './password-policy';

export class RegisterUserDto {
  @ApiProperty({ description: 'Endereco de e-mail do usuario', example: 'admin@nexysten.com' })
  @IsEmail({}, { message: 'O email deve ser um endereco de e-mail valido.' })
  email!: string;

  @ApiProperty({ description: 'Senha do usuario', example: 'SenhaForte123', minLength: 10 })
  @IsString({ message: 'A senha deve ser uma string.' })
  @StrongPassword()
  password!: string;

  @ApiPropertyOptional({ description: 'Nome completo do usuario', example: 'Luis Eduardo' })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  name?: string;

  @IsOptional()
  @IsPhoneNumber('BR', { message: 'O telefone deve ser um numero de telefone valido do Brasil.' })
  phone?: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'Papel do usuario no sistema', example: 'TENANT_ADMIN' })
  @IsOptional()
  @IsEnum(UserRole, { message: 'A role deve ser MASTER_ADMIN, TENANT_ADMIN ou CUSTOMER.' })
  role?: UserRole;

  @ApiPropertyOptional({ description: 'ID do tenant (obrigatorio para TENANT_ADMIN e CUSTOMER)', example: 'uuid-do-tenant' })
  @IsOptional()
  @IsUUID('4', { message: 'O tenantId deve ser um UUID valido.' })
  tenantId?: string;
}
