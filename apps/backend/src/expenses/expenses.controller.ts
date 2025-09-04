import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseWithCategory } from '../common/types/prisma.types';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly _expensesService: ExpensesService) {}

  @Post()
  create(
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<ExpenseWithCategory> {
    return this._expensesService.create(createExpenseDto);
  }

  @Get()
  findAll(): Promise<ExpenseWithCategory[]> {
    return this._expensesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ExpenseWithCategory | null> {
    return this._expensesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<ExpenseWithCategory> {
    return this._expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<ExpenseWithCategory> {
    return this._expensesService.remove(id);
  }
}
