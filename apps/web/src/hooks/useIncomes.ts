import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { incomeService } from '../services/incomeService';
import { statisticsKeys } from './useStatistics';
import type { CreateIncomeDto, UpdateIncomeDto } from '../types/income';

export const incomeKeys = {
  all: ['incomes'] as const,
  lists: () => [...incomeKeys.all, 'list'] as const,
  list: (filters: string) => [...incomeKeys.lists(), { filters }] as const,
  details: () => [...incomeKeys.all, 'detail'] as const,
  detail: (id: string) => [...incomeKeys.details(), id] as const,
};

export const useIncomes = () => {
  return useQuery({
    queryKey: incomeKeys.lists(),
    queryFn: incomeService.findAll,
    staleTime: 2 * 60 * 1000,
  });
};

export const useIncome = (id: string) => {
  return useQuery({
    queryKey: incomeKeys.detail(id),
    queryFn: () => incomeService.findOne(id),
    enabled: !!id,
  });
};

export const useCreateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIncomeDto) => incomeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statisticsKeys.summary() });
    },
  });
};

export const useUpdateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIncomeDto }) =>
      incomeService.update(id, data),
    onSuccess: updatedIncome => {
      queryClient.setQueryData(
        incomeKeys.detail(updatedIncome.id),
        updatedIncome
      );
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statisticsKeys.summary() });
    },
  });
};

export const useDeleteIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => incomeService.remove(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: incomeKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: incomeKeys.lists() });
    },
  });
};
