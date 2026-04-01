import { IsString, IsNumber, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'O nome do produto deve ser uma string.' })
  name!: string;

  @IsString({ message: 'A descrição do produto deve ser uma string.' })
  description!: string;

  @IsNumber({}, { message: 'O preço deve ser um número.' })
  price!: number;

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

  @IsOptional()
  @IsArray({ message: 'Os categoryIds devem ser um array.' })
  @IsString({ each: true, message: 'Cada categoryId deve ser um UUID em formato de string.' })
  categoryIds?: string[];
}
