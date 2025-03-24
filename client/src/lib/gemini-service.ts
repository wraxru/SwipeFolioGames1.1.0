// Gemini API service for generating AI-powered stock information

/**
 * Creates a structured prompt for Gemini to generate stock information
 * @param stackName The name of the investment stack (e.g., "Tech Titans", "Green Giants")
 * @param ticker Optional ticker symbol if updating an existing stock
 * @returns A formatted prompt for Gemini
 */
export function createGeminiPrompt(stackName: string, ticker: string | null = null): string {
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
      "priceReturn3Month": "00%",
      "relativePerformance": "00%",
      "rsi": "00",
      "industryComparison": "Above Average|Average|Below Average"
    }
  },
  "metricExplanations": {
    "performance": {
      "calculation": "Based on revenue growth of [revenueGrowth], profit margins of [profitMargin], and return on invested capital of [returnOnCapital] over the past 3 years compared to industry averages.",
      "comparison": "This company's performance metrics rank in the [top quartile/second quartile/third quartile/bottom quartile] of its industry peers, showing [exceptional/solid/average/below average] operational execution.",
      "meaning": "[Strong/Fair/Low] performance indicates the company is [effectively growing revenue while maintaining healthy margins and efficient capital use/growing moderately with average profitability/struggling to grow revenue or maintain profitability]."
    },
    "stability": {
      "calculation": "Measured using price volatility of [volatility], market correlation (beta) of [beta], and [consistent/inconsistent] dividend payments over the past 5 years.",
      "comparison": "Compared to industry peers, this stock shows [lower volatility and more predictable returns/average stability characteristics/higher volatility and less predictable behavior].",
      "meaning": "[High/Fair/Unstable] stability suggests this stock may be [suitable for conservative portfolios seeking steady performance/appropriate for balanced portfolios/better suited for aggressive portfolios that can tolerate higher risk]."
    },
    "value": {
      "calculation": "Evaluated using a P/E ratio of [peRatio], P/B ratio of [pbRatio], and dividend yield of [dividendYield] relative to industry standards.",
      "comparison": "These valuation metrics are [below/in-line with/above] the industry average, indicating the stock is [potentially undervalued/fairly valued/potentially overvalued].",
      "meaning": "A [High/Fair/Low] value rating suggests investors are [getting good value for their investment/paying a reasonable price/paying a premium] relative to the company's financial fundamentals."
    },
    "momentum": {
      "calculation": "Based on 3-month price return of [priceReturn3Month], performance vs. market index of [relativePerformance], and Relative Strength Index (RSI) of [rsi].",
      "comparison": "This momentum profile is [stronger than/similar to/weaker than] most peers in the same industry.",
      "meaning": "[Strong/Fair/Weak] momentum indicates the stock is [in a solid uptrend with strong buying pressure/moving in line with market trends/showing weakness or downward pressure] in the short to medium term."
    }
  },
  "synopsis": {
    "price": "Brief note about recent price action or trend (15-20 words)",
    "company": "Recent noteworthy company news or development (15-20 words)",
    "role": "Investment classification based on metrics (e.g., 'Anchor stock for stability and moderate growth')"
  }
}

Guidelines:
1. For "companyName" and "ticker", create a fictional but realistic company that would fit in the "${stackName}" category.
2. For "currentPrice", generate a realistic price point considering the industry and company size.
3. For "percentChange", provide a value between -5.00 and +5.00 that's consistent with the "momentum" rating.
4. For "metrics", assign ratings that make sense together based on the company type.
5. For all specific metrics (revenueGrowth, peRatio, etc.), use realistic values that align with the overall metric ratings.
6. For "metricExplanations", fill in the placeholders ([revenueGrowth], etc.) with the corresponding values from specificMetrics.
7. For "role" in synopsis, classify as one of: Anchor (stable, lower growth), Driver (higher growth, lower stability), Contributor (balanced), or Speculative (high risk/reward) based on the metrics.

