// Industry average constants based on provided real estate data
export const industryAverages: Record<string, {
  performance: {
    revenueGrowth: number;
    profitMargin: number;
    returnOnCapital: number;
  };
  stability: {
    volatility: number;
    beta: number;
    dividendConsistency: "High" | "Medium" | "Low" | "N/A";
  };
  value: {
    peRatio: number;
    pbRatio: number;
    dividendYield: number;
  };
  momentum: {
    threeMonthReturn: number;
    relativePerformance: number;
    rsi: number;
  };
}> = {
  "Tech": {
    performance: {
      revenueGrowth: 12,
      profitMargin: 22,
      returnOnCapital: 14
    },
    stability: {
      volatility: 1.0,
      beta: 1.1,
      dividendConsistency: "Medium"
    },
    value: {
      peRatio: 22.0,
      pbRatio: 3.5,
      dividendYield: 0.9
    },
    momentum: {
      threeMonthReturn: 4.5,
      relativePerformance: 1.8,
      rsi: 55
    }
  },
  "ESG": {
    performance: {
      revenueGrowth: 8,
      profitMargin: 18,
      returnOnCapital: 12
    },
    stability: {
      volatility: 0.9,
      beta: 0.9,
      dividendConsistency: "Medium"
    },
    value: {
      peRatio: 18.0,
      pbRatio: 2.8,
      dividendYield: 1.5
    },
    momentum: {
      threeMonthReturn: 3.8,
      relativePerformance: 1.2,
      rsi: 53
    }
  },
  "Healthcare": {
    performance: {
      revenueGrowth: 15,
      profitMargin: 20,
      returnOnCapital: 13
    },
    stability: {
      volatility: 1.2,
      beta: 1.15,
      dividendConsistency: "Low"
    },
    value: {
      peRatio: 25.0,
      pbRatio: 4.0,
      dividendYield: 0.6
    },
    momentum: {
      threeMonthReturn: 5.0,
      relativePerformance: 2.0,
      rsi: 58
    }
  },
  "Financial Planning": {
    performance: {
      revenueGrowth: 7,
      profitMargin: 16,
      returnOnCapital: 15
    },
    stability: {
      volatility: 1.1,
      beta: 1.05,
      dividendConsistency: "High"
    },
    value: {
      peRatio: 17.0,
      pbRatio: 2.5,
      dividendYield: 2.2
    },
    momentum: {
      threeMonthReturn: 3.5,
      relativePerformance: 1.0,
      rsi: 51
    }
  },
  "Consumer": {
    performance: {
      revenueGrowth: 5,
      profitMargin: 12,
      returnOnCapital: 11
    },
    stability: {
      volatility: 0.95,
      beta: 0.9,
      dividendConsistency: "Medium"
    },
    value: {
      peRatio: 19.0,
      pbRatio: 2.5,
      dividendYield: 1.8
    },
    momentum: {
      threeMonthReturn: 3.0,
      relativePerformance: 1.0,
      rsi: 54
    }
  },
  "Real Estate": {
    performance: {
      revenueGrowth: 5.0,
      profitMargin: 25.0,
      returnOnCapital: 4.5
    },
    stability: {
      volatility: 8.6,
      beta: 0.8,
      dividendConsistency: "Medium"
    },
    value: {
      peRatio: 36.0,
      pbRatio: 2.5,
      dividendYield: 4.0
    },
    momentum: {
      threeMonthReturn: 2.0,
      relativePerformance: -5,
      rsi: 49
    }
  },
  // Default values for other categories
  "Default": {
    performance: {
      revenueGrowth: 7,
      profitMargin: 15,
      returnOnCapital: 12
    },
    stability: {
      volatility: 1.0,
      beta: 1.0,
      dividendConsistency: "Medium"
    },
    value: {
      peRatio: 18.0,
      pbRatio: 2.5,
      dividendYield: 1.5
    },
    momentum: {
      threeMonthReturn: 3.5,
      relativePerformance: 1.2,
      rsi: 52
    }
  }
};

// Helper to get industry averages for a specific industry or default if not found
export const getIndustryAverages = (industry: string) => {
  return industryAverages[industry] || industryAverages["Real Estate"];
};

// Helper functions to return ratings based on industry averages
import { PerformanceDetails, StabilityDetails, ValueDetails, MomentumDetails } from './stock-data';

