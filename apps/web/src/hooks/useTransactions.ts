import { useMemo } from 'react';
import { useIncomes } from './useIncomes';
import { useExpenses } from './useExpenses';
import { combineTransactions } from '../services/transactionService';
import type { TransactionFilters } from '../types/transaction';

export const useTransactions = (filters?: TransactionFilters) => {
  const {
    data: incomes,
    isLoading: incomesLoading,
    error: incomesError,
  } = useIncomes();
  const {
    data: expenses,
    isLoading: expensesLoading,
    error: expensesError,
  } = useExpenses();

  const transactions = useMemo(() => {
    if (!incomes || !expenses) return [];
    return combineTransactions(incomes, expenses);
  }, [incomes, expenses]);

  const filteredTransactions = useMemo(() => {
    if (!filters) return transactions;

    return transactions.filter(transaction => {
      if (
        filters.type &&
        filters.type !== 'all' &&
        transaction.type !== filters.type
      ) {
        return false;
      }

      if (
        filters.categoryId &&
        transaction.type === 'expense' &&
        transaction.category?.id !== filters.categoryId
      ) {
        return false;
      }

      if (filters.startDate && new Date(transaction.date) < filters.startDate) {
        return false;
      }

      if (filters.endDate && new Date(transaction.date) > filters.endDate) {
        return false;
      }

      return true;
    });
  }, [transactions, filters]);

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    isLoading: incomesLoading || expensesLoading,
    error: incomesError || expensesError,
  };
};
