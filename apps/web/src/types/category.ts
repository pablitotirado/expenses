export interface CategoryWithCount {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    expenses: number;
  };
}

export interface CreateCategoryDto {
  name: string;
}

export interface CategoryApiResponse {
  data: CategoryWithCount;
  message?: string;
}
