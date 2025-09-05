import { CategoriesController } from './categories.controller';
import { CategoriesService } from '../service/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let mockCategoriesService: {
    create: ReturnType<typeof vi.fn>;
    findAll: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockCategoriesService = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    controller = new CategoriesController(
      mockCategoriesService as unknown as CategoriesService,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category when valid data is provided', async () => {
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

      mockCategoriesService.create.mockResolvedValue(expectedCategory);

      // Act
      const result = await controller.create(createCategoryDto);

      // Assert
      expect(mockCategoriesService.create).toHaveBeenCalledWith(
        createCategoryDto,
      );
      expect(mockCategoriesService.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategory);
    });

    it('should handle service errors when creating category', async () => {
      // Arrange
      const createCategoryDto: CreateCategoryDto = {
        name: 'Test Category',
      };

      const error = new Error('Service error');
      mockCategoriesService.create.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.create(createCategoryDto)).rejects.toThrow(
        'Service error',
      );
      expect(mockCategoriesService.create).toHaveBeenCalledWith(
        createCategoryDto,
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

      mockCategoriesService.findAll.mockResolvedValue(expectedCategories);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(mockCategoriesService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategories);
    });

    it('should return empty array when no categories exist', async () => {
      // Arrange
      mockCategoriesService.findAll.mockResolvedValue([]);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(mockCategoriesService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
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

      mockCategoriesService.findOne.mockResolvedValue(expectedCategory);

      // Act
      const result = await controller.findOne(categoryId);

      // Assert
      expect(mockCategoriesService.findOne).toHaveBeenCalledWith(categoryId);
      expect(mockCategoriesService.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategory);
    });

    it('should return null when category not found', async () => {
      // Arrange
      const categoryId = '999';
      mockCategoriesService.findOne.mockResolvedValue(null);

      // Act
      const result = await controller.findOne(categoryId);

      // Assert
      expect(mockCategoriesService.findOne).toHaveBeenCalledWith(categoryId);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a category when valid data is provided', async () => {
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

      mockCategoriesService.update.mockResolvedValue(expectedCategory);

      // Act
      const result = await controller.update(categoryId, updateCategoryDto);

      // Assert
      expect(mockCategoriesService.update).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
      expect(mockCategoriesService.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategory);
    });

    it('should handle service errors when updating category', async () => {
      // Arrange
      const categoryId = '1';
      const updateCategoryDto: CreateCategoryDto = {
        name: 'Updated Category',
      };

      const error = new Error('Service error');
      mockCategoriesService.update.mockRejectedValue(error);

      // Act & Assert
      await expect(
        controller.update(categoryId, updateCategoryDto),
      ).rejects.toThrow('Service error');
      expect(mockCategoriesService.update).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a category when valid id is provided', async () => {
      // Arrange
      const categoryId = '1';
      const expectedCategory = {
        id: '1',
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
          expenses: 0,
        },
      };

      mockCategoriesService.remove.mockResolvedValue(expectedCategory);

      // Act
      const result = await controller.remove(categoryId);

      // Assert
      expect(mockCategoriesService.remove).toHaveBeenCalledWith(categoryId);
      expect(mockCategoriesService.remove).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCategory);
    });

    it('should handle service errors when removing category', async () => {
      // Arrange
      const categoryId = '1';
      const error = new Error('Service error');
      mockCategoriesService.remove.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.remove(categoryId)).rejects.toThrow(
        'Service error',
      );
      expect(mockCategoriesService.remove).toHaveBeenCalledWith(categoryId);
    });
  });
});
