import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryWithCount } from '../common/types/prisma.types';

@Injectable()
export class CategoriesService {
  constructor(private readonly _categoryRepository: CategoryRepository) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryWithCount> {
    try {
      return await this._categoryRepository.create(createCategoryDto);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Unique constraint')
      ) {
        throw new ConflictException('Category name already exists');
      }
      throw error;
    }
  }

  findAll(): Promise<CategoryWithCount[]> {
    return this._categoryRepository.findAll();
  }

  findOne(id: string): Promise<CategoryWithCount | null> {
    return this._categoryRepository.findOne(id);
  }

  async update(
    id: string,
    updateCategoryDto: CreateCategoryDto,
  ): Promise<CategoryWithCount> {
    try {
      return await this._categoryRepository.update(id, updateCategoryDto);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Unique constraint')
      ) {
        throw new ConflictException('Category name already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<CategoryWithCount> {
    try {
      const category = await this._categoryRepository.findWithExpenseCount(id);

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      if (category._count && category._count.expenses > 0) {
        throw new ConflictException(
          'Cannot delete category with associated expenses',
        );
      }

      return await this._categoryRepository.delete(id);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('Foreign key constraint')
      ) {
        throw new ConflictException(
          'Cannot delete category with associated expenses',
        );
      }
      throw error;
    }
  }
}
