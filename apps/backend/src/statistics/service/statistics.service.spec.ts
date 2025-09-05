import { StatisticsService } from './statistics.service';
import { StatisticsRepository } from '../repositories/statistics.repository';

describe('StatisticsService', () => {
  let service: StatisticsService;
  let mockStatisticsRepository: {
    getSummary: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockStatisticsRepository = {
      getSummary: vi.fn(),
    };

    service = new StatisticsService(
      mockStatisticsRepository as unknown as StatisticsRepository,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSummary', () => {
    it('should return summary statistics successfully', async () => {
      // Arrange
      const expectedSummary = {
        totalIncome: 10000,
        totalExpenses: 7500,
        netIncome: 2500,
        expenseCategories: [
          { name: 'Food', amount: 2000, percentage: 26.67 },
          { name: 'Transport', amount: 1500, percentage: 20.0 },
          { name: 'Entertainment', amount: 1000, percentage: 13.33 },
          { name: 'Other', amount: 3000, percentage: 40.0 },
        ],
        monthlyTrends: [
          { month: '2024-01', income: 5000, expenses: 3750 },
          { month: '2024-02', income: 5000, expenses: 3750 },
        ],
        topExpenses: [
          { description: 'Grocery shopping', amount: 500, date: '2024-01-15' },
          { description: 'Gas bill', amount: 300, date: '2024-01-14' },
        ],
      };

      mockStatisticsRepository.getSummary.mockResolvedValue(expectedSummary);

      // Act
      const result = await service.getSummary();

      // Assert
      expect(mockStatisticsRepository.getSummary).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedSummary);
    });

    it('should return empty summary when no data is available', async () => {
      // Arrange
      const expectedSummary = {
        totalIncome: 0,
        totalExpenses: 0,
        netIncome: 0,
        expenseCategories: [],
        monthlyTrends: [],
        topExpenses: [],
      };

      mockStatisticsRepository.getSummary.mockResolvedValue(expectedSummary);

      // Act
      const result = await service.getSummary();

      // Assert
      expect(mockStatisticsRepository.getSummary).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedSummary);
    });

    it('should handle repository errors when getting summary', async () => {
      // Arrange
      const error = new Error('Repository error');
      mockStatisticsRepository.getSummary.mockRejectedValue(error);

      // Act & Assert
      await expect(service.getSummary()).rejects.toThrow('Repository error');
    });

    it('should return summary with only income data', async () => {
      // Arrange
      const expectedSummary = {
        totalIncome: 5000,
        totalExpenses: 0,
        netIncome: 5000,
        expenseCategories: [],
        monthlyTrends: [{ month: '2024-01', income: 5000, expenses: 0 }],
        topExpenses: [],
      };

      mockStatisticsRepository.getSummary.mockResolvedValue(expectedSummary);

      // Act
      const result = await service.getSummary();

      // Assert
      expect(mockStatisticsRepository.getSummary).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedSummary);
    });

    it('should return summary with only expenses data', async () => {
      // Arrange
      const expectedSummary = {
        totalIncome: 0,
        totalExpenses: 2000,
        netIncome: -2000,
        expenseCategories: [
          { name: 'Food', amount: 1000, percentage: 50.0 },
          { name: 'Transport', amount: 1000, percentage: 50.0 },
        ],
        monthlyTrends: [{ month: '2024-01', income: 0, expenses: 2000 }],
        topExpenses: [
          { description: 'Grocery shopping', amount: 500, date: '2024-01-15' },
        ],
      };

      mockStatisticsRepository.getSummary.mockResolvedValue(expectedSummary);

      // Act
      const result = await service.getSummary();

      // Assert
      expect(mockStatisticsRepository.getSummary).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedSummary);
    });

    it('should return summary with complex data structure', async () => {
      // Arrange
      const expectedSummary = {
        totalIncome: 15000,
        totalExpenses: 12000,
        netIncome: 3000,
        expenseCategories: [
          { name: 'Food', amount: 4000, percentage: 33.33 },
          { name: 'Transport', amount: 2000, percentage: 16.67 },
          { name: 'Entertainment', amount: 1500, percentage: 12.5 },
          { name: 'Healthcare', amount: 1000, percentage: 8.33 },
          { name: 'Other', amount: 3500, percentage: 29.17 },
        ],
        monthlyTrends: [
          { month: '2024-01', income: 5000, expenses: 4000 },
          { month: '2024-02', income: 5000, expenses: 4000 },
          { month: '2024-03', income: 5000, expenses: 4000 },
        ],
        topExpenses: [
          { description: 'Rent payment', amount: 2000, date: '2024-01-01' },
          { description: 'Grocery shopping', amount: 500, date: '2024-01-15' },
          { description: 'Gas bill', amount: 300, date: '2024-01-14' },
          { description: 'Movie tickets', amount: 150, date: '2024-01-20' },
          { description: 'Coffee', amount: 50, date: '2024-01-25' },
        ],
      };

      mockStatisticsRepository.getSummary.mockResolvedValue(expectedSummary);

      // Act
      const result = await service.getSummary();

      // Assert
      expect(mockStatisticsRepository.getSummary).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedSummary);
    });

    it('should handle null or undefined data from repository', async () => {
      // Arrange
      mockStatisticsRepository.getSummary.mockResolvedValue(null);

      // Act
      const result = await service.getSummary();

      // Assert
      expect(mockStatisticsRepository.getSummary).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should handle empty object from repository', async () => {
      // Arrange
      const expectedSummary = {};
      mockStatisticsRepository.getSummary.mockResolvedValue(expectedSummary);

      // Act
      const result = await service.getSummary();

      // Assert
      expect(mockStatisticsRepository.getSummary).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedSummary);
    });
  });
});
