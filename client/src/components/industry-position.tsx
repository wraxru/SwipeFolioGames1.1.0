import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRightCircle } from 'lucide-react';
import { StockData } from '@/lib/stock-data';
import { getAdvancedMetricScore } from '@/lib/advanced-metric-scoring';
import ComparativeAnalysis from '@/components/comparative-analysis';

interface IndustryPositionProps {
  stock: StockData;
}

export default function IndustryPosition({ stock }: IndustryPositionProps) {
  const [showComparison, setShowComparison] = useState(false);

  // Calculate percentile rank and overall score
  const performanceScore = getAdvancedMetricScore(stock, 'performance');
  const stabilityScore = getAdvancedMetricScore(stock, 'stability');
  const valueScore = getAdvancedMetricScore(stock, 'value');
  const momentumScore = getAdvancedMetricScore(stock, 'momentum');
  
  // Overall score (simple average of the four metrics)
  const overallScore = Math.round((performanceScore + stabilityScore + valueScore + momentumScore) / 4);
  
  // Convert to percentile (simple approach for now)
  const percentile = overallScore;
  
  // Color coding based on percentile
  let statusColor = 'bg-red-500';
  let textColor = 'text-red-600';
  let borderColor = 'border-red-500';
  
  if (percentile >= 70) {
    statusColor = 'bg-green-500';
    textColor = 'text-green-600';
    borderColor = 'border-green-500';
  } else if (percentile >= 50) {
    statusColor = 'bg-yellow-500';
    textColor = 'text-yellow-600';
    borderColor = 'border-yellow-500';
  }

  // Generate a simple summary text
  let summaryText = '';
  if (percentile >= 80) {
    summaryText = `${stock.name} is a top performer in the ${stock.industry} industry.`;
  } else if (percentile >= 70) {
    summaryText = `${stock.name} outperforms most stocks in its industry.`;
  } else if (percentile >= 60) {
    summaryText = `${stock.name} performs above average in its industry.`;
  } else if (percentile >= 50) {
    summaryText = `${stock.name} shows average performance in its industry.`;
  } else if (percentile >= 40) {
    summaryText = `${stock.name} performs below average in its industry.`;
  } else if (percentile >= 30) {
    summaryText = `${stock.name} underperforms most stocks in its industry.`;
  } else {
    summaryText = `${stock.name} is among the lower performers in the ${stock.industry} industry.`;
  }
  
  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  return (
    <div className="mt-4 mb-2">
      {/* Main position indicator with left border accent */}
      <div className={`rounded-lg border ${borderColor} border-l-4 bg-white shadow-sm`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-700">Industry Position</h3>
              <p className="text-xs text-gray-500">{stock.industry}</p>
            </div>
            
            {/* Percentile circle */}
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 ${statusColor} rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                {percentile}%
              </div>
              <div className="text-xs mt-1 font-medium text-gray-600">Rank</div>
            </div>
          </div>
          
          {/* Summary text */}
          <p className="text-sm mt-2 text-gray-600">
            {summaryText}
          </p>
          
          {/* Key metrics at a glance */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            <div className="rounded-md bg-gray-50 p-2 text-center">
              <div className="text-xs text-gray-500">Performance</div>
              <div className={`text-sm font-medium ${performanceScore >= 70 ? 'text-green-600' : performanceScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {performanceScore}
              </div>
            </div>
            <div className="rounded-md bg-gray-50 p-2 text-center">
              <div className="text-xs text-gray-500">Stability</div>
              <div className={`text-sm font-medium ${stabilityScore >= 70 ? 'text-green-600' : stabilityScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {stabilityScore}
              </div>
            </div>
            <div className="rounded-md bg-gray-50 p-2 text-center">
              <div className="text-xs text-gray-500">Value</div>
              <div className={`text-sm font-medium ${valueScore >= 70 ? 'text-green-600' : valueScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {valueScore}
              </div>
            </div>
            <div className="rounded-md bg-gray-50 p-2 text-center">
              <div className="text-xs text-gray-500">Momentum</div>
              <div className={`text-sm font-medium ${momentumScore >= 70 ? 'text-green-600' : momentumScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {momentumScore}
              </div>
            </div>
          </div>
          
          {/* Compare Button - Prominent and attention-grabbing */}
          <button 
            onClick={toggleComparison}
            className={`mt-4 w-full py-3 px-4 rounded-lg flex items-center justify-center font-medium transition-all duration-200 ${
              showComparison 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {showComparison ? (
              <>
                <ChevronUp className="w-5 h-5 mr-2" />
                Hide Industry Comparison
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5 mr-2" />
                See How It Compares
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Expanded comparison view */}
      {showComparison && (
        <div className="mt-2 transition-all duration-300 ease-in-out">
          <ComparativeAnalysis 
            currentStock={stock} 
            industry={stock.industry} 
          />
        </div>
      )}
    </div>
  );
}