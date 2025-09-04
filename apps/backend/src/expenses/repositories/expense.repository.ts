import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { Expense } from '@prisma/client';

type ExpenseWithCategoryPrisma = Expense & {
  category: { id: string; name: string };
};

@Injectable()
export class ExpenseRepository extends BaseRepository<ExpenseWithCategoryPrisma> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Expense');
  }

  async create(data: CreateExpenseDto): Promise<ExpenseWithCategoryPrisma> {
    try {
      return await this.prisma.expense.create({
        data,
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      });
    } catch (error) {
      this.handleError(error, 'creating');
    }
  }

  async findAll(): Promise<ExpenseWithCategoryPrisma[]> {
    try {
      return await this.prisma.expense.findMany({
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      });
    } catch (error) {
      this.handleError(error, 'finding all');
    }
  }

  async findOne(id: string): Promise<ExpenseWithCategoryPrisma | null> {
    try {
      return await this.prisma.expense.findUnique({
        where: { id },
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      });
    } catch (error) {
      this.handleError(error, 'finding');
    }
  }

  async update(
    id: string,
    data: UpdateExpenseDto,
  ): Promise<ExpenseWithCategoryPrisma> {
    try {
      return await this.prisma.expense.update({
        where: { id },
        data,
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      });
    } catch (error) {
      this.handleError(error, 'updating');
    }
  }

  async delete(id: string): Promise<ExpenseWithCategoryPrisma> {
    try {
      return await this.prisma.expense.delete({
        where: { id },
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      });
    } catch (error) {
      this.handleError(error, 'deleting');
    }
  }

  async findByDateRange(
    from: Date,
    to: Date,
  ): Promise<ExpenseWithCategoryPrisma[]> {
    try {
      return await this.prisma.expense.findMany({
        where: {
          date: {
            gte: from,
            lte: to,
          },
        },
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
        orderBy: {
          date: 'asc',
        },
      });
    } catch (error) {
      this.handleError(error, 'finding by date range');
    }
  }

  async count(): Promise<number> {
    try {
      return await this.prisma.expense.count();
    } catch (error) {
      this.handleError(error, 'counting');
    }
  }
}
