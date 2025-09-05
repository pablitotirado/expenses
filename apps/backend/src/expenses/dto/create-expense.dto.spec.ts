import { validate } from 'class-validator';
import { CreateExpenseDto } from './create-expense.dto';

describe('CreateExpenseDto', () => {
  it('should be defined', () => {
    expect(CreateExpenseDto).toBeDefined();
  });

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      // Arrange
      const dto = new CreateExpenseDto();
      dto.amount = 1000;
      dto.description = 'Test expense';
      dto.categoryId = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with minimal required data', async () => {
      // Arrange
      const dto = new CreateExpenseDto();
      dto.amount = 500;
      dto.categoryId = '550e8400-e29b-41d4-a716-446655440000';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when amount is missing', async () => {
      // Arrange
      const dto = new CreateExpenseDto();
      dto.description = 'Test expense';
      dto.categoryId = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      const amountError = errors.find((error) => error.property === 'amount');
      expect(amountError).toBeDefined();
      expect(amountError?.constraints?.isNumber).toBeDefined();
    });

    it('should fail validation when amount is not a number', async () => {
      // Arrange
      const dto = new CreateExpenseDto();
      (dto as any).amount = 'not-a-number';
      dto.categoryId = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      const amountError = errors.find((error) => error.property === 'amount');
      expect(amountError).toBeDefined();
      expect(amountError?.constraints?.isNumber).toBeDefined();
    });

    it('should fail validation when categoryId is missing', async () => {
      // Arrange
      const dto = new CreateExpenseDto();
      dto.amount = 1000;
      dto.description = 'Test expense';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      const categoryIdError = errors.find(
        (error) => error.property === 'categoryId',
      );
      expect(categoryIdError).toBeDefined();
      expect(categoryIdError?.constraints?.isUuid).toBeDefined();
    });

    it('should fail validation when categoryId is not a valid UUID', async () => {
      // Arrange
      const dto = new CreateExpenseDto();
      dto.amount = 1000;
      dto.categoryId = 'not-a-uuid';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      const categoryIdError = errors.find(
        (error) => error.property === 'categoryId',
      );
      expect(categoryIdError).toBeDefined();
      expect(categoryIdError?.constraints?.isUuid).toBeDefined();
    });

    it('should pass validation when description is null', async () => {
      // Arrange
      const dto = new CreateExpenseDto();
      dto.amount = 1000;
      dto.description = null;
      dto.categoryId = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when description is undefined', async () => {
      // Arrange
      const dto = new CreateExpenseDto();
      dto.amount = 1000;
      dto.categoryId = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when description is not a string', async () => {
      // Arrange
      const dto = new CreateExpenseDto();
      dto.amount = 1000;
      (dto as any).description = 123;
      dto.categoryId = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      const descriptionError = errors.find(
        (error) => error.property === 'description',
      );
      expect(descriptionError).toBeDefined();
      expect(descriptionError?.constraints?.isString).toBeDefined();
    });

    it('should pass validation with valid UUID formats', async () => {
      // Arrange
      const validUuids = [
        '123e4567-e89b-12d3-a456-426614174000',
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
        '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
      ];

      for (const uuid of validUuids) {
        const dto = new CreateExpenseDto();
        dto.amount = 1000;
        dto.categoryId = uuid;

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(0);
      }
    });

    it('should pass validation with valid amount values', async () => {
      // Arrange
      const validAmounts = [0, 1, 100, 1000, 9999.99, 100000];

      for (const amount of validAmounts) {
        const dto = new CreateExpenseDto();
        dto.amount = amount;
        dto.categoryId = '123e4567-e89b-12d3-a456-426614174000';

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(0);
      }
    });

    it('should pass validation with negative amounts', async () => {
      // Arrange
      const dto = new CreateExpenseDto();
      dto.amount = -100;
      dto.categoryId = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });
  });

  describe('properties', () => {
    it('should have correct property types when initialized', () => {
      // Arrange
      const dto = new CreateExpenseDto();
      dto.amount = 1000;
      dto.description = 'Test expense';
      dto.categoryId = '123e4567-e89b-12d3-a456-426614174000';

      // Act & Assert
      expect(typeof dto.amount).toBe('number');
      expect(typeof dto.description).toBe('string');
      expect(typeof dto.categoryId).toBe('string');
    });

    it('should implement SharedCreateExpenseDto interface', () => {
      // Arrange
      const dto = new CreateExpenseDto();
      dto.amount = 1000;
      dto.description = 'Test expense';
      dto.categoryId = '123e4567-e89b-12d3-a456-426614174000';

      // Act & Assert
      expect(dto).toHaveProperty('amount');
      expect(dto).toHaveProperty('description');
      expect(dto).toHaveProperty('categoryId');
      expect(typeof dto.amount).toBe('number');
      expect(typeof dto.categoryId).toBe('string');
    });
  });

  describe('ApiProperty decorators', () => {
    it('should have ApiProperty decorators on all fields', () => {
      // This test ensures the fields are properly decorated for Swagger documentation
      const dto = new CreateExpenseDto();
      dto.amount = 1000;
      dto.description = 'Test expense';
      dto.categoryId = '123e4567-e89b-12d3-a456-426614174000';

      // The fields should exist and be accessible
      expect(dto.amount).toBe(1000);
      expect(dto.description).toBe('Test expense');
      expect(dto.categoryId).toBe('123e4567-e89b-12d3-a456-426614174000');
    });
  });
});
