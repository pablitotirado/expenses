import { Dashboard } from './components/Dashboard';
import { TransactionHistory } from './components/TransactionHistory';

function App() {
  return (
    <div className="min-h-screen bg-gray-200">
      <header className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            💰 Gestor Financiero Personal
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Gestiona tus ingresos, gastos y mantén el control de tus finanzas
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Dashboard />
        <div className="bg-white rounded-lg shadow-md p-4">
          <TransactionHistory />
        </div>
      </div>
    </div>
  );
}

export default App;
