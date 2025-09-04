import { ExpensesChart } from './ExpensesChart';
import { IncomeVsExpensesChart } from './IncomeVsExpensesChart';

export const ChartsSection: React.FC = () => {
  return (
    <div className="col-span-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ingresos vs Gastos */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3">
            💰 Ingresos vs Gastos
          </h3>
          <IncomeVsExpensesChart />
        </div>

        {/* Gráfico de Gastos por Categoría */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-md font-semibold text-gray-800 mb-3">
            🎯 Distribución de Gastos por Categoría
          </h3>
          <ExpensesChart />
        </div>
      </div>
    </div>
  );
};
