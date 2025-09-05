import { BadRequestException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from '../dto/create-expense.dto';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let mockExpenseRepository: any;
  let mockStatisticsService: any;

  beforeEach(() => {
    mockExpenseRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockStatisticsService = {
      getSummary: vi.fn(),
    };

    // Clear all mocks
    vi.clearAllMocks();

    // Create service instance with mocked dependencies
    service = new ExpensesService(mockExpenseRepository, mockStatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create expense when balance is sufficient', async () => {
      // Arrange
      const createExpenseDto: CreateExpenseDto = {
        amount: 100,
        description: 'Test expense',
        categoryId: 'test-category-id',
      };

      const mockSummary = {
        totalIncome: 1000,
        totalExpenses: 200,
        currentBalance: 800,
      };

      const mockExpense = {
        id: 'expense-id',
        amount: 100,
        description: 'Test expense',
        categoryId: 'test-category-id',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 'test-category-id',
          name: 'Test Category',
        },
      };

      mockStatisticsService.getSummary.mockResolvedValue(mockSummary);
      mockExpenseRepository.create.mockResolvedValue(mockExpense as any);

      // Act
      const result = await service.create(createExpenseDto);

      // Assert
      expect(mockStatisticsService.getSummary).toHaveBeenCalled();
      expect(mockExpenseRepository.create).toHaveBeenCalledWith(
        createExpenseDto,
      );
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException when balance is insufficient', async () => {
      // Arrange
      const createExpenseDto: CreateExpenseDto = {
        amount: 1000,
        description: 'Expensive expense',
        categoryId: 'test-category-id',
      };

      const mockSummary = {
        totalIncome: 500,
        totalExpenses: 200,
        currentBalance: 300, // Less than requested amount
      };

      mockStatisticsService.getSummary.mockResolvedValue(mockSummary);

      // Act & Assert
      await expect(service.create(createExpenseDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createExpenseDto)).rejects.toThrow(
        'Balance insuficiente. Disponible: $300.00, solicitado: $1000.00',
      );
      expect(mockExpenseRepository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when balance is exactly zero', async () => {
      // Arrange
      const createExpenseDto: CreateExpenseDto = {
        amount: 100,
        description: 'Test expense',
        categoryId: 'test-category-id',
      };

      const mockSummary = {
        totalIncome: 0,
        totalExpenses: 0,
        currentBalance: 0,
      };

      mockStatisticsService.getSummary.mockResolvedValue(mockSummary);

      // Act & Assert
      await expect(service.create(createExpenseDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createExpenseDto)).rejects.toThrow(
        'Balance insuficiente. Disponible: $0.00, solicitado: $100.00',
      );
      expect(mockExpenseRepository.create).not.toHaveBeenCalled();
    });

    it('should allow expense when amount equals available balance', async () => {
      // Arrange
      const createExpenseDto: CreateExpenseDto = {
        amount: 300,
        description: 'Exact balance expense',
        categoryId: 'test-category-id',
      };

      const mockSummary = {
        totalIncome: 500,
        totalExpenses: 200,
        currentBalance: 300, // Exactly equal to requested amount
      };

      const mockExpense = {
        id: 'expense-id',
        amount: 300,
        description: 'Exact balance expense',
        categoryId: 'test-category-id',
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: 'test-category-id',
          name: 'Test Category',
        },
      };

      mockStatisticsService.getSummary.mockResolvedValue(mockSummary);
      mockExpenseRepository.create.mockResolvedValue(mockExpense as any);

      // Act
      const result = await service.create(createExpenseDto);

      // Assert
      expect(mockStatisticsService.getSummary).toHaveBeenCalled();
      expect(mockExpenseRepository.create).toHaveBeenCalledWith(
        createExpenseDto,
      );
      expect(result).toBeDefined();
    });
  });
});
