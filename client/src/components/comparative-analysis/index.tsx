import React from 'react';
import { StockData } from "@/lib/stock-data";
import VerticalStockComparison from './vertical-comparison';

interface ComparativeAnalysisProps {
  currentStock: StockData;
}

export default function ComparativeAnalysis({ currentStock }: ComparativeAnalysisProps) {
  return (
    <div className="mb-4">
      <VerticalStockComparison currentStock={currentStock} />
    </div>
  );
}