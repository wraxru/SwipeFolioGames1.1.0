import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { InfoIcon } from 'lucide-react';

// Define the comparison stock type
export interface ComparisonStock {
  name: string;
  ticker: string;
  performance: number;
  stability: number;
  value: number;
  momentum: number;
  dividendYield?: number;
  color: string;
}

interface RadarChartComponentProps {
  currentStock: ComparisonStock;
  comparisonStocks: ComparisonStock[];
}

const formatTooltipValue = (value: number) => {
  return Math.round(value);
};

export default function RadarChartComponent({ currentStock, comparisonStocks }: RadarChartComponentProps) {
  // Combine current stock and comparison stocks
  const allStocks = [currentStock, ...comparisonStocks];

  // Transform data for RadarChart
  const metrics = ['Performance', 'Stability', 'Value', 'Momentum'];
  if (currentStock.dividendYield !== undefined) {
    metrics.push('Dividend');
  }

  const chartData = metrics.map(metric => {
    const lowerMetric = metric.toLowerCase();
    const dataPoint: any = { metric };
    
    allStocks.forEach(stock => {
      // Use the appropriate property based on the metric name
      if (lowerMetric === 'dividend' && stock.dividendYield !== undefined) {
        // Normalize dividend yield to a 0-100 scale for visualization
        // Assuming 5% dividend yield is considered excellent (100 score)
        const normalizedYield = Math.min(stock.dividendYield * 20, 100);
        dataPoint[stock.ticker] = normalizedYield;
      } else if (lowerMetric === 'performance') {
        dataPoint[stock.ticker] = stock.performance;
      } else if (lowerMetric === 'stability') {
        dataPoint[stock.ticker] = stock.stability;
      } else if (lowerMetric === 'value') {
        dataPoint[stock.ticker] = stock.value;
      } else if (lowerMetric === 'momentum') {
        dataPoint[stock.ticker] = stock.momentum;
      }
    });
    
    return dataPoint;
  });

  const [visibleStocks, setVisibleStocks] = React.useState<string[]>(
    allStocks.map(stock => stock.ticker)
  );

  const toggleStockVisibility = (ticker: string) => {
    if (visibleStocks.includes(ticker)) {
      // Don't allow toggling off the current stock
      if (ticker === currentStock.ticker) return;
      setVisibleStocks(visibleStocks.filter(t => t !== ticker));
    } else {
      setVisibleStocks([...visibleStocks, ticker]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Comparative Analysis</h3>
        <div className="flex items-center space-x-1 text-xs text-slate-500">
          <InfoIcon size={14} />
          <span>Compare with similar companies</span>
        </div>
      </div>
      
      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart outerRadius={90} data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: '#64748b' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            
            {allStocks.map((stock, index) => (
              visibleStocks.includes(stock.ticker) && (
                <Radar
                  key={stock.ticker}
                  name={`${stock.ticker} - ${stock.name}`}
                  dataKey={stock.ticker}
                  stroke={stock.color}
                  fill={stock.color}
                  fillOpacity={stock.ticker === currentStock.ticker ? 0.3 : 0.1}
                  strokeWidth={stock.ticker === currentStock.ticker ? 2 : 1}
                />
              )
            ))}
            
            <Tooltip 
              formatter={formatTooltipValue} 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '0.5rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e2e8f0'
              }} 
            />
            <Legend 
              formatter={(value, entry) => {
                // Extract ticker from the name (format: "TICKER - Company Name")
                const ticker = value.split(' - ')[0];
                return (
                  <span style={{ color: entry.color, cursor: 'pointer', fontWeight: ticker === currentStock.ticker ? 'bold' : 'normal' }}>
                    {ticker}
                  </span>
                );
              }}
              onClick={(data) => {
                const ticker = data.value.split(' - ')[0];
                toggleStockVisibility(ticker);
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-md">
        <span className="block font-medium mb-1">About Radar Charts:</span>
        <p>
          This chart shows how {currentStock.ticker} compares to similar companies across multiple metrics.
          Each axis represents a different investment quality, with higher scores (further from center) being better.
          Click company tickers in the legend to show/hide them.
        </p>
      </div>
    </div>
  );
}