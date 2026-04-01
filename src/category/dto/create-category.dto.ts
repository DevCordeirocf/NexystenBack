import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'O nome da categoria deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome da categoria não pode ser vazio.' })
  @MaxLength(100, { message: 'O nome da categoria não pode ter mais de 100 caracteres.' })
  name!: string;

  @IsString({ message: 'A descrição da categoria deve ser uma string.' })
  @IsOptional()
  @MaxLength(500, { message: 'A descrição da categoria não pode ter mais de 500 caracteres.' })
  description?: string;

  tenantId?: string; // Será preenchido pelo interceptor/decorator
}
