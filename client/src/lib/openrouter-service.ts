// OpenRouter API service for generating AI-powered stock information

/**
 * Creates a structured prompt for OpenRouter to generate stock information
 * @param stackName The name of the investment stack (e.g., "Tech Titans", "Green Giants")
 * @param ticker Optional ticker symbol if updating an existing stock
 * @returns A formatted prompt for the API
 */
export function createOpenRouterPrompt(stackName: string, ticker: string | null = null): string {
  const isREIT = stackName.includes("REIT") || stackName === "Dividend Kings";
  
  return `
You are a financial data generator for the SwipeFolio app. Generate realistic but fictional stock information for a company that would belong in the "${stackName}" investment category.

${ticker ? `The company ticker should be ${ticker}.` : ''}
${isREIT ? "This should be a REIT (Real Estate Investment Trust) company." : ""}

Return ONLY a JSON object with the following structure (no explanation or other text):

{
  "companyName": "Full Company Name",
  "ticker": "${ticker || 'TICK'}",
  "currentPrice": 00.00,
  "percentChange": 0.00,
  "description": "A concise sentence describing what the company does and its position in the industry.",
  "metrics": {
    "performance": "High|Fair|Low",
    "stability": "High|Fair|Unstable",
    "value": "High|Fair|Low",
    "momentum": "Strong|Fair|Weak"
  },
  "specificMetrics": {
    "performance": {
      "revenueGrowth": "00%",
      "profitMargin": "00%",
      "returnOnCapital": "00%",
      "industryComparison": "Above Average|Average|Below Average"
    },
    "stability": {
      "volatility": "0.0",
      "beta": "0.0",
      "dividendConsistency": "High|Medium|Low|N/A",
      "industryComparison": "Above Average|Average|Below Average"
    },
    "value": {
      "peRatio": "00.0",
      "pbRatio": "0.0",
      "dividendYield": "0.0%",
      "industryComparison": "Above Average|Average|Below Average"
    },
    "momentum": {
      "priceReturn3Month": "+00%",
      "relativePerformance": "Outperforming|At Par|Underperforming",
      "rsi": "00",
      "industryComparison": "Above Average|Average|Below Average"
    }
  },
  "synopsis": {
    "price": "Brief price analysis",
    "company": "Recent company development or news",
    "role": "anchor|driver|grower|speculative"
  },
  "metricExplanations": {
    "performance": {
      "calculation": "How {revenueGrowth} revenue growth, {profitMargin} profit margin, and {returnOnCapital} return on capital factor into the performance rating",
      "comparison": "How this compares to industry: {industryComparison}",
      "meaning": "What this metric means for investors"
    },
    "stability": {
      "calculation": "How {volatility} volatility, {beta} beta, and {dividendConsistency} dividend consistency factor into the stability rating",
      "comparison": "How this compares to industry: {industryComparison}",
      "meaning": "What this metric means for investors"
    },
    "value": {
      "calculation": "How {peRatio} P/E ratio, {pbRatio} P/B ratio, and {dividendYield} dividend yield factor into the value rating",
      "comparison": "How this compares to industry: {industryComparison}",
      "meaning": "What this metric means for investors"
    },
    "momentum": {
      "calculation": "How {priceReturn3Month} 3-month return, {relativePerformance} relative performance, and {rsi} RSI factor into the momentum rating",
      "comparison": "How this compares to industry: {industryComparison}",
      "meaning": "What this metric means for investors"
    }
  }
}

Make sure all numerical values are realistic for a company in this sector. Vary the metrics so they're not all the same rating. The description should be concise but informative.`;
}

/**
 * Interface for the API response containing stock information
 */
