import { Injectable } from '@nestjs/common';
import { ExpenseRepository } from './repositories/expense.repository';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseApi } from 'expenses-shared';
import { convertExpenseToApi } from '../common/utils/date-converter';

@Injectable()
export class ExpensesService {
  constructor(private readonly _expenseRepository: ExpenseRepository) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<ExpenseApi> {
    const expense = await this._expenseRepository.create(createExpenseDto);
    return convertExpenseToApi(expense);
  }

  async findAll(): Promise<ExpenseApi[]> {
    const expenses = await this._expenseRepository.findAll();
    return expenses.map(convertExpenseToApi);
  }

  async findOne(id: string): Promise<ExpenseApi | null> {
    const expense = await this._expenseRepository.findOne(id);
    return expense ? convertExpenseToApi(expense) : null;
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<ExpenseApi> {
    const expense = await this._expenseRepository.update(id, updateExpenseDto);
    return convertExpenseToApi(expense);
  }

  async remove(id: string): Promise<ExpenseApi> {
    const expense = await this._expenseRepository.delete(id);
    return convertExpenseToApi(expense);
  }
}
