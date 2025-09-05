import { IncomesController } from './incomes.controller';
import { IncomesService } from '../service/incomes.service';
import { CreateIncomeDto, UpdateIncomeDto } from '../dto';

describe('IncomesController', () => {
  let controller: IncomesController;
  let mockIncomesService: {
    create: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockIncomesService = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    controller = new IncomesController(
      mockIncomesService as unknown as IncomesService,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an income when valid data is provided', async () => {
      // Arrange
      const createIncomeDto: CreateIncomeDto = {
        amount: 5000,
        description: 'Salary',
      };

      const expectedIncome = {
        id: 'income-123',
        amount: 5000,
        description: 'Salary',
        date: '2024-01-15',
      };

      mockIncomesService.create.mockResolvedValue(expectedIncome);

      // Act
      const result = await controller.create(createIncomeDto);

      // Assert
      expect(mockIncomesService.create).toHaveBeenCalledWith(createIncomeDto);
      expect(mockIncomesService.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedIncome);
    });

    it('should create an income without description when not provided', async () => {
      // Arrange
      const createIncomeDto: CreateIncomeDto = {
        amount: 3000,
      };

      const expectedIncome = {
        id: 'income-456',
        amount: 3000,
        description: null,
        date: '2024-01-15',
      };

      mockIncomesService.create.mockResolvedValue(expectedIncome);

      // Act
      const result = await controller.create(createIncomeDto);

      // Assert
      expect(mockIncomesService.create).toHaveBeenCalledWith(createIncomeDto);
      expect(result).toEqual(expectedIncome);
    });

    it('should handle service errors when creating income', async () => {
      // Arrange
      const createIncomeDto: CreateIncomeDto = {
        amount: 5000,
        description: 'Salary',
      };

      const error = new Error('Service error');
      mockIncomesService.create.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.create(createIncomeDto)).rejects.toThrow(
        'Service error',
      );
      expect(mockIncomesService.create).toHaveBeenCalledWith(createIncomeDto);
    });
  });

  describe('findAll', () => {
    it('should return all incomes', async () => {
      // Arrange
      const expectedIncomes = [
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
          date: '2024-01-16',
        },
      ];

      mockIncomesService.findAll.mockResolvedValue(expectedIncomes);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(mockIncomesService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedIncomes);
    });

    it('should return empty array when no incomes exist', async () => {
      // Arrange
      mockIncomesService.findAll.mockResolvedValue([]);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(mockIncomesService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an income when found', async () => {
      // Arrange
      const incomeId = 'income-123';
      const expectedIncome = {
        id: 'income-123',
        amount: 5000,
        description: 'Salary',
        date: '2024-01-15',
      };

      mockIncomesService.findOne.mockResolvedValue(expectedIncome);

      // Act
      const result = await controller.findOne(incomeId);

      // Assert
      expect(mockIncomesService.findOne).toHaveBeenCalledWith(incomeId);
      expect(mockIncomesService.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedIncome);
    });

    it('should return null when income not found', async () => {
      // Arrange
      const incomeId = 'income-999';
      mockIncomesService.findOne.mockResolvedValue(null);

      // Act
      const result = await controller.findOne(incomeId);

      // Assert
      expect(mockIncomesService.findOne).toHaveBeenCalledWith(incomeId);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an income when valid data is provided', async () => {
      // Arrange
      const incomeId = 'income-123';
      const updateIncomeDto: UpdateIncomeDto = {
        amount: 6000,
        description: 'Updated salary',
      };

      const expectedIncome = {
        id: 'income-123',
        amount: 6000,
        description: 'Updated salary',
        date: '2024-01-15',
      };

      mockIncomesService.update.mockResolvedValue(expectedIncome);

      // Act
      const result = await controller.update(incomeId, updateIncomeDto);

      // Assert
      expect(mockIncomesService.update).toHaveBeenCalledWith(
        incomeId,
        updateIncomeDto,
      );
      expect(mockIncomesService.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedIncome);
    });

    it('should update an income with partial data', async () => {
      // Arrange
      const incomeId = 'income-123';
      const updateIncomeDto: UpdateIncomeDto = {
        amount: 7000,
      };

      const expectedIncome = {
        id: 'income-123',
        amount: 7000,
        description: 'Original description',
        date: '2024-01-15',
      };

      mockIncomesService.update.mockResolvedValue(expectedIncome);

      // Act
      const result = await controller.update(incomeId, updateIncomeDto);

      // Assert
      expect(mockIncomesService.update).toHaveBeenCalledWith(
        incomeId,
        updateIncomeDto,
      );
      expect(result).toEqual(expectedIncome);
    });

    it('should handle service errors when updating income', async () => {
      // Arrange
      const incomeId = 'income-123';
      const updateIncomeDto: UpdateIncomeDto = {
        amount: 6000,
      };

      const error = new Error('Service error');
      mockIncomesService.update.mockRejectedValue(error);

      // Act & Assert
      await expect(
        controller.update(incomeId, updateIncomeDto),
      ).rejects.toThrow('Service error');
      expect(mockIncomesService.update).toHaveBeenCalledWith(
        incomeId,
        updateIncomeDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove an income when valid id is provided', async () => {
      // Arrange
      const incomeId = 'income-123';
      const expectedIncome = {
        id: 'income-123',
        amount: 5000,
        description: 'Salary',
        date: '2024-01-15',
      };

      mockIncomesService.remove.mockResolvedValue(expectedIncome);

      // Act
      const result = await controller.remove(incomeId);

      // Assert
      expect(mockIncomesService.remove).toHaveBeenCalledWith(incomeId);
      expect(mockIncomesService.remove).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedIncome);
    });

    it('should handle service errors when removing income', async () => {
      // Arrange
      const incomeId = 'income-123';
      const error = new Error('Service error');
      mockIncomesService.remove.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.remove(incomeId)).rejects.toThrow(
        'Service error',
      );
      expect(mockIncomesService.remove).toHaveBeenCalledWith(incomeId);
    });
  });
});
