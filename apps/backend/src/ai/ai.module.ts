import { Module } from '@nestjs/common';
import { AIController } from './controller/ai.controller';
import { AIService } from './service/ai.service';
import { PrismaModule } from '../prisma/prisma.module';
import { IncomeRepository } from '../incomes/repositories/income.repository';
import { ExpenseRepository } from '../expenses/repositories/expense.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AIController],
  providers: [AIService, IncomeRepository, ExpenseRepository],
})
export class AIModule {}
