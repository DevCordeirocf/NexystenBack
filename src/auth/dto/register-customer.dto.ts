import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StrongPassword } from './password-policy';

export class RegisterCustomerDto {
  @ApiProperty({ description: 'Endereco de e-mail do cliente', example: 'cliente@exemplo.com' })
  @IsEmail({}, { message: 'O email deve ser um endereco de e-mail valido.' })
  email!: string;

  @ApiProperty({ description: 'Senha do cliente', example: 'SenhaForte123', minLength: 10 })
  @IsString({ message: 'A senha deve ser uma string.' })
  @StrongPassword()
  password!: string;

  @ApiPropertyOptional({ description: 'Nome completo do cliente', example: 'Joao Silva' })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  name?: string;

  @IsOptional()
  @IsPhoneNumber('BR', { message: 'O telefone deve ser um numero de telefone valido do Brasil.' })
  phone?: string;
}
