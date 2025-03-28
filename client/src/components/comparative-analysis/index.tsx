import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RadarChartComponent, { ComparisonStock } from './radar-chart';
import QuadrantChart from './quadrant-chart';

import { StockData } from "@/lib/stock-data";

// Function to convert text ratings to numeric scores for visualization
function convertRatingToNumber(rating: string): number {
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
      // Try to parse as a number if it's already a number
      const parsed = parseInt(rating, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
      // Default fallback
      return 50;
  }
}

interface ComparativeAnalysisProps {
  currentStock: StockData;
}

// Colors for comparison stocks
const comparisonColors = [
  '#3b82f6', // blue
  '#ef4444', // red  
  '#f97316', // orange
  '#8b5cf6', // purple
  '#10b981', // green
];

// Hardcoded comparison stocks by industry
const comparisonStocksByIndustry: Record<string, ComparisonStock[]> = {
  'Real Estate': [
    {
      name: 'Realty Income',
      ticker: 'O',
      performance: 48,
      stability: 82,
      value: 73,
      momentum: 62,
      dividendYield: 5.2,
      color: comparisonColors[0],
    },
    {
      name: 'Simon Property',
      ticker: 'SPG',
      performance: 52,
      stability: 68,
      value: 77,
      momentum: 66,
      dividendYield: 5.8,
      color: comparisonColors[1],
    },
    {
      name: 'AvalonBay',
      ticker: 'AVB',
      performance: 47,
      stability: 76,
      value: 69,
      momentum: 58,
      dividendYield: 3.3,
      color: comparisonColors[2],
    },
    {
      name: 'Equity Residential',
      ticker: 'EQR',
      performance: 45,
      stability: 79,
      value: 71,
      momentum: 55,
      dividendYield: 4.2,
      color: comparisonColors[3],
    }
  ],
  'Technology': [
    {
      name: 'Microsoft',
      ticker: 'MSFT',
      performance: 88,
      stability: 75,
      value: 62,
      momentum: 84,
      dividendYield: 0.8,
      color: comparisonColors[0],
    },
    {
      name: 'Apple',
      ticker: 'AAPL',
      performance: 85,
      stability: 78,
      value: 58,
      momentum: 76,
      dividendYield: 0.5,
      color: comparisonColors[1],
    },
    {
      name: 'Alphabet',
      ticker: 'GOOGL',
      performance: 82,
      stability: 72,
      value: 65,
      momentum: 79,
      dividendYield: 0,
      color: comparisonColors[2],
    },
    {
      name: 'Amazon',
      ticker: 'AMZN',
      performance: 79,
      stability: 64,
      value: 56,
      momentum: 82,
      dividendYield: 0,
      color: comparisonColors[3],
    }
  ],
  'Healthcare': [
    {
      name: 'Johnson & Johnson',
      ticker: 'JNJ',
      performance: 67,
      stability: 89,
      value: 72,
      momentum: 55,
      dividendYield: 3.1,
      color: comparisonColors[0],
    },
    {
      name: 'Pfizer',
      ticker: 'PFE',
      performance: 58,
      stability: 75,
      value: 78,
      momentum: 48,
      dividendYield: 5.4,
      color: comparisonColors[1],
    },
    {
      name: 'UnitedHealth',
      ticker: 'UNH',
      performance: 73,
      stability: 82,
      value: 64,
      momentum: 68,
      dividendYield: 1.7,
      color: comparisonColors[2],
    },
    {
      name: 'Merck',
      ticker: 'MRK',
      performance: 65,
      stability: 80,
      value: 71,
      momentum: 62,
      dividendYield: 2.9,
      color: comparisonColors[3],
    }
  ],
  // Default industry for stocks that don't match a specific industry
  'Other': [
    {
      name: 'Company A',
      ticker: 'AAA',
      performance: 65,
      stability: 70,
      value: 68,
      momentum: 72,
      dividendYield: 2.2,
      color: comparisonColors[0],
    },
    {
      name: 'Company B',
      ticker: 'BBB',
      performance: 58,
      stability: 75,
      value: 65,
      momentum: 62,
      dividendYield: 3.5,
      color: comparisonColors[1],
    },
    {
      name: 'Company C',
      ticker: 'CCC',
      performance: 70,
      stability: 62,
      value: 60,
      momentum: 75,
      dividendYield: 1.8,
      color: comparisonColors[2],
    },
    {
      name: 'Company D',
      ticker: 'DDD',
      performance: 62,
      stability: 68,
      value: 72,
      momentum: 65,
      dividendYield: 2.5,
      color: comparisonColors[3],
    }
  ]
};

export default function ComparativeAnalysis({ currentStock }: ComparativeAnalysisProps) {
  // Create a ComparisonStock object from the current stock
  const currentStockForComparison: ComparisonStock = {
    name: currentStock.name,
    ticker: currentStock.ticker,
    // Parse values to numbers - transform text ratings into numeric scores
    performance: convertRatingToNumber(currentStock.metrics.performance.value),
    stability: convertRatingToNumber(currentStock.metrics.stability.value),
    value: convertRatingToNumber(currentStock.metrics.value.value),
    momentum: convertRatingToNumber(currentStock.metrics.momentum.value),
    dividendYield: typeof currentStock.metrics.value.details.dividendYield === 'number' 
      ? currentStock.metrics.value.details.dividendYield 
      : (currentStock.metrics.value.details.dividendYield !== 'N/A' 
          ? parseFloat(currentStock.metrics.value.details.dividendYield as string) 
          : undefined),
    color: '#16a34a', // Always use green for the current stock
  };

  // Get comparison stocks based on the current stock's industry
  const industry = currentStock.industry || 'Other';
  const comparisonStocks = comparisonStocksByIndustry[industry] || comparisonStocksByIndustry['Other'];

  return (
    <div className="mb-4">
      <Tabs defaultValue="radar" className="w-full">
        <div className="flex justify-center mb-2">
          <TabsList className="grid grid-cols-2 w-64">
            <TabsTrigger value="radar" className="text-xs">Radar Comparison</TabsTrigger>
            <TabsTrigger value="quadrant" className="text-xs">Quadrant Analysis</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="radar" className="mt-0">
          <RadarChartComponent 
            currentStock={currentStockForComparison}
            comparisonStocks={comparisonStocks}
          />
        </TabsContent>
        
        <TabsContent value="quadrant" className="mt-0">
          <QuadrantChart 
            currentStock={currentStockForComparison}
            comparisonStocks={comparisonStocks}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}