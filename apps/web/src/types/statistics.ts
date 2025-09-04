export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
}

export interface StatisticsApiResponse {
  data: FinancialSummary;
  message?: string;
}
