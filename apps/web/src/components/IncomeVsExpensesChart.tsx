import { useMemo } from 'react';
import { useFinancialSummary } from '../hooks/useStatistics';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type TooltipItem,
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const IncomeVsExpensesChart: React.FC = () => {
  const { data: financialData, isLoading, error } = useFinancialSummary();

  // Calcular datos del gráfico usando useMemo
  const chartData = useMemo(() => {
    const totalIncome = financialData?.totalIncome || 0;
    const totalExpenses = financialData?.totalExpenses || 0;
    const currentBalance = financialData?.currentBalance || 0;

    return {
      labels: ['Ingresos', 'Gastos', 'Saldo'],
      datasets: [
        {
          label: 'Monto ($)',
          data: [totalIncome, totalExpenses, currentBalance],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)', // green-500
            'rgba(239, 68, 68, 0.8)', // red-500
            'rgba(59, 130, 246, 0.8)', // blue-500
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)', // green-500
            'rgba(239, 68, 68, 1)', // red-500
            'rgba(59, 130, 246, 1)', // blue-500
          ],
          borderWidth: 2,
          borderRadius: 4,
        },
      ],
    };
  }, [financialData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            const value = context.parsed.y;
            return `$${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: string | number) => `$${value}`,
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

  // Si no hay datos, mostrar mensaje
  if (
    !financialData ||
    (financialData.totalIncome === 0 && financialData.totalExpenses === 0)
  ) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">📈</div>
          <p className="text-sm">No hay datos financieros aún</p>
          <p className="text-xs">
            Los gráficos aparecerán cuando agregues ingresos o gastos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};
