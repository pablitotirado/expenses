import { ExpensesController } from './expenses.controller';
import { ExpensesService } from '../service/expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from '../dto';

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let mockExpensesService: {
    create: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockExpensesService = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    controller = new ExpensesController(
      mockExpensesService as unknown as ExpensesService,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an expense when valid data is provided', async () => {
      // Arrange
      const createExpenseDto: CreateExpenseDto = {
        amount: 1000,
        description: 'Test expense',
        categoryId: 'category-123',
      };

      const expectedExpense = {
        id: 'expense-123',
        amount: 1000,
        description: 'Test expense',
        categoryId: 'category-123',
        date: '2024-01-15',
        category: {
          id: 'category-123',
          name: 'Food',
        },
      };

      mockExpensesService.create.mockResolvedValue(expectedExpense);

      // Act
      const result = await controller.create(createExpenseDto);

      // Assert
      expect(mockExpensesService.create).toHaveBeenCalledWith(createExpenseDto);
      expect(mockExpensesService.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedExpense);
    });

    it('should create an expense without description when not provided', async () => {
      // Arrange
      const createExpenseDto: CreateExpenseDto = {
        amount: 500,
        categoryId: 'category-456',
      };

      const expectedExpense = {
        id: 'expense-456',
        amount: 500,
        description: null,
        categoryId: 'category-456',
        date: '2024-01-15',
        category: {
          id: 'category-456',
          name: 'Transport',
        },
      };

      mockExpensesService.create.mockResolvedValue(expectedExpense);

      // Act
      const result = await controller.create(createExpenseDto);

      // Assert
      expect(mockExpensesService.create).toHaveBeenCalledWith(createExpenseDto);
      expect(result).toEqual(expectedExpense);
    });

    it('should handle service errors when creating expense', async () => {
      // Arrange
      const createExpenseDto: CreateExpenseDto = {
        amount: 1000,
        description: 'Test expense',
        categoryId: 'category-123',
      };

      const error = new Error('Service error');
      mockExpensesService.create.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.create(createExpenseDto)).rejects.toThrow(
        'Service error',
      );
      expect(mockExpensesService.create).toHaveBeenCalledWith(createExpenseDto);
    });
  });

  describe('findAll', () => {
    it('should return all expenses', async () => {
      // Arrange
      const expectedExpenses = [
        {
          id: 'expense-1',
          amount: 1000,
          description: 'Food',
          categoryId: 'category-1',
          date: '2024-01-15',
          category: {
            id: 'category-1',
            name: 'Food',
          },
        },
        {
          id: 'expense-2',
          amount: 500,
          description: 'Transport',
          categoryId: 'category-2',
          date: '2024-01-16',
          category: {
            id: 'category-2',
            name: 'Transport',
          },
        },
      ];

      mockExpensesService.findAll.mockResolvedValue(expectedExpenses);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(mockExpensesService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedExpenses);
    });

    it('should return empty array when no expenses exist', async () => {
      // Arrange
      mockExpensesService.findAll.mockResolvedValue([]);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(mockExpensesService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an expense when found', async () => {
      // Arrange
      const expenseId = 'expense-123';
      const expectedExpense = {
        id: 'expense-123',
        amount: 1000,
        description: 'Test expense',
        categoryId: 'category-123',
        date: '2024-01-15',
        category: {
          id: 'category-123',
          name: 'Food',
        },
      };

      mockExpensesService.findOne.mockResolvedValue(expectedExpense);

      // Act
      const result = await controller.findOne(expenseId);

      // Assert
      expect(mockExpensesService.findOne).toHaveBeenCalledWith(expenseId);
      expect(mockExpensesService.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedExpense);
    });

    it('should return null when expense not found', async () => {
      // Arrange
      const expenseId = 'expense-999';
      mockExpensesService.findOne.mockResolvedValue(null);

      // Act
      const result = await controller.findOne(expenseId);

      // Assert
      expect(mockExpensesService.findOne).toHaveBeenCalledWith(expenseId);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update an expense when valid data is provided', async () => {
      // Arrange
      const expenseId = 'expense-123';
      const updateExpenseDto: UpdateExpenseDto = {
        amount: 1500,
        description: 'Updated expense',
      };

      const expectedExpense = {
        id: 'expense-123',
        amount: 1500,
        description: 'Updated expense',
        categoryId: 'category-123',
        date: '2024-01-15',
        category: {
          id: 'category-123',
          name: 'Food',
        },
      };

      mockExpensesService.update.mockResolvedValue(expectedExpense);

      // Act
      const result = await controller.update(expenseId, updateExpenseDto);

      // Assert
      expect(mockExpensesService.update).toHaveBeenCalledWith(
        expenseId,
        updateExpenseDto,
      );
      expect(mockExpensesService.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedExpense);
    });

    it('should update an expense with partial data', async () => {
      // Arrange
      const expenseId = 'expense-123';
      const updateExpenseDto: UpdateExpenseDto = {
        amount: 2000,
      };

      const expectedExpense = {
        id: 'expense-123',
        amount: 2000,
        description: 'Original description',
        categoryId: 'category-123',
        date: '2024-01-15',
        category: {
          id: 'category-123',
          name: 'Food',
        },
      };

      mockExpensesService.update.mockResolvedValue(expectedExpense);

      // Act
      const result = await controller.update(expenseId, updateExpenseDto);

      // Assert
      expect(mockExpensesService.update).toHaveBeenCalledWith(
        expenseId,
        updateExpenseDto,
      );
      expect(result).toEqual(expectedExpense);
    });

    it('should handle service errors when updating expense', async () => {
      // Arrange
      const expenseId = 'expense-123';
      const updateExpenseDto: UpdateExpenseDto = {
        amount: 1500,
      };

      const error = new Error('Service error');
      mockExpensesService.update.mockRejectedValue(error);

      // Act & Assert
      await expect(
        controller.update(expenseId, updateExpenseDto),
      ).rejects.toThrow('Service error');
      expect(mockExpensesService.update).toHaveBeenCalledWith(
        expenseId,
        updateExpenseDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove an expense when valid id is provided', async () => {
      // Arrange
      const expenseId = 'expense-123';
      const expectedExpense = {
        id: 'expense-123',
        amount: 1000,
        description: 'Test expense',
        categoryId: 'category-123',
        date: '2024-01-15',
        category: {
          id: 'category-123',
          name: 'Food',
        },
      };

      mockExpensesService.remove.mockResolvedValue(expectedExpense);

      // Act
      const result = await controller.remove(expenseId);

      // Assert
      expect(mockExpensesService.remove).toHaveBeenCalledWith(expenseId);
      expect(mockExpensesService.remove).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedExpense);
    });

    it('should handle service errors when removing expense', async () => {
      // Arrange
      const expenseId = 'expense-123';
      const error = new Error('Service error');
      mockExpensesService.remove.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.remove(expenseId)).rejects.toThrow(
        'Service error',
      );
      expect(mockExpensesService.remove).toHaveBeenCalledWith(expenseId);
    });
  });
});
