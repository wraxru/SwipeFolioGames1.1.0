// Industry average constants based on the guidance document
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
      revenueGrowth: 5,
      profitMargin: 25,
      returnOnCapital: 4.5
    },
    stability: {
      volatility: 2.5,
      beta: 1,
      dividendConsistency: "Medium"
    },
    value: {
      peRatio: 36.0,
      pbRatio: 2.5,
      dividendYield: 4.0
    },
    momentum: {
      threeMonthReturn: .02,
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
  return industryAverages[industry] || industryAverages["Default"];
};

// Helper functions to return ratings based on industry averages
import { PerformanceDetails, StabilityDetails, ValueDetails, MomentumDetails } from './stock-data';

// Helper to generate metric ratings based on values compared to industry averages
export const getMetricRating = (
  metricName: 'performance' | 'stability' | 'value' | 'momentum',
  metrics: PerformanceDetails | StabilityDetails | ValueDetails | MomentumDetails,
  industryAvgs: any
): { value: string; color: string; explanation: string } => {
  let rating: string;
  let color: string;
  let explanation: string;
  
  switch (metricName) {
    case 'performance': {
      const perfMetrics = metrics as PerformanceDetails;
      const perfAvgs = industryAvgs as typeof industryAverages["Default"]["performance"];
      
      // Performance Rating Rules
      if (
        perfMetrics.revenueGrowth > perfAvgs.revenueGrowth + 5 &&
        perfMetrics.profitMargin > perfAvgs.profitMargin + 5 &&
        perfMetrics.returnOnCapital > perfAvgs.returnOnCapital + 3
      ) {
        rating = "High";
        color = "green";
        explanation = `Based on revenue growth of ${perfMetrics.revenueGrowth}% (Industry: ${perfAvgs.revenueGrowth}%), profit margins of ${perfMetrics.profitMargin}% (Industry: ${perfAvgs.profitMargin}%), and return on invested capital of ${perfMetrics.returnOnCapital}% (Industry: ${perfAvgs.returnOnCapital}%) over the past 3 years. This company's performance metrics rank in the top quartile of its industry peers, showing exceptional operational execution. Strong performance indicates the company is effectively growing revenue while maintaining healthy margins and efficient capital use.`;
      } else if (
        perfMetrics.revenueGrowth < perfAvgs.revenueGrowth - 5 ||
        perfMetrics.profitMargin < perfAvgs.profitMargin - 5 ||
        perfMetrics.returnOnCapital < perfAvgs.returnOnCapital - 3
      ) {
        rating = "Low";
        color = "red";
        explanation = `Based on revenue growth of ${perfMetrics.revenueGrowth}% (Industry: ${perfAvgs.revenueGrowth}%), profit margins of ${perfMetrics.profitMargin}% (Industry: ${perfAvgs.profitMargin}%), and return on invested capital of ${perfMetrics.returnOnCapital}% (Industry: ${perfAvgs.returnOnCapital}%) over the past 3 years. This company's performance metrics fall below industry benchmarks, indicating challenges in execution. Low performance suggests the company is facing headwinds in growing revenue or maintaining profitability compared to peers.`;
      } else {
        rating = "Fair";
        color = "yellow";
        explanation = `Based on revenue growth of ${perfMetrics.revenueGrowth}% (Industry: ${perfAvgs.revenueGrowth}%), profit margins of ${perfMetrics.profitMargin}% (Industry: ${perfAvgs.profitMargin}%), and return on invested capital of ${perfMetrics.returnOnCapital}% (Industry: ${perfAvgs.returnOnCapital}%) over the past 3 years. This company's performance metrics are in line with industry averages, showing competent operational execution. Fair performance suggests the company is growing steadily but may have opportunities to improve efficiency or scale.`;
      }
      break;
    }
      
    case 'stability': {
      const stabMetrics = metrics as StabilityDetails;
      const stabAvgs = industryAvgs as typeof industryAverages["Default"]["stability"];
      
      // Stability Rating Rules
      if (
        stabMetrics.volatility < stabAvgs.volatility - 0.1 &&
        stabMetrics.beta >= 0.8 && stabMetrics.beta <= 1.1 &&
        (stabMetrics.dividendConsistency === stabAvgs.dividendConsistency || 
         (stabMetrics.dividendConsistency === "High" && stabAvgs.dividendConsistency !== "High"))
      ) {
        rating = "High";
        color = "green";
        explanation = `With volatility of ${stabMetrics.volatility} (Industry: ${stabAvgs.volatility}), beta of ${stabMetrics.beta} (Industry: ${stabAvgs.beta}), and ${stabMetrics.dividendConsistency} dividend consistency, this stock shows strong stability characteristics. Low volatility suggests the stock experiences less dramatic price swings than peers during market fluctuations. A beta near 1.0 indicates price movements that are well-aligned with broader market trends but not excessively reactive.`;
      } else if (
        stabMetrics.volatility > stabAvgs.volatility + 0.1 ||
        stabMetrics.beta < 0.7 || stabMetrics.beta > 1.3 ||
        (stabMetrics.dividendConsistency === "Low" && stabAvgs.dividendConsistency !== "Low")
      ) {
        rating = "Unstable";
        color = "red";
        explanation = `With volatility of ${stabMetrics.volatility} (Industry: ${stabAvgs.volatility}), beta of ${stabMetrics.beta} (Industry: ${stabAvgs.beta}), and ${stabMetrics.dividendConsistency} dividend consistency, this stock shows concerning stability characteristics. Higher volatility means sharper price movements during market fluctuations. The beta value indicates the stock has a tendency to make exaggerated moves compared to the broader market, potentially exposing investors to higher risk during downturns.`;
      } else {
        rating = "Fair";
        color = "yellow";
        explanation = `With volatility of ${stabMetrics.volatility} (Industry: ${stabAvgs.volatility}), beta of ${stabMetrics.beta} (Industry: ${stabAvgs.beta}), and ${stabMetrics.dividendConsistency} dividend consistency, this stock shows average stability characteristics. Its price movements generally follow market patterns with moderate predictability. The stock typically doesn't experience extreme swings beyond what would be expected given market conditions, making it relatively manageable for most investment strategies.`;
      }
      break;
    }
      
    case 'value': {
      const valMetrics = metrics as ValueDetails;
      const valAvgs = industryAvgs as typeof industryAverages["Default"]["value"];
      
      // Value Rating Rules
      if (
        valMetrics.peRatio < valAvgs.peRatio - 2.0 &&
        valMetrics.pbRatio < valAvgs.pbRatio - 0.5 &&
        (valMetrics.dividendYield === "N/A" || (typeof valMetrics.dividendYield === 'number' && valMetrics.dividendYield > valAvgs.dividendYield + 0.5))
      ) {
        rating = "High";
        color = "green";
        explanation = `With a P/E ratio of ${valMetrics.peRatio} (Industry: ${valAvgs.peRatio}), P/B ratio of ${valMetrics.pbRatio} (Industry: ${valAvgs.pbRatio}), and dividend yield of ${valMetrics.dividendYield === "N/A" ? "N/A" : valMetrics.dividendYield + "%"} (Industry: ${valAvgs.dividendYield}%), this stock appears undervalued compared to industry peers. The lower P/E and P/B ratios suggest you're paying less for each dollar of earnings and book value than for similar companies. This could indicate a potential buying opportunity if the company's fundamentals remain sound.`;
      } else if (
        valMetrics.peRatio > valAvgs.peRatio + 2.0 ||
        valMetrics.pbRatio > valAvgs.pbRatio + 0.5 ||
        (valMetrics.dividendYield !== "N/A" && typeof valMetrics.dividendYield === 'number' && valMetrics.dividendYield < valAvgs.dividendYield - 0.5)
      ) {
        rating = "Low";
        color = "red";
        explanation = `With a P/E ratio of ${valMetrics.peRatio} (Industry: ${valAvgs.peRatio}), P/B ratio of ${valMetrics.pbRatio} (Industry: ${valAvgs.pbRatio}), and dividend yield of ${valMetrics.dividendYield === "N/A" ? "N/A" : valMetrics.dividendYield + "%"} (Industry: ${valAvgs.dividendYield}%), this stock appears relatively expensive compared to industry peers. The higher P/E and P/B ratios indicate you're paying a premium for each dollar of earnings and book value relative to similar companies. This valuation likely reflects high growth expectations or other positive factors, but it also increases the risk of disappointment.`;
      } else {
        rating = "Fair";
        color = "yellow";
        explanation = `With a P/E ratio of ${valMetrics.peRatio} (Industry: ${valAvgs.peRatio}), P/B ratio of ${valMetrics.pbRatio} (Industry: ${valAvgs.pbRatio}), and dividend yield of ${valMetrics.dividendYield === "N/A" ? "N/A" : valMetrics.dividendYield + "%"} (Industry: ${valAvgs.dividendYield}%), this stock is fairly valued compared to industry peers. The valuation metrics suggest the market is pricing this company in line with similar businesses, reflecting a reasonable balance between risk and potential return. This typically represents a sensible entry point for investors who believe in the company's prospects.`;
      }
      break;
    }
      
    case 'momentum': {
      const momMetrics = metrics as MomentumDetails;
      const momAvgs = industryAvgs as typeof industryAverages["Default"]["momentum"];
      
      // Momentum Rating Rules
      if (
        momMetrics.threeMonthReturn > momAvgs.threeMonthReturn + 2 &&
        momMetrics.relativePerformance > momAvgs.relativePerformance + 1 &&
        momMetrics.rsi >= 55 && momMetrics.rsi <= 70
      ) {
        rating = "Strong";
        color = "green";
        explanation = `With a 3-month return of ${momMetrics.threeMonthReturn}% (Industry: ${momAvgs.threeMonthReturn}%), relative performance of ${momMetrics.relativePerformance}% vs. market, and RSI of ${momMetrics.rsi}, this stock is demonstrating strong positive momentum. The price trend shows accelerating strength compared to both industry peers and the broader market. This suggests growing investor confidence and potential continuation of the upward trend in the near term.`;
      } else if (
        momMetrics.threeMonthReturn < momAvgs.threeMonthReturn - 2 ||
        momMetrics.relativePerformance < momAvgs.relativePerformance - 1 ||
        momMetrics.rsi < 45 || momMetrics.rsi > 70
      ) {
        rating = "Weak";
        color = "red";
        explanation = `With a 3-month return of ${momMetrics.threeMonthReturn}% (Industry: ${momAvgs.threeMonthReturn}%), relative performance of ${momMetrics.relativePerformance}% vs. market, and RSI of ${momMetrics.rsi}, this stock is showing weak momentum. The price action is trailing behind both industry peers and broader market benchmarks. This may indicate diminishing investor interest or confidence in the company's near-term prospects. An RSI ${momMetrics.rsi < 45 ? "below 45 suggests the stock may be oversold" : "above 70 suggests the stock may be overbought"}.`;
      } else {
        rating = "Fair";
        color = "yellow";
        explanation = `With a 3-month return of ${momMetrics.threeMonthReturn}% (Industry: ${momAvgs.threeMonthReturn}%), relative performance of ${momMetrics.relativePerformance}% vs. market, and RSI of ${momMetrics.rsi}, this stock is showing moderate momentum. The price movement is generally in line with industry peers and broader market trends. The balanced RSI suggests the stock is neither significantly overbought nor oversold, indicating a relatively stable price trajectory in the recent period.`;
      }
      break;
    }
      
    default:
      rating = "Fair";
      color = "yellow";
      explanation = "Insufficient data to provide a detailed analysis.";
  }
  
  return { value: rating, color, explanation };
};