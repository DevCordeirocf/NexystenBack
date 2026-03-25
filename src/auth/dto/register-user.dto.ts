import { IsEmail, IsString, MinLength, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsUUID()
  tenantId?: string;
}
