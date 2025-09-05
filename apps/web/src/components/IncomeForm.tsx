import { useState } from 'react';
import {
  Formik,
  Form,
  Field,
  ErrorMessage as FormikErrorMessage,
} from 'formik';
import { useCreateIncome } from '../hooks/useIncomes';
import { ErrorMessage } from './ErrorMessage';
import {
  backendIncomeSchema,
  type BackendIncomeFormData,
} from '../validation/schemas';

export const IncomeForm: React.FC = () => {
  const createIncomeMutation = useCreateIncome();
  const [showIncomeForm, setShowIncomeForm] = useState(false);

  const initialValues: BackendIncomeFormData = {
    amount: 0,
    description: '',
  };

  const handleSubmit = (
    values: BackendIncomeFormData,
    { resetForm }: { resetForm: () => void }
  ) => {
    createIncomeMutation.mutate(values, {
      onSuccess: () => {
        resetForm();
        setShowIncomeForm(false);
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          💰 Registrar Ingreso
        </h2>
        <button
          type="button"
          onClick={() => setShowIncomeForm(!showIncomeForm)}
          className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-md hover:bg-gray-100"
          title={showIncomeForm ? 'Ocultar formulario' : 'Mostrar formulario'}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              showIncomeForm ? 'rotate-180' : ''
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

      {showIncomeForm && (
        <Formik
          initialValues={initialValues}
          validationSchema={backendIncomeSchema}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form>
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
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="h-5 mt-1">
                    <FormikErrorMessage
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Salario, Freelance, etc. (opcional)"
                  />
                  <div className="h-5 mt-1">
                    <FormikErrorMessage
                      name="description"
                      component="div"
                      className="text-sm text-red-600"
                    />
                  </div>
                </div>

                {/* Botón de Envío */}
                <div className="w-full lg:flex-shrink-0 lg:w-auto lg:flex lg:items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-2 lg:hidden">
                    &nbsp;
                  </label>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid || !dirty}
                    className="w-full py-2 lg:w-10 lg:h-10 bg-green-600 text-white rounded-md lg:rounded-full hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    title="Registrar Ingreso"
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
              <ErrorMessage
                error={createIncomeMutation.error}
                className="mt-3"
              />

              {/* Mensaje de éxito */}
              {createIncomeMutation.isSuccess && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-600">
                    ¡Ingreso registrado exitosamente!
                  </p>
                </div>
              )}
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};
