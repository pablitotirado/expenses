import { ExpenseApi } from '../entities/expense';
import { ApiResponse } from './response';

/**
 * API response for a single expense
 */
export interface ExpenseApiResponse extends ApiResponse<ExpenseApi> {}

/**
 * API response for multiple expenses
 */
export interface ExpensesApiResponse extends ApiResponse<ExpenseApi[]> {}
