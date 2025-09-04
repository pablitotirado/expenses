import { useQuery } from '@tanstack/react-query';
import { statisticsService } from '../services/statisticsService';

export const statisticsKeys = {
  all: ['statistics'] as const,
  summary: () => [...statisticsKeys.all, 'summary'] as const,
};

export const useFinancialSummary = () => {
  return useQuery({
    queryKey: statisticsKeys.summary(),
    queryFn: statisticsService.getSummary,
    staleTime: 1 * 60 * 1000, // 1 minuto
    refetchInterval: 30 * 1000, // Refetch cada 30 segundos
  });
};
