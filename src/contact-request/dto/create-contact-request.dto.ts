import { IsString, IsEmail, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactRequestDto {
  @IsOptional()
  @IsUUID("4", { message: "O userId deve ser um UUID válido." })
  userId?: string;
  @ApiProperty({ description: 'ID do produto de interesse', example: 'uuid-do-produto' })
  @IsUUID("4", { message: "O productId deve ser um UUID válido." })
  productId!: string;

  @ApiProperty({ description: 'Nome do cliente interessado', example: 'Fulano de Tal' })
  @IsString({ message: "O nome do cliente deve ser uma string." })
  customerName!: string;

  @ApiProperty({ description: 'E-mail para contato', example: 'fulano@exemplo.com' })
  @IsEmail({}, { message: "O email do cliente deve ser um endereço de e-mail válido." })
  customerEmail!: string;

  @IsOptional()
  @IsString({ message: "O telefone do cliente deve ser uma string." })
  customerPhone?: string;

  @ApiPropertyOptional({ description: 'Mensagem adicional do cliente', example: 'Gostaria de saber mais sobre as especificações.' })
  @IsOptional()
  @IsString({ message: "A mensagem deve ser uma string." })
  message?: string;
}
