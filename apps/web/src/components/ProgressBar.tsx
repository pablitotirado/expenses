interface ProgressBarProps {
  label: string;
  value: string | number;
  percentage: number;
  color: 'blue' | 'red' | 'green';
  showPercentage?: boolean;
  percentageText?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  percentage,
  color,
  showPercentage = true,
  percentageText,
  className = '',
}) => {
  const getColorClasses = (color: 'blue' | 'red' | 'green') => {
    switch (color) {
      case 'blue':
        return 'bg-blue-600';
      case 'red':
        return 'bg-red-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-blue-600';
    }
  };

  const getValueColorClasses = (color: 'blue' | 'red' | 'green') => {
    switch (color) {
      case 'blue':
        return 'text-blue-600';
      case 'red':
        return 'text-red-600';
      case 'green':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-bold ${getValueColorClasses(color)}`}>
          {value}
        </span>
      </div>
      <div className="w-full mx-auto bg-gray-200 rounded-full h-2">
        <div
          className={`${getColorClasses(color)} h-2 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      {showPercentage && (
        <p className="text-xs text-gray-500 mt-1 text-left">
          {percentageText || `${percentage.toFixed(1)}%`}
        </p>
      )}
    </div>
  );
};
