import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useCreateExpense } from '../hooks/useExpenses';
import { useCategories } from '../hooks/useCategories';
import { useFinancialSummary } from '../hooks/useStatistics';
import {
  createBackendExpenseSchemaWithBalance,
  type BackendExpenseFormData,
} from '../validation/schemas';

export const ExpenseForm: React.FC = () => {
  const createExpenseMutation = useCreateExpense();
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const { data: financialData } = useFinancialSummary();
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const initialValues: BackendExpenseFormData = {
    amount: 0,
    description: '',
    categoryId: '',
  };

  const handleSubmit = (
    values: BackendExpenseFormData,
    { resetForm }: { resetForm: () => void }
  ) => {
    createExpenseMutation.mutate(values, {
      onSuccess: () => {
        resetForm();
        setShowExpenseForm(false);
      },
    });
  };

  const validationSchema = financialData
    ? createBackendExpenseSchemaWithBalance(financialData.currentBalance)
    : createBackendExpenseSchemaWithBalance(0);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            💸 Registrar Gasto
          </h2>
          {financialData && (
            <p className="text-sm text-gray-600 mt-1">
              Balance disponible:{' '}
              <span className="font-medium text-green-600">
                ${financialData.currentBalance.toFixed(2)}
              </span>
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowExpenseForm(!showExpenseForm)}
          className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-md hover:bg-gray-100"
          title={showExpenseForm ? 'Ocultar formulario' : 'Mostrar formulario'}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              showExpenseForm ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {showExpenseForm && (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ isSubmitting, isValid, dirty, values }) => {
            const hasEnoughBalance = financialData
              ? values.amount <= financialData.currentBalance
              : false;

            return (
              <Form>
                {/* Inputs y botón en la misma línea */}
                <div className="flex flex-col lg:flex-row gap-4 mt-2">
                  {/* Campo Monto */}
                  <div className="w-full lg:flex-1">
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Monto
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Field
                        type="number"
                        id="amount"
                        name="amount"
                        step="0.01"
                        min="0.01"
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="h-5 mt-1">
                      <ErrorMessage
                        name="amount"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>

                  {/* Campo Descripción */}
                  <div className="w-full lg:flex-1">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Descripción
                    </label>
                    <Field
                      type="text"
                      id="description"
                      name="description"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Ej: Almuerzo, Gasolina, etc. (opcional)"
                    />
                    <div className="h-5 mt-1">
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>

                  {/* Campo Categoría */}
                  <div className="w-full lg:flex-1">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Categoría
                    </label>
                    <Field
                      as="select"
                      id="categoryId"
                      name="categoryId"
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 12px center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '20px',
                      }}
                      disabled={categoriesLoading}
                    >
                      <option value="">
                        {categoriesLoading
                          ? 'Cargando categorías...'
                          : 'Selecciona una categoría'}
                      </option>
                      {categories &&
                        categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </Field>
                    <div className="h-5 mt-1">
                      <ErrorMessage
                        name="categoryId"
                        component="div"
                        className="text-sm text-red-600"
                      />
                      {categoriesError && (
                        <div className="text-sm text-red-600">
                          Error al cargar categorías
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botón de Envío - alineado con los inputs */}
                  <div className="w-full lg:flex-shrink-0 lg:w-auto lg:flex lg:items-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2 lg:hidden">
                      &nbsp;
                    </label>
                    <button
                      type="submit"
                      disabled={
                        isSubmitting || !isValid || !dirty || !hasEnoughBalance
                      }
                      className="w-full py-2 lg:w-10 lg:h-10 bg-red-600 text-white rounded-md lg:rounded-full hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                      title={
                        !hasEnoughBalance
                          ? 'Balance insuficiente'
                          : 'Registrar Gasto'
                      }
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Mensaje de error de la mutación */}
                {createExpenseMutation.error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">
                      {(createExpenseMutation.error as any)?.response?.data
                        ?.message ||
                        'Error al crear el gasto. Inténtalo de nuevo.'}
                    </p>
                  </div>
                )}

                {/* Mensaje de éxito */}
                {createExpenseMutation.isSuccess && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-600">
                      ¡Gasto registrado exitosamente!
                    </p>
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};
