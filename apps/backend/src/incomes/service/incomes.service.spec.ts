import { IncomesService } from './incomes.service';
import { IncomeRepository } from '../repositories/income.repository';
import { CreateIncomeDto, UpdateIncomeDto } from '../dto';

// Mock the date converter utility
vi.mock('../common/utils/date-converter', () => ({
  convertIncomeToApi: vi.fn((income) => ({
    id: income.id,
    amount: income.amount,
    description: income.description,
    date: '2024-01-15',
  })),
}));

describe('IncomesService', () => {
  let service: IncomesService;
  let mockIncomeRepository: {
    create: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockIncomeRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    service = new IncomesService(
      mockIncomeRepository as unknown as IncomeRepository,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an income successfully', async () => {
      // Arrange
      const createIncomeDto: CreateIncomeDto = {
        amount: 5000,
        description: 'Salary',
      };

      const mockIncome = {
        id: 'income-123',
        amount: 5000,
        description: 'Salary',
        date: new Date('2024-01-15'),
      };

      const expectedApiIncome = {
        id: 'income-123',
        amount: 5000,
        description: 'Salary',
        date: '2024-01-15',
      };

      mockIncomeRepository.create.mockResolvedValue(mockIncome);

      // Act
      const result = await service.create(createIncomeDto);

      // Assert
      expect(mockIncomeRepository.create).toHaveBeenCalledWith(createIncomeDto);
      expect(result).toEqual(expectedApiIncome);
    });

    it('should create an income without description', async () => {
      // Arrange
      const createIncomeDto: CreateIncomeDto = {
        amount: 3000,
      };

      const mockIncome = {
        id: 'income-456',
        amount: 3000,
        description: null,
        date: new Date('2024-01-15'),
      };

      const expectedApiIncome = {
        id: 'income-456',
        amount: 3000,
        description: null,
        date: '2024-01-15',
      };

      mockIncomeRepository.create.mockResolvedValue(mockIncome);

      // Act
      const result = await service.create(createIncomeDto);

      // Assert
      expect(mockIncomeRepository.create).toHaveBeenCalledWith(createIncomeDto);
      expect(result).toEqual(expectedApiIncome);
    });

    it('should handle repository errors when creating income', async () => {
      // Arrange
      const createIncomeDto: CreateIncomeDto = {
        amount: 5000,
        description: 'Salary',
      };

      const error = new Error('Repository error');
      mockIncomeRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(service.create(createIncomeDto)).rejects.toThrow(
        'Repository error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all incomes', async () => {
      // Arrange
      const mockIncomes = [
        {
          id: 'income-1',
          amount: 5000,
          description: 'Salary',
          date: new Date('2024-01-15'),
        },
        {
          id: 'income-2',
          amount: 1000,
          description: 'Freelance',
          date: new Date('2024-01-16'),
        },
      ];

      const expectedApiIncomes = [
        {
          id: 'income-1',
          amount: 5000,
          description: 'Salary',
          date: '2024-01-15',
        },
        {
          id: 'income-2',
          amount: 1000,
          description: 'Freelance',
          date: '2024-01-15',
        },
      ];

      mockIncomeRepository.findAll.mockResolvedValue(mockIncomes);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockIncomeRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedApiIncomes);
    });

    it('should return empty array when no incomes exist', async () => {
      // Arrange
      mockIncomeRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockIncomeRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an income when found', async () => {
      // Arrange
      const incomeId = 'income-123';
      const mockIncome = {
        id: 'income-123',
        amount: 5000,
        description: 'Salary',
        date: new Date('2024-01-15'),
      };

      const expectedApiIncome = {
        id: 'income-123',
        amount: 5000,
        description: 'Salary',
        date: '2024-01-15',
      };

      mockIncomeRepository.findOne.mockResolvedValue(mockIncome);

      // Act
      const result = await service.findOne(incomeId);

      // Assert
      expect(mockIncomeRepository.findOne).toHaveBeenCalledWith(incomeId);
      expect(result).toEqual(expectedApiIncome);
    });

    it('should return null when income not found', async () => {
      // Arrange
      const incomeId = 'income-999';
      mockIncomeRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findOne(incomeId);

      // Assert
      expect(mockIncomeRepository.findOne).toHaveBeenCalledWith(incomeId);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an income successfully', async () => {
      // Arrange
      const incomeId = 'income-123';
      const updateIncomeDto: UpdateIncomeDto = {
        amount: 6000,
        description: 'Updated salary',
      };

      const mockIncome = {
        id: 'income-123',
        amount: 6000,
        description: 'Updated salary',
        date: new Date('2024-01-15'),
      };

      const expectedApiIncome = {
        id: 'income-123',
        amount: 6000,
        description: 'Updated salary',
        date: '2024-01-15',
      };

      mockIncomeRepository.update.mockResolvedValue(mockIncome);

      // Act
      const result = await service.update(incomeId, updateIncomeDto);

      // Assert
      expect(mockIncomeRepository.update).toHaveBeenCalledWith(
        incomeId,
        updateIncomeDto,
      );
      expect(result).toEqual(expectedApiIncome);
    });

    it('should update an income with partial data', async () => {
      // Arrange
      const incomeId = 'income-123';
      const updateIncomeDto: UpdateIncomeDto = {
        amount: 7000,
      };

      const mockIncome = {
        id: 'income-123',
        amount: 7000,
        description: 'Original description',
        date: new Date('2024-01-15'),
      };

      const expectedApiIncome = {
        id: 'income-123',
        amount: 7000,
        description: 'Original description',
        date: '2024-01-15',
      };

      mockIncomeRepository.update.mockResolvedValue(mockIncome);

      // Act
      const result = await service.update(incomeId, updateIncomeDto);

      // Assert
      expect(mockIncomeRepository.update).toHaveBeenCalledWith(
        incomeId,
        updateIncomeDto,
      );
      expect(result).toEqual(expectedApiIncome);
    });

    it('should handle repository errors when updating income', async () => {
      // Arrange
      const incomeId = 'income-123';
      const updateIncomeDto: UpdateIncomeDto = {
        amount: 6000,
      };

      const error = new Error('Repository error');
      mockIncomeRepository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(service.update(incomeId, updateIncomeDto)).rejects.toThrow(
        'Repository error',
      );
    });
  });

  describe('remove', () => {
    it('should remove an income successfully', async () => {
      // Arrange
      const incomeId = 'income-123';
      const mockIncome = {
        id: 'income-123',
        amount: 5000,
        description: 'Salary',
        date: new Date('2024-01-15'),
      };

      const expectedApiIncome = {
        id: 'income-123',
        amount: 5000,
        description: 'Salary',
        date: '2024-01-15',
      };

      mockIncomeRepository.delete.mockResolvedValue(mockIncome);

      // Act
      const result = await service.remove(incomeId);

      // Assert
      expect(mockIncomeRepository.delete).toHaveBeenCalledWith(incomeId);
      expect(result).toEqual(expectedApiIncome);
    });

    it('should handle repository errors when removing income', async () => {
      // Arrange
      const incomeId = 'income-123';
      const error = new Error('Repository error');
      mockIncomeRepository.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(service.remove(incomeId)).rejects.toThrow(
        'Repository error',
      );
    });
  });
});