export interface StockResponse {
  companyName: string;
  ticker: string;
  currentPrice: number;
  percentChange: number;
  description: string;
  metrics: {
    performance: "High" | "Fair" | "Low";
    stability: "High" | "Fair" | "Unstable";
    value: "High" | "Fair" | "Low";
    momentum: "Strong" | "Fair" | "Weak";
  };
  specificMetrics?: {
    performance: {
      revenueGrowth: string;
      profitMargin: string;
      returnOnCapital: string;
      industryComparison: string;
    };
    stability: {
      volatility: string;
      beta: string;
      dividendConsistency: string;
      industryComparison: string;
    };
    value: {
      peRatio: string;
      pbRatio: string;
      dividendYield: string;
      industryComparison: string;
    };
    momentum: {
      priceReturn3Month: string;
      relativePerformance: string;
      rsi: string;
      industryComparison: string;
    };
  };
  synopsis: {
    price: string;
    company: string;
    role: string;
  };
  metricExplanations: {
    performance: {
      calculation: string;
      comparison: string;
      meaning: string;
    };
    stability: {
      calculation: string;
      comparison: string;
      meaning: string;
    };
    value: {
      calculation: string;
      comparison: string;
      meaning: string;
    };
    momentum: {
      calculation: string;
      comparison: string;
      meaning: string;
    };
  };
}

/**
 * Calculate a SmartScore rating (1-5) based on the metrics
 * @param metrics The metrics object from API
 * @returns A score between 1-5
 */
export function calculateSmartScore(metrics: StockResponse['metrics']): number {
  // Convert ratings to numerical values
  const scoreMap = {
    performance: { High: 5, Fair: 3, Low: 1 },
    stability: { High: 5, Fair: 3, Unstable: 1 },
    value: { High: 5, Fair: 3, Low: 1 },
    momentum: { Strong: 5, Fair: 3, Weak: 1 }
  };
  
  // Calculate average score
  let totalScore = 0;
  let count = 0;
  
  for (const [key, rating] of Object.entries(metrics)) {
    const categoryMap = scoreMap[key as keyof typeof scoreMap];
    if (categoryMap) {
      const score = categoryMap[rating as keyof typeof categoryMap];
      if (score) {
        totalScore += score;
        count++;
      }
    }
  }
  
  // Return average rounded to nearest 0.5
  return Math.round((totalScore / count) * 2) / 2;
}

/**
 * Generate chart data that ends at the specified current price
 * @param endPrice The current price to end the chart at
 * @param momentum The momentum rating to influence the chart pattern
 * @param timeFrame The time frame for the chart (1D, 5D, etc.)
 * @returns Array of price points for the chart
 */
export function generateChartData(
  endPrice: number, 
  momentum: string, 
  timeFrame: string = "1D"
): number[] {
  // Determine data points based on time frame
  let dataPoints = 24; // Default for 1D
  let volatility = 0.015;
  let trend = 0;
  
  // Set data points based on time frame
  switch(timeFrame) {
    case "1D": dataPoints = 24; break; // hourly
    case "5D": dataPoints = 5; break;  // daily
    case "1M": dataPoints = 30; break; // daily
    case "6M": dataPoints = 24; break; // weekly
    case "1Y": dataPoints = 12; break; // monthly
    case "5Y": dataPoints = 20; break; // quarterly
    default: dataPoints = 24;
  }
  
  // Set trend direction based on momentum
  if (momentum === "Strong") trend = 0.002;
  if (momentum === "Weak") trend = -0.002;
  
  // Generate chart data points
  const data: number[] = [];
  // Start at a price that's about 5-15% less than end price for positive momentum
  // or 5-15% more for negative momentum
  let startOffset = -0.1;
  if (trend < 0) startOffset = 0.1;
  
  let currentPrice = endPrice * (1 + startOffset);
  
  for (let i = 0; i < dataPoints; i++) {
    data.push(currentPrice);
    
    // Calculate next price with trend and volatility
    const randomFactor = (Math.random() - 0.5) * volatility;
    currentPrice = currentPrice * (1 + trend + randomFactor);
  }
  
  // Always end exactly at the current price
  data.push(endPrice);
  
  return data;
}

