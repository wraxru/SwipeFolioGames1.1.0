import React from 'react';
import { StockData } from "@/lib/stock-data";
import VerticalStockComparison from './vertical-comparison';

export interface ComparativeAnalysisProps {
  currentStock: StockData;
  industry?: string; // Optional industry parameter
}

export default function ComparativeAnalysis({ currentStock, industry }: ComparativeAnalysisProps) {
  return (
    <div className="mb-4">
      <VerticalStockComparison 
        currentStock={currentStock} 
        industry={industry || currentStock.industry} 
      />
    </div>
  );
}