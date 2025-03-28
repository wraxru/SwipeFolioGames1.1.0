import React, { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { InfoIcon } from 'lucide-react';
import { ComparisonStock } from './radar-chart';

interface QuadrantChartProps {
  currentStock: ComparisonStock;
  comparisonStocks: ComparisonStock[];
}

interface QuadrantOption {
  id: string;
  name: string;
  xAxis: {
    metric: keyof ComparisonStock;
    label: string;
    description: string;
    isHigherBetter: boolean;
  };
  yAxis: {
    metric: keyof ComparisonStock;
    label: string;
    description: string;
    isHigherBetter: boolean;
  };
  quadrants: {
    topLeft: { label: string; description: string; color: string };
    topRight: { label: string; description: string; color: string };
    bottomLeft: { label: string; description: string; color: string };
    bottomRight: { label: string; description: string; color: string };
  };
}

export default function QuadrantChart({ currentStock, comparisonStocks }: QuadrantChartProps) {
  const quadrantOptions: QuadrantOption[] = [
    {
      id: 'risk-return',
      name: 'Risk vs Return',
      xAxis: {
        metric: 'stability',
        label: 'Risk (Inverse Stability)',
        description: 'Lower stability means higher risk',
        isHigherBetter: false,
      },
      yAxis: {
        metric: 'performance',
        label: 'Return Potential',
        description: 'Higher performance means higher potential returns',
        isHigherBetter: true,
      },
      quadrants: {
        topLeft: { 
          label: 'Defensive Growth', 
          description: 'Low risk, high return - ideal investments',
          color: 'rgba(16, 185, 129, 0.1)' // green
        },
        topRight: { 
          label: 'Aggressive Growth', 
          description: 'High risk, high return - for performance-focused investors',
          color: 'rgba(59, 130, 246, 0.1)' // blue
        },
        bottomLeft: { 
          label: 'Conservative', 
          description: 'Low risk, low return - for safety-focused investors',
          color: 'rgba(249, 115, 22, 0.1)' // orange
        },
        bottomRight: { 
          label: 'Speculative', 
          description: 'High risk, low return - generally avoid these',
          color: 'rgba(239, 68, 68, 0.1)' // red
        },
      }
    },
    {
      id: 'value-growth',
      name: 'Value vs Growth',
      xAxis: {
        metric: 'value',
        label: 'Value Score',
        description: 'Higher value score means better price relative to fundamentals',
        isHigherBetter: true,
      },
      yAxis: {
        metric: 'momentum',
        label: 'Growth Momentum',
        description: 'Higher momentum score indicates stronger price trend',
        isHigherBetter: true,
      },
      quadrants: {
        topLeft: { 
          label: 'Growth Stocks', 
          description: 'Low value, high momentum - growing quickly but expensive',
          color: 'rgba(59, 130, 246, 0.1)' // blue
        },
        topRight: { 
          label: 'GARP Stocks', 
          description: 'High value, high momentum - growth at reasonable price',
          color: 'rgba(16, 185, 129, 0.1)' // green
        },
        bottomLeft: { 
          label: 'Challenged Stocks', 
          description: 'Low value, low momentum - potential problems',
          color: 'rgba(239, 68, 68, 0.1)' // red
        },
        bottomRight: { 
          label: 'Value Stocks', 
          description: 'High value, low momentum - potential undervalued opportunities',
          color: 'rgba(249, 115, 22, 0.1)' // orange
        },
      }
    }
  ];

  const [selectedOption, setSelectedOption] = useState<QuadrantOption>(quadrantOptions[0]);

  // All stocks
  const allStocks = [currentStock, ...comparisonStocks];

  // Transform data for the ScatterChart
  const scatterData = allStocks.map(stock => {
    // For the risk-return view, invert stability since lower stability = higher risk
    const xValue = selectedOption.xAxis.isHigherBetter 
      ? stock[selectedOption.xAxis.metric] as number
      : 100 - (stock[selectedOption.xAxis.metric] as number);
    
    return {
      x: xValue,
      y: stock[selectedOption.yAxis.metric] as number,
      z: stock.ticker === currentStock.ticker ? 200 : 100, // Current stock is larger
      name: stock.name,
      ticker: stock.ticker,
      color: stock.color,
      current: stock.ticker === currentStock.ticker
    };
  });

  // Custom tooltip content
  const renderTooltip = (props: { active?: boolean; payload?: any[] }) => {
    const { active, payload } = props;
    
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-slate-200 rounded-md shadow-md text-xs">
          <p className="font-bold">{`${data.ticker} - ${data.name}`}</p>
          <p>{`${selectedOption.xAxis.label}: ${Math.round(data.x)}`}</p>
          <p>{`${selectedOption.yAxis.label}: ${Math.round(data.y)}`}</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Comparative Analysis</h3>
        <div className="flex items-center space-x-1 text-xs text-slate-500">
          <InfoIcon size={14} />
          <span>Compare stocks across key metrics</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex space-x-2 text-sm mb-2">
          {quadrantOptions.map(option => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option)}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                selectedOption.id === option.id
                  ? 'bg-blue-100 text-blue-800 font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-64 mt-2 relative">
        {/* Quadrant background colors */}
        <div className="absolute inset-0 z-0">
          <div className="grid grid-cols-2 grid-rows-2 h-full">
            <div className="bg-opacity-80" style={{ backgroundColor: selectedOption.quadrants.topLeft.color }}></div>
            <div className="bg-opacity-80" style={{ backgroundColor: selectedOption.quadrants.topRight.color }}></div>
            <div className="bg-opacity-80" style={{ backgroundColor: selectedOption.quadrants.bottomLeft.color }}></div>
            <div className="bg-opacity-80" style={{ backgroundColor: selectedOption.quadrants.bottomRight.color }}></div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name={selectedOption.xAxis.label}
              domain={[0, 100]}
              tick={{ fontSize: 11 }}
              tickCount={5}
              label={{ 
                value: selectedOption.xAxis.label, 
                position: 'bottom',
                style: { fontSize: '11px', fill: '#64748b' }
              }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name={selectedOption.yAxis.label}
              domain={[0, 100]}
              tick={{ fontSize: 11 }}
              tickCount={5}
              label={{ 
                value: selectedOption.yAxis.label, 
                angle: -90, 
                position: 'left',
                style: { fontSize: '11px', fill: '#64748b', textAnchor: 'middle' }
              }}
            />
            <ZAxis type="number" dataKey="z" range={[60, 200]} />
            <Tooltip content={renderTooltip} />
            
            {/* Reference lines dividing the quadrants */}
            <ReferenceLine y={50} stroke="#94a3b8" strokeWidth={1} />
            <ReferenceLine x={50} stroke="#94a3b8" strokeWidth={1} />
            
            {/* Scatter points */}
            <Scatter 
              data={scatterData} 
              fill="#8884d8"
              shape={(props: { cx?: number; cy?: number; r?: number; fill?: string; payload?: any }) => {
                const { cx, cy, r, fill, payload } = props;
                return (
                  <g>
                    <circle 
                      cx={cx || 0} 
                      cy={cy || 0} 
                      r={payload.current ? (r || 5) * 1.2 : (r || 5)} 
                      fill={payload.color} 
                      opacity={payload.current ? 0.9 : 0.7} 
                      stroke={payload.current ? "#000" : "none"}
                      strokeWidth={payload.current ? 1 : 0}
                    />
                    <text 
                      x={cx || 0} 
                      y={Number(cy || 0) + (r || 5) + 10} 
                      textAnchor="middle" 
                      fill="#475569" 
                      fontSize={10}
                      fontWeight={payload.current ? "bold" : "normal"}
                    >
                      {payload.ticker}
                    </text>
                  </g>
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      {/* Quadrant labels */}
      <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
        <div className="p-2 rounded-md" style={{ backgroundColor: selectedOption.quadrants.topLeft.color }}>
          <span className="font-medium block">{selectedOption.quadrants.topLeft.label}</span>
          <span className="text-slate-600">{selectedOption.quadrants.topLeft.description}</span>
        </div>
        <div className="p-2 rounded-md" style={{ backgroundColor: selectedOption.quadrants.topRight.color }}>
          <span className="font-medium block">{selectedOption.quadrants.topRight.label}</span>
          <span className="text-slate-600">{selectedOption.quadrants.topRight.description}</span>
        </div>
        <div className="p-2 rounded-md" style={{ backgroundColor: selectedOption.quadrants.bottomLeft.color }}>
          <span className="font-medium block">{selectedOption.quadrants.bottomLeft.label}</span>
          <span className="text-slate-600">{selectedOption.quadrants.bottomLeft.description}</span>
        </div>
        <div className="p-2 rounded-md" style={{ backgroundColor: selectedOption.quadrants.bottomRight.color }}>
          <span className="font-medium block">{selectedOption.quadrants.bottomRight.label}</span>
          <span className="text-slate-600">{selectedOption.quadrants.bottomRight.description}</span>
        </div>
      </div>
    </div>
  );
}