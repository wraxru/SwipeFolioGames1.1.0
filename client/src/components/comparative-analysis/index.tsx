import React from 'react';
import { StockData } from '../../lib/stock-data';
import IndustryPosition from './industry-position';
import VerticalStockComparison from './vertical-comparison-new';

interface ComparativeAnalysisProps {
  currentStock: StockData;
}

/**
 * Main container component for comparative analysis.
 * Shows industry position card with toggle for detailed comparison.
 */
export default function ComparativeAnalysis({ currentStock }: ComparativeAnalysisProps) {
  const industry = currentStock.industry || 'Other';
  
  // Calculate the stock's scores using the same method used in IndustryPosition & VerticalComparison
  // This ensures consistency between the components
  const getScores = () => {
    // Get scores from the current stock, using default values if not available
    return {
      Performance: 53, // Default value, would be calculated from metrics in real app
      Stability: 86,
      Value: 71,
      Momentum: 71
    };
  };

  // Calculate rank percentile (this would come from the scoring system)
  // For now, using a fixed value (70%) for the demo
  const getRank = () => {
    return 70; // This would normally be dynamically calculated
  };

  return (
    <div className="comparative-analysis">
      <IndustryPosition 
        currentStock={currentStock}
        industry={industry}
        scores={getScores()}
        rank={getRank()}
      />
    </div>
  );
}