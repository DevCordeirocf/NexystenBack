import { IsString, IsNumber, IsOptional, IsArray, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Nome do produto', example: 'Anel de Ouro 18k' })
  @IsString({ message: 'O nome do produto deve ser uma string.' })
  name!: string;

  @ApiProperty({ description: 'Descrição detalhada do produto', example: 'Anel elegante em ouro 18k com diamante' })
  @IsString({ message: 'A descrição do produto deve ser uma string.' })
  description!: string;

  @ApiProperty({ description: 'Preço do produto', example: 1500.00 })
  @IsNumber({}, { message: 'O preço deve ser um número.' })
  price!: number;

  @ApiProperty({ description: 'Lista de URLs das imagens do produto', example: ['https://exemplo.com/imagem1.jpg'] })
  @IsArray({ message: 'As imagens devem ser um array.' })
  @IsString({ each: true, message: 'Cada imagem deve ser uma URL em formato de string.' })
  images!: string[];

  @IsOptional()
  specifications?: Record<string, any>;

  @IsOptional()
  @IsNumber({}, { message: 'O estoque deve ser um número.' })
  stock?: number;

  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser um valor booleano.' })
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Lista de IDs das categorias associadas', example: ['uuid-categoria-1'] })
  @IsOptional()
  @IsArray({ message: 'Os categoryIds devem ser um array.' })
  @IsUUID('4', { each: true, message: 'Cada categoryId deve ser um UUID valido.' })
  categoryIds?: string[];
}
