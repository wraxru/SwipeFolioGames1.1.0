import React from 'react';
import { X, Trophy } from 'lucide-react';
import { StockData } from '../../lib/stock-data';
import { getAdvancedMetricScore } from '../../lib/advanced-metric-scoring';

interface MetricRankingPopupProps {
  isOpen: boolean;
  onClose: () => void;
  metricName: string;
  currentStock: StockData;
  industryStocks: StockData[];
}

/**
 * A popup component that shows the top companies for a specific metric
 * with the current stock highlighted and its position in the ranking.
 */
const MetricRankingPopup: React.FC<MetricRankingPopupProps> = ({ 
  isOpen, 
  onClose, 
  metricName, 
  currentStock,
  industryStocks
}) => {
  if (!isOpen) return null;
  
  // Convert metric name to the format expected by the scoring function
  const metricKey = metricName.toLowerCase() as 'performance' | 'stability' | 'value' | 'momentum';
  
  // Filter out current stock from industry stocks to avoid duplication
  const filteredIndustryStocks = industryStocks.filter(
    stock => stock.ticker !== currentStock.ticker
  );
  
  // Calculate scores for all stocks including the current one
  const stockScores = [...filteredIndustryStocks, currentStock].map(stock => {
    // Get score for this metric
    const score = getAdvancedMetricScore(stock, metricKey);
    
    return {
      ticker: stock.ticker,
      name: stock.name,
      score,
      isCurrentStock: stock.ticker === currentStock.ticker
    };
  });
  
  // Sort by score in descending order
  const sortedStocks = [...stockScores].sort((a, b) => b.score - a.score);
  
  // Limit to top 10 for display
  const topTenStocks = sortedStocks.slice(0, 10);
  
  // Find the rank of the current stock
  const currentStockRank = sortedStocks.findIndex(stock => stock.ticker === currentStock.ticker) + 1;
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-green-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };
  
  // Get medal for top 3 positions
  const getMedalStyles = (position: number) => {
    switch(position) {
      case 0: // Gold - 1st place
        return {
          background: 'bg-gradient-to-br from-yellow-300 to-yellow-600',
          shadow: 'shadow-yellow-200',
          border: 'border-yellow-400',
          text: 'text-yellow-900'
        };
      case 1: // Silver - 2nd place
        return {
          background: 'bg-gradient-to-br from-gray-300 to-gray-400',
          shadow: 'shadow-gray-200',
          border: 'border-gray-300',
          text: 'text-gray-800'
        };
      case 2: // Bronze - 3rd place
        return {
          background: 'bg-gradient-to-br from-amber-300 to-amber-600',
          shadow: 'shadow-amber-200',
          border: 'border-amber-400',
          text: 'text-amber-900'
        };
      default:
        return {
          background: 'bg-gray-100',
          shadow: '',
          border: 'border-gray-200',
          text: 'text-gray-700'
        };
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="font-bold text-lg text-gray-800">
            Top Companies by {metricName}
          </h3>
          <button 
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-200 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        
        {/* Current stock position */}
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <p className="text-sm text-gray-700">
            <span className="font-bold text-blue-700">{currentStock.name}</span> ranks <span className="font-bold text-blue-700">{getOrdinalSuffix(currentStockRank)}</span> out of {sortedStocks.length} companies in {metricName.toLowerCase()}.
          </p>
        </div>
        
        {/* Companies list */}
        <div className="overflow-y-auto flex-1">
          <div className="divide-y divide-gray-100">
            {topTenStocks.map((stock, index) => {
              const medalStyles = getMedalStyles(index);
              
              return (
                <div 
                  key={stock.ticker} 
                  className={`p-4 flex items-center ${stock.isCurrentStock ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  {/* Medal for top 3, number for others */}
                  {index < 3 ? (
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 ${medalStyles.background} ${medalStyles.shadow} border ${medalStyles.border}`}>
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold text-sm bg-gray-100 text-gray-700`}>
                      {index + 1}
                    </div>
                  )}
                  
                  {/* Company info */}
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 flex items-center">
                      {stock.name}
                      {stock.isCurrentStock && (
                        <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Current</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{stock.ticker}</div>
                  </div>
                  
                  {/* Score */}
                  <div className={`font-bold text-lg ${getScoreColor(stock.score)}`}>
                    {stock.score}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Scores are calculated based on multiple factors and range from 0-100.
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  
  let suffix = 'th';
  if (j === 1 && k !== 11) suffix = 'st';
  if (j === 2 && k !== 12) suffix = 'nd';
  if (j === 3 && k !== 13) suffix = 'rd';
  
  return num + suffix;
}

export default MetricRankingPopup;