/**
 * Fill in placeholder values in the metric explanations with actual values from specificMetrics
 * @param stockData The full stock data object from the API
 */
function populateMetricExplanations(stockData: StockResponse): void {
  if (!stockData.metricExplanations || !stockData.specificMetrics) return;
  
  // For each metric type (performance, stability, etc.)
  Object.keys(stockData.metricExplanations).forEach(metricType => {
    const metricKey = metricType as keyof typeof stockData.metricExplanations;
    const specificMetricsKey = metricType as keyof typeof stockData.specificMetrics;
    
    if (!stockData.specificMetrics?.[specificMetricsKey]) return;
    
    // For each property in the explanation (calculation, comparison, meaning)
    Object.keys(stockData.metricExplanations[metricKey]).forEach(property => {
      const propertyKey = property as keyof typeof stockData.metricExplanations.performance;
      let text = stockData.metricExplanations[metricKey][propertyKey];
      
      // Replace each placeholder {placeholder} with the actual value
      const specificMetrics = stockData.specificMetrics![specificMetricsKey] as any;
      Object.keys(specificMetrics).forEach(specificMetric => {
        const placeholder = `{${specificMetric}}`;
        const value = specificMetrics[specificMetric];
        text = text.replace(placeholder, value);
      });
      
      // Update the explanation with the populated text
      stockData.metricExplanations[metricKey][propertyKey] = text;
    });
  });
}

/**
 * Generate chart data for all time frames
 * @param currentPrice The current stock price
 * @param momentum The momentum rating
 * @param volatility The stock's volatility value
 * @returns Object with chart data for each time frame
 */
export function generateChartDataAllTimeframes(
  currentPrice: number,
  momentum: string,
  volatility: string
): { [key: string]: number[] } {
  // Convert volatility from string to number if needed
  const volatilityValue = typeof volatility === 'string' ? parseFloat(volatility) : volatility;
  
  // Convert momentum string to numeric factor for calculations
  let momentumFactor = 0;
  switch (momentum) {
    case 'Strong':
      momentumFactor = 0.2;
      break;
    case 'Fair':
      momentumFactor = 0;
      break;
    case 'Weak':
      momentumFactor = -0.2;
      break;
    default:
      momentumFactor = 0;
  }
  
  return {
    "1D": generateImprovedChartData(currentPrice, 24, "hours", {
      startChange: -0.01 - momentumFactor * 0.005,
      volatility: volatilityValue * 0.3,
      trend: momentumFactor * 0.0004
    }),
    
    "5D": generateImprovedChartData(currentPrice, 5, "days", {
      startChange: -0.03 - momentumFactor * 0.01,
      volatility: volatilityValue * 0.4,
      trend: momentumFactor * 0.0006
    }),
    
    "1M": generateImprovedChartData(currentPrice, 30, "days", {
      startChange: -0.05 - momentumFactor * 0.03,
      volatility: volatilityValue * 0.5,
      trend: momentumFactor * 0.001
    }),
    
    "6M": generateImprovedChartData(currentPrice, 6, "months", {
      startChange: -0.1 - momentumFactor * 0.05,
      volatility: volatilityValue * 0.7,
      trend: momentumFactor * 0.003
    }),
    
    "YTD": generateImprovedChartData(currentPrice, new Date().getMonth() + 1, "months", {
      startChange: -0.08 - momentumFactor * 0.04,
      volatility: volatilityValue * 0.8,
      trend: momentumFactor * 0.005
    }),
    
    "1Y": generateImprovedChartData(currentPrice, 12, "months", {
      startChange: -0.15 - momentumFactor * 0.1,
      volatility: volatilityValue,
      trend: momentumFactor * 0.007
    }),
    
    "5Y": generateImprovedChartData(currentPrice, 5, "years", {
      startChange: -0.4 - momentumFactor * 0.2,
      volatility: volatilityValue * 1.2,
      trend: momentumFactor * 0.01
    }),
    
    "MAX": generateImprovedChartData(currentPrice, 10, "years", {
      startChange: -0.6 - momentumFactor * 0.3,
      volatility: volatilityValue * 1.5,
      trend: momentumFactor * 0.015
    })
  };
}

