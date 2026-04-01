import { IsString, IsIn, IsOptional } from 'class-validator';

export class UpdateContactRequestDto {
  @IsString({ message: 'O status deve ser uma string.' })
  @IsOptional()
  @IsIn(['PENDING', 'CONTACTED', 'CLOSED'], { message: 'O status deve ser PENDING, CONTACTED ou CLOSED.' })
  status?: string;

  @IsString({ message: 'As notas internas devem ser uma string.' })
  @IsOptional()
  internalNotes?: string; // Notas internas do lojista sobre o lead
}
