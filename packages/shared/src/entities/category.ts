/**
 * Expense category entity type
 */
export interface Category {
  id: string;
  name: string;
}

/**
 * Category with expense count (for statistics)
 */
export interface CategoryWithCount extends Category {
  _count: {
    expenses: number;
  };
}
