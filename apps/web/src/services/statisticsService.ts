import api from '../lib/axios';
import type { FinancialSummary } from '../types/statistics';

export const statisticsService = {
  getSummary: async (): Promise<FinancialSummary> => {
    const response = await api.get<FinancialSummary>('/statistics/summary');
    return response.data;
  },
};
