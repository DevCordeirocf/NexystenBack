import { IsNotEmpty, IsOptional, IsString, MaxLength, IsUUID} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Nome da categoria', example: 'Joias de Luxo', maxLength: 100 })
  @IsString({ message: 'O nome da categoria deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome da categoria não pode ser vazio.' })
  @MaxLength(100, { message: 'O nome da categoria não pode ter mais de 100 caracteres.' })
  name!: string;

  @ApiPropertyOptional({ description: 'Descrição da categoria', example: 'Categoria destinada a joias exclusivas', maxLength: 500 })
  @IsString({ message: 'A descrição da categoria deve ser uma string.' })
  @IsOptional()
  @MaxLength(500, { message: 'A descrição da categoria não pode ter mais de 500 caracteres.' })
  description?: string;

  @IsOptional()
  @IsUUID('4', { message: 'O tenantId deve ser um UUID válido.' })
  tenantId?: string; // Será preenchido pelo interceptor/decorator
}
