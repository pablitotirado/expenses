import { validate } from 'class-validator';
import { UpdateIncomeDto } from './update-income.dto';

describe('UpdateIncomeDto', () => {
  it('should be defined', () => {
    expect(UpdateIncomeDto).toBeDefined();
  });

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      // Arrange
      const dto = new UpdateIncomeDto();
      dto.amount = 6000;
      dto.description = 'Updated salary';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data (amount only)', async () => {
      // Arrange
      const dto = new UpdateIncomeDto();
      dto.amount = 7000;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with partial data (description only)', async () => {
      // Arrange
      const dto = new UpdateIncomeDto();
      dto.description = 'Updated description';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty object', async () => {
      // Arrange
      const dto = new UpdateIncomeDto();

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when amount is not a number', async () => {
      // Arrange
      const dto = new UpdateIncomeDto();
      (dto as any).amount = 'not-a-number';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      const amountError = errors.find((error) => error.property === 'amount');
      expect(amountError).toBeDefined();
      expect(amountError?.constraints?.isNumber).toBeDefined();
    });

    it('should fail validation when description is not a string', async () => {
      // Arrange
      const dto = new UpdateIncomeDto();
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
      const dto = new UpdateIncomeDto();
      dto.description = null;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when description is undefined', async () => {
      // Arrange
      const dto = new UpdateIncomeDto();
      dto.amount = 5000;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with valid amount values', async () => {
      // Arrange
      const validAmounts = [0, 1, 100, 1000, 5000, 10000, 50000, -100];

      for (const amount of validAmounts) {
        const dto = new UpdateIncomeDto();
        dto.amount = amount;

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(0);
      }
    });

    it('should pass validation with decimal amounts', async () => {
      // Arrange
      const dto = new UpdateIncomeDto();
      dto.amount = 5000.75;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });
  });

  describe('properties', () => {
    it('should have correct property types when initialized', () => {
      // Arrange
      const dto = new UpdateIncomeDto();
      dto.amount = 6000;
      dto.description = 'Updated salary';

      // Act & Assert
      expect(typeof dto.amount).toBe('number');
      expect(typeof dto.description).toBe('string');
    });

    it('should allow all properties to be optional', () => {
      // Arrange
      const dto = new UpdateIncomeDto();

      // Act & Assert
      expect(dto.amount).toBeUndefined();
      expect(dto.description).toBeUndefined();
    });

    it('should implement SharedUpdateIncomeDto interface', () => {
      // Arrange
      const dto = new UpdateIncomeDto();
      dto.amount = 6000;
      dto.description = 'Updated salary';

      // Act & Assert
      expect(dto).toHaveProperty('amount');
      expect(dto).toHaveProperty('description');
    });
  });

  describe('PartialType behavior', () => {
    it('should allow setting any combination of properties', () => {
      // Arrange
      const dto1 = new UpdateIncomeDto();
      dto1.amount = 6000;

      const dto2 = new UpdateIncomeDto();
      dto2.description = 'Updated';

      const dto3 = new UpdateIncomeDto();
      // No properties set

      const dto4 = new UpdateIncomeDto();
      dto4.amount = 6000;
      dto4.description = 'Updated';

      // Act & Assert
      expect(dto1.amount).toBe(6000);
      expect(dto1.description).toBeUndefined();

      expect(dto2.amount).toBeUndefined();
      expect(dto2.description).toBe('Updated');

      expect(dto3.amount).toBeUndefined();
      expect(dto3.description).toBeUndefined();

      expect(dto4.amount).toBe(6000);
      expect(dto4.description).toBe('Updated');
    });
  });
});
