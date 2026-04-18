import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterMasterDto {
  @ApiProperty({ description: 'Endereço de e-mail do administrador master', example: 'admin@nexysten.com' })
  @IsEmail({}, { message: 'O email deve ser um endereço de e-mail válido.' })
  email!: string;

  @ApiProperty({ description: 'Senha do administrador master', example: 'senha123', minLength: 6 })
  @IsString({ message: 'A senha deve ser uma string.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password!: string;

  @ApiPropertyOptional({ description: 'Nome completo do administrador', example: 'Luis Eduardo' })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  name?: string;
}
