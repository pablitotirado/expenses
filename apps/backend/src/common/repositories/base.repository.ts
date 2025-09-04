import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface BaseRepositoryError {
  code: string;
  message: string;
}

@Injectable()
export abstract class BaseRepository<TEntity> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
  ) {}

  protected handleError(error: unknown, action: string): never {
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as BaseRepositoryError;

      if (prismaError.code === 'P2002') {
        throw new Error(`${this.modelName} already exists`);
      }

      if (prismaError.code === 'P2025') {
        throw new Error(`${this.modelName} not found`);
      }
    }

    throw new Error(
      `Error ${action} ${this.modelName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
