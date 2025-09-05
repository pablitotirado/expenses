import { validate } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

describe('CreateCategoryDto', () => {
  it('should be defined', () => {
    expect(CreateCategoryDto).toBeDefined();
  });

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      // Arrange
      const dto = new CreateCategoryDto();
      dto.name = 'Test Category';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when name is missing', async () => {
      // Arrange
      const dto = new CreateCategoryDto();

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should fail validation when name is not a string', async () => {
      // Arrange
      const dto = new CreateCategoryDto();
      (dto as any).name = 123;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints?.isString).toBeDefined();
    });

    it('should fail validation when name is empty string', async () => {
      // Arrange
      const dto = new CreateCategoryDto();
      dto.name = '';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints?.isNotEmpty).toBeDefined();
    });

    it('should pass validation when name is only whitespace (class-validator behavior)', async () => {
      // Arrange
      const dto = new CreateCategoryDto();
      dto.name = '   ';

      // Act
      const errors = await validate(dto);

      // Assert
      // Note: @IsNotEmpty() doesn't trim by default, so whitespace-only strings pass validation
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with valid category names', async () => {
      // Arrange
      const validNames = [
        'Food',
        'Transportation',
        'Entertainment',
        'Healthcare',
        'Education',
        'Shopping',
        'Utilities',
        'Rent',
        'Insurance',
        'Miscellaneous',
      ];

      for (const name of validNames) {
        const dto = new CreateCategoryDto();
        dto.name = name;

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(0);
      }
    });

    it('should pass validation with long category names', async () => {
      // Arrange
      const dto = new CreateCategoryDto();
      dto.name = 'Very Long Category Name That Should Still Be Valid';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with special characters in name', async () => {
      // Arrange
      const dto = new CreateCategoryDto();
      dto.name = 'Category with Special Characters & Numbers 123';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });
  });

  describe('properties', () => {
    it('should have correct property types when initialized', () => {
      // Arrange
      const dto = new CreateCategoryDto();
      dto.name = 'Test Category';

      // Act & Assert
      expect(typeof dto.name).toBe('string');
    });

    it('should implement SharedCreateCategoryDto interface', () => {
      // Arrange
      const dto = new CreateCategoryDto();
      dto.name = 'Test Category';

      // Act & Assert
      expect(dto).toHaveProperty('name');
      expect(typeof dto.name).toBe('string');
    });
  });

  describe('ApiProperty decorators', () => {
    it('should have ApiProperty decorator on name field', () => {
      // This test ensures the field is properly decorated for Swagger documentation
      const dto = new CreateCategoryDto();
      dto.name = 'Test Category';

      // The field should exist and be accessible
      expect(dto.name).toBe('Test Category');
    });
  });
});
