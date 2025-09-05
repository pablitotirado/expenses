import { Module } from '@nestjs/common';
import { ExpensesService } from './service/expenses.service';
import { ExpensesController } from './controller/expenses.controller';
import { ExpenseRepository } from './repositories/expense.repository';
import { CategoriesModule } from '../categories/categories.module';
import { StatisticsModule } from '../statistics/statistics.module';

@Module({
  imports: [CategoriesModule, StatisticsModule],
  controllers: [ExpensesController],
  providers: [ExpensesService, ExpenseRepository],
  exports: [ExpensesService],
})
export class ExpensesModule {}
