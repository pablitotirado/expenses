import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useDeleteIncome } from '../hooks/useIncomes';
import { useDeleteExpense } from '../hooks/useExpenses';
import type { TransactionFilters } from '../types/transaction';
import { formatCurrency } from '../lib/format';

export const TransactionHistory: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const deleteIncomeMutation = useDeleteIncome();
  const deleteExpenseMutation = useDeleteExpense();

  const filters: TransactionFilters = {
    type: filter,
  };

  const { transactions, isLoading, error } = useTransactions(filters);

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(dateObj);
  };

  const handleDelete = (id: string, type: 'income' | 'expense') => {
    if (confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      if (type === 'income') {
        deleteIncomeMutation.mutate(id);
      } else {
        deleteExpenseMutation.mutate(id);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'income'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Ingresos
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Gastos
          </button>
        </div>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div className="text-center text-gray-500 py-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Cargando transacciones...</span>
          </div>
        </div>
      )}

      {/* Error al cargar datos */}
      {error && (
        <div className="text-center text-red-500 py-8">
          <div className="text-4xl mb-2">⚠️</div>
          <p>Error al cargar las transacciones</p>
          <p className="text-sm">Verifica la conexión con el backend</p>
        </div>
      )}

      {/* Lista de transacciones */}
      {!isLoading && !error && transactions.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No hay transacciones para mostrar
        </div>
      )}

      {!isLoading && !error && transactions.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map(transaction => (
            <div
              key={transaction.id}
              className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                transaction.type === 'income'
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`text-2xl ${
                    transaction.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '💰' : '💸'}
                </div>

                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.description}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{formatDate(transaction.date)}</span>
                    {transaction.type === 'expense' && transaction.category && (
                      <>
                        <span>•</span>
                        <span className="px-2 py-1 bg-gray-200 rounded-full">
                          {transaction.category.name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`font-bold text-lg ${
                    transaction.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>

                <button
                  onClick={() => handleDelete(transaction.id, transaction.type)}
                  disabled={
                    (transaction.type === 'income' &&
                      deleteIncomeMutation.isPending) ||
                    (transaction.type === 'expense' &&
                      deleteExpenseMutation.isPending)
                  }
                  className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Eliminar transacción"
                >
                  {(transaction.type === 'income' &&
                    deleteIncomeMutation.isPending) ||
                  (transaction.type === 'expense' &&
                    deleteExpenseMutation.isPending) ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    '🗑️'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
