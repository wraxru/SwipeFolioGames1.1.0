import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import VerticalStockComparison from './vertical-comparison-new';
import { StockData } from '../../lib/stock-data';

interface IndustryPositionProps {
  currentStock: StockData;
  industry: string;
  scores: {
    Performance: number;
    Stability: number;
    Value: number;
    Momentum: number;
  };
  rank: number; // Percentile rank (0-100)
}

const IndustryPosition: React.FC<IndustryPositionProps> = ({
  currentStock,
  industry,
  scores,
  rank
}) => {
  const [showComparison, setShowComparison] = useState(false);

  // Generate a performance statement based on rank
  const getPerformanceStatement = () => {
    if (rank >= 80) return `${currentStock.name} is among the top performers in its industry.`;
    if (rank >= 60) return `${currentStock.name} outperforms most stocks in its industry.`;
    if (rank >= 40) return `${currentStock.name} performs about average for its industry.`;
    if (rank >= 20) return `${currentStock.name} underperforms compared to its industry.`;
    return `${currentStock.name} is among the weakest performers in its industry.`;
  };

  // Get color for metric based on value
  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-emerald-600';
    if (value >= 60) return 'text-green-600';
    if (value >= 40) return 'text-amber-600';
    if (value < 40) return 'text-red-600';
    return 'text-gray-700';
  };

  // Toggle comparison view
  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  return (
    <div className="mt-6">
      {/* Industry Position Card */}
      <div className="border rounded-lg overflow-hidden">
        <div className="p-4 relative border-b border-gray-100">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Industry Position</h3>
              <p className="text-sm text-gray-600">{industry}</p>
            </div>
            
            {/* Rank Circle */}
            <div className="flex flex-col items-center">
              <div className="rounded-full h-16 w-16 flex items-center justify-center text-white font-bold text-xl" 
                   style={{ 
                     backgroundColor: `hsl(${Math.min(120, rank * 1.2)}, 70%, 60%)` 
                   }}>
                {rank}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Rank</div>
            </div>
          </div>
          
          <p className="text-gray-700 mt-2">{getPerformanceStatement()}</p>
          
          {/* Metric Scores */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-500 mb-1">Performance</p>
              <p className={`font-semibold ${getMetricColor(scores.Performance)}`}>
                {scores.Performance}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-500 mb-1">Stability</p>
              <p className={`font-semibold ${getMetricColor(scores.Stability)}`}>
                {scores.Stability}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-500 mb-1">Value</p>
              <p className={`font-semibold ${getMetricColor(scores.Value)}`}>
                {scores.Value}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-500 mb-1">Momentum</p>
              <p className={`font-semibold ${getMetricColor(scores.Momentum)}`}>
                {scores.Momentum}
              </p>
            </div>
          </div>
          
          {/* Compare Button */}
          <button 
            className="w-full mt-4 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center transition-colors duration-200"
            onClick={toggleComparison}
          >
            <span className="mr-1">{showComparison ? 'Hide Comparison' : 'See How It Compares'}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showComparison ? 'transform rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Comparison Section (toggled) */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showComparison ? 'max-h-[2000px]' : 'max-h-0'}`}>
          <div className="p-4">
            <VerticalStockComparison 
              currentStock={currentStock}
              industry={industry}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryPosition;