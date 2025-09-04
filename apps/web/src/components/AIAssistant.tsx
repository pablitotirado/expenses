import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AIRecommendationButton } from './AIRecommendationButton';
import { aiService } from '../services/aiService';
import { MarkdownRenderer } from './MarkdownRenderer';

export const AIAssistant: React.FC = () => {
  const [userGoal, setUserGoal] = useState('');
  const [showGoalSection, setShowGoalSection] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');

  const aiMutation = useMutation({
    mutationFn: async (request: { period: string; userGoal?: string }) => {
      return await aiService.getFinancialAnalysis(request);
    },
  });

  const periodOptions = [
    { value: 'current_month', label: 'Este mes' },
    { value: 'last_month', label: 'Mes pasado' },
    { value: 'last_3_months', label: 'Últimos 3 meses' },
  ];

  const handleAskAI = () => {
    aiMutation.mutate({
      period: selectedPeriod,
      userGoal: userGoal || undefined,
    });
  };

  const handleToggleGoalSection = () => {
    setShowGoalSection(!showGoalSection);
    if (showGoalSection) {
      setUserGoal('');
    }
  };

  return (
    <div className="col-span-12">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            🤖 Asistente de IA
          </h3>
          <AIRecommendationButton
            tooltipText="Obtener recomendaciones de la IA sobre mis finanzas"
            onClick={handleAskAI}
            className="scale-125"
          />
        </div>

        {/* Sección de metas opcional */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleToggleGoalSection}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center gap-2"
            >
              <span>{showGoalSection ? '−' : '+'}</span>
              {showGoalSection ? 'Ocultar' : 'Agregar'} meta personalizada
            </button>

            {/* Pills de período */}
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                {periodOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedPeriod(option.value)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                      selectedPeriod === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Icono de información */}
              <div className="relative group">
                <svg
                  className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Selecciona el período de tiempo para el análisis de la IA
                  <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </div>

          {showGoalSection && (
            <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué aspecto te gustaría mejorar o qué meta quieres cumplir?
              </label>
              <textarea
                value={userGoal}
                onChange={e => setUserGoal(e.target.value)}
                placeholder="Ejemplo: Quiero ahorrar $5000 para un viaje, reducir gastos en comida, mejorar mi presupuesto mensual..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-2">
                Esta información ayudará a la IA a darte recomendaciones más
                personalizadas
              </p>
            </div>
          )}
        </div>

        {/* Área de respuesta */}
        <div className="min-h-[120px] bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
          {aiMutation.isPending ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">
                  Analizando tus datos financieros...
                </p>
              </div>
            </div>
          ) : aiMutation.isSuccess && aiMutation.data ? (
            <div className="text-gray-700">
              <MarkdownRenderer content={aiMutation.data.analysis} />
            </div>
          ) : aiMutation.isError ? (
            <div className="text-center text-red-600">
              <div className="text-4xl mb-2">❌</div>
              <p className="text-sm">Error al obtener el análisis de la IA</p>
              <p className="text-xs mt-1">Por favor, intenta nuevamente</p>
              {aiMutation.error && (
                <details className="mt-2 text-xs text-gray-500">
                  <summary className="cursor-pointer">
                    Ver detalles del error
                  </summary>
                  <pre className="mt-1 text-left bg-gray-100 p-2 rounded">
                    {JSON.stringify(aiMutation.error, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">🤖</div>
                <p className="text-sm">
                  Haz clic en el botón de IA para obtener recomendaciones
                </p>
                <p className="text-xs mt-1">
                  sobre tus patrones de gastos e ingresos
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
