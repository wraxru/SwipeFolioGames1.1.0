/**
 * Server-side Gemini API integration using the @google/generative-ai library
 */
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

/**
 * Create a prompt for Gemini to generate stock information for a specific stack
 */
export function createGeminiPrompt(stackName: string, ticker: string | null = null): string {
  return `Generate a realistic stock profile based on the following investment stack: "${stackName}".
  
  Your response should be detailed, accurate JSON with the following structure:
  
  {
    "companyName": "Full Company Name",
    "ticker": "SYMBOL",
    "currentPrice": 123.45,
    "percentChange": 1.23,
    "description": "Brief company description focusing on their main business, market position, and recent performance.",
    "metrics": {
      "performance": "High / Fair / Low",
      "stability": "High / Fair / Unstable",
      "value": "High / Fair / Low",
      "momentum": "Strong / Fair / Weak"
    },
    "specificMetrics": {
      "performance": {
        "revenueGrowth": "12.3% YoY",
        "profitMargin": "23.5%",
        "returnOnCapital": "18.7%",
        "industryComparison": "Above/Below industry average by X%"
      },
      "stability": {
        "volatility": "0.72",
        "beta": "1.15",
        "dividendConsistency": "Consistent/Inconsistent/None",
        "industryComparison": "More/Less stable than industry average"
      },
      "value": {
        "peRatio": "18.2x",
        "pbRatio": "3.4x",
        "dividendYield": "1.8%",
        "industryComparison": "Trading at a premium/discount to industry average"
      },
      "momentum": {
        "priceReturn3Month": "+/- 8.2%",
        "relativePerformance": "Outperforming/Underperforming sector by X%",
        "rsi": "62.5",
        "industryComparison": "Stronger/Weaker momentum than peers"
      }
    },
    "synopsis": {
      "price": "Brief analysis of recent price action",
      "company": "Brief recent company news or events",
      "role": "The role this stock plays in a portfolio (anchor, driver, grower, speculative)"
    },
    "metricExplanations": {
      "performance": {
        "calculation": "This rating incorporates {revenueGrowth} revenue growth, {profitMargin} profit margin, and {returnOnCapital} return on capital.",
        "comparison": "Performance is {industryComparison}.",
        "meaning": "A high performance rating indicates strong fundamental business execution."
      },
      "stability": {
        "calculation": "Stability is measured by {volatility} price volatility (lower is better), {beta} beta, and {dividendConsistency} dividend history.",
        "comparison": "{industryComparison}.",
        "meaning": "Higher stability suggests the stock is less affected by market turbulence."
      },
      "value": {
        "calculation": "Value considers the {peRatio} P/E ratio, {pbRatio} price-to-book, and {dividendYield} dividend yield.",
        "comparison": "{industryComparison}.",
        "meaning": "A high value rating suggests the stock may be undervalued relative to its fundamentals."
      },
      "momentum": {
        "calculation": "Momentum tracks {priceReturn3Month} 3-month returns and {rsi} RSI (Relative Strength Index).",
        "comparison": "{industryComparison}.",
        "meaning": "Strong momentum indicates positive price trends that may continue short-term."
      }
    }
  }
  
  Important:
  - Create a realistic company that would be part of the "${stackName}" industry or theme
  - If a specific ticker "${ticker || ''}" is provided, make sure to use that ticker and an appropriate company name
  - Ensure all numbers are realistic for the industry
  - Make sure metric explanations include placeholders exactly matching the property names in specificMetrics
  - Provide a variety of metrics values (don't make them all High or all Low)
  - Generate values appropriate for the company's size, industry, and maturity
  - Make sure the description and synopsis provide context about competition, market position, and key business drivers

  Respond with ONLY the JSON, no explanation text.`;
}

/**
 * Call the Gemini API to generate stock information
 * @param stackName The name of the investment stack
 * @returns Promise with the processed stock data
 */
export async function generateAIStockData(stackName: string): Promise<any> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not found");
    }
    
    // Initialize the Gemini API with the API key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const generationConfig = {
      temperature: 0.7,
      topK: 20,
      topP: 0.9,
      maxOutputTokens: 3072,
    };
    
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
    
    const prompt = createGeminiPrompt(stackName);
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });
    
    const response = result.response;
    const textResponse = response.text();
    
    // Extract and parse the JSON response from Gemini
    console.log("Raw response from Gemini:", textResponse.substring(0, 100) + "...");
    const stockData = JSON.parse(textResponse);
    
    // Populate the template placeholders with actual values
    populateMetricExplanations(stockData);
    
    // Generate chart data for different time periods based on the stock's momentum and volatility
    const volatilityValue = stockData.specificMetrics?.stability?.volatility 
      ? parseFloat(stockData.specificMetrics.stability.volatility) 
      : 0.15;
    
    // Add chart data
    stockData.chartDataByTimeFrame = generateChartDataAllTimeframes(
      stockData.currentPrice,
      stockData.metrics.momentum,
      volatilityValue
    );
    
    // Add rating and smartScore for compatibility
    stockData.rating = calculateRating(stockData.metrics);
    stockData.smartScore = getSmartScoreLabel(stockData.rating);
    
    return stockData;
  } catch (error) {
    console.error("Error generating AI stock data:", error);
    throw error;
  }
}

