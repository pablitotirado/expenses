export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Helper para verificar si un error es de tipo ApiError
export const isApiError = (error: any): error is ApiError => {
  return (
    error &&
    typeof error.status === 'number' &&
    typeof error.message === 'string'
  );
};

// Helper para obtener el mensaje de error de manera segura
export const getErrorMessage = (error: any): string => {
  if (isApiError(error)) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'Ha ocurrido un error inesperado';
};

// Helper para verificar si es un error 404
export const isNotFoundError = (error: any): boolean => {
  return isApiError(error) && error.status === 404;
};

// Helper para verificar si es un error de validación (400)
export const isValidationError = (error: any): boolean => {
  return isApiError(error) && error.status === 400;
};

// Helper para verificar si es un error de conflicto (409)
export const isConflictError = (error: any): boolean => {
  return isApiError(error) && error.status === 409;
};
