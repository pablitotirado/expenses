import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { IncomeRepository } from './repositories/income.repository';

@Module({
  controllers: [IncomesController],
  providers: [IncomesService, IncomeRepository],
  exports: [IncomesService],
})
export class IncomesModule {}
