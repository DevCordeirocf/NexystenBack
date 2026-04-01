import { IsString, IsBoolean, IsOptional, IsJSON } from 'class-validator';

export class UpdateTenantDto {
  @IsOptional()
  @IsString({ message: 'O nome do tenant deve ser uma string.' })
  name?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser um valor booleano.' })
  isActive?: boolean;

  @IsOptional()
  // @IsJSON({ message: 'themeConfig deve ser um JSON válido.' })
  themeConfig?: Record<string, any>; // Flexible JSON for theme configuration

  @IsString({ message: 'A URL da logo deve ser uma string.' })
  @IsOptional()
  logoUrl?: string;

  @IsString({ message: 'O número do WhatsApp deve ser uma string.' })
  @IsOptional()
  whatsappNumber?: string;
}
