import { PartialType } from '@nestjs/swagger';
import { CreateIncomeDto } from './create-income.dto';
import { UpdateIncomeDto as SharedUpdateIncomeDto } from 'expenses-shared';

export class UpdateIncomeDto
  extends PartialType(CreateIncomeDto)
  implements SharedUpdateIncomeDto {}
