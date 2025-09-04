import api from '../lib/axios';
import type { CategoryWithCount, CreateCategoryDto } from '../types/category';

export const categoryService = {
  create: async (data: CreateCategoryDto): Promise<CategoryWithCount> => {
    const response = await api.post<CategoryWithCount>('/categories', data);
    return response.data;
  },

  findAll: async (): Promise<CategoryWithCount[]> => {
    const response = await api.get<CategoryWithCount[]>('/categories');
    return response.data;
  },

  findOne: async (id: string): Promise<CategoryWithCount> => {
    const response = await api.get<CategoryWithCount>(`/categories/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: CreateCategoryDto
  ): Promise<CategoryWithCount> => {
    const response = await api.patch<CategoryWithCount>(
      `/categories/${id}`,
      data
    );
    return response.data;
  },

  remove: async (id: string): Promise<CategoryWithCount> => {
    const response = await api.delete<CategoryWithCount>(`/categories/${id}`);
    return response.data;
  },
};
