import { ApiProperty } from '@nestjs/swagger';

export class PeriodDto {
  @ApiProperty({
    description: 'Fecha de inicio del período',
    example: '2024-01-01T00:00:00.000Z',
  })
  from: string;

  @ApiProperty({
    description: 'Fecha de fin del período',
    example: '2024-01-31T23:59:59.999Z',
  })
  to: string;

  @ApiProperty({
    description: 'Número de días en el período',
    example: 31,
  })
  days: number;
}

export class IncomeDto {
  @ApiProperty({
    description: 'Fecha del ingreso',
    example: '2024-01-15',
  })
  date: string;

  @ApiProperty({
    description: 'Monto del ingreso',
    example: 50000,
  })
  amount: number;

  @ApiProperty({
    description: 'Fuente del ingreso',
    example: 'Salario',
  })
  source: string;
}

export class ExpenseDto {
  @ApiProperty({
    description: 'Fecha del gasto',
    example: '2024-01-15',
  })
  date: string;

  @ApiProperty({
    description: 'Monto del gasto',
    example: 15000,
  })
  amount: number;

  @ApiProperty({
    description: 'Categoría del gasto',
    example: 'Alimentación',
  })
  category: string;

  @ApiProperty({
    description: 'Si es un gasto fijo',
    example: false,
  })
  fixed: boolean;

  @ApiProperty({
    description: 'Notas adicionales del gasto',
    example: 'Supermercado',
    required: false,
  })
  notes?: string;
}

export class UserProfileDto {
  @ApiProperty({
    description: 'Tamaño del hogar',
    example: 1,
  })
  household_size: number;

  @ApiProperty({
    description: 'Número de dependientes',
    example: 0,
  })
  dependents: number;

  @ApiProperty({
    description: 'Si tiene deudas',
    example: false,
  })
  has_debt: boolean;

  @ApiProperty({
    description: 'Metas financieras del usuario',
    example: ['Ahorrar para vacaciones'],
    type: [String],
  })
  goals: string[];
}

export class FinancialDataDto {
  @ApiProperty({
    description: 'Período del análisis',
    type: PeriodDto,
  })
  period: PeriodDto;

  @ApiProperty({
    description: 'Moneda utilizada',
    example: 'ARS',
  })
  currency: string;

  @ApiProperty({
    description: 'Lista de ingresos',
    type: [IncomeDto],
  })
  incomes: IncomeDto[];

  @ApiProperty({
    description: 'Lista de gastos',
    type: [ExpenseDto],
  })
  expenses: ExpenseDto[];

  @ApiProperty({
    description: 'Perfil del usuario',
    type: UserProfileDto,
  })
  user_profile: UserProfileDto;
}

export class AIResponseDto {
  @ApiProperty({
    description: 'Análisis financiero generado por IA',
    example: 'Basado en tus datos financieros del mes actual...',
  })
  analysis: string;

  @ApiProperty({
    description: 'Datos financieros utilizados para el análisis',
    type: FinancialDataDto,
  })
  data: FinancialDataDto;
}
