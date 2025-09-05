import {
  AIResponseDto,
  FinancialDataDto,
  PeriodDto,
  IncomeDto,
  ExpenseDto,
  UserProfileDto,
} from './ai-response.dto';

describe('AIResponseDto', () => {
  it('should be defined', () => {
    expect(AIResponseDto).toBeDefined();
  });

  describe('AIResponseDto', () => {
    it('should create instance with valid data', () => {
      // Arrange
      const financialData: FinancialDataDto = {
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
      };

      const response: AIResponseDto = {
        analysis: 'Test analysis',
        data: financialData,
      };

      // Act & Assert
      expect(response.analysis).toBe('Test analysis');
      expect(response.data).toEqual(financialData);
    });
  });

  describe('PeriodDto', () => {
    it('should create instance with valid data', () => {
      // Arrange
      const period: PeriodDto = {
        from: '2024-01-01T00:00:00.000Z',
        to: '2024-01-31T23:59:59.999Z',
        days: 31,
      };

      // Act & Assert
      expect(period.from).toBe('2024-01-01T00:00:00.000Z');
      expect(period.to).toBe('2024-01-31T23:59:59.999Z');
      expect(period.days).toBe(31);
    });
  });

  describe('IncomeDto', () => {
    it('should create instance with valid data', () => {
      // Arrange
      const income: IncomeDto = {
        date: '2024-01-15',
        amount: 50000,
        source: 'Salario',
      };

      // Act & Assert
      expect(income.date).toBe('2024-01-15');
      expect(income.amount).toBe(50000);
      expect(income.source).toBe('Salario');
    });
  });

  describe('ExpenseDto', () => {
    it('should create instance with valid data', () => {
      // Arrange
      const expense: ExpenseDto = {
        date: '2024-01-15',
        amount: 15000,
        category: 'Alimentación',
        fixed: false,
        notes: 'Supermercado',
      };

      // Act & Assert
      expect(expense.date).toBe('2024-01-15');
      expect(expense.amount).toBe(15000);
      expect(expense.category).toBe('Alimentación');
      expect(expense.fixed).toBe(false);
      expect(expense.notes).toBe('Supermercado');
    });

    it('should create instance without optional notes', () => {
      // Arrange
      const expense: ExpenseDto = {
        date: '2024-01-15',
        amount: 15000,
        category: 'Alimentación',
        fixed: true,
      };

      // Act & Assert
      expect(expense.notes).toBeUndefined();
    });
  });

  describe('UserProfileDto', () => {
    it('should create instance with valid data', () => {
      // Arrange
      const profile: UserProfileDto = {
        household_size: 2,
        dependents: 1,
        has_debt: true,
        goals: ['Ahorrar para vacaciones', 'Comprar casa'],
      };

      // Act & Assert
      expect(profile.household_size).toBe(2);
      expect(profile.dependents).toBe(1);
      expect(profile.has_debt).toBe(true);
      expect(profile.goals).toEqual([
        'Ahorrar para vacaciones',
        'Comprar casa',
      ]);
    });

    it('should create instance with empty goals array', () => {
      // Arrange
      const profile: UserProfileDto = {
        household_size: 1,
        dependents: 0,
        has_debt: false,
        goals: [],
      };

      // Act & Assert
      expect(profile.goals).toEqual([]);
    });
  });

  describe('FinancialDataDto', () => {
    it('should create instance with complete data', () => {
      // Arrange
      const period: PeriodDto = {
        from: '2024-01-01T00:00:00.000Z',
        to: '2024-01-31T23:59:59.999Z',
        days: 31,
      };

      const incomes: IncomeDto[] = [
        {
          date: '2024-01-15',
          amount: 50000,
          source: 'Salario',
        },
      ];

      const expenses: ExpenseDto[] = [
        {
          date: '2024-01-15',
          amount: 15000,
          category: 'Alimentación',
          fixed: false,
          notes: 'Supermercado',
        },
      ];

      const userProfile: UserProfileDto = {
        household_size: 1,
        dependents: 0,
        has_debt: false,
        goals: ['Ahorrar para vacaciones'],
      };

      const financialData: FinancialDataDto = {
        period,
        currency: 'ARS',
        incomes,
        expenses,
        user_profile: userProfile,
      };

      // Act & Assert
      expect(financialData.period).toEqual(period);
      expect(financialData.currency).toBe('ARS');
      expect(financialData.incomes).toEqual(incomes);
      expect(financialData.expenses).toEqual(expenses);
      expect(financialData.user_profile).toEqual(userProfile);
    });
  });
});
