import { IsString, IsBoolean, IsOptional, IsEmail, MinLength, IsEnum, IsUUID } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateTenantDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  themeConfig?: Record<string, any>; // Flexible JSON for theme configuration

  // Admin User for this tenant (optional, can be created later)
  @IsOptional()
  @IsEmail()
  adminEmail?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Admin password must be at least 6 characters long' })
  adminPassword?: string;
}
