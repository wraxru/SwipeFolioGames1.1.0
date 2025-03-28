import React, { useState, useEffect } from 'react';
import { StockData } from '../../lib/stock-data';
import { getIndustryStocks } from '../../lib/stock-data';
import { getAdvancedMetricScore } from '../../lib/advanced-metric-scoring';
import { getIndustryAverages } from '../../lib/industry-data';
import { marketAverages } from '../../lib/market-averages';

interface VerticalStockComparisonProps {
  currentStock: StockData;
}

interface ComparisonStockData {
  symbol: string;
  name: string;
  color: string;
  scores: {
    Performance: number;
    Stability: number;
    Value: number;
    Momentum: number;
  };
}

/**
 * A vertical comparison component that shows how a stock compares to ALL other stocks in its industry
 * using vertical bars for easy comparison.
 */
export default function VerticalStockComparison({ currentStock }: VerticalStockComparisonProps) {
  // Get the industry for the current stock 
  const industry = currentStock.industry || 'Other';
  
  // Load all stocks in this industry
  const allIndustryStocks = getIndustryStocks(industry);
  
  // State for UI controls
  const [showFullComparison, setShowFullComparison] = useState(false);
  const [showAllIndustryComparison, setShowAllIndustryComparison] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState("");
  
  // Prepare industry averages and market data
  const industryAverages = getIndustryAverages(industry);
  
  // Create a mapping of all stocks with their scores
  const [industryStocksWithScores, setIndustryStocksWithScores] = useState<Record<string, ComparisonStockData>>({});
  const [currentStockScores, setCurrentStockScores] = useState<ComparisonStockData>({
    symbol: currentStock.ticker,
    name: currentStock.name,
    color: '#10b981', // emerald-500 for main stock
    scores: {
      Performance: 0, 
      Stability: 0,
      Value: 0,
      Momentum: 0
    }
  });
  
  // Selected competitor data
  const [competitorData, setCompetitorData] = useState<ComparisonStockData | null>(null);
  
  // Calculate scores for all stocks in the industry
  useEffect(() => {
    const calculateScores = () => {
      // Calculate scores for the current stock
      const mainPerformanceScore = getAdvancedMetricScore(currentStock, 'performance');
      const mainStabilityScore = getAdvancedMetricScore(currentStock, 'stability');
      const mainValueScore = getAdvancedMetricScore(currentStock, 'value');
      const mainMomentumScore = getAdvancedMetricScore(currentStock, 'momentum');
      
      setCurrentStockScores({
        symbol: currentStock.ticker,
        name: currentStock.name,
        color: '#10b981', // emerald-500 for main stock
        scores: {
          Performance: mainPerformanceScore,
          Stability: mainStabilityScore,
          Value: mainValueScore,
          Momentum: mainMomentumScore
        }
      });
      
      // Calculate scores for all other stocks in the industry
      const stockScoresMap: Record<string, ComparisonStockData> = {};
      
      allIndustryStocks.forEach(stock => {
        // Skip the current stock as we already calculated it
        if (stock.ticker === currentStock.ticker) return;
        
        try {
          const performanceScore = getAdvancedMetricScore(stock, 'performance');
          const stabilityScore = getAdvancedMetricScore(stock, 'stability');
          const valueScore = getAdvancedMetricScore(stock, 'value');
          const momentumScore = getAdvancedMetricScore(stock, 'momentum');
          
          stockScoresMap[stock.ticker] = {
            symbol: stock.ticker,
            name: stock.name,
            color: '#7c3aed', // purple-600 for competitors
            scores: {
              Performance: performanceScore,
              Stability: stabilityScore,
              Value: valueScore,
              Momentum: momentumScore
            }
          };
        } catch (error) {
          console.error(`Error calculating scores for ${stock.ticker}:`, error);
        }
      });
      
      setIndustryStocksWithScores(stockScoresMap);
      
      // Set initial competitor if available
      const competitorTickers = Object.keys(stockScoresMap);
      if (competitorTickers.length > 0 && !selectedCompetitor) {
        setSelectedCompetitor(competitorTickers[0]);
        setCompetitorData(stockScoresMap[competitorTickers[0]]);
      }
    };
    
    calculateScores();
  }, [currentStock, allIndustryStocks, industry, selectedCompetitor]);
  
  // Update competitor data when selection changes
  useEffect(() => {
    if (selectedCompetitor && industryStocksWithScores[selectedCompetitor]) {
      setCompetitorData(industryStocksWithScores[selectedCompetitor]);
    }
  }, [selectedCompetitor, industryStocksWithScores]);
  
  // Calculate industry and market benchmarks
  const industryBenchmarks = {
    Performance: 50, // Default value
    Stability: 50,   // Default value
    Value: 50,       // Default value
    Momentum: 50     // Default value
  };
  
  const marketBenchmarks = {
    Performance: 50, // Default value
    Stability: 50,   // Default value
    Value: 50,       // Default value
    Momentum: 50     // Default value
  };
  
  // Toggle functions for UI
  const toggleFullComparison = () => {
    setShowFullComparison(!showFullComparison);
    if (showAllIndustryComparison) setShowAllIndustryComparison(false);
  };
  
  const toggleIndustryComparison = () => {
    setShowAllIndustryComparison(!showAllIndustryComparison);
    if (showFullComparison) setShowFullComparison(false);
  };
  
  // Define the metrics to show
  const metrics = ['Performance', 'Stability', 'Value', 'Momentum'];

  // Check if we have competitor data available
  const hasCompetitors = Object.keys(industryStocksWithScores).length > 0;
  
  if (!hasCompetitors) {
    return (
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <div className="text-gray-700 font-medium mb-2">Industry Comparison</div>
        <div className="text-sm text-gray-500">
          No other stocks available in this industry for comparison.
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-700 font-medium">Industry Comparison</div>
        <div className="flex space-x-2">
          <button 
            className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
            onClick={toggleFullComparison}
          >
            {showFullComparison ? 'Hide Details' : 'Show Details'}
          </button>
          <button 
            className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
            onClick={toggleIndustryComparison}
          >
            {showAllIndustryComparison ? 'Hide All Stocks' : 'Show All Stocks'}
          </button>
        </div>
      </div>
      
      {/* Competitor selector */}
      {!showAllIndustryComparison && (
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">Compare with:</label>
          <select 
            className="w-full p-2 border rounded bg-white text-sm"
            value={selectedCompetitor}
            onChange={(e) => setSelectedCompetitor(e.target.value)}
          >
            {Object.entries(industryStocksWithScores).map(([ticker, data]) => (
              <option key={ticker} value={ticker}>
                {data.name} ({ticker})
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Vertical bar comparison for each metric */}
      {!showAllIndustryComparison && competitorData && (
        <div className="space-y-6">
          {metrics.map(metric => {
            // Get values for this metric
            const mainValue = currentStockScores.scores[metric as keyof typeof currentStockScores.scores] || 0;
            const compValue = competitorData.scores[metric as keyof typeof competitorData.scores] || 0;
            const industryValue = industryBenchmarks[metric as keyof typeof industryBenchmarks] || 0;
            const marketValue = marketBenchmarks[metric as keyof typeof marketBenchmarks] || 0;
            
            // Determine higher value
            const mainHigher = mainValue > compValue;
            const compHigher = compValue > mainValue;
            
            return (
              <div key={metric} className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <div>{metric}</div>
                  <div>
                    <span className="inline-block h-2 w-2 bg-gray-500 rounded-full mr-1"></span>
                    Industry
                    <span className="inline-block h-2 w-2 bg-gray-300 rounded-full ml-3 mr-1"></span>
                    Market
                  </div>
                </div>
                
                {/* Main stock bar */}
                <div>
                  <div className="h-9 bg-gray-100 rounded-full relative overflow-hidden">
                    <div 
                      className="h-full rounded-full flex items-center justify-end pr-3"
                      style={{ 
                        width: `${mainValue}%`, 
                        backgroundColor: currentStockScores.color,
                        transition: 'width 0.5s ease-in-out'
                      }}
                    >
                      {/* Only show ticker symbol if bar is wide enough */}
                      {mainValue > 20 && (
                        <span className="text-xs font-bold text-white drop-shadow-md">{currentStockScores.symbol}</span>
                      )}
                    </div>
                    
                    {/* Show ticker outside the bar if it's too narrow */}
                    {mainValue <= 20 && (
                      <span className="absolute text-xs font-bold text-gray-700 left-[101%]">{currentStockScores.symbol}</span>
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
                    {(mainValue || 0).toFixed(0)}
                  </div>
                </div>
                
                {/* Competitor stock bar */}
                <div>
                  <div className="h-9 bg-gray-100 rounded-full relative overflow-hidden">
                    <div 
                      className="h-full rounded-full flex items-center justify-end pr-3"
                      style={{ 
                        width: `${compValue}%`, 
                        backgroundColor: competitorData.color,
                        transition: 'width 0.5s ease-in-out'
                      }}
                    >
                      {/* Only show ticker symbol if bar is wide enough */}
                      {compValue > 20 && (
                        <span className="text-xs font-bold text-white drop-shadow-md">{competitorData.symbol}</span>
                      )}
                    </div>
                    
                    {/* Show ticker outside the bar if it's too narrow */}
                    {compValue <= 20 && (
                      <span className="absolute text-xs font-bold text-gray-700 left-[101%]">{competitorData.symbol}</span>
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
                    {(compValue || 0).toFixed(0)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Show all industry stocks comparison */}
      {showAllIndustryComparison && (
        <div className="mt-6 border-t pt-4 transition-all duration-300 ease-in-out">
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
                {/* Main stock row */}
                <tr className="hover:bg-gray-50 transition-colors duration-150 bg-gray-50">
                  <td className="py-3 px-2 font-medium text-gray-800">
                    {currentStockScores.symbol} <span className="text-xs text-gray-500">(Selected)</span>
                  </td>
                  <td className="text-center py-3 px-2">{(currentStockScores.scores.Performance || 0).toFixed(0)}</td>
                  <td className="text-center py-3 px-2">{(currentStockScores.scores.Stability || 0).toFixed(0)}</td>
                  <td className="text-center py-3 px-2">{(currentStockScores.scores.Value || 0).toFixed(0)}</td>
                  <td className="text-center py-3 px-2">{(currentStockScores.scores.Momentum || 0).toFixed(0)}</td>
                </tr>
                
                {/* All other industry stocks */}
                {Object.entries(industryStocksWithScores).map(([ticker, stockData]) => (
                  <tr 
                    key={ticker} 
                    className={`hover:bg-gray-50 transition-colors duration-150 ${ticker === selectedCompetitor ? 'bg-purple-50' : ''} cursor-pointer`}
                    onClick={() => {
                      setSelectedCompetitor(ticker);
                      setShowAllIndustryComparison(false);
                    }}
                  >
                    <td className="py-3 px-2 font-medium text-gray-700">{stockData.symbol}</td>
                    <td className="text-center py-3 px-2">{(stockData.scores.Performance || 0).toFixed(0)}</td>
                    <td className="text-center py-3 px-2">{(stockData.scores.Stability || 0).toFixed(0)}</td>
                    <td className="text-center py-3 px-2">{(stockData.scores.Value || 0).toFixed(0)}</td>
                    <td className="text-center py-3 px-2">{(stockData.scores.Momentum || 0).toFixed(0)}</td>
                  </tr>
                ))}
                
                {/* Industry and market averages */}
                <tr className="hover:bg-gray-50 transition-colors duration-150 bg-gray-100">
                  <td className="py-3 px-2 font-medium text-gray-600">Industry Avg</td>
                  <td className="text-center py-3 px-2 text-gray-600">{(industryBenchmarks.Performance || 0).toFixed(0)}</td>
                  <td className="text-center py-3 px-2 text-gray-600">{(industryBenchmarks.Stability || 0).toFixed(0)}</td>
                  <td className="text-center py-3 px-2 text-gray-600">{(industryBenchmarks.Value || 0).toFixed(0)}</td>
                  <td className="text-center py-3 px-2 text-gray-600">{(industryBenchmarks.Momentum || 0).toFixed(0)}</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors duration-150 bg-gray-100">
                  <td className="py-3 px-2 font-medium text-gray-500">Market Avg</td>
                  <td className="text-center py-3 px-2 text-gray-500">{(marketBenchmarks.Performance || 0).toFixed(0)}</td>
                  <td className="text-center py-3 px-2 text-gray-500">{(marketBenchmarks.Stability || 0).toFixed(0)}</td>
                  <td className="text-center py-3 px-2 text-gray-500">{(marketBenchmarks.Value || 0).toFixed(0)}</td>
                  <td className="text-center py-3 px-2 text-gray-500">{(marketBenchmarks.Momentum || 0).toFixed(0)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="text-xs text-gray-500 mt-3">
            Click any row to select that stock for detailed comparison
          </div>
        </div>
      )}
      
      {/* Detailed comparison table */}
      {showFullComparison && competitorData && (
        <div className="mt-6 border-t pt-4 transition-all duration-300 ease-in-out">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-2 rounded-l-lg font-semibold text-gray-700">Metrics</th>
                  <th className="text-center py-2 px-2 font-semibold" style={{ color: currentStockScores.color }}>
                    {currentStockScores.symbol}
                  </th>
                  <th className="text-center py-2 px-2 font-semibold" style={{ color: competitorData.color }}>
                    {competitorData.symbol}
                  </th>
                  <th className="text-center py-2 px-2 font-semibold text-gray-600">Industry</th>
                  <th className="text-center py-2 px-2 rounded-r-lg font-semibold text-gray-400">Market</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {metrics.map(metric => {
                  const mainValue = currentStockScores.scores[metric as keyof typeof currentStockScores.scores] || 0;
                  const compValue = competitorData.scores[metric as keyof typeof competitorData.scores] || 0;
                  const industryValue = industryBenchmarks[metric as keyof typeof industryBenchmarks] || 0;
                  const marketValue = marketBenchmarks[metric as keyof typeof marketBenchmarks] || 0;
                  
                  const values = [mainValue, compValue, industryValue, marketValue];
                  const maxValue = Math.max(...values);
                  
                  return (
                    <tr key={metric} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="py-3 px-2 font-medium text-gray-700">{metric}</td>
                      <td className={`text-center py-3 px-2 ${mainValue === maxValue ? 'font-bold' : ''}`} 
                         style={{ color: mainValue === maxValue ? currentStockScores.color : 'inherit' }}>
                        {(mainValue || 0).toFixed(0)}
                      </td>
                      <td className={`text-center py-3 px-2 ${compValue === maxValue ? 'font-bold' : ''}`} 
                         style={{ color: compValue === maxValue ? competitorData.color : 'inherit' }}>
                        {(compValue || 0).toFixed(0)}
                      </td>
                      <td className={`text-center py-3 px-2 ${industryValue === maxValue ? 'font-medium text-gray-600' : 'text-gray-600'}`}>
                        {(industryValue || 0).toFixed(0)}
                      </td>
                      <td className={`text-center py-3 px-2 ${marketValue === maxValue ? 'font-medium text-gray-500' : 'text-gray-400'}`}>
                        {(marketValue || 0).toFixed(0)}
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