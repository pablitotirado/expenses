import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ExpenseRepository } from '../repositories/expense.repository';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { ExpenseApi } from 'expenses-shared';
import { convertExpenseToApi } from '../../common/utils/date-converter';
import { StatisticsService } from '../../statistics/service/statistics.service';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly _expenseRepository: ExpenseRepository,
    private readonly _statisticsService: StatisticsService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<ExpenseApi> {
    // Verificar balance disponible antes de crear el gasto
    const summary = await this._statisticsService.getSummary();

    if (createExpenseDto.amount > summary.currentBalance) {
      throw new BadRequestException(
        `Balance insuficiente. Disponible: $${summary.currentBalance.toFixed(2)}, solicitado: $${createExpenseDto.amount.toFixed(2)}`,
      );
    }

    const expense = await this._expenseRepository.create(createExpenseDto);
    return convertExpenseToApi(expense);
  }

  async findAll(): Promise<ExpenseApi[]> {
    const expenses = await this._expenseRepository.findAll();
    return expenses.map(convertExpenseToApi);
  }

  async findOne(id: string): Promise<ExpenseApi> {
    const expense = await this._expenseRepository.findOne(id);
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return convertExpenseToApi(expense);
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<ExpenseApi> {
    // First check if expense exists
    await this.findOne(id);

    const expense = await this._expenseRepository.update(id, updateExpenseDto);
    return convertExpenseToApi(expense);
  }

  async remove(id: string): Promise<ExpenseApi> {
    // First check if expense exists
    await this.findOne(id);

    const expense = await this._expenseRepository.delete(id);
    return convertExpenseToApi(expense);
  }
}
