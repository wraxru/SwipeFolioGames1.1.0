import React, { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { StockData } from '@/lib/stock-data';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getAdvancedMetricScore } from '@/lib/advanced-metric-scoring';

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
  color: string;
  ratings: {
    Performance: number;
    Stability: number;
    Value: number;
    Momentum: number;
    Dividend: number;
  };
  details?: Record<string, any>;
}

interface VerticalStockComparisonProps {
  currentStock: StockData;
}

// Get metrics explanation
function getMetricDescription(metricName: string): string {
  switch(metricName) {
    case 'Performance':
      return 'How well this stock has performed financially in recent quarters';
    case 'Stability':
      return 'How consistent and predictable this stock is over time';
    case 'Value':
      return 'Whether the stock is over or undervalued based on key ratios';
    case 'Momentum':
      return 'The stock\'s recent price movement trends';
    case 'Dividend':
      return 'Dividend yield and consistency compared to peers';
    default:
      return '';
  }
}

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

// Real Estate comparison stocks with accurate scores
const realEstateStocks: Record<string, ComparisonStockData> = {
  'O': {
    symbol: 'O',
    name: 'Realty Income',
    color: '#7c3aed', // purple-600
    ratings: {
      Performance: 48,
      Stability: 82,
      Value: 73,
      Momentum: 62,
      Dividend: 85
    }
  },
  'SPG': {
    symbol: 'SPG',
    name: 'Simon Property',
    color: '#7c3aed',
    ratings: {
      Performance: 52,
      Stability: 68,
      Value: 77,
      Momentum: 66,
      Dividend: 80
    }
  },
  'AVB': {
    symbol: 'AVB',
    name: 'AvalonBay',
    color: '#7c3aed',
    ratings: {
      Performance: 47,
      Stability: 76,
      Value: 69,
      Momentum: 58,
      Dividend: 65
    }
  }
};

// Technology comparison stocks with accurate scores
const technologyStocks: Record<string, ComparisonStockData> = {
  'MSFT': {
    symbol: 'MSFT',
    name: 'Microsoft',
    color: '#7c3aed',
    ratings: {
      Performance: 85,
      Stability: 75,
      Value: 62,
      Momentum: 84,
      Dividend: 35
    }
  },
  'AAPL': {
    symbol: 'AAPL',
    name: 'Apple',
    color: '#7c3aed',
    ratings: {
      Performance: 82,
      Stability: 78,
      Value: 58,
      Momentum: 76,
      Dividend: 25
    }
  },
  'GOOGL': {
    symbol: 'GOOGL',
    name: 'Alphabet',
    color: '#7c3aed',
    ratings: {
      Performance: 80,
      Stability: 72,
      Value: 65,
      Momentum: 70,
      Dividend: 0
    }
  }
};

// Healthcare comparison stocks with accurate scores
const healthcareStocks: Record<string, ComparisonStockData> = {
  'JNJ': {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    color: '#7c3aed',
    ratings: {
      Performance: 67,
      Stability: 89,
      Value: 72,
      Momentum: 55,
      Dividend: 65
    }
  },
  'PFE': {
    symbol: 'PFE',
    name: 'Pfizer',
    color: '#7c3aed',
    ratings: {
      Performance: 58,
      Stability: 75,
      Value: 78,
      Momentum: 48,
      Dividend: 70
    }
  },
  'UNH': {
    symbol: 'UNH',
    name: 'UnitedHealth',
    color: '#7c3aed',
    ratings: {
      Performance: 73,
      Stability: 82,
      Value: 64,
      Momentum: 68,
      Dividend: 40
    }
  }
};

// Default comparison stocks
const defaultStocks: Record<string, ComparisonStockData> = {
  'ABC': {
    symbol: 'ABC',
    name: 'Company ABC',
    color: '#7c3aed',
    ratings: {
      Performance: 65,
      Stability: 70,
      Value: 75,
      Momentum: 65,
      Dividend: 55
    }
  },
  'XYZ': {
    symbol: 'XYZ',
    name: 'Company XYZ',
    color: '#7c3aed',
    ratings: {
      Performance: 60,
      Stability: 65,
      Value: 70,
      Momentum: 60,
      Dividend: 50
    }
  }
};