/**
 * Generate improved chart data for a specific time frame
 * @param endPrice The current price to end the chart at
 * @param units Number of time units to generate
 * @param timeUnit The type of time unit
 * @param options Configuration options
 * @returns Array of price points
 */
function generateImprovedChartData(
  endPrice: number,
  units: number,
  timeUnit: "hours" | "days" | "months" | "years",
  options: {
    startChange?: number;
    volatility?: number;
    trend?: number;
  } = {}
): number[] {
  const {
    startChange = -0.1,  // Start price will default to 10% lower than end price
    volatility = 0.1,    // Default volatility
    trend = 0.002        // Default slight upward trend
  } = options;
  
  // Calculate number of data points based on time unit
  const dataPoints = getDataPointCount(units, timeUnit);
  
  // Start price is a percentage change from the end price
  const startPrice = endPrice * (1 + startChange);
  
  // Calculate total change and per-step change
  const totalChange = endPrice / startPrice - 1;
  const baseChangePerStep = totalChange / dataPoints;
  
  // Generate data points
  const data: number[] = [];
  let currentPrice = startPrice;
  
  for (let i = 0; i < dataPoints; i++) {
    data.push(currentPrice);
    
    // Base trend component
    let changeForThisStep = baseChangePerStep + trend;
    
    // Random volatility component
    // More volatility at the middle of the time period, less at start/end
    const position = i / dataPoints;
    const volatilityWeight = 4 * position * (1 - position); // Parabola peaking at 0.5
    const randomFactor = ((Math.random() - 0.5) * 2 * volatility) * volatilityWeight;
    
    // Apply change for this step
    currentPrice = currentPrice * (1 + changeForThisStep + randomFactor);
    
    // Ensure we don't go below zero (extremely unlikely but just in case)
    if (currentPrice < 0.01) currentPrice = 0.01;
  }
  
  // Add final price point to ensure it ends exactly at endPrice
  data.push(endPrice);
  
  return data;
}

/**
 * Calculate how many data points to generate for a time period
 */
function getDataPointCount(units: number, timeUnit: string): number {
  switch (timeUnit) {
    case "hours":
      return units * 4; // 15-minute intervals
    case "days":
      return units * 8; // 8 points per day
    case "months":
      return units * 20; // ~20 trading days per month
    case "years":
      return units * 52; // Weekly data for years
    default:
      return units * 20;
  }
}

/**
 * Call the API to generate stock analysis information
 * This is a client-side helper that will call the backend API
 * @param companyName The company name
 * @param industry The industry name
 * @param currentPrice The current stock price
 * @param metrics The current metrics
 * @returns Promise with stock analysis
 */
export async function generateStockAnalysis(
  companyName: string,
  industry: string,
  currentPrice: number,
  metrics: any
): Promise<any> {
  try {
    // Call our server-side proxy instead of directly calling OpenRouter API
    const response = await fetch('/api/stock-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        companyName,
        industry,
        currentPrice,
        metrics
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Stock analysis generation error:', error);
    // Return a fallback analysis if API call fails
    return {
      price: `${companyName} shows steady market performance`,
      company: `${companyName} maintains position in ${industry}`,
      role: 'anchor',
      targetPrice: currentPrice * 1.1,
      metrics: {
        performance: { value: 'moderate', explanation: 'Based on standard metrics', industryComparison: 'In line with industry' },
        stability: { value: 'moderate', explanation: 'Based on volatility analysis', industryComparison: 'Average stability' },
        value: { value: 'moderate', explanation: 'P/E ratio evaluation', industryComparison: 'Fair market value' },
        momentum: { value: 'moderate', explanation: 'Recent price trends', industryComparison: 'Normal momentum' }
      }
    };
  }
}