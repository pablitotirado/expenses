import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CategoryWithCount } from '../../common/types/prisma.types';

@Injectable()
export class CategoryRepository extends BaseRepository<CategoryWithCount> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Category');
  }

  async create(data: CreateCategoryDto): Promise<CategoryWithCount> {
    try {
      return await this.prisma.expenseCategory.create({
        data,
        include: {
          _count: {
            select: { expenses: true },
          },
        },
      });
    } catch (error) {
      this.handleError(error, 'creating');
    }
  }

  async findAll(): Promise<CategoryWithCount[]> {
    try {
      return await this.prisma.expenseCategory.findMany({
        include: {
          _count: {
            select: { expenses: true },
          },
        },
      });
    } catch (error) {
      this.handleError(error, 'finding all');
    }
  }

  async findOne(id: string): Promise<CategoryWithCount | null> {
    try {
      return await this.prisma.expenseCategory.findUnique({
        where: { id },
        include: {
          _count: {
            select: { expenses: true },
          },
        },
      });
    } catch (error) {
      this.handleError(error, 'finding');
    }
  }

  async update(
    id: string,
    data: CreateCategoryDto,
  ): Promise<CategoryWithCount> {
    try {
      return await this.prisma.expenseCategory.update({
        where: { id },
        data,
        include: {
          _count: {
            select: { expenses: true },
          },
        },
      });
    } catch (error) {
      this.handleError(error, 'updating');
    }
  }

  async delete(id: string): Promise<CategoryWithCount> {
    try {
      return await this.prisma.expenseCategory.delete({
        where: { id },
        include: {
          _count: {
            select: { expenses: true },
          },
        },
      });
    } catch (error) {
      this.handleError(error, 'deleting');
    }
  }

  async findWithExpenseCount(id: string): Promise<CategoryWithCount | null> {
    try {
      return await this.prisma.expenseCategory.findUnique({
        where: { id },
        include: {
          _count: {
            select: { expenses: true },
          },
        },
      });
    } catch (error) {
      this.handleError(error, 'finding with expense count');
    }
  }
}
