import api from '../lib/axios';
import type {
  IncomeType,
  CreateIncomeDto,
  UpdateIncomeDto,
} from '../types/income';

export const incomeService = {
  create: async (data: CreateIncomeDto): Promise<IncomeType> => {
    const response = await api.post<IncomeType>('/incomes', data);
    return response.data;
  },

  findAll: async (): Promise<IncomeType[]> => {
    const response = await api.get<IncomeType[]>('/incomes');
    return response.data;
  },

  findOne: async (id: string): Promise<IncomeType> => {
    const response = await api.get<IncomeType>(`/incomes/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateIncomeDto): Promise<IncomeType> => {
    const response = await api.patch<IncomeType>(`/incomes/${id}`, data);
    return response.data;
  },

  remove: async (id: string): Promise<IncomeType> => {
    const response = await api.delete<IncomeType>(`/incomes/${id}`);
    return response.data;
  },
};
