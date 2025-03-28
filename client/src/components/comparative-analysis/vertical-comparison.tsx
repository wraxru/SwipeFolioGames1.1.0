import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';
import { StockData } from '@/lib/stock-data';

// Type for industry benchmark data
interface BenchmarkData {
  ratings: {
    Performance: number;
    Stability: number;
    Value: number;
    Momentum: number;
    Dividend: number;
  };
}

// Type for comparison stock
interface ComparisonStockData {
  symbol: string;
  name: string;
  type: string;
  color: string;
  ratings: {
    Performance: number;
    Stability: number;
    Value: number;
    Momentum: number;
    Dividend: number;
  };
}

interface VerticalStockComparisonProps {
  currentStock: StockData;
}

// Function to convert text ratings to numeric scores for visualization
function convertRatingToNumber(rating: string | number): number {
  if (typeof rating === 'number') return rating;
  
  switch (rating.toLowerCase()) {
    case 'strong':
    case 'excellent':
    case 'high':
      return 85;
    case 'good':
      return 75;
    case 'fair':
    case 'average':
    case 'medium':
      return 60;
    case 'weak':
    case 'unstable':
    case 'low':
      return 40;
    case 'poor':
    case 'very unstable':
    case 'very low':
      return 25;
    default:
      // Try to parse as a number if it's already a number string
      const parsed = parseInt(rating, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
      // Default fallback
      return 50;
  }
}

// Hardcoded comparison stocks by industry
const comparisonStocksByIndustry: Record<string, Record<string, ComparisonStockData>> = {
  'Real Estate': {
    'O': {
      symbol: 'O',
      name: 'Realty Income',
      type: 'Anchor Stock',
      color: '#5856D6', // Purple
      ratings: {
        Performance: 60,
        Stability: 85,
        Value: 70,
        Momentum: 55,
        Dividend: 85
      }
    },
    'SPG': {
      symbol: 'SPG',
      name: 'Simon Property Group',
      type: 'Anchor Stock',
      color: '#5856D6',
      ratings: {
        Performance: 65,
        Stability: 70,
        Value: 75,
        Momentum: 65,
        Dividend: 80
      }
    },
    'AVB': {
      symbol: 'AVB',
      name: 'AvalonBay Communities',
      type: 'Anchor Stock',
      color: '#5856D6',
      ratings: {
        Performance: 55,
        Stability: 80,
        Value: 65,
        Momentum: 50,
        Dividend: 65
      }
    }
  },
  'Technology': {
    'MSFT': {
      symbol: 'MSFT',
      name: 'Microsoft',
      type: 'Anchor Stock',
      color: '#5856D6',
      ratings: {
        Performance: 90,
        Stability: 85,
        Value: 65,
        Momentum: 80,
        Dividend: 35
      }
    },
    'AAPL': {
      symbol: 'AAPL',
      name: 'Apple',
      type: 'Anchor Stock',
      color: '#5856D6',
      ratings: {
        Performance: 85,
        Stability: 90,
        Value: 60,
        Momentum: 75,
        Dividend: 25
      }
    },
    'GOOGL': {
      symbol: 'GOOGL',
      name: 'Alphabet',
      type: 'Anchor Stock',
      color: '#5856D6',
      ratings: {
        Performance: 80,
        Stability: 75,
        Value: 70,
        Momentum: 70,
        Dividend: 0
      }
    }
  },
  'Healthcare': {
    'JNJ': {
      symbol: 'JNJ',
      name: 'Johnson & Johnson',
      type: 'Anchor Stock',
      color: '#5856D6',
      ratings: {
        Performance: 70,
        Stability: 90,
        Value: 75,
        Momentum: 60,
        Dividend: 65
      }
    },
    'PFE': {
      symbol: 'PFE',
      name: 'Pfizer',
      type: 'Anchor Stock',
      color: '#5856D6',
      ratings: {
        Performance: 60,
        Stability: 75,
        Value: 80,
        Momentum: 50,
        Dividend: 70
      }
    },
    'UNH': {
      symbol: 'UNH',
      name: 'UnitedHealth',
      type: 'Anchor Stock',
      color: '#5856D6',
      ratings: {
        Performance: 75,
        Stability: 80,
        Value: 65,
        Momentum: 70,
        Dividend: 40
      }
    }
  },
  'Other': {
    'ABC': {
      symbol: 'ABC',
      name: 'Company ABC',
      type: 'Anchor Stock',
      color: '#5856D6',
      ratings: {
        Performance: 65,
        Stability: 70,
        Value: 75,
        Momentum: 65,
        Dividend: 55
      }
    },
    'DEF': {
      symbol: 'DEF',
      name: 'Company DEF',
      type: 'Anchor Stock',
      color: '#5856D6',
      ratings: {
        Performance: 60,
        Stability: 65,
        Value: 70,
        Momentum: 60,
        Dividend: 50
      }
    }
  }
};

// Industry and market benchmarks by industry
const benchmarksByIndustry: Record<string, {Industry: BenchmarkData, Market: BenchmarkData}> = {
  'Real Estate': {
    Industry: {
      ratings: {
        Performance: 55,
        Stability: 75,
        Value: 65,
        Momentum: 50,
        Dividend: 70
      }
    },
    Market: {
      ratings: {
        Performance: 60,
        Stability: 65,
        Value: 60,
        Momentum: 60,
        Dividend: 40
      }
    }
  },
  'Technology': {
    Industry: {
      ratings: {
        Performance: 75,
        Stability: 70,
        Value: 60,
        Momentum: 70,
        Dividend: 15
      }
    },
    Market: {
      ratings: {
        Performance: 60,
        Stability: 65,
        Value: 60,
        Momentum: 60,
        Dividend: 40
      }
    }
  },
  'Healthcare': {
    Industry: {
      ratings: {
        Performance: 65,
        Stability: 80,
        Value: 70,
        Momentum: 55,
        Dividend: 60
      }
    },
    Market: {
      ratings: {
        Performance: 60,
        Stability: 65,
        Value: 60,
        Momentum: 60,
        Dividend: 40
      }
    }
  },
  'Other': {
    Industry: {
      ratings: {
        Performance: 60,
        Stability: 65,
        Value: 65,
        Momentum: 60,
        Dividend: 50
      }
    },
    Market: {
      ratings: {
        Performance: 60,
        Stability: 65,
        Value: 60,
        Momentum: 60,
        Dividend: 40
      }
    }
  }
};

export default function VerticalStockComparison({ currentStock }: VerticalStockComparisonProps) {
  // Set default industry based on currentStock
  const industry = currentStock.industry || 'Other';
  
  // Get comparison stocks for this industry
  const competitorsForIndustry = comparisonStocksByIndustry[industry] || comparisonStocksByIndustry['Other'];
  
  // Set first competitor that's not the current stock as default
  const defaultCompetitor = Object.keys(competitorsForIndustry).find(
    ticker => ticker !== currentStock.ticker
  ) || Object.keys(competitorsForIndustry)[0];
  
  const [showFullComparison, setShowFullComparison] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState(defaultCompetitor);
  
  // Create a ComparisonStockData object from the current stock
  const mainStockData: ComparisonStockData = {
    symbol: currentStock.ticker,
    name: currentStock.name,
    type: 'Anchor Stock',
    color: '#4CD964', // iOS Green
    ratings: {
      Performance: convertRatingToNumber(currentStock.metrics.performance.value),
      Stability: convertRatingToNumber(currentStock.metrics.stability.value),
      Value: convertRatingToNumber(currentStock.metrics.value.value),
      Momentum: convertRatingToNumber(currentStock.metrics.momentum.value),
      Dividend: typeof currentStock.metrics.value.details.dividendYield === 'number' 
        ? currentStock.metrics.value.details.dividendYield * 20 // Scale up for visualization
        : convertRatingToNumber(currentStock.metrics.value.details.dividendYield as string)
    }
  };
  
  // Get the selected competitor
  const competitor = competitorsForIndustry[selectedCompetitor];
  
  // Get benchmarks for this industry
  const benchmarks = benchmarksByIndustry[industry] || benchmarksByIndustry['Other'];
  
  // Toggle full comparison
  const toggleFullComparison = () => {
    setShowFullComparison(!showFullComparison);
  };

  return (
    <div className="bg-white rounded-lg p-4 max-w-md mx-auto mb-4">
      {/* Header section */}
      <div className="flex justify-between items-start mb-3">
        <div>
          {/* Main stock info */}
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-gray-200 rounded mr-2"></div>
            <div>
              <div className="font-bold text-lg">{mainStockData.symbol}</div>
              <div className="text-xs text-gray-600">{mainStockData.type}</div>
            </div>
          </div>
          
          {/* Competitor stock info */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded mr-2"></div>
            <div>
              <div className="font-bold text-lg">{competitor.symbol}</div>
              <div className="text-xs text-gray-600">{competitor.type}</div>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="mb-2">
            <div className="text-sm text-gray-600">Compare with:</div>
            <select 
              className="border border-gray-300 rounded p-1 text-sm"
              value={selectedCompetitor}
              onChange={(e) => setSelectedCompetitor(e.target.value)}
            >
              {Object.keys(competitorsForIndustry)
                .filter(symbol => symbol !== currentStock.ticker)
                .map(symbol => (
                  <option key={symbol} value={symbol}>{symbol}</option>
                ))
              }
            </select>
          </div>
          
          <button 
            className="text-blue-600 font-medium text-sm flex items-center ml-auto"
            onClick={toggleFullComparison}
          >
            {showFullComparison ? 'Hide All' : 'View All'}
            {showFullComparison ? <Minus className="h-4 w-4 ml-1" /> : <Plus className="h-4 w-4 ml-1" />}
          </button>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-end mb-3 text-xs text-gray-600">
        <div className="flex items-center mr-4">
          <div className="w-2 h-2 rounded-full bg-gray-700 mr-1"></div>
          <span>Industry</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-gray-400 mr-1"></div>
          <span>Market</span>
        </div>
      </div>
      
      {/* Metric comparisons - vertical layout */}
      {Object.keys(mainStockData.ratings).map(metric => {
        const mainValue = mainStockData.ratings[metric as keyof typeof mainStockData.ratings];
        const compValue = competitor.ratings[metric as keyof typeof competitor.ratings];
        const industryValue = benchmarks.Industry.ratings[metric as keyof typeof benchmarks.Industry.ratings];
        const marketValue = benchmarks.Market.ratings[metric as keyof typeof benchmarks.Market.ratings];
        
        const mainHigher = mainValue > compValue;
        const compHigher = compValue > mainValue;
        
        return (
          <div key={metric} className="mb-6">
            <div className="font-medium text-gray-700 mb-2">{metric}</div>
            
            {/* Main stock bar */}
            <div className="mb-4">
              <div className="h-8 bg-gray-100 rounded-full relative">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${mainValue}%`, 
                    backgroundColor: mainStockData.color
                  }}
                ></div>
                
                {/* Industry marker */}
                <div 
                  className="absolute h-full w-1 bg-gray-700 z-10" 
                  style={{ left: `${industryValue}%` }}
                ></div>
                
                {/* Market marker */}
                <div 
                  className="absolute h-full w-1 bg-gray-400 z-10" 
                  style={{ left: `${marketValue}%` }}
                ></div>
                
                {/* Value label */}
                <div className={`absolute left-0 -bottom-6 font-medium ${mainHigher ? 'text-green-600' : 'text-gray-700'}`}>
                  {mainValue.toFixed(0)}
                </div>
                
                {/* Symbol indicator */}
                <div 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-bold text-white"
                >
                  {mainStockData.symbol}
                </div>
              </div>
            </div>
            
            {/* Competitor stock bar */}
            <div>
              <div className="h-8 bg-gray-100 rounded-full relative">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${compValue}%`, 
                    backgroundColor: competitor.color
                  }}
                ></div>
                
                {/* Industry marker */}
                <div 
                  className="absolute h-full w-1 bg-gray-700 z-10" 
                  style={{ left: `${industryValue}%` }}
                ></div>
                
                {/* Market marker */}
                <div 
                  className="absolute h-full w-1 bg-gray-400 z-10" 
                  style={{ left: `${marketValue}%` }}
                ></div>
                
                {/* Value label */}
                <div className={`absolute left-0 -bottom-6 font-medium ${compHigher ? 'text-indigo-600' : 'text-gray-700'}`}>
                  {compValue.toFixed(0)}
                </div>
                
                {/* Symbol indicator */}
                <div 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-bold text-white"
                >
                  {competitor.symbol}
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Color legend */}
      <div className="flex justify-center my-4 text-sm">
        <div className="flex items-center mr-6">
          <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: mainStockData.color }}></div>
          <span>{mainStockData.symbol}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: competitor.color }}></div>
          <span>{competitor.symbol}</span>
        </div>
      </div>
      
      {/* Full comparison table */}
      {showFullComparison && (
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <div className="font-bold text-gray-800">Full Comparison</div>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={toggleFullComparison}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left pb-2">Metrics</th>
                <th className="text-center pb-2 font-medium" style={{ color: mainStockData.color }}>{mainStockData.symbol}</th>
                <th className="text-center pb-2 font-medium" style={{ color: competitor.color }}>{competitor.symbol}</th>
                <th className="text-center pb-2 font-medium text-gray-700">Industry</th>
                <th className="text-center pb-2 font-medium text-gray-500">Market</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(mainStockData.ratings).map(metric => {
                const mainValue = mainStockData.ratings[metric as keyof typeof mainStockData.ratings];
                const compValue = competitor.ratings[metric as keyof typeof competitor.ratings];
                const industryValue = benchmarks.Industry.ratings[metric as keyof typeof benchmarks.Industry.ratings];
                const marketValue = benchmarks.Market.ratings[metric as keyof typeof benchmarks.Market.ratings];
                
                const values = [mainValue, compValue, industryValue, marketValue];
                const maxValue = Math.max(...values);
                
                return (
                  <tr key={metric} className="border-t">
                    <td className="py-2 font-medium text-gray-700">{metric}</td>
                    <td className={`text-center py-2 ${mainValue === maxValue ? 'font-bold' : ''}`} style={{ color: mainValue === maxValue ? mainStockData.color : 'inherit' }}>
                      {mainValue.toFixed(0)}
                    </td>
                    <td className={`text-center py-2 ${compValue === maxValue ? 'font-bold' : ''}`} style={{ color: compValue === maxValue ? competitor.color : 'inherit' }}>
                      {compValue.toFixed(0)}
                    </td>
                    <td className={`text-center py-2 ${industryValue === maxValue ? 'font-bold' : ''}`}>
                      {industryValue.toFixed(0)}
                    </td>
                    <td className={`text-center py-2 ${marketValue === maxValue ? 'font-bold' : ''}`}>
                      {marketValue.toFixed(0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div className="text-xs text-gray-500 mt-3">
            Higher numbers indicate better performance in each category. Bold values represent the highest score.
          </div>
        </div>
      )}
    </div>
  );
}