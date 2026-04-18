import { IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStockAvailabilityDto {
  @ApiPropertyOptional({ description: 'Quantidade em estoque', example: 10 })
  @IsOptional()
  @IsNumber({}, { message: 'O estoque deve ser um número.' })
  stock?: number;

  @ApiPropertyOptional({ description: 'Define se o produto está ativo na vitrine', example: true })
  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser um valor booleano.' })
  isActive?: boolean;
}
