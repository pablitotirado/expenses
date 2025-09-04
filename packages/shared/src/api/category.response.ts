import { Category, CategoryWithCount } from '../entities/category';
import { ApiResponse } from './response';

/**
 * API response for a single category
 */
export interface CategoryApiResponse extends ApiResponse<Category> {}

/**
 * API response for multiple categories
 */
export interface CategoriesApiResponse extends ApiResponse<Category[]> {}

/**
 * API response for a category with expense count
 */
export interface CategoryWithCountApiResponse
  extends ApiResponse<CategoryWithCount> {}
