import { IsEmail, IsString, MinLength, IsOptional, IsUUID, IsEnum, IsPhoneNumber } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterUserDto {
  @IsEmail({}, { message: 'O email deve ser um endereço de e-mail válido.' })
  email!: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password!: string;

  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  name?: string;

  @IsOptional()
  @IsPhoneNumber('BR', { message: 'O telefone deve ser um número de telefone válido do Brasil.' })
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'A role deve ser MASTER_ADMIN, TENANT_ADMIN ou CUSTOMER.' })
  role?: UserRole;

  @IsOptional()
  @IsUUID('4', { message: 'O tenantId deve ser um UUID válido.' })
  tenantId?: string;
}
