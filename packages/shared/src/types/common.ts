/**
 * Common utility types
 */

/**
 * Make all properties optional
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Make all properties required
 */
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Pick specific properties from a type
 */
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
 * Omit specific properties from a type
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Financial summary type for dashboard/statistics
 */
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  expensesByCategory: Record<string, number>;
}

/**
 * Transaction type (unified income/expense)
 */
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category?: string;
  date: Date;
}
