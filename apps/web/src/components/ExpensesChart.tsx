import { useMemo } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  type TooltipItem,
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

export const ExpensesChart: React.FC = () => {
  const { data: expenses, isLoading, error } = useExpenses();

  // Calcular gastos por categoría usando useMemo
  const chartData = useMemo(() => {
    const expensesByCategory: Record<string, number> = {};

    expenses?.forEach(expense => {
      const categoryName = expense.category.name;
      expensesByCategory[categoryName] =
        (expensesByCategory[categoryName] || 0) + expense.amount;
    });

    const categories = Object.keys(expensesByCategory);
    const amounts = Object.values(expensesByCategory);

    // Colores para las categorías
    const colors = [
      '#3B82F6', // blue-500
      '#EF4444', // red-500
      '#10B981', // emerald-500
      '#F59E0B', // amber-500
      '#8B5CF6', // violet-500
      '#EC4899', // pink-500
      '#06B6D4', // cyan-500
      '#84CC16', // lime-500
    ];

    return {
      labels: categories,
      datasets: [
        {
          data: amounts,
          backgroundColor: colors.slice(0, categories.length),
          borderColor: colors
            .slice(0, categories.length)
            .map(color => color + '80'),
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    };
  }, [expenses]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center text-gray-500">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm">Cargando datos del gráfico...</p>
        </div>
      </div>
    );
  }

  // Error al cargar datos
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-center text-red-600">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="text-sm">Error al cargar los datos</p>
          <p className="text-xs">Verifica la conexión con el backend</p>
        </div>
      </div>
    );
  }

  // Si no hay gastos, mostrar mensaje
  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm">No hay gastos registrados aún</p>
          <p className="text-xs">
            Los gráficos aparecerán cuando agregues gastos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};
