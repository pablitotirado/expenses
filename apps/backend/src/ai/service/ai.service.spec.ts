import { AIService } from './ai.service';
import { IncomeRepository } from '../../incomes/repositories/income.repository';
import { ExpenseRepository } from '../../expenses/repositories/expense.repository';

// Mock OpenAI
const mockOpenAI = {
  responses: {
    create: vi.fn(),
  },
};

vi.mock('openai', () => {
  return {
    default: vi.fn(() => mockOpenAI),
  };
});

describe('AIService', () => {
  let service: AIService;
  let mockIncomeRepository: {
    findByDateRange: ReturnType<typeof vi.fn>;
  };
  let mockExpenseRepository: {
    findByDateRange: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockIncomeRepository = {
      findByDateRange: vi.fn(),
    };

    mockExpenseRepository = {
      findByDateRange: vi.fn(),
    };

    service = new AIService(
      mockIncomeRepository as unknown as IncomeRepository,
      mockExpenseRepository as unknown as ExpenseRepository,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFinancialAnalysis', () => {
    it('should return financial analysis with AI response', async () => {
      // Arrange
      const request = {
        period: 'current_month',
        userGoal: 'Ahorrar para vacaciones',
      };

      const mockIncomes = [
        {
          id: '1',
          amount: 50000,
          description: 'Salario',
          date: new Date('2024-01-15'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockExpenses = [
        {
          id: '1',
          amount: 15000,
          description: 'Supermercado',
          date: new Date('2024-01-15'),
          createdAt: new Date(),
          updatedAt: new Date(),
          category: {
            id: '1',
            name: 'Alimentación',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ];

      const mockAIResponse = {
        output_text: 'Basado en tus datos financieros del mes actual...',
      };

      mockIncomeRepository.findByDateRange.mockResolvedValue(mockIncomes);
      mockExpenseRepository.findByDateRange.mockResolvedValue(mockExpenses);
      mockOpenAI.responses.create.mockResolvedValue(mockAIResponse);

      // Act
      const result = await service.getFinancialAnalysis(request);

      // Assert
      expect(mockIncomeRepository.findByDateRange).toHaveBeenCalled();
      expect(mockExpenseRepository.findByDateRange).toHaveBeenCalled();
      expect(mockOpenAI.responses.create).toHaveBeenCalled();
      expect(result.analysis).toBe(mockAIResponse.output_text);
      expect(result.data.incomes).toHaveLength(1);
      expect(result.data.expenses).toHaveLength(1);
      expect(result.data.user_profile.goals).toContain(
        'Ahorrar para vacaciones',
      );
    });

    it('should return fallback response when OpenAI fails', async () => {
      // Arrange
      const request = {
        period: 'current_month',
        userGoal: 'Test goal',
      };

      const mockIncomes = [
        {
          id: '1',
          amount: 30000,
          description: 'Salario',
          date: new Date('2024-01-15'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockExpenses = [
        {
          id: '1',
          amount: 20000,
          description: 'Gastos',
          date: new Date('2024-01-15'),
          createdAt: new Date(),
          updatedAt: new Date(),
          category: {
            id: '1',
            name: 'Alimentación',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ];

      mockIncomeRepository.findByDateRange.mockResolvedValue(mockIncomes);
      mockExpenseRepository.findByDateRange.mockResolvedValue(mockExpenses);
      mockOpenAI.responses.create.mockRejectedValue(
        new Error('OpenAI API error'),
      );

      // Act
      const result = await service.getFinancialAnalysis(request);

      // Assert
      expect(result.analysis).toContain('📊 **Análisis Financiero');
      expect(result.analysis).toContain('💰 **Resumen:**');
      expect(result.analysis).toContain('• Ingresos totales: $30,000');
      expect(result.analysis).toContain('• Gastos totales: $20,000');
      expect(result.analysis).toContain('• Balance: $10,000');
      expect(result.analysis).toContain('🎯 **Tu meta:** Test goal');
      expect(result.analysis).toContain(
        '*Nota: El servicio de IA no está disponible temporalmente',
      );
    });

    it('should handle different period types correctly', async () => {
      // Arrange
      const periods = ['current_month', 'last_month', 'last_3_months'];

      for (const period of periods) {
        const request = { period };

        mockIncomeRepository.findByDateRange.mockResolvedValue([]);
        mockExpenseRepository.findByDateRange.mockResolvedValue([]);
        mockOpenAI.responses.create.mockResolvedValue({
          output_text: `Analysis for ${period}`,
        });

        // Act
        const result = await service.getFinancialAnalysis(request);

        // Assert
        expect(result.data.period.days).toBeGreaterThan(0);
        expect(result.analysis).toBe(`Analysis for ${period}`);
      }
    });

    it('should transform income data correctly', async () => {
      // Arrange
      const request = { period: 'current_month' };

      const mockIncomes = [
        {
          id: '1',
          amount: 100000,
          description: 'Salario principal',
          date: new Date('2024-01-15'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          amount: 5000,
          description: null,
          date: new Date('2024-01-20'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockIncomeRepository.findByDateRange.mockResolvedValue(mockIncomes);
      mockExpenseRepository.findByDateRange.mockResolvedValue([]);
      mockOpenAI.responses.create.mockResolvedValue({
        output_text: 'Test analysis',
      });

      // Act
      const result = await service.getFinancialAnalysis(request);

      // Assert
      expect(result.data.incomes).toEqual([
        {
          date: '2024-01-15',
          amount: 100000,
          source: 'Salario principal',
        },
        {
          date: '2024-01-20',
          amount: 5000,
          source: 'Sin descripción',
        },
      ]);
    });

    it('should transform expense data correctly', async () => {
      // Arrange
      const request = { period: 'current_month' };

      const mockExpenses = [
        {
          id: '1',
          amount: 25000,
          description: 'Supermercado',
          date: new Date('2024-01-15'),
          createdAt: new Date(),
          updatedAt: new Date(),
          category: {
            id: '1',
            name: 'Alimentación',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        {
          id: '2',
          amount: 15000,
          description: null,
          date: new Date('2024-01-20'),
          createdAt: new Date(),
          updatedAt: new Date(),
          category: {
            id: '2',
            name: 'Alquiler',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ];

      mockIncomeRepository.findByDateRange.mockResolvedValue([]);
      mockExpenseRepository.findByDateRange.mockResolvedValue(mockExpenses);
      mockOpenAI.responses.create.mockResolvedValue({
        output_text: 'Test analysis',
      });

      // Act
      const result = await service.getFinancialAnalysis(request);

      // Assert
      expect(result.data.expenses).toEqual([
        {
          date: '2024-01-15',
          amount: 25000,
          category: 'Alimentación',
          fixed: false,
          notes: 'Supermercado',
        },
        {
          date: '2024-01-20',
          amount: 15000,
          category: 'Alquiler',
          fixed: true,
          notes: undefined,
        },
      ]);
    });

    it('should identify fixed expenses correctly', async () => {
      // Arrange
      const request = { period: 'current_month' };

      const fixedCategories = [
        'Alquiler',
        'Servicios',
        'Streaming',
        'Seguros',
        'Préstamos',
        'Gimnasio',
      ];
      const mockExpenses = fixedCategories.map((category, index) => ({
        id: `${index}`,
        amount: 1000,
        description: 'Test',
        date: new Date('2024-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
        category: {
          id: `${index}`,
          name: category,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }));

      mockIncomeRepository.findByDateRange.mockResolvedValue([]);
      mockExpenseRepository.findByDateRange.mockResolvedValue(mockExpenses);
      mockOpenAI.responses.create.mockResolvedValue({
        output_text: 'Test analysis',
      });

      // Act
      const result = await service.getFinancialAnalysis(request);

      // Assert
      result.data.expenses.forEach((expense) => {
        expect(expense.fixed).toBe(true);
      });
    });
  });
});
