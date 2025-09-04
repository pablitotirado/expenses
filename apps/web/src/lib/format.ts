/**
 * Formatters utilities for the application
 */

/**
 * Formats a number as currency in Argentine Pesos
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount);
};
