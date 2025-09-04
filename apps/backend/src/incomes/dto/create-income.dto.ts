import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateIncomeDto as SharedCreateIncomeDto } from 'expenses-shared';

export class CreateIncomeDto implements SharedCreateIncomeDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string | null;
}
