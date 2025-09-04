import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { PrismaService } from '../../prisma/prisma.service';

export interface StatisticsSummary {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
}

@Injectable()
export class StatisticsRepository extends BaseRepository<never> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Statistics');
  }

  async getTotalIncome(): Promise<number> {
    try {
      const result = await this.prisma.income.aggregate({
        _sum: {
          amount: true,
        },
      });
      return result._sum.amount || 0;
    } catch (error) {
      this.handleError(error, 'calculating total income');
    }
  }

  async getTotalExpenses(): Promise<number> {
    try {
      const result = await this.prisma.expense.aggregate({
        _sum: {
          amount: true,
        },
      });
      return result._sum.amount || 0;
    } catch (error) {
      this.handleError(error, 'calculating total expenses');
    }
  }

  async getSummary(): Promise<StatisticsSummary> {
    try {
      const [totalIncomeResult, totalExpensesResult] = await Promise.all([
        this.prisma.income.aggregate({
          _sum: {
            amount: true,
          },
        }),
        this.prisma.expense.aggregate({
          _sum: {
            amount: true,
          },
        }),
      ]);

      const totalIncome = totalIncomeResult._sum.amount || 0;
      const totalExpenses = totalExpensesResult._sum.amount || 0;
      const currentBalance = totalIncome - totalExpenses;

      return {
        totalIncome,
        totalExpenses,
        currentBalance,
      };
    } catch (error) {
      this.handleError(error, 'calculating summary');
    }
  }

  async getIncomeCount(): Promise<number> {
    try {
      return await this.prisma.income.count();
    } catch (error) {
      this.handleError(error, 'counting incomes');
    }
  }

  async getExpenseCount(): Promise<number> {
    try {
      return await this.prisma.expense.count();
    } catch (error) {
      this.handleError(error, 'counting expenses');
    }
  }
}
