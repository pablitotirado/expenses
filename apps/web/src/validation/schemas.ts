import * as yup from 'yup';

export const incomeSchema = yup.object({
  amount: yup
    .string()
    .required('El monto es obligatorio')
    .test('is-number', 'El monto debe ser un número válido', value => {
      if (!value) return false;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    })
    .test('min-amount', 'El monto mínimo es $0.01', value => {
      if (!value) return false;
      const num = parseFloat(value);
      return num >= 0.01;
    }),
  description: yup
    .string()
    .required('La descripción es obligatoria')
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .max(100, 'La descripción no puede exceder 100 caracteres')
    .trim(),
  date: yup
    .string()
    .required('La fecha es obligatoria')
    .test('valid-date', 'La fecha debe ser válida', value => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime()) && date <= new Date();
    }),
});

export const backendIncomeSchema = yup.object({
  amount: yup
    .number()
    .required('El monto es obligatorio')
    .min(0.01, 'El monto mínimo es $0.01')
    .typeError('El monto debe ser un número válido'),
  description: yup
    .string()
    .nullable()
    .optional()
    .max(100, 'La descripción no puede exceder 100 caracteres')
    .trim(),
});

export const expenseSchema = yup.object({
  amount: yup
    .string()
    .required('El monto es obligatorio')
    .test('is-number', 'El monto debe ser un número válido', value => {
      if (!value) return false;
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    })
    .test('min-amount', 'El monto mínimo es $0.01', value => {
      if (!value) return false;
      const num = parseFloat(value);
      return num >= 0.01;
    }),
  description: yup
    .string()
    .required('La descripción es obligatoria')
    .min(3, 'La descripción debe tener al menos 3 caracteres')
    .max(100, 'La descripción no puede exceder 100 caracteres')
    .trim(),
  category: yup
    .string()
    .required('La categoría es obligatoria')
    .min(1, 'Debe seleccionar una categoría'),
  date: yup
    .string()
    .required('La fecha es obligatoria')
    .test('valid-date', 'La fecha debe ser válida', value => {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime()) && date <= new Date();
    }),
});

export const backendExpenseSchema = yup.object({
  amount: yup
    .number()
    .required('El monto es obligatorio')
    .min(0.01, 'El monto mínimo es $0.01')
    .typeError('El monto debe ser un número válido'),
  description: yup
    .string()
    .nullable()
    .optional()
    .max(100, 'La descripción no puede exceder 100 caracteres')
    .trim(),
  categoryId: yup
    .string()
    .required('La categoría es obligatoria')
    .uuid('Debe seleccionar una categoría válida'),
});

export type IncomeFormData = yup.InferType<typeof incomeSchema>;
export type BackendIncomeFormData = yup.InferType<typeof backendIncomeSchema>;
export type ExpenseFormData = yup.InferType<typeof expenseSchema>;
export type BackendExpenseFormData = yup.InferType<typeof backendExpenseSchema>;

export const categorySchema = yup.object({
  name: yup
    .string()
    .required('El nombre de la categoría es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim(),
  icon: yup.string().required('El icono es obligatorio'),
  color: yup.string().required('El color es obligatorio'),
});

export type CategoryFormData = yup.InferType<typeof categorySchema>;

export const backendCategorySchema = yup.object({
  name: yup
    .string()
    .required('El nombre de la categoría es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .trim(),
});

export type BackendCategoryFormData = yup.InferType<
  typeof backendCategorySchema
>;

export const createBackendExpenseSchemaWithBalance = (
  currentBalance: number
) => {
  return yup.object({
    amount: yup
      .number()
      .required('El monto es obligatorio')
      .min(0.01, 'El monto mínimo es $0.01')
      .max(
        currentBalance,
        `Balance insuficiente. Disponible: $${currentBalance.toFixed(2)}`
      )
      .typeError('El monto debe ser un número válido'),
    description: yup
      .string()
      .nullable()
      .optional()
      .max(100, 'La descripción no puede exceder 100 caracteres')
      .trim(),
    categoryId: yup
      .string()
      .required('La categoría es obligatoria')
      .uuid('Debe seleccionar una categoría válida'),
  });
};
