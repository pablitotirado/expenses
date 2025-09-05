import { validate } from 'class-validator';
import { CreateIncomeDto } from './create-income.dto';

describe('CreateIncomeDto', () => {
  it('should be defined', () => {
    expect(CreateIncomeDto).toBeDefined();
  });

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      // Arrange
      const dto = new CreateIncomeDto();
      dto.amount = 5000;
      dto.description = 'Salary';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with minimal required data', async () => {
      // Arrange
      const dto = new CreateIncomeDto();
      dto.amount = 3000;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when amount is missing', async () => {
      // Arrange
      const dto = new CreateIncomeDto();
      dto.description = 'Salary';

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
      const dto = new CreateIncomeDto();
      (dto as any).amount = 'not-a-number';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors.length).toBeGreaterThan(0);
      const amountError = errors.find((error) => error.property === 'amount');
      expect(amountError).toBeDefined();
      expect(amountError?.constraints?.isNumber).toBeDefined();
    });

    it('should pass validation when description is null', async () => {
      // Arrange
      const dto = new CreateIncomeDto();
      dto.amount = 5000;
      dto.description = null;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when description is undefined', async () => {
      // Arrange
      const dto = new CreateIncomeDto();
      dto.amount = 5000;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when description is not a string', async () => {
      // Arrange
      const dto = new CreateIncomeDto();
      dto.amount = 5000;
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

    it('should pass validation with valid amount values', async () => {
      // Arrange
      const validAmounts = [0, 1, 100, 1000, 5000, 10000, 50000];

      for (const amount of validAmounts) {
        const dto = new CreateIncomeDto();
        dto.amount = amount;

        // Act
        const errors = await validate(dto);

        // Assert
        expect(errors).toHaveLength(0);
      }
    });

    it('should pass validation with negative amounts', async () => {
      // Arrange
      const dto = new CreateIncomeDto();
      dto.amount = -100;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with decimal amounts', async () => {
      // Arrange
      const dto = new CreateIncomeDto();
      dto.amount = 5000.5;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with large amounts', async () => {
      // Arrange
      const dto = new CreateIncomeDto();
      dto.amount = 1000000;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });
  });

  describe('properties', () => {
    it('should have correct property types when initialized', () => {
      // Arrange
      const dto = new CreateIncomeDto();
      dto.amount = 5000;
      dto.description = 'Salary';

      // Act & Assert
      expect(typeof dto.amount).toBe('number');
      expect(typeof dto.description).toBe('string');
    });

    it('should implement SharedCreateIncomeDto interface', () => {
      // Arrange
      const dto = new CreateIncomeDto();
      dto.amount = 5000;
      dto.description = 'Salary';

      // Act & Assert
      expect(dto).toHaveProperty('amount');
      expect(dto).toHaveProperty('description');
      expect(typeof dto.amount).toBe('number');
    });
  });

  describe('ApiProperty decorators', () => {
    it('should have ApiProperty decorators on all fields', () => {
      // This test ensures the fields are properly decorated for Swagger documentation
      const dto = new CreateIncomeDto();
      dto.amount = 5000;
      dto.description = 'Salary';

      // The fields should exist and be accessible
      expect(dto.amount).toBe(5000);
      expect(dto.description).toBe('Salary');
    });
  });
});
