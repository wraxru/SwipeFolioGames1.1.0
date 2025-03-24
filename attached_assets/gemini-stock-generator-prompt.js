// GEMINI PROMPT TEMPLATE FOR SWIPEFOLIO STOCK GENERATOR

/**
 * This function creates a structured prompt for Gemini to generate
 * consistent stock information for the SwipeFolio app
 * 
 * @param {string} stackName - The name of the investment stack (e.g., "Tech Titans", "Green Giants")
 * @returns {string} - A formatted prompt for Gemini
 */
function createGeminiPrompt(stackName) {
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
  },
  "chartEndpoint": "/api/charts/${stackName.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(Math.random() * 1000)}"
}

Guidelines:
1. For "companyName" and "ticker", create a fictional but realistic company that would fit in the "${stackName}" category.
2. For "currentPrice", generate a realistic price point considering the industry and company size.
3. For "percentChange", provide a value between -5.00 and +5.00 that's consistent with the "momentum" rating.
4. For "metrics", assign ratings that make sense together (e.g., high stability often means lower growth performance).
5. For "role", determine if this is an Anchor (stable, lower growth), Driver (higher growth, lower stability), Contributor (balanced), or Speculative (high risk/reward) stock based on the metrics provided.
6. Ensure all explanations in "metricExplanations" are concise and educational for novice investors.
7. The "chartEndpoint" will be used to generate a price chart ending at exactly the currentPrice value you specify.
`;
}

/**
 * This function processes Gemini's response and enhances it with additional data
 * needed for the SwipeFolio interface
 * 
 * @param {Object} geminiResponse - The parsed JSON response from Gemini
 * @returns {Object} - Enhanced stock data ready for display
 */
function processGeminiResponse(geminiResponse) {
  try {
    // Parse the response if it's a string
    const stockData = typeof geminiResponse === 'string' 
      ? JSON.parse(geminiResponse) 
      : geminiResponse;
    
    // Add SmartScore based on metrics
    stockData.smartScore = calculateSmartScore(stockData.metrics);
    
    // Generate chart data that ends at the specified price
    stockData.chartData = generateChartData(stockData.currentPrice, stockData.metrics.momentum);
    
    return stockData;
  } catch (error) {
    console.error("Error processing Gemini response:", error);
    return null;
  }
}

/**
 * Calculate a SmartScore rating (1-5) based on the metrics
 * 
 * @param {Object} metrics - The metrics object from Gemini
 * @returns {number} - A score between 1-5
 */
function calculateSmartScore(metrics) {
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
    if (scoreMap[key] && scoreMap[key][rating]) {
      totalScore += scoreMap[key][rating];
      count++;
    }
  }
  
  // Return average rounded to nearest 0.5
  return Math.round((totalScore / count) * 2) / 2;
}

/**
 * Generate chart data that ends at the specified current price
 * 
 * @param {number} endPrice - The current price to end the chart at
 * @param {string} momentum - The momentum rating to influence the chart pattern
 * @returns {Array} - Array of price points for the chart
 */
function generateChartData(endPrice, momentum) {
  // Implementation depends on your charting library
  // This is a placeholder function
  
  const dataPoints = 24; // For a 24-hour chart
  let volatility;
  let trend;
  
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
  const data = [];
  let currentPrice = endPrice;
  
  for (let i = dataPoints; i >= 0; i--) {
    data.unshift({
      time: `${i}:00`,
      price: currentPrice
    });
    
    // Adjust price for the next point (going backward)
    const randomFactor = (Math.random() - 0.5) * 2 * volatility;
    currentPrice = currentPrice / (1 + (trend + randomFactor));
  }
  
  return data;
}

// Example usage
// const prompt = createGeminiPrompt("Tech Titans");
// const geminiResponse = await callGeminiAPI(prompt); // Implement API call
// const processedData = processGeminiResponse(geminiResponse);
// console.log(processedData);
