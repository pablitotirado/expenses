/**
 * Expense entity type
 */
export interface Expense {
  id: string;
  amount: number;
  date: Date;
  description: string | null;
  categoryId: string;
}

/**
 * Expense entity type for API responses (with string dates and category info)
 */
export interface ExpenseApi {
  id: string;
  amount: number;
  date: string; // ISO date string
  description: string | null;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
}

/**
 * Alias for backward compatibility
 */
export type ExpenseWithCategory = ExpenseApi;
