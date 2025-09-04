import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class AIRequestDto {
  @ApiProperty({
    description: 'Período para el análisis financiero',
    example: 'current_month',
    enum: ['current_month', 'last_month', 'last_3_months'],
  })
  @IsString()
  period: string;

  @ApiProperty({
    description: 'Meta financiera del usuario (opcional)',
    example: 'Ahorrar para vacaciones',
    required: false,
  })
  @IsOptional()
  @IsString()
  userGoal?: string;
}
