import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '../services/expenseService';
import { statisticsKeys } from './useStatistics';
import { isNotFoundError } from '../types/api';
import type { CreateExpenseDto, UpdateExpenseDto } from '../types/expense';

export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (filters: string) => [...expenseKeys.lists(), { filters }] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
};

export const useExpenses = () => {
  return useQuery({
    queryKey: expenseKeys.lists(),
    queryFn: expenseService.findAll,
    staleTime: 2 * 60 * 1000,
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: expenseKeys.detail(id),
    queryFn: () => expenseService.findOne(id),
    enabled: !!id,
    retry: (failureCount, error) => {
      // No reintentar si es un error 404 (recurso no encontrado)
      if (isNotFoundError(error)) {
        return false;
      }
      // Reintentar hasta 3 veces para otros errores
      return failureCount < 3;
    },
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseDto) => expenseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statisticsKeys.summary() });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseDto }) =>
      expenseService.update(id, data),
    onSuccess: updatedExpense => {
      queryClient.setQueryData(
        expenseKeys.detail(updatedExpense.id),
        updatedExpense
      );
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statisticsKeys.summary() });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseService.remove(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: expenseKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: statisticsKeys.summary() });
    },
  });
};
