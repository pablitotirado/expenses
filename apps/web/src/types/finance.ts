export type {
  Income,
  Expense,
  Category,
  Transaction,
  FinancialSummary,
} from 'expenses-shared';

export interface CategoryWithUI {
  id: string;
  name: string;
  color: string;
  icon: string;
}
