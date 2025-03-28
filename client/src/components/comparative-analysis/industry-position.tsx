import React, { useState } from 'react';
import { ChevronDown, Award, TrendingUp, Shield, DollarSign, Zap } from 'lucide-react';
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

// Function to get letter grade based on percentile rank
const getGradeFromRank = (rank: number): string => {
  if (rank >= 90) return 'A+';
  if (rank >= 80) return 'A';
  if (rank >= 75) return 'A-';
  if (rank >= 70) return 'B+';
  if (rank >= 65) return 'B';
  if (rank >= 60) return 'B-';
  if (rank >= 55) return 'C+';
  if (rank >= 50) return 'C';
  if (rank >= 45) return 'C-';
  if (rank >= 40) return 'D+';
  if (rank >= 35) return 'D';
  if (rank >= 30) return 'D-';
  return 'F';
};

const IndustryPosition: React.FC<IndustryPositionProps> = ({
  currentStock,
  industry,
  scores,
  rank
}) => {
  const [showComparison, setShowComparison] = useState(false);
  const stockGrade = getGradeFromRank(rank);

  // Generate a performance statement based on rank
  const getPerformanceStatement = () => {
    const name = currentStock.name;
    if (rank >= 80) return `${name} stands out as a top performer in the ${industry} sector.`;
    if (rank >= 60) return `${name} outperforms most competitors in the ${industry} sector.`;
    if (rank >= 40) return `${name} delivers average performance for its ${industry} sector.`;
    if (rank >= 20) return `${name} lags behind compared to others in the ${industry} sector.`;
    return `${name} significantly underperforms within the ${industry} sector.`;
  };

  // Get color for metric based on value
  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-emerald-600';
    if (value >= 60) return 'text-green-600';
    if (value >= 40) return 'text-amber-600';
    if (value < 40) return 'text-red-600';
    return 'text-gray-700';
  };

  // Get background color gradient for metric bubbles
  const getMetricBgGradient = (value: number) => {
    if (value >= 80) return 'bg-gradient-to-br from-emerald-400 to-emerald-600';
    if (value >= 60) return 'bg-gradient-to-br from-green-400 to-green-600';
    if (value >= 40) return 'bg-gradient-to-br from-amber-400 to-amber-600';
    return 'bg-gradient-to-br from-red-400 to-red-600';
  };

  // Get icon for each metric
  const getMetricIcon = (metricName: string) => {
    switch(metricName) {
      case 'Performance': return <TrendingUp className="h-4 w-4" />;
      case 'Stability': return <Shield className="h-4 w-4" />;
      case 'Value': return <DollarSign className="h-4 w-4" />;
      case 'Momentum': return <Zap className="h-4 w-4" />;
      default: return null;
    }
  };

  // Toggle comparison view
  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  return (
    <div className="mt-6">
      {/* Industry Position Card */}
      <div className="border border-gray-200 rounded-xl shadow-sm overflow-hidden bg-white">
        <div className="p-5 relative border-b border-gray-100">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Industry Position</h3>
              <p className="text-sm font-medium text-gray-600">{industry}</p>
            </div>
            
            {/* Grade and Rank - Redesigned as a horizontal badge */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1 text-amber-600" />
                  <span className="text-sm font-bold text-gray-800">GRADE</span>
                </div>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-600">Industry Ranking:</span>
                  <span className="text-xs font-medium text-gray-800 ml-1">{rank}th percentile</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 rounded-lg blur-sm opacity-60"
                     style={{ 
                       backgroundColor: `hsl(${Math.min(120, rank * 1.2)}, 70%, 60%)`
                     }}>
                </div>
                <div className="rounded-lg w-16 h-16 flex items-center justify-center text-white relative shadow-lg" 
                     style={{ 
                       background: `linear-gradient(135deg, hsl(${Math.min(120, rank * 1.2)}, 80%, 65%), hsl(${Math.min(120, rank * 1.2)}, 70%, 45%))` 
                     }}>
                  <span className="text-3xl font-bold">{stockGrade}</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-800 text-sm font-medium mt-2">{getPerformanceStatement()}</p>
          
          {/* Metric Scores - Enhanced with gradients and icons */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            {Object.entries(scores).map(([metric, score]) => (
              <div key={metric} className="relative group">
                {/* Background glow effect on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-sm -m-1"
                     style={{ backgroundColor: score >= 60 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444' }}></div>
                
                {/* Metric card */}
                <div className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300 flex flex-col items-center">
                  <div className={`${getMetricBgGradient(score)} text-white p-1.5 rounded-full mb-2 shadow-md`}>
                    {getMetricIcon(metric)}
                  </div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">{metric}</p>
                  <p className={`text-lg font-bold ${getMetricColor(score)}`}>
                    {score}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Compare Button - Enhanced with gradient and animation */}
          <button 
            className="w-full mt-5 py-3.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl flex items-center justify-center transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
            onClick={toggleComparison}
          >
            <span className="mr-2">{showComparison ? 'Hide Comparison' : 'See How It Compares'}</span>
            <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${showComparison ? 'transform rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Comparison Section (toggled) - Improved transition */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showComparison ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
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