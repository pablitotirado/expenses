interface AIRecommendationButtonProps {
  tooltipText?: string;
  onClick?: () => void;
  className?: string;
}

export const AIRecommendationButton: React.FC<AIRecommendationButtonProps> = ({
  tooltipText = 'Obtener recomendaciones de la IA',
  onClick,
  className = '',
}) => {
  return (
    <button
      className={`relative group p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ${className}`}
      title={tooltipText}
      onClick={onClick}
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/e/ef/ChatGPT-Logo.svg"
        alt="IA"
        className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity duration-200"
      />
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {tooltipText}
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </button>
  );
};
