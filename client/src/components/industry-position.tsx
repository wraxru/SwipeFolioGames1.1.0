import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { StockData } from '@/lib/stock-data';
import { getAdvancedMetricScore } from '@/lib/advanced-metric-scoring';
import VerticalStockComparison from '@/components/comparative-analysis/vertical-comparison';

interface IndustryPositionProps {
  stock: StockData;
}

export default function IndustryPosition({ stock }: IndustryPositionProps) {
  // Simple boolean state
  const [isOpen, setIsOpen] = useState(false);

  // Calculate scores
  const performanceScore = getAdvancedMetricScore(stock, 'performance');
  const stabilityScore = getAdvancedMetricScore(stock, 'stability');
  const valueScore = getAdvancedMetricScore(stock, 'value');
  const momentumScore = getAdvancedMetricScore(stock, 'momentum');

  // Overall score (simple average of the four metrics)
  const overallScore = Math.round((performanceScore + stabilityScore + valueScore + momentumScore) / 4);
  const percentile = overallScore;

  // Color coding
  let statusColor = percentile >= 70 ? 'bg-green-500' : percentile >= 50 ? 'bg-yellow-500' : 'bg-red-500';
  let borderColor = percentile >= 70 ? 'border-green-500' : percentile >= 50 ? 'border-yellow-500' : 'border-red-500';

  // Summary text
  let summaryText = '';
  if (percentile >= 70) {
    summaryText = `${stock.name} outperforms most stocks in its industry.`;
  } else if (percentile >= 50) {
    summaryText = `${stock.name} shows average performance in its industry.`;
  } else {
    summaryText = `${stock.name} underperforms most stocks in its industry.`;
  }

  // Toggle function with console logs
  const toggleOpen = () => {
    console.log(`Toggle clicked. Current state: ${isOpen}`);
    setIsOpen(!isOpen);
    console.log(`New state will be: ${!isOpen}`);
  };

  return (
    <div className="mt-4 mb-2">
      {/* Main card */}
      <div className={`rounded-lg border ${borderColor} border-l-4 bg-white shadow-sm`}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800">Industry Position</h3>
              <p className="text-sm font-medium text-gray-600">{stock.industry}</p>
            </div>

            {/* Percentile circle */}
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 ${statusColor} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md`}>
                {percentile}%
              </div>
              <div className="text-sm mt-1 font-medium text-gray-700">Rank</div>
            </div>
          </div>

          {/* Summary */}
          <p className="text-base mt-3 text-gray-700 font-medium">
            {summaryText}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="rounded-md bg-gray-50 p-3 text-center shadow-sm">
              <div className="text-sm text-gray-600 font-medium mb-1">Performance</div>
              <div className={`text-lg font-bold ${performanceScore >= 70 ? 'text-green-600' : performanceScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {performanceScore}
              </div>
            </div>
            <div className="rounded-md bg-gray-50 p-3 text-center shadow-sm">
              <div className="text-sm text-gray-600 font-medium mb-1">Stability</div>
              <div className={`text-lg font-bold ${stabilityScore >= 70 ? 'text-green-600' : stabilityScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {stabilityScore}
              </div>
            </div>
            <div className="rounded-md bg-gray-50 p-3 text-center shadow-sm">
              <div className="text-sm text-gray-600 font-medium mb-1">Value</div>
              <div className={`text-lg font-bold ${valueScore >= 70 ? 'text-green-600' : valueScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {valueScore}
              </div>
            </div>
            <div className="rounded-md bg-gray-50 p-3 text-center shadow-sm">
              <div className="text-sm text-gray-600 font-medium mb-1">Momentum</div>
              <div className={`text-lg font-bold ${momentumScore >= 70 ? 'text-green-600' : momentumScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {momentumScore}
              </div>
            </div>
          </div>

          {/* Single toggle button */}
          <button 
            onClick={toggleOpen}
            className={`mt-5 w-full py-3 px-4 rounded-lg flex items-center justify-center font-medium text-base transition-all duration-200 ${
              isOpen 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
            }`}
          >
            {isOpen ? (
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

      {/* Debug indicator */}
      <div className="p-2 bg-blue-100 rounded mt-2 mb-2 text-xs">
        Toggle state: {isOpen ? 'OPEN' : 'CLOSED'}
      </div>

      {/* Simple conditional rendering */}
      {isOpen && (
        <div className="mt-2 border rounded-lg">
          <VerticalStockComparison 
            currentStock={stock} 
            industry={stock.industry} 
          />
        </div>
      )}
    </div>
  );
}