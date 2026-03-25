import { IsEmail, IsString, MinLength, IsOptional, IsUUID, IsEnum, IsPhoneNumber } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsUUID()
  tenantId?: string;
}
