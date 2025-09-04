import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { CreateCategoryDto as SharedCreateCategoryDto } from 'expenses-shared';

export class CreateCategoryDto implements SharedCreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
