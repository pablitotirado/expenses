import { useFinancialSummary } from '../hooks/useStatistics';
import { ProgressBar } from './ProgressBar';
import { IncomeForm } from './IncomeForm';
import { CategoryExpenses } from './CategoryExpenses';
import { ChartsSection } from './ChartsSection';
import { ExpenseForm } from './ExpenseForm';
import { AIAssistant } from './AIAssistant';

export const Dashboard: React.FC = () => {
  // Obtener datos financieros del backend
  const { data: financialData, isLoading, error } = useFinancialSummary();

  // Datos por defecto mientras se cargan
  const defaultData = {
    totalIncome: 0,
    totalExpenses: 0,
    currentBalance: 0,
  };

  const data = financialData || defaultData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  // Calcular porcentajes para los progress bars
  const expensesPercentage =
    data.totalIncome > 0 ? (data.totalExpenses / data.totalIncome) * 100 : 0;
  const balancePercentage =
    data.totalIncome > 0 ? (data.currentBalance / data.totalIncome) * 100 : 0;

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Resumen principal con progress bars - ocupa las 12 columnas */}
      <div className="col-span-12">
        <div className="bg-white rounded-lg shadow-md p-4">
          {/* Estado de carga */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">
                  Cargando datos financieros...
                </span>
              </div>
            </div>
          )}

          {/* Error al cargar datos */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">
                Error al cargar los datos financieros. Verifica que el backend
                esté ejecutándose.
              </p>
            </div>
          )}

          {/* Progress bars que fluyen de vertical a horizontal según el espacio */}
          {!isLoading && !error && (
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Progress bar de ingresos totales */}
              <div className="w-full lg:flex-1 min-w-0">
                <ProgressBar
                  label="Ingresos Totales"
                  value={formatCurrency(data.totalIncome)}
                  percentage={100}
                  color="green"
                  percentageText="100% - Base de referencia"
                />
              </div>

              {/* Progress bar de gastos */}
              <div className="w-full lg:flex-1 min-w-0">
                <ProgressBar
                  label="Gastos Totales"
                  value={formatCurrency(data.totalExpenses)}
                  percentage={expensesPercentage}
                  color="red"
                  percentageText={`${expensesPercentage.toFixed(1)}% del total de ingresos`}
                />
              </div>

              {/* Progress bar del saldo disponible */}
              <div className="w-full lg:flex-1 min-w-0">
                <ProgressBar
                  label="Saldo Disponible"
                  value={formatCurrency(data.currentBalance)}
                  percentage={Math.abs(balancePercentage)}
                  color={data.currentBalance >= 0 ? 'blue' : 'red'}
                  percentageText={
                    data.currentBalance >= 0
                      ? `${balancePercentage.toFixed(1)}% disponible para ahorro/gastos futuros`
                      : `${Math.abs(balancePercentage).toFixed(1)}% por encima de los ingresos`
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Asistente de IA */}
      <AIAssistant />

      {/* Gráficos - ahora usando el componente separado */}
      <div className="col-span-12">
        <ChartsSection />
      </div>

      {/* Registrar Ingreso - ocupa las 12 columnas */}
      <div className="col-span-12">
        <IncomeForm />
      </div>

      {/* Registrar Gasto - ocupa las 12 columnas */}
      <div className="col-span-12">
        <ExpenseForm />
      </div>

      {/* Gastos por categoría - ahora usando el componente separado */}
      <div className="col-span-12">
        <CategoryExpenses />
      </div>
    </div>
  );
};
