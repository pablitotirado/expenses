import type { Transaction } from '../types/transaction';
import type { IncomeType } from '../types/income';
import type { ExpenseWithCategory } from '../types/expense';

export const combineTransactions = (
  incomes: IncomeType[],
  expenses: ExpenseWithCategory[]
): Transaction[] => {
  const incomeTransactions: Transaction[] = incomes.map(income => ({
    id: income.id,
    type: 'income' as const,
    amount: income.amount,
    description: income.description,
    date: income.date,
  }));

  const expenseTransactions: Transaction[] = expenses.map(expense => ({
    id: expense.id,
    type: 'expense' as const,
    amount: expense.amount,
    description: expense.description,
    date: expense.date,
    category: {
      id: expense.category.id,
      name: expense.category.name,
    },
  }));

  return [...incomeTransactions, ...expenseTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
