export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string | null;
  date: string; // ISO date string from backend
  category?: {
    id: string;
    name: string;
  };
}

export interface TransactionFilters {
  type?: 'all' | 'income' | 'expense';
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
}
