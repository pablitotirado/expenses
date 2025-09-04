import { Income, Expense } from '@prisma/client';
import { IncomeApi, ExpenseApi } from 'expenses-shared';

/**
 * Convert Prisma Income to IncomeApi (with string dates)
 */
export function convertIncomeToApi(income: Income): IncomeApi {
  return {
    ...income,
    date: income.date.toISOString(),
  };
}

/**
 * Convert Prisma Expense to ExpenseApi (with string dates)
 */
export function convertExpenseToApi(
  expense: Expense & { category: { id: string; name: string } },
): ExpenseApi {
  return {
    ...expense,
    date: expense.date.toISOString(),
  };
}