/**
 * Calculate a rating from 1-5 based on metrics
 */
function calculateRating(metrics: {
  performance: string;
  stability: string;
  value: string;
  momentum: string;
}): number {
  // Assign scores to each metric value
  const scores: {[key: string]: {[key: string]: number}} = {
    performance: { 'High': 5, 'Fair': 3, 'Low': 1 },
    stability: { 'High': 5, 'Fair': 3, 'Unstable': 1 },
    value: { 'High': 5, 'Fair': 3, 'Low': 1 },
    momentum: { 'Strong': 5, 'Fair': 3, 'Weak': 1 }
  };
  
  // Calculate average score
  let total = 0;
  let count = 0;
  
  for (const metric in metrics) {
    if (Object.prototype.hasOwnProperty.call(metrics, metric)) {
      const value = metrics[metric as keyof typeof metrics];
      const categoryScores = scores[metric];
      if (categoryScores && categoryScores[value]) {
        total += categoryScores[value];
        count++;
      }
    }
  }
  
  // Return rounded average to one decimal place
  return count > 0 ? Math.round((total / count) * 10) / 10 : 3.0;
}

/**
 * Get a SmartScore label based on a numeric rating
 */
function getSmartScoreLabel(rating: number): string {
  if (rating >= 4.5) return "Exceptional";
  if (rating >= 4.0) return "Excellent";
  if (rating >= 3.5) return "Very Good";
  if (rating >= 3.0) return "Good";
  if (rating >= 2.5) return "Fair";
  if (rating >= 2.0) return "Mediocre";
  return "Weak";
}

/**
 * Fill in placeholder values in the metric explanations with actual values from specificMetrics
 * @param stockData The full stock data object from Gemini
 */
function populateMetricExplanations(stockData: any): void {
  if (!stockData.metricExplanations || !stockData.specificMetrics) return;
  
  // For each metric type (performance, stability, etc.)
  Object.keys(stockData.metricExplanations).forEach(metricType => {
    if (!stockData.specificMetrics[metricType]) return;
    
    // For each property in the explanation (calculation, comparison, meaning)
    Object.keys(stockData.metricExplanations[metricType]).forEach(property => {
      let text = stockData.metricExplanations[metricType][property];
      
      // Replace each placeholder {placeholder} with the actual value
      Object.keys(stockData.specificMetrics[metricType]).forEach(specificMetric => {
        const placeholder = `{${specificMetric}}`;
        const value = stockData.specificMetrics[metricType][specificMetric];
        text = text.replace(placeholder, value);
      });
      
      // Update the explanation with the populated text
      stockData.metricExplanations[metricType][property] = text;
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
function generateChartDataAllTimeframes(
  currentPrice: number,
  momentum: string,
  volatilityValue: number
): { [key: string]: number[] } {
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
 * Generate multiple AI stock data for an industry
 * @param industry The industry name
 * @param count Number of stocks to generate
 * @returns Promise with array of stock data
 */
export async function generateMultipleStocks(industry: string, count: number = 3): Promise<any[]> {
  try {
    const stocks = [];
    
    for (let i = 0; i < count; i++) {
      const stock = await generateAIStockData(industry);
      
      // Add color mappings for metrics
      if (stock.metrics) {
        stock.metrics = {
          performance: {
            value: stock.metrics.performance,
            color: getColorForMetric('performance', stock.metrics.performance)
          },
          stability: {
            value: stock.metrics.stability,
            color: getColorForMetric('stability', stock.metrics.stability)
          },
          value: {
            value: stock.metrics.value,
            color: getColorForMetric('value', stock.metrics.value)
          },
          momentum: {
            value: stock.metrics.momentum,
            color: getColorForMetric('momentum', stock.metrics.momentum)
          }
        };
      }
      
      stocks.push(stock);
    }
    
    return stocks;
  } catch (error) {
    console.error("Error generating multiple stocks:", error);
    throw error;
  }
}

/**
 * Get a color for a metric based on its value
 */
function getColorForMetric(metricType: string, value: string): string {
  const colorMap: {[key: string]: {[key: string]: string}} = {
    performance: {
      'High': '#10b981', // Green
      'Fair': '#f59e0b', // Yellow/Orange
      'Low': '#ef4444'   // Red
    },
    stability: {
      'High': '#10b981',   // Green
      'Fair': '#f59e0b',   // Yellow/Orange
      'Unstable': '#ef4444' // Red
    },
    value: {
      'High': '#10b981', // Green
      'Fair': '#f59e0b', // Yellow/Orange
      'Low': '#ef4444'   // Red
    },
    momentum: {
      'Strong': '#10b981', // Green
      'Fair': '#f59e0b',   // Yellow/Orange
      'Weak': '#ef4444'    // Red
    }
  };
  
  return colorMap[metricType]?.[value] || '#94a3b8'; // Default to slate-400
}