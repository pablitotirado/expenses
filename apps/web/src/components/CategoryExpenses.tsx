import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useCreateCategory, useCategories } from '../hooks/useCategories';
import {
  backendCategorySchema,
  type BackendCategoryFormData,
} from '../validation/schemas';
import type { CategoryWithCount } from '../types/category';

export const CategoryExpenses: React.FC = () => {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const createCategoryMutation = useCreateCategory();
  const { data: categories, isLoading, error } = useCategories();

  const categoryInitialValues: BackendCategoryFormData = {
    name: '',
  };

  const handleCategorySubmit = (
    values: BackendCategoryFormData,
    { resetForm }: { resetForm: () => void }
  ) => {
    createCategoryMutation.mutate(values, {
      onSuccess: () => {
        resetForm();
        setShowCategoryForm(false);
      },
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            🏷️ Gestionar Categorías de Gastos
          </h3>
          <button
            type="button"
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-md hover:bg-gray-100"
            title={
              showCategoryForm ? 'Ocultar formulario' : 'Mostrar formulario'
            }
          >
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                showCategoryForm ? 'rotate-180' : ''
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

        {/* Lista de categorías existentes */}
        {categories && categories.length > 0 && (
          <div className="mt-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">
              Categorías existentes:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {categories.map((category: CategoryWithCount) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <span className="text-sm text-gray-700">{category.name}</span>
                  <span className="text-xs text-gray-500">
                    {category._count.expenses} gastos
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado de carga */}
        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center px-4 py-2 text-sm text-gray-600">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-2"></div>
              Cargando categorías...
            </div>
          </div>
        )}

        {/* Error al cargar categorías */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">
              Error al cargar las categorías. Verifica que el backend esté
              ejecutándose.
            </p>
          </div>
        )}

        {/* Formulario para crear categoría */}
        {showCategoryForm && (
          <Formik
            initialValues={categoryInitialValues}
            validationSchema={backendCategorySchema}
            onSubmit={handleCategorySubmit}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form>
                <div className="flex flex-col lg:flex-row gap-4 mt-4">
                  {/* Campo Nombre */}
                  <div className="w-full lg:flex-1">
                    <label
                      htmlFor="categoryName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nombre de la Categoría
                    </label>
                    <Field
                      type="text"
                      id="categoryName"
                      name="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: Entretenimiento"
                    />
                    <div className="h-5 mt-1">
                      <ErrorMessage
                        name="name"
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
                      className="w-full py-2 lg:w-10 lg:h-10 bg-blue-600 text-white rounded-md lg:rounded-full hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                      title="Crear Categoría"
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Mensaje de error de la mutación */}
                {createCategoryMutation.error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">
                      {(createCategoryMutation.error as any)?.response?.data
                        ?.message ||
                        'Error al crear la categoría. Inténtalo de nuevo.'}
                    </p>
                  </div>
                )}

                {/* Mensaje de éxito */}
                {createCategoryMutation.isSuccess && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-600">
                      ¡Categoría creada exitosamente!
                    </p>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        )}
      </div>
    </>
  );
};
