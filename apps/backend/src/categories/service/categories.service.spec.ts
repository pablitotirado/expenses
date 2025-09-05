import { CategoriesService } from './categories.service';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let mockCategoryRepository: {
    create: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    findWithExpenseCount: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockCategoryRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findWithExpenseCount: vi.fn(),
    };

    service = new CategoriesService(
      mockCategoryRepository as unknown as CategoryRepository,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category successfully', async () => {
      // Arrange
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };

      const expectedCategory = {
        id: '1',
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          expenses: 0,
        },
      };

      mockCategoryRepository.create.mockResolvedValue(expectedCategory);

      // Act
      const result = await service.create(createCategoryDto);

      // Assert
      expect(mockCategoryRepository.create).toHaveBeenCalledWith(
        createCategoryDto,
      );
      expect(result).toEqual(expectedCategory);
    });

    it('should throw ConflictException when category name already exists', async () => {
      // Arrange
      const createCategoryDto: CreateCategoryDto = {
        name: 'Existing Category',
      };

      const error = new Error('Unique constraint failed');
      mockCategoryRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(service.create(createCategoryDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createCategoryDto)).rejects.toThrow(
        'Category name already exists',
      );
    });

    it('should rethrow other errors', async () => {
      // Arrange
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };

      const error = new Error('Database connection failed');
      mockCategoryRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(service.create(createCategoryDto)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      // Arrange
      const expectedCategories = [
        {
          id: '1',
          name: 'Category 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            expenses: 5,
          },
        },
        {
          id: '2',
          name: 'Category 2',
          createdAt: new Date(),
          updatedAt: new Date(),
          _count: {
            expenses: 3,
          },
        },
      ];

      mockCategoryRepository.findAll.mockResolvedValue(expectedCategories);

      // Act
      const result = await service.findAll();

      // Assert
      expect(mockCategoryRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategories);
    });
  });

  describe('findOne', () => {
    it('should return a category when found', async () => {
      // Arrange
      const categoryId = '1';
      const expectedCategory = {
        id: '1',
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          expenses: 2,
        },
      };

      mockCategoryRepository.findOne.mockResolvedValue(expectedCategory);

      // Act
      const result = await service.findOne(categoryId);

      // Assert
      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual(expectedCategory);
    });

    it('should return null when category not found', async () => {
      // Arrange
      const categoryId = '999';
      mockCategoryRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findOne(categoryId);

      // Assert
      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith(categoryId);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a category successfully', async () => {
      // Arrange
      const categoryId = '1';
      const updateCategoryDto: CreateCategoryDto = {
        name: 'Updated Category',
      };

      const expectedCategory = {
        id: '1',
        name: 'Updated Category',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          expenses: 3,
        },
      };

      mockCategoryRepository.update.mockResolvedValue(expectedCategory);

      // Act
      const result = await service.update(categoryId, updateCategoryDto);

      // Assert
      expect(mockCategoryRepository.update).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
      expect(result).toEqual(expectedCategory);
    });

    it('should throw ConflictException when updated name already exists', async () => {
      // Arrange
      const categoryId = '1';
      const updateCategoryDto: CreateCategoryDto = {
        name: 'Existing Category',
      };

      const error = new Error('Unique constraint failed');
      mockCategoryRepository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(
        service.update(categoryId, updateCategoryDto),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.update(categoryId, updateCategoryDto),
      ).rejects.toThrow('Category name already exists');
    });

    it('should rethrow other errors', async () => {
      // Arrange
      const categoryId = '1';
      const updateCategoryDto: CreateCategoryDto = {
        name: 'Updated Category',
      };

      const error = new Error('Database connection failed');
      mockCategoryRepository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(
        service.update(categoryId, updateCategoryDto),
      ).rejects.toThrow('Database connection failed');
    });
  });

  describe('remove', () => {
    it('should remove a category successfully when no expenses are associated', async () => {
      // Arrange
      const categoryId = '1';
      const categoryWithCount = {
        id: '1',
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          expenses: 0,
        },
      };

      const expectedDeletedCategory = {
        id: '1',
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          expenses: 0,
        },
      };

      mockCategoryRepository.findWithExpenseCount.mockResolvedValue(
        categoryWithCount,
      );
      mockCategoryRepository.delete.mockResolvedValue(expectedDeletedCategory);

      // Act
      const result = await service.remove(categoryId);

      // Assert
      expect(mockCategoryRepository.findWithExpenseCount).toHaveBeenCalledWith(
        categoryId,
      );
      expect(mockCategoryRepository.delete).toHaveBeenCalledWith(categoryId);
      expect(result).toEqual(expectedDeletedCategory);
    });

    it('should throw NotFoundException when category not found', async () => {
      // Arrange
      const categoryId = '999';
      mockCategoryRepository.findWithExpenseCount.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remove(categoryId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove(categoryId)).rejects.toThrow(
        `Category with ID ${categoryId} not found`,
      );
    });

    it('should throw ConflictException when category has associated expenses', async () => {
      // Arrange
      const categoryId = '1';
      const categoryWithCount = {
        id: '1',
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          expenses: 5,
        },
      };

      mockCategoryRepository.findWithExpenseCount.mockResolvedValue(
        categoryWithCount,
      );

      // Act & Assert
      await expect(service.remove(categoryId)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.remove(categoryId)).rejects.toThrow(
        'Cannot delete category with associated expenses',
      );
    });

    it('should throw ConflictException when foreign key constraint fails', async () => {
      // Arrange
      const categoryId = '1';
      const categoryWithCount = {
        id: '1',
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          expenses: 0,
        },
      };

      mockCategoryRepository.findWithExpenseCount.mockResolvedValue(
        categoryWithCount,
      );

      const error = new Error('Foreign key constraint failed');
      mockCategoryRepository.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(service.remove(categoryId)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.remove(categoryId)).rejects.toThrow(
        'Cannot delete category with associated expenses',
      );
    });

    it('should rethrow other errors', async () => {
      // Arrange
      const categoryId = '1';
      const categoryWithCount = {
        id: '1',
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          expenses: 0,
        },
      };

      mockCategoryRepository.findWithExpenseCount.mockResolvedValue(
        categoryWithCount,
      );

      const error = new Error('Database connection failed');
      mockCategoryRepository.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(service.remove(categoryId)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
