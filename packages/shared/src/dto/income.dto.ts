/**
 * DTO for creating a new income
 */
export interface CreateIncomeDto {
  amount: number;
  description?: string | null;
}

/**
 * DTO for updating an existing income
 */
export interface UpdateIncomeDto {
  amount?: number;
  description?: string | null;
}
