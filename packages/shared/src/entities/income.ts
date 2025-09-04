/**
 * Income entity type
 */
export interface Income {
  id: string;
  amount: number;
  date: Date;
  description: string | null;
}

/**
 * Income entity type for API responses (with string dates)
 */
export interface IncomeApi {
  id: string;
  amount: number;
  date: string; // ISO date string
  description: string | null;
}
