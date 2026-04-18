import { IsString, IsIn, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContactRequestDto {
  @ApiPropertyOptional({ description: 'Status da solicitação', enum: ['PENDING', 'CONTACTED', 'CLOSED'], example: 'CONTACTED' })
  @IsString({ message: 'O status deve ser uma string.' })
  @IsOptional()
  @IsIn(['PENDING', 'CONTACTED', 'CLOSED'], { message: 'O status deve ser PENDING, CONTACTED ou CLOSED.' })
  status?: string;

  @ApiPropertyOptional({ description: 'Notas internas para acompanhamento', example: 'Cliente agendou visita para terça-feira.' })
  @IsString({ message: 'As notas internas devem ser uma string.' })
  @IsOptional()
  internalNotes?: string; // Notas internas do lojista sobre o lead
}
