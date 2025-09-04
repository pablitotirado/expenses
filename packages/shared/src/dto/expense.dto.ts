/**
 * DTO for creating a new expense
 */
export interface CreateExpenseDto {
  amount: number;
  description?: string | null;
  categoryId: string;
}

/**
 * DTO for updating an existing expense
 */
export interface UpdateExpenseDto {
  amount?: number;
  description?: string | null;
  categoryId?: string;
}
