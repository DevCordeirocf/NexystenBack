import { IsOptional, IsIn } from 'class-validator';

export class UpdateContactRequestDto {
  @IsOptional()
  @IsIn(['PENDING', 'CONTACTED', 'CLOSED'])
  status?: string;
}
