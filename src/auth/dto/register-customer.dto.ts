import { IsEmail, IsString, MinLength, IsOptional, IsPhoneNumber } from 'class-validator';

export class RegisterCustomerDto {
  @IsEmail({}, { message: 'O email deve ser um endereço de e-mail válido.' })
  email!: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password!: string;

  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  name?: string;

  @IsOptional()
  @IsPhoneNumber('BR', { message: 'O telefone deve ser um número de telefone válido do Brasil.' })
  phone?: string;
}
