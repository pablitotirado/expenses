import { validate } from 'class-validator';
import { AIRequestDto } from './ai-request.dto';

describe('AIRequestDto', () => {
  it('should be defined', () => {
    expect(AIRequestDto).toBeDefined();
  });

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      // Arrange
      const dto = new AIRequestDto();
      dto.period = 'current_month';
      dto.userGoal = 'Ahorrar para vacaciones';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only required fields', async () => {
      // Arrange
      const dto = new AIRequestDto();
      dto.period = 'last_month';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when period is missing', async () => {
      // Arrange
      const dto = new AIRequestDto();
      dto.userGoal = 'Test goal';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('period');
      expect(errors[0].constraints?.isString).toBeDefined();
    });

    it('should fail validation when period is not a string', async () => {
      // Arrange
      const dto = new AIRequestDto();
      (dto as any).period = 123;
      dto.userGoal = 'Test goal';

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('period');
      expect(errors[0].constraints?.isString).toBeDefined();
    });

    it('should pass validation when userGoal is undefined', async () => {
      // Arrange
      const dto = new AIRequestDto();
      dto.period = 'current_month';
      dto.userGoal = undefined;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when userGoal is not a string', async () => {
      // Arrange
      const dto = new AIRequestDto();
      dto.period = 'current_month';
      (dto as any).userGoal = 123;

      // Act
      const errors = await validate(dto);

      // Assert
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('userGoal');
      expect(errors[0].constraints?.isString).toBeDefined();
    });

    it('should accept valid period values', async () => {
      // Arrange
      const validPeriods = ['current_month', 'last_month', 'last_3_months'];

      for (const period of validPeriods) {
        const dto = new AIRequestDto();
        dto.period = period;

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
      const dto = new AIRequestDto();
      dto.period = 'current_month';
      dto.userGoal = 'Test goal';

      // Act & Assert
      expect(typeof dto.period).toBe('string');
      expect(typeof dto.userGoal).toBe('string');
    });

    it('should allow userGoal to be optional', () => {
      // Arrange
      const dto = new AIRequestDto();
      dto.period = 'current_month';

      // Act & Assert
      expect(dto.userGoal).toBeUndefined();
    });
  });
});
