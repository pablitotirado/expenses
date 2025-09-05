import { StatisticsController } from './statistics.controller';
import { StatisticsService } from '../service/statistics.service';

describe('StatisticsController', () => {
  let controller: StatisticsController;
  let mockStatisticsService: {
    getSummary: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockStatisticsService = {
      getSummary: vi.fn(),
    };

    controller = new StatisticsController(
      mockStatisticsService as unknown as StatisticsService,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getSummary', () => {
    it('should return summary statistics when data is available', async () => {
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

      mockStatisticsService.getSummary.mockResolvedValue(expectedSummary);

      // Act
      const result = await controller.getSummary();

      // Assert
      expect(mockStatisticsService.getSummary).toHaveBeenCalledTimes(1);
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

      mockStatisticsService.getSummary.mockResolvedValue(expectedSummary);

      // Act
      const result = await controller.getSummary();

      // Assert
      expect(mockStatisticsService.getSummary).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedSummary);
    });

    it('should handle service errors when getting summary', async () => {
      // Arrange
      const error = new Error('Service error');
      mockStatisticsService.getSummary.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getSummary()).rejects.toThrow('Service error');
      expect(mockStatisticsService.getSummary).toHaveBeenCalledTimes(1);
    });

    it('should return summary with partial data', async () => {
      // Arrange
      const expectedSummary = {
        totalIncome: 5000,
        totalExpenses: 0,
        netIncome: 5000,
        expenseCategories: [],
        monthlyTrends: [{ month: '2024-01', income: 5000, expenses: 0 }],
        topExpenses: [],
      };

      mockStatisticsService.getSummary.mockResolvedValue(expectedSummary);

      // Act
      const result = await controller.getSummary();

      // Assert
      expect(mockStatisticsService.getSummary).toHaveBeenCalledTimes(1);
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

      mockStatisticsService.getSummary.mockResolvedValue(expectedSummary);

      // Act
      const result = await controller.getSummary();

      // Assert
      expect(mockStatisticsService.getSummary).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedSummary);
    });
  });
});
