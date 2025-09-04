/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
