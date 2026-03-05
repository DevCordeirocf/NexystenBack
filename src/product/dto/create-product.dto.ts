import { IsString, IsNumber, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsNumber()
  price!: number;

  @IsArray()
  @IsString({ each: true })
  images!: string[];

  @IsOptional()
  specifications?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
