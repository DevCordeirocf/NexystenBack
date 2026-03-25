import { IsString, IsBoolean, IsOptional, IsJSON } from 'class-validator';

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  themeConfig?: Record<string, any>; // Flexible JSON for theme configuration
}
