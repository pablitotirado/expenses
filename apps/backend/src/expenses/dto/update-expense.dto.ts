import { PartialType } from '@nestjs/swagger';
import { CreateExpenseDto } from './create-expense.dto';
import { UpdateExpenseDto as SharedUpdateExpenseDto } from 'expenses-shared';

export class UpdateExpenseDto
  extends PartialType(CreateExpenseDto)
  implements SharedUpdateExpenseDto {}
