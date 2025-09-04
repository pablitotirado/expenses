interface CategoryProgressBarProps {
  category: string;
  amount: number;
  percentage: number;
  className?: string;
}

export const CategoryProgressBar: React.FC<CategoryProgressBarProps> = ({
  category,
  amount,
  percentage,
  className = '',
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  return (
    <div className={`p-3 bg-gray-50 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-700">{category}</span>
        <span className="text-sm font-bold text-red-600">
          {formatCurrency(amount)}
        </span>
      </div>
      <div className="w-3/4 mx-auto bg-gray-200 rounded-full h-1.5 mb-1">
        <div
          className="bg-red-500 h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 text-center">
        {percentage.toFixed(1)}% del total de gastos
      </p>
    </div>
  );
};
