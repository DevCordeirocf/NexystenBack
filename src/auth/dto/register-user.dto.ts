import { IsEmail, IsString, MinLength, IsOptional, IsUUID, IsEnum, IsPhoneNumber } from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ description: 'Endereço de e-mail do usuário', example: 'admin@nexysten.com' })
  @IsEmail({}, { message: 'O email deve ser um endereço de e-mail válido.' })
  email!: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'senha123', minLength: 6 })
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password!: string;

  @ApiPropertyOptional({ description: 'Nome completo do usuário', example: 'Luis Eduardo' })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  name?: string;

  @IsOptional()
  @IsPhoneNumber('BR', { message: 'O telefone deve ser um número de telefone válido do Brasil.' })
  phone?: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'Papel do usuário no sistema', example: 'TENANT_ADMIN' })
  @IsOptional()
  @IsEnum(UserRole, { message: 'A role deve ser MASTER_ADMIN, TENANT_ADMIN ou CUSTOMER.' })
  role?: UserRole;

  @IsOptional()
  @IsUUID('4', { message: 'O tenantId deve ser um UUID válido.' })
  tenantId?: string;
}
