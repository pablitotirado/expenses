import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repositories/base.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIncomeDto } from '../dto/create-income.dto';
import { UpdateIncomeDto } from '../dto/update-income.dto';
import { Income } from '@prisma/client';

@Injectable()
export class IncomeRepository extends BaseRepository<Income> {
  constructor(prisma: PrismaService) {
    super(prisma, 'Income');
  }

  async create(data: CreateIncomeDto): Promise<Income> {
    try {
      return await this.prisma.income.create({
        data,
      });
    } catch (error) {
      this.handleError(error, 'creating');
    }
  }

  async findAll(): Promise<Income[]> {
    try {
      return await this.prisma.income.findMany();
    } catch (error) {
      this.handleError(error, 'finding all');
    }
  }

  async findOne(id: string): Promise<Income | null> {
    try {
      return await this.prisma.income.findUnique({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, 'finding');
    }
  }

  async update(id: string, data: UpdateIncomeDto): Promise<Income> {
    try {
      return await this.prisma.income.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.handleError(error, 'updating');
    }
  }

  async delete(id: string): Promise<Income> {
    try {
      return await this.prisma.income.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, 'deleting');
    }
  }

  async findByDateRange(from: Date, to: Date): Promise<Income[]> {
    try {
      return await this.prisma.income.findMany({
        where: {
          date: {
            gte: from,
            lte: to,
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
      return await this.prisma.income.count();
    } catch (error) {
      this.handleError(error, 'counting');
    }
  }
}
