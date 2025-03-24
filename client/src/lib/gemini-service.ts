// Gemini API service for generating AI-powered stock information

/**
 * Creates a structured prompt for Gemini to generate stock information
 * @param stackName The name of the investment stack (e.g., "Tech Titans", "Green Giants")
 * @returns A formatted prompt for Gemini
 */
export function createGeminiPrompt(stackName: string): string {
  return `
You are a financial data generator for the SwipeFolio app. Generate realistic but fictional stock information for a company that would belong in the "${stackName}" investment category.

Return ONLY a JSON object with the following structure (no explanation or other text):

{
  "companyName": "Full Company Name",
  "ticker": "TICK",
  "currentPrice": 000.00,
  "percentChange": 0.00,
  "description": "A single concise sentence describing what the company does and its position in the industry.",
  "metrics": {
    "performance": "High|Fair|Low",
    "stability": "High|Fair|Unstable",
    "value": "High|Fair|Low",
    "momentum": "Strong|Fair|Weak"
  },
  "synopsis": {
    "price": "Brief note about recent price action or trend (15-20 words)",
    "company": "Recent noteworthy company news or development (15-20 words)",
    "role": "Investment classification based on metrics (15-20 words)"
  },
  "metricExplanations": {
    "performance": {
      "calculation": "Brief explanation of how performance is calculated",
      "comparison": "How this company's performance compares to industry average",
      "meaning": "What this performance rating means for investors"
    },
    "stability": {
      "calculation": "Brief explanation of how stability is calculated",
      "comparison": "How this company's stability compares to industry average",
      "meaning": "What this stability rating means for investors"
    },
    "value": {
      "calculation": "Brief explanation of how value is calculated",
      "comparison": "How this company's value compares to industry average",
      "meaning": "What this value rating means for investors"
    },
    "momentum": {
      "calculation": "Brief explanation of how momentum is calculated",
      "comparison": "How this company's momentum compares to industry average",
      "meaning": "What this momentum rating means for investors"
    }
  }
}

Guidelines:
1. For "companyName" and "ticker", create a fictional but realistic company that would fit in the "${stackName}" category.
2. For "currentPrice", generate a realistic price point considering the industry and company size.
3. For "percentChange", provide a value between -5.00 and +5.00 that's consistent with the "momentum" rating.
4. For "metrics", assign ratings that make sense together (e.g., high stability often means lower growth performance).
5. For "role", determine if this is an Anchor (stable, lower growth), Driver (higher growth, lower stability), Contributor (balanced), or Speculative (high risk/reward) stock based on the metrics provided.
6. Ensure all explanations in "metricExplanations" are concise and educational for novice investors.
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
      chartData: generateChartData(stockData.currentPrice, stockData.metrics.momentum, "1M")
    };
  } catch (error) {
    console.error("Error generating AI stock data:", error);
    throw error;
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