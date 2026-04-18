import { IsEmail, IsString, MinLength, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterCustomerDto {
  @ApiProperty({ description: 'Endereço de e-mail do cliente', example: 'cliente@exemplo.com' })
  @IsEmail({}, { message: 'O email deve ser um endereço de e-mail válido.' })
  email!: string;

  @ApiProperty({ description: 'Senha do cliente', example: 'senha123', minLength: 6 })
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password!: string;

  @ApiPropertyOptional({ description: 'Nome completo do cliente', example: 'João Silva' })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  name?: string;

  @IsOptional()
  @IsPhoneNumber('BR', { message: 'O telefone deve ser um número de telefone válido do Brasil.' })
  phone?: string;
}
