# expenses-shared

Paquete compartido que contiene los tipos y interfaces comunes utilizados tanto en el backend como en el frontend de la aplicación Stori Expenses.

## Estructura

### Entidades (`src/entities/`)

- **Income**: Tipos para ingresos
  - `Income`: Entidad base con fechas como `Date`
  - `IncomeApi`: Versión para API con fechas como string ISO

- **Expense**: Tipos para gastos
  - `Expense`: Entidad base con fechas como `Date`
  - `ExpenseApi`: Versión para API con fechas como string ISO y información de categoría
  - `ExpenseWithCategory`: Alias para compatibilidad hacia atrás

- **Category**: Tipos para categorías
  - `Category`: Entidad base de categoría
  - `CategoryWithCount`: Categoría con contador de gastos

### DTOs (`src/dto/`)

- **CreateIncomeDto**: DTO para crear ingresos
- **UpdateIncomeDto**: DTO para actualizar ingresos
- **CreateExpenseDto**: DTO para crear gastos
- **UpdateExpenseDto**: DTO para actualizar gastos
- **CreateCategoryDto**: DTO para crear categorías
- **UpdateCategoryDto**: DTO para actualizar categorías

### Respuestas API (`src/api/`)

- **ApiResponse**: Wrapper estándar para respuestas API
- **ApiErrorResponse**: Respuesta estándar para errores
- **PaginatedResponse**: Respuesta paginada
- **IncomeApiResponse**: Respuesta para un ingreso
- **IncomesApiResponse**: Respuesta para múltiples ingresos
- **ExpenseApiResponse**: Respuesta para un gasto
- **ExpensesApiResponse**: Respuesta para múltiples gastos
- **CategoryApiResponse**: Respuesta para una categoría
- **CategoriesApiResponse**: Respuesta para múltiples categorías
- **CategoryWithCountApiResponse**: Respuesta para categoría con contador

### Tipos Comunes (`src/types/`)

- **FinancialSummary**: Resumen financiero para dashboard
- **Transaction**: Tipo unificado para transacciones (ingresos/gastos)
- Utilidades de TypeScript: `Partial`, `Required`, `Pick`, `Omit`

## Uso

### En el Backend

```typescript
import { IncomeApi, CreateIncomeDto, IncomeApiResponse } from 'expenses-shared';
```

### En el Frontend

```typescript
import {
  IncomeApi as IncomeType,
  CreateIncomeDto,
  IncomeApiResponse,
} from 'expenses-shared';
```

## Construcción

```bash
pnpm build
```

## Desarrollo

```bash
pnpm dev  # Modo watch para desarrollo
```

## Notas

- Las entidades base (`Income`, `Expense`, `Category`) usan fechas como `Date` para uso interno
- Las versiones API (`IncomeApi`, `ExpenseApi`) usan fechas como string ISO para serialización JSON
- El backend convierte automáticamente entre estos tipos usando funciones de conversión
- El frontend usa principalmente los tipos API para las respuestas HTTP
