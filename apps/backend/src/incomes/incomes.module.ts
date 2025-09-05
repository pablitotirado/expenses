import { Module } from '@nestjs/common';
import { IncomesService } from './service/incomes.service';
import { IncomesController } from './controller/incomes.controller';
import { IncomeRepository } from './repositories/income.repository';

@Module({
  controllers: [IncomesController],
  providers: [IncomesService, IncomeRepository],
  exports: [IncomesService],
})
export class IncomesModule {}
