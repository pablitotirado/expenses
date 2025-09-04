import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateExpenseDto as SharedCreateExpenseDto } from 'expenses-shared';

export class CreateExpenseDto implements SharedCreateExpenseDto {
  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty()
  @IsUUID()
  categoryId: string;
}
