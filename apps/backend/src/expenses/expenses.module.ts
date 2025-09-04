import { Module } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { ExpenseRepository } from './repositories/expense.repository';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [CategoriesModule],
  controllers: [ExpensesController],
  providers: [ExpensesService, ExpenseRepository],
  exports: [ExpensesService],
})
export class ExpensesModule {}
