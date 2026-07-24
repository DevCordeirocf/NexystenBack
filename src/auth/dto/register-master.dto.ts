import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StrongPassword } from './password-policy';

export class RegisterMasterDto {
  @ApiProperty({ description: 'Endereco de e-mail do administrador master', example: 'admin@nexysten.com' })
  @IsEmail({}, { message: 'O email deve ser um endereco de e-mail valido.' })
  email!: string;

  @ApiProperty({ description: 'Senha do administrador master', example: 'SenhaForte123', minLength: 10 })
  @IsString({ message: 'A senha deve ser uma string.' })
  @StrongPassword()
  password!: string;

  @ApiPropertyOptional({ description: 'Nome completo do administrador', example: 'Luis Eduardo' })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  name?: string;
}
