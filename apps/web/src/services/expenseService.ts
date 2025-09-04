import api from '../lib/axios';
import type {
  ExpenseWithCategory,
  CreateExpenseDto,
  UpdateExpenseDto,
} from '../types/expense';

export const expenseService = {
  create: async (data: CreateExpenseDto): Promise<ExpenseWithCategory> => {
    const response = await api.post<ExpenseWithCategory>('/expenses', data);
    return response.data;
  },

  findAll: async (): Promise<ExpenseWithCategory[]> => {
    const response = await api.get<ExpenseWithCategory[]>('/expenses');
    return response.data;
  },

  findOne: async (id: string): Promise<ExpenseWithCategory> => {
    const response = await api.get<ExpenseWithCategory>(`/expenses/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateExpenseDto
  ): Promise<ExpenseWithCategory> => {
    const response = await api.patch<ExpenseWithCategory>(
      `/expenses/${id}`,
      data
    );
    return response.data;
  },

  remove: async (id: string): Promise<ExpenseWithCategory> => {
    const response = await api.delete<ExpenseWithCategory>(`/expenses/${id}`);
    return response.data;
  },
};
