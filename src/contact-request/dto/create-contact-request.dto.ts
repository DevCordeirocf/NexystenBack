import { IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';

export class CreateContactRequestDto {
  @IsOptional()
  @IsUUID("4", { message: "O userId deve ser um UUID válido." })
  userId?: string;
  @IsUUID("4", { message: "O productId deve ser um UUID válido." })
  productId!: string;

  @IsString({ message: "O nome do cliente deve ser uma string." })
  customerName!: string;

  @IsEmail({}, { message: "O email do cliente deve ser um endereço de e-mail válido." })
  customerEmail!: string;

  @IsOptional()
  @IsString({ message: "O telefone do cliente deve ser uma string." })
  customerPhone?: string;

  @IsOptional()
  @IsString({ message: "A mensagem deve ser uma string." })
  message?: string;
}
