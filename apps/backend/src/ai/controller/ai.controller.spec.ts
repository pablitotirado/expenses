import { AIController } from './ai.controller';
import { AIService } from '../service/ai.service';
import { AIRequestDto, AIResponseDto } from '../dto';

describe('AIController', () => {
  let controller: AIController;
  let mockAIService: {
    getFinancialAnalysis: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockAIService = {
      getFinancialAnalysis: vi.fn(),
    };

    controller = new AIController(mockAIService as unknown as AIService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFinancialAnalysis', () => {
    it('should return financial analysis when valid request is provided', async () => {
      // Arrange
      const request: AIRequestDto = {
        period: 'current_month',
        userGoal: 'Ahorrar para vacaciones',
      };

      const expectedResponse: AIResponseDto = {
        analysis: 'Basado en tus datos financieros del mes actual...',
        data: {
          period: {
            from: '2024-01-01T00:00:00.000Z',
            to: '2024-01-31T23:59:59.999Z',
            days: 31,
          },
          currency: 'ARS',
          incomes: [
            {
              date: '2024-01-15',
              amount: 50000,
              source: 'Salario',
            },
          ],
          expenses: [
            {
              date: '2024-01-15',
              amount: 15000,
              category: 'Alimentación',
              fixed: false,
              notes: 'Supermercado',
            },
          ],
          user_profile: {
            household_size: 1,
            dependents: 0,
            has_debt: false,
            goals: ['Ahorrar para vacaciones'],
          },
        },
      };

      mockAIService.getFinancialAnalysis.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.getFinancialAnalysis(request);

      // Assert
      expect(mockAIService.getFinancialAnalysis).toHaveBeenCalledWith(request);
      expect(mockAIService.getFinancialAnalysis).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });

    it('should return financial analysis when request has no userGoal', async () => {
      // Arrange
      const request: AIRequestDto = {
        period: 'last_month',
      };

      const expectedResponse: AIResponseDto = {
        analysis: 'Análisis del mes pasado...',
        data: {
          period: {
            from: '2023-12-01T00:00:00.000Z',
            to: '2023-12-31T23:59:59.999Z',
            days: 31,
          },
          currency: 'ARS',
          incomes: [],
          expenses: [],
          user_profile: {
            household_size: 1,
            dependents: 0,
            has_debt: false,
            goals: [],
          },
        },
      };

      mockAIService.getFinancialAnalysis.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.getFinancialAnalysis(request);

      // Assert
      expect(mockAIService.getFinancialAnalysis).toHaveBeenCalledWith(request);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle service errors gracefully', async () => {
      // Arrange
      const request: AIRequestDto = {
        period: 'current_month',
        userGoal: 'Test goal',
      };

      const error = new Error('Service error');
      mockAIService.getFinancialAnalysis.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getFinancialAnalysis(request)).rejects.toThrow(
        'Service error',
      );
      expect(mockAIService.getFinancialAnalysis).toHaveBeenCalledWith(request);
    });

    it('should handle different period types', async () => {
      // Arrange
      const periods = ['current_month', 'last_month', 'last_3_months'];

      for (const period of periods) {
        const request: AIRequestDto = { period };
        const expectedResponse: AIResponseDto = {
          analysis: `Analysis for ${period}`,
          data: {
            period: {
              from: '2024-01-01T00:00:00.000Z',
              to: '2024-01-31T23:59:59.999Z',
              days: 31,
            },
            currency: 'ARS',
            incomes: [],
            expenses: [],
            user_profile: {
              household_size: 1,
              dependents: 0,
              has_debt: false,
              goals: [],
            },
          },
        };

        mockAIService.getFinancialAnalysis.mockResolvedValue(expectedResponse);

        // Act
        const result = await controller.getFinancialAnalysis(request);

        // Assert
        expect(mockAIService.getFinancialAnalysis).toHaveBeenCalledWith(
          request,
        );
        expect(result).toEqual(expectedResponse);
      }
    });
  });
});
