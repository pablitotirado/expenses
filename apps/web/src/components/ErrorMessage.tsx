import React from 'react';
import {
  getErrorMessage,
  isNotFoundError,
  isValidationError,
  isConflictError,
} from '../types/api';

interface ErrorMessageProps {
  error: any;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  className = '',
}) => {
  if (!error) return null;

  const message = getErrorMessage(error);
  const isNotFound = isNotFoundError(error);
  const isValidation = isValidationError(error);
  const isConflict = isConflictError(error);

  const getContainerClasses = () => {
    const baseClasses = 'p-3 border rounded-md';

    if (isNotFound) {
      return `${baseClasses} bg-yellow-50 border-yellow-200`;
    }

    if (isValidation) {
      return `${baseClasses} bg-orange-50 border-orange-200`;
    }

    if (isConflict) {
      return `${baseClasses} bg-yellow-50 border-yellow-200`;
    }

    return `${baseClasses} bg-red-50 border-red-200`;
  };

  const getTextClasses = () => {
    if (isNotFound) {
      return 'text-yellow-700';
    }

    if (isValidation) {
      return 'text-orange-700';
    }

    if (isConflict) {
      return 'text-yellow-700';
    }

    return 'text-red-600';
  };

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      <p className={`text-sm ${getTextClasses()}`}>{message}</p>
    </div>
  );
};
