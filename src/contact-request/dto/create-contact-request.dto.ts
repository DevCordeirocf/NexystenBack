import { IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';

export class CreateContactRequestDto {
  @IsUUID()
  productId: string;

  @IsString()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  message?: string;
}