// Define the functions locally for now
// These functions are responsible for calculating the scores and comparison indicators for metrics
function calculateCategoryScore(metricName: string, metrics: any, industryAvgs: any): {
  score: number;  // Average score between 0-2
  rating: string; // "Good", "Average", "Poor"
  color: string;  // "green", "yellow", "red"
} {
  let metricScores: number[] = [];
  
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
      if (metrics.dividendConsistency === "Good") {
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
      const divYield = typeof metrics.dividendYield === 'string' 
        ? parseFloat(metrics.dividendYield.replace('%', '')) 
        : metrics.dividendYield;
      
      if (divYield > industryAvgs.dividendYield * 1.1) {
        metricScores.push(2); // Good
      } else if (divYield < industryAvgs.dividendYield * 0.9) {
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
function getComparisonStatus(value: number | string, industry: number | string, 
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
function getComparisonSymbol(value: number | string, industry: number | string, 
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

// Helper to generate metric ratings based on values compared to industry averages
export const getMetricRating = (
  metricName: 'performance' | 'stability' | 'value' | 'momentum',
  metrics: PerformanceDetails | StabilityDetails | ValueDetails | MomentumDetails,
  industryAvgs: any
): { value: string; color: string; explanation: string } => {
  // Use the new scoring system to calculate category score
  const categoryScore = calculateCategoryScore(metricName, metrics, industryAvgs);
  
  let explanation = "";
  
  switch (metricName) {
    case 'performance': {
      const perfMetrics = metrics as PerformanceDetails;
      const perfAvgs = industryAvgs as typeof industryAverages["Default"]["performance"];
      
      if (categoryScore.rating === "Good") {
        explanation = `Based on revenue growth of ${perfMetrics.revenueGrowth}% (Industry: ${perfAvgs.revenueGrowth}%), profit margins of ${perfMetrics.profitMargin}% (Industry: ${perfAvgs.profitMargin}%), and return on invested capital of ${perfMetrics.returnOnCapital}% (Industry: ${perfAvgs.returnOnCapital}%) over the past 3 years. This company's performance metrics rank in the top quartile of its industry peers, showing exceptional operational execution. Strong performance indicates the company is effectively growing revenue while maintaining healthy margins and efficient capital use.`;
      } else if (categoryScore.rating === "Poor") {
        explanation = `Based on revenue growth of ${perfMetrics.revenueGrowth}% (Industry: ${perfAvgs.revenueGrowth}%), profit margins of ${perfMetrics.profitMargin}% (Industry: ${perfAvgs.profitMargin}%), and return on invested capital of ${perfMetrics.returnOnCapital}% (Industry: ${perfAvgs.returnOnCapital}%) over the past 3 years. This company's performance metrics fall below industry benchmarks, indicating challenges in execution. Low performance suggests the company is facing headwinds in growing revenue or maintaining profitability compared to peers.`;
      } else {
        explanation = `Based on revenue growth of ${perfMetrics.revenueGrowth}% (Industry: ${perfAvgs.revenueGrowth}%), profit margins of ${perfMetrics.profitMargin}% (Industry: ${perfAvgs.profitMargin}%), and return on invested capital of ${perfMetrics.returnOnCapital}% (Industry: ${perfAvgs.returnOnCapital}%) over the past 3 years. This company's performance metrics are in line with industry averages, showing competent operational execution. Fair performance suggests the company is growing steadily but may have opportunities to improve efficiency or scale.`;
      }
      break;
    }
      
    case 'stability': {
      const stabMetrics = metrics as StabilityDetails;
      const stabAvgs = industryAvgs as typeof industryAverages["Default"]["stability"];
      
      if (categoryScore.rating === "Good") {
        explanation = `With volatility of ${stabMetrics.volatility} (Industry: ${stabAvgs.volatility}), beta of ${stabMetrics.beta} (Industry: ${stabAvgs.beta}), and ${stabMetrics.dividendConsistency} dividend consistency, this stock shows strong stability characteristics. Low volatility suggests the stock experiences less dramatic price swings than peers during market fluctuations. A beta near 1.0 indicates price movements that are well-aligned with broader market trends but not excessively reactive.`;
      } else if (categoryScore.rating === "Poor") {
        explanation = `With volatility of ${stabMetrics.volatility} (Industry: ${stabAvgs.volatility}), beta of ${stabMetrics.beta} (Industry: ${stabAvgs.beta}), and ${stabMetrics.dividendConsistency} dividend consistency, this stock shows concerning stability characteristics. Higher volatility means sharper price movements during market fluctuations. The beta value indicates the stock has a tendency to make exaggerated moves compared to the broader market, potentially exposing investors to higher risk during downturns.`;
      } else {
        explanation = `With volatility of ${stabMetrics.volatility} (Industry: ${stabAvgs.volatility}), beta of ${stabMetrics.beta} (Industry: ${stabAvgs.beta}), and ${stabMetrics.dividendConsistency} dividend consistency, this stock shows average stability characteristics. Its price movements generally follow market patterns with moderate predictability. The stock typically doesn't experience extreme swings beyond what would be expected given market conditions, making it relatively manageable for most investment strategies.`;
      }
      break;
    }
      
    case 'value': {
      const valMetrics = metrics as ValueDetails;
      const valAvgs = industryAvgs as typeof industryAverages["Default"]["value"];
      
      if (categoryScore.rating === "Good") {
        explanation = `With a P/E ratio of ${valMetrics.peRatio} (Industry: ${valAvgs.peRatio}), P/B ratio of ${valMetrics.pbRatio} (Industry: ${valAvgs.pbRatio}), and dividend yield of ${valMetrics.dividendYield === "N/A" ? "N/A" : valMetrics.dividendYield + "%"} (Industry: ${valAvgs.dividendYield}%), this stock appears undervalued compared to industry peers. The lower P/E and P/B ratios suggest you're paying less for each dollar of earnings and book value than for similar companies. This could indicate a potential buying opportunity if the company's fundamentals remain sound.`;
      } else if (categoryScore.rating === "Poor") {
        explanation = `With a P/E ratio of ${valMetrics.peRatio} (Industry: ${valAvgs.peRatio}), P/B ratio of ${valMetrics.pbRatio} (Industry: ${valAvgs.pbRatio}), and dividend yield of ${valMetrics.dividendYield === "N/A" ? "N/A" : valMetrics.dividendYield + "%"} (Industry: ${valAvgs.dividendYield}%), this stock appears relatively expensive compared to industry peers. The higher P/E and P/B ratios indicate you're paying a premium for each dollar of earnings and book value relative to similar companies. This valuation likely reflects high growth expectations or other positive factors, but it also increases the risk of disappointment.`;
      } else {
        explanation = `With a P/E ratio of ${valMetrics.peRatio} (Industry: ${valAvgs.peRatio}), P/B ratio of ${valMetrics.pbRatio} (Industry: ${valAvgs.pbRatio}), and dividend yield of ${valMetrics.dividendYield === "N/A" ? "N/A" : valMetrics.dividendYield + "%"} (Industry: ${valAvgs.dividendYield}%), this stock is fairly valued compared to industry peers. The valuation metrics suggest the market is pricing this company in line with similar businesses, reflecting a reasonable balance between risk and potential return. This typically represents a sensible entry point for investors who believe in the company's prospects.`;
      }
      break;
    }
      
    case 'momentum': {
      const momMetrics = metrics as MomentumDetails;
      const momAvgs = industryAvgs as typeof industryAverages["Default"]["momentum"];
      
      if (categoryScore.rating === "Good") {
        explanation = `With a 3-month return of ${momMetrics.threeMonthReturn}% (Industry: ${momAvgs.threeMonthReturn}%), relative performance of ${momMetrics.relativePerformance}% vs. market, and RSI of ${momMetrics.rsi}, this stock is demonstrating strong positive momentum. The price trend shows accelerating strength compared to both industry peers and the broader market. This suggests growing investor confidence and potential continuation of the upward trend in the near term.`;
      } else if (categoryScore.rating === "Poor") {
        explanation = `With a 3-month return of ${momMetrics.threeMonthReturn}% (Industry: ${momAvgs.threeMonthReturn}%), relative performance of ${momMetrics.relativePerformance}% vs. market, and RSI of ${momMetrics.rsi}, this stock is showing weak momentum. The price action is trailing behind both industry peers and broader market benchmarks. This may indicate diminishing investor interest or confidence in the company's near-term prospects. An RSI ${momMetrics.rsi < 45 ? "below 45 suggests the stock may be oversold" : "above 70 suggests the stock may be overbought"}.`;
      } else {
        explanation = `With a 3-month return of ${momMetrics.threeMonthReturn}% (Industry: ${momAvgs.threeMonthReturn}%), relative performance of ${momMetrics.relativePerformance}% vs. market, and RSI of ${momMetrics.rsi}, this stock is showing moderate momentum. The price movement is generally in line with industry peers and broader market trends. The balanced RSI suggests the stock is neither significantly overbought nor oversold, indicating a relatively stable price trajectory in the recent period.`;
      }
      break;
    }
      
    default:
      explanation = "Insufficient data to provide a detailed analysis.";
  }
  
  // Map ratings from our new scoring system to traditional rating values
  let ratingValue = "";
  switch(metricName) {
    case 'performance':
      ratingValue = categoryScore.rating === "Good" ? "High" : 
                    categoryScore.rating === "Poor" ? "Low" : "Fair";
      break;
    case 'stability':
      ratingValue = categoryScore.rating === "Good" ? "High" : 
                    categoryScore.rating === "Poor" ? "Unstable" : "Fair";
      break;
    case 'value':
      ratingValue = categoryScore.rating === "Good" ? "Good" : 
                    categoryScore.rating === "Poor" ? "Poor" : "Fair";
      break;
    case 'momentum':
      ratingValue = categoryScore.rating === "Good" ? "Strong" : 
                    categoryScore.rating === "Poor" ? "Weak" : "Fair";
      break;
    default:
      ratingValue = "Fair";
  }
  
  return { 
    value: ratingValue, 
    color: categoryScore.color, 
    explanation 
  };
};

// Export helper functions for use in other components
export { getComparisonStatus, getComparisonSymbol };