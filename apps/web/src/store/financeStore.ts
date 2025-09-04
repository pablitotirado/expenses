import { create } from 'zustand';
import type { Income, Expense, CategoryWithUI } from '../types/finance';

interface FinanceState {
  incomes: Income[];
  expenses: Expense[];
  categories: CategoryWithUI[];

  addIncome: (income: Income) => void;
  addExpense: (expense: Expense) => void;
  addCategory: (category: CategoryWithUI) => void;
  deleteIncome: (id: string) => void;
  deleteExpense: (id: string) => void;
  deleteCategory: (id: string) => void;
}

const initialCategories: CategoryWithUI[] = [
  { id: '1', name: 'Comida', color: '#EF4444', icon: '🍕' },
  { id: '2', name: 'Transporte', color: '#3B82F6', icon: '🚗' },
  { id: '3', name: 'Entretenimiento', color: '#8B5CF6', icon: '🎬' },
  { id: '4', name: 'Salud', color: '#10B981', icon: '🏥' },
  { id: '5', name: 'Educación', color: '#F59E0B', icon: '📚' },
  { id: '6', name: 'Otros', color: '#6B7280', icon: '📦' },
];

export const useFinanceStore = create<FinanceState>(set => ({
 inicial
  incomes: [],
  expenses: [],
  categories: initialCategories,

  addIncome: (income: Income) => {
    set(state => ({
      incomes: [...state.incomes, income],
    }));
  },

  addExpense: (expense: Expense) => {
    set(state => ({
      expenses: [...state.expenses, expense],
    }));
  },

  addCategory: (category: CategoryWithUI) => {
    set(state => ({
      categories: [...state.categories, category],
    }));
  },

  deleteIncome: (id: string) => {
    set(state => ({
      incomes: state.incomes.filter(inc => inc.id !== id),
    }));
  },

  deleteExpense: (id: string) => {
    set(state => ({
      expenses: state.expenses.filter(exp => exp.id !== id),
    }));
  },

  deleteCategory: (id: string) => {
    set(state => ({
      categories: state.categories.filter(cat => cat.id !== id),
    }));
  },
}));