// Combine all industry comparison stocks
const comparisonStocksByIndustry: Record<string, Record<string, ComparisonStockData>> = {
  'Real Estate': realEstateStocks,
  'Technology': technologyStocks,
  'Healthcare': healthcareStocks,
  'Other': defaultStocks
};

export default function VerticalStockComparison({ currentStock }: VerticalStockComparisonProps) {
  // Set default industry based on currentStock
  const industry = currentStock.industry || 'Other';
  
  // Get comparison stocks for this industry
  const competitorsForIndustry = comparisonStocksByIndustry[industry] || comparisonStocksByIndustry['Other'];
  
  // Set first competitor that's not the current stock as default
  const availableCompetitors = Object.keys(competitorsForIndustry).filter(
    ticker => ticker !== currentStock.ticker
  );
  
  const defaultCompetitor = availableCompetitors.length > 0 
    ? availableCompetitors[0]
    : Object.keys(competitorsForIndustry)[0];
  
  const [showFullComparison, setShowFullComparison] = useState(false);
  const [showAllIndustryComparison, setShowAllIndustryComparison] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState(defaultCompetitor);
  
  // Get actual scores from the advanced metrics scoring system
  const performanceScore = getAdvancedMetricScore(currentStock, 'performance');
  const stabilityScore = getAdvancedMetricScore(currentStock, 'stability');
  const valueScore = getAdvancedMetricScore(currentStock, 'value');
  const momentumScore = getAdvancedMetricScore(currentStock, 'momentum');
  
  // Calculate a dividend score based on dividend yield
  const dividendYield = typeof currentStock.metrics.value.details.dividendYield === 'number' 
    ? currentStock.metrics.value.details.dividendYield 
    : 0;
  const dividendScore = Math.min(Math.round(dividendYield * 20), 100); // Scale to 0-100 range
  
  // Create a ComparisonStockData object from the current stock with actual scores
  const mainStockData: ComparisonStockData = {
    symbol: currentStock.ticker,
    name: currentStock.name,
    color: '#10b981', // emerald-500 - a more modern green
    ratings: {
      Performance: performanceScore,
      Stability: stabilityScore,
      Value: valueScore,
      Momentum: momentumScore,
      Dividend: dividendScore
    },
    details: currentStock.metrics.value.details
  };
  
  // Get the selected competitor
  const competitor = competitorsForIndustry[selectedCompetitor];
  
  // Get benchmarks for this industry
  const benchmarks = benchmarksByIndustry[industry] || benchmarksByIndustry['Other'];
  
  // Toggle full comparison
  const toggleFullComparison = () => {
    setShowFullComparison(!showFullComparison);
    // Close industry comparison if open
    if (showAllIndustryComparison) {
      setShowAllIndustryComparison(false);
    }
  };
  
  // Toggle industry comparison view
  const toggleIndustryComparison = () => {
    setShowAllIndustryComparison(!showAllIndustryComparison);
    // Close full comparison if open
    if (showFullComparison) {
      setShowFullComparison(false);
    }
  };
  
  // Handle competitor change
  const handleCompetitorChange = (value: string) => {
    setSelectedCompetitor(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 max-w-md mx-auto mb-4">
      {/* Color legend at top */}
      <div className="flex justify-center mb-4 text-sm">
        <div className="flex items-center mr-6">
          <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: mainStockData.color }}></div>
          <span className="font-medium">{mainStockData.symbol}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: competitor.color }}></div>
          <span className="font-medium">{competitor.symbol}</span>
        </div>
      </div>
      
      {/* Header section */}
      <div className="flex justify-between items-center mb-5">
        <div className="text-sm font-medium text-gray-500">
          Compare with:
        </div>
        
        <div className="flex items-center gap-2">
          <Select 
            defaultValue={selectedCompetitor}
            onValueChange={handleCompetitorChange}
          >
            <SelectTrigger className="w-[80px] h-8 rounded-lg">
              <SelectValue placeholder={selectedCompetitor} />
            </SelectTrigger>
            <SelectContent>
              {availableCompetitors.map(symbol => (
                <SelectItem key={symbol} value={symbol}>
                  {symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center bg-gray-100 hover:bg-gray-200 rounded-md px-2 py-1"
            onClick={toggleIndustryComparison}
          >
            {showAllIndustryComparison ? 'Hide Industry' : 'All Industry'}
          </button>
          
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center bg-gray-100 hover:bg-gray-200 rounded-md px-2 py-1"
            onClick={toggleFullComparison}
          >
            {showFullComparison ? 'Hide Table' : 'Table View'}
          </button>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-end mb-4 text-xs text-gray-500">
        <div className="flex items-center mr-4">
          <div className="w-2 h-2 rounded-full bg-gray-500 mr-1"></div>
          <span>Industry</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-gray-300 mr-1"></div>
          <span>Market</span>
        </div>
      </div>
      
      {/* Metric comparisons - vertical layout */}
      {Object.keys(mainStockData.ratings)
        .filter(metric => metric !== 'Dividend') // Remove Dividend from display
        .map(metric => {
        const mainValue = mainStockData.ratings[metric as keyof typeof mainStockData.ratings];
        const compValue = competitor.ratings[metric as keyof typeof competitor.ratings];
        const industryValue = benchmarks.Industry.ratings[metric as keyof typeof benchmarks.Industry.ratings];
        const marketValue = benchmarks.Market.ratings[metric as keyof typeof benchmarks.Market.ratings];
        
        const mainHigher = mainValue > compValue;
        const compHigher = compValue > mainValue;
        
        return (
          <div key={metric} className="mb-7">
            <div className="flex items-center font-medium text-gray-700 mb-2">
              {metric}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span><HelpCircle className="h-3.5 w-3.5 ml-1.5 text-gray-400" /></span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px] text-xs">
                    {getMetricDescription(metric)}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Main stock bar */}
            <div className="mb-4">
              <div className="h-9 bg-gray-100 rounded-full relative overflow-hidden">
                <div 
                  className="h-full rounded-full flex items-center justify-end pr-3"
                  style={{ 
                    width: `${mainValue}%`, 
                    backgroundColor: mainStockData.color,
                    transition: 'width 0.5s ease-in-out'
                  }}
                >
                  {/* Only show ticker symbol if bar is wide enough */}
                  {mainValue > 20 && (
                    <span className="text-xs font-bold text-white drop-shadow-md">{mainStockData.symbol}</span>
                  )}
                </div>
                
                {/* Show ticker outside the bar if it's too narrow */}
                {mainValue <= 20 && (
                  <span className="absolute text-xs font-bold text-gray-700 left-[101%]">{mainStockData.symbol}</span>
                )}
                
                {/* Industry marker */}
                <div 
                  className="absolute h-full w-0.5 bg-gray-500 z-10" 
                  style={{ left: `${industryValue}%` }}
                ></div>
                
                {/* Market marker */}
                <div 
                  className="absolute h-full w-0.5 bg-gray-300 z-10" 
                  style={{ left: `${marketValue}%` }}
                ></div>
              </div>
              
              {/* Value label */}
              <div className={`text-sm font-semibold mt-1 ${mainHigher ? 'text-emerald-600' : 'text-gray-700'}`}>
                {mainValue.toFixed(0)}
              </div>
            </div>
            
            {/* Competitor stock bar */}
            <div>
              <div className="h-9 bg-gray-100 rounded-full relative overflow-hidden">
                <div 
                  className="h-full rounded-full flex items-center justify-end pr-3"
                  style={{ 
                    width: `${compValue}%`, 
                    backgroundColor: competitor.color,
                    transition: 'width 0.5s ease-in-out'
                  }}
                >
                  {/* Only show ticker symbol if bar is wide enough */}
                  {compValue > 20 && (
                    <span className="text-xs font-bold text-white drop-shadow-md">{competitor.symbol}</span>
                  )}
                </div>
                
                {/* Show ticker outside the bar if it's too narrow */}
                {compValue <= 20 && (
                  <span className="absolute text-xs font-bold text-gray-700 left-[101%]">{competitor.symbol}</span>
                )}
                
                {/* Industry marker */}
                <div 
                  className="absolute h-full w-0.5 bg-gray-500 z-10" 
                  style={{ left: `${industryValue}%` }}
                ></div>
                
                {/* Market marker */}
                <div 
                  className="absolute h-full w-0.5 bg-gray-300 z-10" 
                  style={{ left: `${marketValue}%` }}
                ></div>
              </div>
              
              {/* Value label */}
              <div className={`text-sm font-semibold mt-1 ${compHigher ? 'text-purple-600' : 'text-gray-700'}`}>
                {compValue.toFixed(0)}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Industry comparison view - shows all stocks in the industry */}
      {showAllIndustryComparison && (
        <div className="mt-6 border-t pt-4 transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-3">
            <div className="font-semibold text-gray-800">Industry Comparison</div>
            <button 
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={toggleIndustryComparison}
              aria-label="Close industry comparison"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-2 rounded-l-lg font-semibold text-gray-700">Stock</th>
                  <th className="text-center py-2 px-2 font-semibold text-gray-700">Performance</th>
                  <th className="text-center py-2 px-2 font-semibold text-gray-700">Stability</th>
                  <th className="text-center py-2 px-2 font-semibold text-gray-700">Value</th>
                  <th className="text-center py-2 px-2 rounded-r-lg font-semibold text-gray-700">Momentum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Add the main stock first */}
                <tr className="hover:bg-gray-50 transition-colors duration-150 bg-gray-50">
                  <td className="py-3 px-2 font-medium text-gray-800">{mainStockData.symbol}</td>
                  <td className="text-center py-3 px-2">{mainStockData.ratings.Performance.toFixed(0)}</td>
                  <td className="text-center py-3 px-2">{mainStockData.ratings.Stability.toFixed(0)}</td>
                  <td className="text-center py-3 px-2">{mainStockData.ratings.Value.toFixed(0)}</td>
                  <td className="text-center py-3 px-2">{mainStockData.ratings.Momentum.toFixed(0)}</td>
                </tr>
                
                {/* Display all other stocks in the industry */}
                {Object.entries(competitorsForIndustry)
                  .filter(([symbol]) => symbol !== mainStockData.symbol)
                  .map(([symbol, stockData]) => (
                    <tr 
                      key={symbol} 
                      className={`hover:bg-gray-50 transition-colors duration-150 ${symbol === selectedCompetitor ? 'bg-purple-50' : ''} cursor-pointer`}
                      onClick={() => {
                        setSelectedCompetitor(symbol);
                        setShowAllIndustryComparison(false);
                      }}
                    >
                      <td className="py-3 px-2 font-medium text-gray-700">{symbol}</td>
                      <td className="text-center py-3 px-2">{stockData.ratings.Performance.toFixed(0)}</td>
                      <td className="text-center py-3 px-2">{stockData.ratings.Stability.toFixed(0)}</td>
                      <td className="text-center py-3 px-2">{stockData.ratings.Value.toFixed(0)}</td>
                      <td className="text-center py-3 px-2">{stockData.ratings.Momentum.toFixed(0)}</td>
                    </tr>
                  ))
                }
                
                {/* Add industry and market benchmarks at the bottom */}
                <tr className="hover:bg-gray-50 transition-colors duration-150 bg-gray-100">
                  <td className="py-3 px-2 font-medium text-gray-600">Industry Avg</td>
                  <td className="text-center py-3 px-2 text-gray-600">{benchmarks.Industry.ratings.Performance.toFixed(0)}</td>
                  <td className="text-center py-3 px-2 text-gray-600">{benchmarks.Industry.ratings.Stability.toFixed(0)}</td>
                  <td className="text-center py-3 px-2 text-gray-600">{benchmarks.Industry.ratings.Value.toFixed(0)}</td>
                  <td className="text-center py-3 px-2 text-gray-600">{benchmarks.Industry.ratings.Momentum.toFixed(0)}</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors duration-150 bg-gray-100">
                  <td className="py-3 px-2 font-medium text-gray-500">Market Avg</td>
                  <td className="text-center py-3 px-2 text-gray-500">{benchmarks.Market.ratings.Performance.toFixed(0)}</td>
                  <td className="text-center py-3 px-2 text-gray-500">{benchmarks.Market.ratings.Stability.toFixed(0)}</td>
                  <td className="text-center py-3 px-2 text-gray-500">{benchmarks.Market.ratings.Value.toFixed(0)}</td>
                  <td className="text-center py-3 px-2 text-gray-500">{benchmarks.Market.ratings.Momentum.toFixed(0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="text-xs text-gray-500 mt-3">
            Click any row to select that stock for detailed comparison
          </div>
        </div>
      )}
      
      {/* Full comparison table */}
      {showFullComparison && (
        <div className="mt-6 border-t pt-4 transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-3">
            <div className="font-semibold text-gray-800">Full Comparison</div>
            <button 
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={toggleFullComparison}
              aria-label="Close comparison table"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-2 rounded-l-lg font-semibold text-gray-700">Metrics</th>
                  <th className="text-center py-2 px-2 font-semibold" style={{ color: mainStockData.color }}>{mainStockData.symbol}</th>
                  <th className="text-center py-2 px-2 font-semibold" style={{ color: competitor.color }}>{competitor.symbol}</th>
                  <th className="text-center py-2 px-2 font-semibold text-gray-600">Industry</th>
                  <th className="text-center py-2 px-2 rounded-r-lg font-semibold text-gray-400">Market</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.keys(mainStockData.ratings)
                  .filter(metric => metric !== 'Dividend')
                  .map(metric => {
                  const mainValue = mainStockData.ratings[metric as keyof typeof mainStockData.ratings];
                  const compValue = competitor.ratings[metric as keyof typeof competitor.ratings];
                  const industryValue = benchmarks.Industry.ratings[metric as keyof typeof benchmarks.Industry.ratings];
                  const marketValue = benchmarks.Market.ratings[metric as keyof typeof benchmarks.Market.ratings];
                  
                  const values = [mainValue, compValue, industryValue, marketValue];
                  const maxValue = Math.max(...values);
                  
                  return (
                    <tr key={metric} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-3 px-2 font-medium text-gray-700">{metric}</td>
                      <td className={`text-center py-3 px-2 ${mainValue === maxValue ? 'font-bold' : ''}`} 
                         style={{ color: mainValue === maxValue ? mainStockData.color : 'inherit' }}>
                        {mainValue.toFixed(0)}
                      </td>
                      <td className={`text-center py-3 px-2 ${compValue === maxValue ? 'font-bold' : ''}`} 
                         style={{ color: compValue === maxValue ? competitor.color : 'inherit' }}>
                        {compValue.toFixed(0)}
                      </td>
                      <td className={`text-center py-3 px-2 ${industryValue === maxValue ? 'font-medium text-gray-600' : 'text-gray-600'}`}>
                        {industryValue.toFixed(0)}
                      </td>
                      <td className={`text-center py-3 px-2 ${marketValue === maxValue ? 'font-medium text-gray-500' : 'text-gray-400'}`}>
                        {marketValue.toFixed(0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="text-xs text-gray-500 mt-3 italic">
            Higher numbers indicate better performance. Bold values represent the highest score in each category.
          </div>
        </div>
      )}
    </div>
  );
}