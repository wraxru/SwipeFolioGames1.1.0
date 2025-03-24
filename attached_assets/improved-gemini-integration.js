// GEMINI PROMPT AND DATA PROCESSING FOR SWIPEFOLIO

/**
 * This function creates a structured prompt for Gemini to generate
 * consistent and detailed stock information for the SwipeFolio app
 * 
 * @param {string} stackName - The name of the investment stack (e.g., "Tech Titans", "Green Giants")
 * @param {string} ticker - Optional ticker symbol if updating an existing stock
 * @returns {string} - A formatted prompt for Gemini
 */
function createGeminiPrompt(stackName, ticker = null) {
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
  },
  "chartData": {
    "1D": [],
    "5D": [],
    "1M": [],
    "6M": [],
    "1Y": [],
    "5Y": []
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
8. Don't include any actual chart data in your response - we'll generate that separately.

Make sure all explanations are educational and provide meaningful insights for novice investors without using technical jargon.
`;
}

/**
 * This function generates chart data for different time periods
 * that end at the currentPrice and respect the stock's momentum and volatility
 * 
 * @param {number} currentPrice - The current stock price 
 * @param {string} momentum - The momentum rating
 * @param {number} volatility - The volatility value
 * @returns {Object} - Chart data for different time periods
 */
function generateChartData(currentPrice, momentum, volatility) {
  // Momentum and volatility influence
  const momentumFactor = momentum === 'Strong' ? 0.8 : 
                        momentum === 'Fair' ? 0 : -0.5;

  const volatilityScale = parseFloat(volatility) || 0.15;
  
  // Generate appropriate chart data for each time period
  return {
    "1D": generateTimeSeriesData(currentPrice, 24, 'hours', {
      startChange: -0.01 - momentumFactor * 0.005,
      volatility: volatilityScale * 0.2,
      trend: momentumFactor * 0.001
    }),
    
    "5D": generateTimeSeriesData(currentPrice, 5, 'days', {
      startChange: -0.02 - momentumFactor * 0.01,
      volatility: volatilityScale * 0.4,
      trend: momentumFactor * 0.002
    }),
    
    "1M": generateTimeSeriesData(currentPrice, 30, 'days', {
      startChange: -0.05 - momentumFactor * 0.02,
      volatility: volatilityScale * 0.6,
      trend: momentumFactor * 0.003
    }),
    
    "6M": generateTimeSeriesData(currentPrice, 6, 'months', {
      startChange: -0.1 - momentumFactor * 0.05,
      volatility: volatilityScale * 0.8,
      trend: momentumFactor * 0.005
    }),
    
    "1Y": generateTimeSeriesData(currentPrice, 12, 'months', {
      startChange: -0.15 - momentumFactor * 0.1,
      volatility: volatilityScale,
      trend: momentumFactor * 0.007
    }),
    
    "5Y": generateTimeSeriesData(currentPrice, 5, 'years', {
      startChange: -0.4 - momentumFactor * 0.2,
      volatility: volatilityScale * 1.2,
      trend: momentumFactor * 0.01
    })
  };
}

/**
 * Generate time series data for charts
 * 
 * @param {number} endPrice - The price to end the chart at
 * @param {number} units - Number of time units to generate
 * @param {string} timeUnit - Type of time unit ('hours', 'days', 'months', 'years')
 * @param {Object} options - Configuration options
 * @returns {Array} - Array of data points
 */
function generateTimeSeriesData(endPrice, units, timeUnit, options = {}) {
  const {
    startChange = -0.1,  // Default price will start 10% lower
    volatility = 0.1,    // Default volatility factor
    trend = 0.002        // Default upward trend per period
  } = options;
  
  const data = [];
  const dataPoints = getDataPointsForTimeUnit(units, timeUnit);
  
  // Calculate starting price based on end price and startChange
  let startPrice = endPrice * (1 + startChange);
  
  // Calculate the constant change needed to reach the end price
  const baseStepChange = (endPrice - startPrice) / dataPoints;
  
  // Generate dates and labels based on time unit
  const {dates, labels} = generateDatesAndLabels(units, timeUnit);
  
  // Generate the price data, ensuring we end exactly at endPrice
  let currentPrice = startPrice;
  for (let i = 0; i < dataPoints; i++) {
    // More volatility for periods other than the last one
    const randomFactor = i < dataPoints - 1 
      ? (Math.random() - 0.5) * volatility 
      : 0;
    
    // Calculate the next price with base trend and volatility
    // Make sure last point is exactly endPrice
    const nextPrice = i === dataPoints - 1 
      ? endPrice 
      : currentPrice + baseStepChange + (currentPrice * (trend + randomFactor));
    
    // Add data point
    data.push({
      date: dates[Math.min(i, dates.length - 1)],
      label: labels[Math.min(i, labels.length - 1)],
      price: Math.max(0.01, nextPrice) // Prevent negative prices
    });
    
    currentPrice = nextPrice;
  }
  
  return data;
}

/**
 * Calculate how many data points to generate for a given time period
 */
function getDataPointsForTimeUnit(units, timeUnit) {
  switch(timeUnit) {
    case 'hours': return units;
    case 'days': return units * 7; // More granular for days
    case 'months': return units * 4; // Weekly points for months
    case 'years': return units * 12; // Monthly points for years
    default: return units;
  }
}

/**
 * Generate appropriate dates and labels for the x-axis
 */
function generateDatesAndLabels(units, timeUnit) {
  const dates = [];
  const labels = [];
  const now = new Date();
  
  switch(timeUnit) {
    case 'hours':
      // For a 1-day chart, show hours
      for (let i = 0; i <= units; i++) {
        const hour = (now.getHours() - (units - i) + 24) % 24;
        dates.push(new Date(now).setHours(hour, 0, 0, 0));
        labels.push(`${hour}:00`);
      }
      break;
      
    case 'days':
      // For a 5-day chart, show days
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 0; i <= units; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (units - i));
        dates.push(date.getTime());
        labels.push(days[date.getDay()]);
      }
      break;
      
    case 'months':
      // For 1M and 6M charts, show dates throughout the period
      for (let i = 0; i <= units; i++) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - (units - i));
        dates.push(date.getTime());
        labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
      }
      break;
      
    case 'years':
      // For 1Y and 5Y charts, show years
      for (let i = 0; i <= units; i++) {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - (units - i));
        dates.push(date.getTime());
        labels.push(date.getFullYear().toString());
      }
      break;
  }
  
  return { dates, labels };
}

/**
 * Process and enhance the Gemini response with chart data and format corrections
 * 
 * @param {Object} geminiResponse - The raw response from Gemini
 * @returns {Object} - Processed and enhanced stock data
 */
function processGeminiResponse(geminiResponse) {
  try {
    // Parse response if it's a string
    const stockData = typeof geminiResponse === 'string' 
      ? JSON.parse(geminiResponse) 
      : geminiResponse;
    
    // Calculate SmartScore based on metrics
    stockData.smartScore = calculateSmartScore(stockData.metrics);
    
    // Format percentChange to display with "+" sign for positive values
    stockData.formattedPercentChange = formatPercentChange(stockData.percentChange);
    
    // Generate chart data based on stock characteristics
    const volatility = stockData.specificMetrics?.stability?.volatility || "0.15";
    stockData.chartData = generateChartData(
      stockData.currentPrice,
      stockData.metrics.momentum,
      volatility
    );
    
    // Fill in metric explanation placeholders with actual values
    populateMetricExplanations(stockData);
    
    return stockData;
  } catch (error) {
    console.error("Error processing Gemini response:", error);
    return null;
  }
}

/**
 * Format percent change for display (adds + sign for positive values)
 */
function formatPercentChange(percentChange) {
  const value = parseFloat(percentChange);
  return (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
}

/**
 * Fill in placeholders in metric explanations with actual values
 */
function populateMetricExplanations(stockData) {
  for (const metricKey in stockData.metricExplanations) {
    if (stockData.metricExplanations.hasOwnProperty(metricKey) && 
        stockData.specificMetrics && 
        stockData.specificMetrics[metricKey]) {
      
      const explanation = stockData.metricExplanations[metricKey];
      const specificValues = stockData.specificMetrics[metricKey];
      
      // Replace placeholders with actual values
      for (const valueKey in specificValues) {
        if (specificValues.hasOwnProperty(valueKey)) {
          const placeholder = `[${valueKey}]`;
          const value = specificValues[valueKey];
          
          if (explanation.calculation.includes(placeholder)) {
            explanation.calculation = explanation.calculation.replace(placeholder, value);
          }
        }
      }
    }
  }
}

/**
 * Calculate a SmartScore rating (1-5) based on the metrics
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
 * Initialize the stock view when a card is clicked
 * This should be called whenever a user selects a stock card
 * 
 * @param {string} stackName - The stack the stock belongs to
 * @param {string} ticker - Optional specific ticker to load
 */
async function initializeStockView(stackName, ticker = null) {
  try {
    // Generate the Gemini prompt
    const prompt = createGeminiPrompt(stackName, ticker);
    
    // Call Gemini API (implement according to your setup)
    const response = await callGeminiAPI(prompt);
    
    // Process the response
    const stockData = processGeminiResponse(response);
    
    // Cache the complete stock data for this ticker
    cacheStockData(stockData);
    
    // Update the UI with the stock data
    updateStockUI(stockData);
    
    return stockData;
  } catch (error) {
    console.error("Error initializing stock view:", error);
    // Handle error gracefully
    displayErrorMessage("Could not load stock data");
    return null;
  }
}

/**
 * Cache the stock data for quick access when user switches tabs
 */
function cacheStockData(stockData) {
  if (!stockData || !stockData.ticker) return;
  
  // Use localStorage or another caching mechanism
  localStorage.setItem(`stock_${stockData.ticker}`, JSON.stringify(stockData));
}

/**
 * Display a metric explanation modal when a metric bubble is clicked
 * 
 * @param {string} metricType - The type of metric (performance, stability, value, momentum)
 */
function showMetricExplanation(metricType) {
  // Get the current ticker from the UI
  const currentTicker = getCurrentTickerFromUI();
  
  // Check if we have this stock data in cache
  const cachedData = localStorage.getItem(`stock_${currentTicker}`);
  
  if (!cachedData) {
    console.error("No cached data found for", currentTicker);
    return;
  }
  
  const stockData = JSON.parse(cachedData);
  const explanation = stockData.metricExplanations[metricType];
  const specificMetrics = stockData.specificMetrics[metricType];
  
  // Create HTML for the explanation modal
  const modalHTML = `
    <div class="explanation-modal">
      <div class="modal-header">
        <h3>${capitalizeFirstLetter(metricType)} Explanation</h3>
        <button class="close-button">×</button>
      </div>
      
      <div class="explanation-section">
        <div class="section-title">
          <span class="section-icon">+</span>
          <h4>How It's Calculated</h4>
        </div>
        <p>${explanation.calculation}</p>
        
        <div class="metrics-detail">
          ${createMetricsDetailHTML(metricType, specificMetrics)}
        </div>
      </div>
      
      <div class="explanation-section">
        <div class="section-title">
          <span class="section-icon">↑</span>
          <h4>Industry Comparison</h4>
        </div>
        <p>${explanation.comparison}</p>
      </div>
      
      <div class="explanation-section">
        <div class="section-title">
          <span class="section-icon">○</span>
          <h4>What It Means</h4>
        </div>
        <p>${explanation.meaning}</p>
      </div>
      
      <div class="footer-note">
        <p>These metrics are based on both historical data and forward-looking indicators. They should be used as one of many tools in your investment decision-making.</p>
      </div>
    </div>
  `;
  
  // Show the modal in your UI
  showModal(modalHTML);
}

/**
 * Create HTML for the specific metrics list
 */
function createMetricsDetailHTML(metricType, specificMetrics) {
  if (!specificMetrics) return '';
  
  let html = '<ul class="metrics-list">';
  
  switch(metricType) {
    case 'performance':
      html += `<li><strong>Revenue Growth:</strong> ${specificMetrics.revenueGrowth}</li>`;
      html += `<li><strong>Profit Margin:</strong> ${specificMetrics.profitMargin}</li>`;
      html += `<li><strong>Return on Capital:</strong> ${specificMetrics.returnOnCapital}</li>`;
      break;
    case 'stability':
      html += `<li><strong>Volatility:</strong> ${specificMetrics.volatility}</li>`;
      html += `<li><strong>Beta:</strong> ${specificMetrics.beta}</li>`;
      html += `<li><strong>Dividend Consistency:</strong> ${specificMetrics.dividendConsistency}</li>`;
      break;
    case 'value':
      html += `<li><strong>P/E Ratio:</strong> ${specificMetrics.peRatio}</li>`;
      html += `<li><strong>P/B Ratio:</strong> ${specificMetrics.pbRatio}</li>`;
      html += `<li><strong>Dividend Yield:</strong> ${specificMetrics.dividendYield}</li>`;
      break;
    case 'momentum':
      html += `<li><strong>3-Month Return:</strong> ${specificMetrics.priceReturn3Month}</li>`;
      html += `<li><strong>Relative Performance:</strong> ${specificMetrics.relativePerformance}</li>`;
      html += `<li><strong>RSI:</strong> ${specificMetrics.rsi}</li>`;
      break;
  }
  
  html += '</ul>';
  return html;
}

/**
 * Helper function to capitalize the first letter of a string
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// You'll need to implement these functions according to your UI:
// - callGeminiAPI(prompt)
// - updateStockUI(stockData) 
// - getCurrentTickerFromUI()
// - showModal(htmlContent)
// - displayErrorMessage(message)
