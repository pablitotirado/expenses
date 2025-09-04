/**
 * DTO for creating a new category
 */
export interface CreateCategoryDto {
  name: string;
}

/**
 * DTO for updating an existing category
 */
export interface UpdateCategoryDto {
  name?: string;
}
