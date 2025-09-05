import { validate } from 'class-validator';
import { UpdateExpenseDto } from './update-expense.dto';

describe('UpdateExpenseDto', () => {
  it('should be defined', () => {
    expect(UpdateExpenseDto).toBeDefined();
  });

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      // Arrange
      const dto = new UpdateExpenseDto();
      dto.amount = 1000;
      dto.description = 'Updated expense';
      dto.categoryId = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data (amount only)', async () => {
      // Arrange
      const dto = new UpdateExpenseDto();
      dto.amount = 1500;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data (description only)', async () => {
      // Arrange
      const dto = new UpdateExpenseDto();
      dto.description = 'Updated description';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data (categoryId only)', async () => {
      // Arrange
      const dto = new UpdateExpenseDto();
      dto.categoryId = '550e8400-e29b-41d4-a716-446655440000';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty object', async () => {
      // Arrange
      const dto = new UpdateExpenseDto();

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when amount is not a number', async () => {
      // Arrange
      const dto = new UpdateExpenseDto();
      (dto as any).amount = 'not-a-number';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      const amountError = errors.find((error) => error.property === 'amount');
      expect(amountError).toBeDefined();
      expect(amountError?.constraints?.isNumber).toBeDefined();
    });

    it('should fail validation when categoryId is not a valid UUID', async () => {
      // Arrange
      const dto = new UpdateExpenseDto();
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

    it('should fail validation when description is not a string', async () => {
      // Arrange
      const dto = new UpdateExpenseDto();
      (dto as any).description = 123;

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

    it('should pass validation when description is null', async () => {
      // Arrange
      const dto = new UpdateExpenseDto();
      dto.description = null;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when description is undefined', async () => {
      // Arrange
      const dto = new UpdateExpenseDto();
      dto.amount = 1000;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
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
        const dto = new UpdateExpenseDto();
        dto.categoryId = uuid;

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(0);
      }
    });

    it('should pass validation with valid amount values', async () => {
      // Arrange
      const validAmounts = [0, 1, 100, 1000, 9999.99, 100000, -100];

      for (const amount of validAmounts) {
        const dto = new UpdateExpenseDto();
        dto.amount = amount;

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(0);
      }
    });
  });

  describe('properties', () => {
    it('should have correct property types when initialized', () => {
      // Arrange
      const dto = new UpdateExpenseDto();
      dto.amount = 1000;
      dto.description = 'Updated expense';
      dto.categoryId = '123e4567-e89b-12d3-a456-426614174000';

      // Act & Assert
      expect(typeof dto.amount).toBe('number');
      expect(typeof dto.description).toBe('string');
      expect(typeof dto.categoryId).toBe('string');
    });

    it('should allow all properties to be optional', () => {
      // Arrange
      const dto = new UpdateExpenseDto();

      // Act & Assert
      expect(dto.amount).toBeUndefined();
      expect(dto.description).toBeUndefined();
      expect(dto.categoryId).toBeUndefined();
    });

    it('should implement SharedUpdateExpenseDto interface', () => {
      // Arrange
      const dto = new UpdateExpenseDto();
      dto.amount = 1000;
      dto.description = 'Updated expense';
      dto.categoryId = '123e4567-e89b-12d3-a456-426614174000';

      // Act & Assert
      expect(dto).toHaveProperty('amount');
      expect(dto).toHaveProperty('description');
      expect(dto).toHaveProperty('categoryId');
    });
  });

  describe('PartialType behavior', () => {
    it('should allow setting any combination of properties', () => {
      // Arrange
      const dto1 = new UpdateExpenseDto();
      dto1.amount = 1000;

      const dto2 = new UpdateExpenseDto();
      dto2.description = 'Updated';

      const dto3 = new UpdateExpenseDto();
      dto3.categoryId = '123e4567-e89b-12d3-a456-426614174000';

      const dto4 = new UpdateExpenseDto();
      dto4.amount = 1000;
      dto4.description = 'Updated';
      dto4.categoryId = '123e4567-e89b-12d3-a456-426614174000';

      // Act & Assert
      expect(dto1.amount).toBe(1000);
      expect(dto1.description).toBeUndefined();
      expect(dto1.categoryId).toBeUndefined();

      expect(dto2.amount).toBeUndefined();
      expect(dto2.description).toBe('Updated');
      expect(dto2.categoryId).toBeUndefined();

      expect(dto3.amount).toBeUndefined();
      expect(dto3.description).toBeUndefined();
      expect(dto3.categoryId).toBe('123e4567-e89b-12d3-a456-426614174000');

      expect(dto4.amount).toBe(1000);
      expect(dto4.description).toBe('Updated');
      expect(dto4.categoryId).toBe('123e4567-e89b-12d3-a456-426614174000');
    });
  });
});
