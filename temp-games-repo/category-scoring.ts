// Calculate category scores based on metric values
export function calculateCategoryScore(metricName: string, metrics: any, industryAvgs: any): {
  score: number;  // Average score between 0-2
  rating: string; // "Good", "Average", "Poor"
  color: string;  // "green", "yellow", "red"
} {
  let metricScores: number[] = [];
  let totalScore = 0;
  
  switch (metricName) {
    case 'performance': {
      // Revenue Growth Score
      if (metrics.revenueGrowth > industryAvgs.revenueGrowth * 1.1) {
        metricScores.push(2); // Good
      } else if (metrics.revenueGrowth < industryAvgs.revenueGrowth * 0.9) {
        metricScores.push(0); // Poor
      } else {
        metricScores.push(1); // Average
      }
      
      // Profit Margin Score
      if (metrics.profitMargin > industryAvgs.profitMargin * 1.1) {
        metricScores.push(2); // Good
      } else if (metrics.profitMargin < industryAvgs.profitMargin * 0.9) {
        metricScores.push(0); // Poor
      } else {
        metricScores.push(1); // Average
      }
      
      // Return on Capital Score
      if (metrics.returnOnCapital > industryAvgs.returnOnCapital * 1.1) {
        metricScores.push(2); // Good
      } else if (metrics.returnOnCapital < industryAvgs.returnOnCapital * 0.9) {
        metricScores.push(0); // Poor
      } else {
        metricScores.push(1); // Average
      }
      break;
    }
    
    case 'stability': {
      // Volatility Score (lower is better)
      if (metrics.volatility < industryAvgs.volatility * 0.9) {
        metricScores.push(2); // Good
      } else if (metrics.volatility > industryAvgs.volatility * 1.1) {
        metricScores.push(0); // Poor
      } else {
        metricScores.push(1); // Average
      }
      
      // Beta Score (closer to 1 is better)
      const betaDiff = Math.abs(metrics.beta - 1);
      const avgBetaDiff = Math.abs(industryAvgs.beta - 1);
      if (betaDiff < avgBetaDiff * 0.9) {
        metricScores.push(2); // Good
      } else if (betaDiff > avgBetaDiff * 1.1) {
        metricScores.push(0); // Poor
      } else {
        metricScores.push(1); // Average
      }
      
      // Dividend Consistency Score
      if (metrics.dividendConsistency === "High") {
        metricScores.push(2); // Good
      } else if (metrics.dividendConsistency === "Medium") {
        metricScores.push(1); // Average
      } else {
        metricScores.push(0); // Poor (Low or N/A)
      }
      break;
    }
    
    case 'value': {
      // PE Ratio Score (lower is better)
      if (metrics.peRatio < industryAvgs.peRatio * 0.9) {
        metricScores.push(2); // Good
      } else if (metrics.peRatio > industryAvgs.peRatio * 1.1) {
        metricScores.push(0); // Poor
      } else {
        metricScores.push(1); // Average
      }
      
      // PB Ratio Score (lower is better)
      if (metrics.pbRatio < industryAvgs.pbRatio * 0.9) {
        metricScores.push(2); // Good
      } else if (metrics.pbRatio > industryAvgs.pbRatio * 1.1) {
        metricScores.push(0); // Poor
      } else {
        metricScores.push(1); // Average
      }
      
      // Dividend Yield Score (higher is better)
      if (metrics.dividendYield > industryAvgs.dividendYield * 1.1) {
        metricScores.push(2); // Good
      } else if (metrics.dividendYield < industryAvgs.dividendYield * 0.9) {
        metricScores.push(0); // Poor
      } else {
        metricScores.push(1); // Average
      }
      break;
    }
    
    case 'momentum': {
      // Three Month Return Score
      if (metrics.threeMonthReturn > industryAvgs.threeMonthReturn * 1.1) {
        metricScores.push(2); // Good
      } else if (metrics.threeMonthReturn < industryAvgs.threeMonthReturn * 0.9) {
        metricScores.push(0); // Poor
      } else {
        metricScores.push(1); // Average
      }
      
      // Relative Performance Score
      if (metrics.relativePerformance > industryAvgs.relativePerformance * 1.1) {
        metricScores.push(2); // Good
      } else if (metrics.relativePerformance < industryAvgs.relativePerformance * 0.9) {
        metricScores.push(0); // Poor
      } else {
        metricScores.push(1); // Average
      }
      
      // RSI Score (optimal range 50-70)
      if (metrics.rsi >= 50 && metrics.rsi <= 70) {
        metricScores.push(2); // Good
      } else if (metrics.rsi < 40 || metrics.rsi > 75) {
        metricScores.push(0); // Poor
      } else {
        metricScores.push(1); // Average
      }
      break;
    }
    
    default:
      // Default to all average if unknown metric type
      metricScores = [1, 1, 1];
  }
  
  // Calculate average score
  const avgScore = metricScores.reduce((sum, score) => sum + score, 0) / metricScores.length;
  
  // Determine rating based on average score
  let rating: string;
  let color: string;
  
  if (avgScore >= 1.6) {
    rating = "Good";
    color = "green";
  } else if (avgScore >= 0.8) {
    rating = "Average";
    color = "yellow";
  } else {
    rating = "Poor";
    color = "red";
  }
  
  return {
    score: avgScore,
    rating,
    color
  };
}

// Get comparison status (better, similar, worse)
export function getComparisonStatus(value: number | string, industry: number | string, 
                                   isLowerBetter: boolean = false): "green" | "yellow" | "red" {
  // Handle string values
  if (typeof value === 'string' || typeof industry === 'string') {
    return "yellow"; // Default to neutral for string comparisons
  }
  
  // Handle numeric values
  if (isLowerBetter) {
    // For metrics where lower is better (like volatility, PE ratio)
    if (value < industry * 0.9) return "green";
    if (value > industry * 1.1) return "red";
    return "yellow";
  } else {
    // For metrics where higher is better (like revenue growth)
    if (value > industry * 1.1) return "green";
    if (value < industry * 0.9) return "red";
    return "yellow";
  }
}

// Get comparison symbol
export function getComparisonSymbol(value: number | string, industry: number | string, 
                                   isLowerBetter: boolean = false): "<" | "=" | ">" {
  // Handle string values
  if (typeof value === 'string' || typeof industry === 'string') {
    return "="; // Default for string comparisons
  }
  
  // Handle numeric values with 5% threshold for equality
  const ratio = value / industry;
  
  if (isLowerBetter) {
    // For metrics where lower is better
    if (ratio < 0.95) return "<"; // Value is less than industry (good)
    if (ratio > 1.05) return ">"; // Value is greater than industry (bad)
    return "="; // Approximately equal
  } else {
    // For metrics where higher is better
    if (ratio > 1.05) return ">"; // Value is greater than industry (good)
    if (ratio < 0.95) return "<"; // Value is less than industry (bad)
    return "="; // Approximately equal
  }
}