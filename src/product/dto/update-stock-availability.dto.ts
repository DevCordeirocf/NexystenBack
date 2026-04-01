import { IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateStockAvailabilityDto {
  @IsOptional()
  @IsNumber({}, { message: 'O estoque deve ser um número.' })
  stock?: number;

  @IsOptional()
  @IsBoolean({ message: 'isActive deve ser um valor booleano.' })
  isActive?: boolean;
}