Make sure all explanations are educational and provide meaningful insights for novice investors without using technical jargon.
`;
}

/**
 * Interface for the Gemini API response containing stock information
 */
export interface GeminiStockResponse {
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
 * @param metrics The metrics object from Gemini
 * @returns A score between 1-5
 */
export function calculateSmartScore(metrics: GeminiStockResponse['metrics']): number {
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
    if (scoreMap[key as keyof typeof scoreMap] && 
        scoreMap[key as keyof typeof scoreMap][rating as keyof typeof scoreMap.performance]) {
      totalScore += scoreMap[key as keyof typeof scoreMap][rating as keyof typeof scoreMap.performance];
      count++;
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
  
  // Set volatility and trend based on momentum
  switch(momentum) {
    case 'Strong':
      volatility = 0.01;
      trend = 0.003;
      break;
    case 'Fair':
      volatility = 0.015;
      trend = 0;
      break;
    case 'Weak':
      volatility = 0.02;
      trend = -0.002;
      break;
    default:
      volatility = 0.015;
      trend = 0;
  }
  
  // Generate data working backward from the end price
  const data: number[] = [];
  let currentPrice = endPrice;
  
  for (let i = 0; i <= dataPoints; i++) {
    // Add current price to data
    data.push(currentPrice);
    
    // Adjust price for the next point (going backward)
    const randomFactor = (Math.random() - 0.5) * 2 * volatility;
    currentPrice = currentPrice / (1 + (trend + randomFactor));
  }
  
  // Reverse array so it ends with endPrice
  return data.reverse();
}

/**
 * Call the Gemini API to generate stock information
 * @param stackName The name of the investment stack
 * @returns Promise with the processed stock data
 */
export async function generateAIStockData(stackName: string): Promise<any> {
  try {
    const apiKey = import.meta.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not found");
    }
    
    const prompt = createGeminiPrompt(stackName);
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    
    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract the JSON content from Gemini's response
    const textResponse = data.candidates[0].content.parts[0].text;
    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}') + 1;
    const jsonStr = textResponse.substring(jsonStart, jsonEnd);
    
    // Parse the JSON
    const stockData = JSON.parse(jsonStr) as GeminiStockResponse;
    
    // Process explanations to replace placeholders with specific metrics
    if (stockData.specificMetrics) {
      populateMetricExplanations(stockData);
    }
    
    // Generate chart data with proper scale based on current price and momentum
    const chartDataByTimeFrame = generateChartDataAllTimeframes(
      stockData.currentPrice, 
      stockData.metrics.momentum, 
      stockData.specificMetrics?.stability?.volatility || "0.15"
    );
    
    // Process and enhance the data
    return {
      name: stockData.companyName,
      ticker: stockData.ticker,
      price: stockData.currentPrice,
      change: stockData.percentChange,
      rating: calculateSmartScore(stockData.metrics),
      smartScore: Math.ceil(calculateSmartScore(stockData.metrics)).toString(),
      description: stockData.description,
      metrics: {
        performance: { 
          value: stockData.metrics.performance, 
          color: stockData.metrics.performance === 'High' ? 'green' : 
                 stockData.metrics.performance === 'Fair' ? 'yellow' : 'red'
        },
        stability: { 
          value: stockData.metrics.stability, 
          color: stockData.metrics.stability === 'High' ? 'green' : 
                 stockData.metrics.stability === 'Fair' ? 'yellow' : 'red'
        },
        value: { 
          value: stockData.metrics.value, 
          color: stockData.metrics.value === 'High' ? 'green' : 
                 stockData.metrics.value === 'Fair' ? 'yellow' : 'red'
        },
        momentum: { 
          value: stockData.metrics.momentum, 
          color: stockData.metrics.momentum === 'Strong' ? 'green' : 
                 stockData.metrics.momentum === 'Fair' ? 'yellow' : 'red'
        }
      },
      synopsis: stockData.synopsis,
      metricExplanations: stockData.metricExplanations,
      specificMetrics: stockData.specificMetrics,
      chartData: chartDataByTimeFrame["1M"],
      chartDataByTimeFrame: chartDataByTimeFrame
    };
  } catch (error) {
    console.error("Error generating AI stock data:", error);
    throw error;
  }
}

/**
 * Fill in placeholder values in the metric explanations with actual values from specificMetrics
 * @param stockData The full stock data object from Gemini
 */
function populateMetricExplanations(stockData: GeminiStockResponse): void {
  if (!stockData.specificMetrics) return;
  
  for (const metricKey in stockData.metricExplanations) {
    if (stockData.metricExplanations.hasOwnProperty(metricKey) && 
        stockData.specificMetrics.hasOwnProperty(metricKey)) {
        
      const explanation = stockData.metricExplanations[metricKey as keyof typeof stockData.metricExplanations];
      const specificValues = stockData.specificMetrics[metricKey as keyof typeof stockData.specificMetrics];
      
      // Replace placeholders with actual values
      for (const valueKey in specificValues) {
        if (specificValues.hasOwnProperty(valueKey)) {
          const placeholder = `[${valueKey}]`;
          const value = specificValues[valueKey as keyof typeof specificValues];
          
          if (explanation.calculation.includes(placeholder)) {
            explanation.calculation = explanation.calculation.replace(placeholder, value);
          }
          
          if (explanation.comparison.includes(placeholder)) {
            explanation.comparison = explanation.comparison.replace(placeholder, value);
          }
          
          if (explanation.meaning.includes(placeholder)) {
            explanation.meaning = explanation.meaning.replace(placeholder, value);
          }
        }
      }
    }
  }
}

/**
 * Generate chart data for all time frames
 * @param currentPrice The current stock price
 * @param momentum The momentum rating
 * @param volatility The stock's volatility value
 * @returns Object with chart data for each time frame
 */
function generateChartDataAllTimeframes(
  currentPrice: number, 
  momentum: string, 
  volatility: string
): { [timeFrame: string]: number[] } {
  // Get volatility as a number
  const volatilityValue = parseFloat(volatility) || 0.15;
  
  // Momentum factor affects the trend direction and strength
  const momentumFactor = momentum === 'Strong' ? 0.8 : 
                        momentum === 'Fair' ? 0 : -0.5;
  
  return {
    "1D": generateImprovedChartData(currentPrice, 24, "hours", {
      startChange: -0.01 - momentumFactor * 0.005,
      volatility: volatilityValue * 0.2,
      trend: momentumFactor * 0.001
    }),
    
    "5D": generateImprovedChartData(currentPrice, 5, "days", {
      startChange: -0.02 - momentumFactor * 0.01,
      volatility: volatilityValue * 0.4,
      trend: momentumFactor * 0.002
    }),
    
    "1M": generateImprovedChartData(currentPrice, 30, "days", {
      startChange: -0.05 - momentumFactor * 0.02,
      volatility: volatilityValue * 0.6,
      trend: momentumFactor * 0.003
    }),
    
    "6M": generateImprovedChartData(currentPrice, 6, "months", {
      startChange: -0.1 - momentumFactor * 0.05,
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
  
  // Calculate starting price based on end price and startChange
  const startPrice = endPrice * (1 + startChange);
  
  // Calculate constant change needed to reach the end price
  const baseStepChange = (endPrice - startPrice) / dataPoints;
  
  // Generate price data
  const pricePoints: number[] = [];
  let currentPrice = startPrice;
  
  for (let i = 0; i < dataPoints; i++) {
    // Add randomness for all points except the last one
    const randomFactor = i < dataPoints - 1 
      ? (Math.random() - 0.5) * volatility 
      : 0;
    
    // Calculate next price with trend and volatility
    // Make sure the last point is exactly the end price
    const nextPrice = i === dataPoints - 1 
      ? endPrice 
      : currentPrice + baseStepChange + (currentPrice * (trend + randomFactor));
    
    pricePoints.push(Math.max(0.01, nextPrice)); // Prevent negative prices
    currentPrice = nextPrice;
  }
  
  return pricePoints;
}

/**
 * Calculate how many data points to generate for a time period
 */
function getDataPointCount(units: number, timeUnit: string): number {
  switch(timeUnit) {
    case "hours": return units;
    case "days": return units * 5; // More granular for days
    case "months": return units * 4; // Weekly points for months
    case "years": return units * 12; // Monthly points for years
    default: return units;
  }
}

/**
 * Generate multiple AI stock data for an industry
 * @param industry The industry name
 * @param count Number of stocks to generate
 * @returns Promise with array of stock data
 */
export async function generateMultipleStocks(industry: string, count: number = 3): Promise<any[]> {
  try {
    const stocks = [];
    // Generate 'count' number of stocks
    for (let i = 0; i < count; i++) {
      const stock = await generateAIStockData(industry);
      stocks.push(stock);
    }
    return stocks;
  } catch (error) {
    console.error("Error generating multiple stocks:", error);
    return [];
  }
}