import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';
import type { CreateCategoryDto } from '../types/category';

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: string) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: categoryService.findAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.findOne(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};

// Hook para actualizar una categoría
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCategoryDto }) =>
      categoryService.update(id, data),
    onSuccess: updatedCategory => {
      // Actualizar la cache con la categoría actualizada
      queryClient.setQueryData(
        categoryKeys.detail(updatedCategory.id),
        updatedCategory
      );
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.remove(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: categoryKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};
