import { IncomeApi } from '../entities/income';
import { ApiResponse } from './response';

/**
 * API response for a single income
 */
export interface IncomeApiResponse extends ApiResponse<IncomeApi> {}

/**
 * API response for multiple incomes
 */
export interface IncomesApiResponse extends ApiResponse<IncomeApi[]> {}
