// Market average constants to normalize industry data
export const marketAverages = {
  performance: {
    revenueGrowth: 7, // 7%
    profitMargin: 12, // 12%
    returnOnCapital: 12 // 12%
  },
  stability: {
    volatility: 15, // 15%
    beta: 1, // Beta of 1 (market average by definition)
    dividendConsistency: 75 // 75 (normalized, where 100 is "High", 75 is "Good", 50 is "Medium", 25 is "Poor")
  },
  value: {
    peRatio: 16, // P/E of 16x
    pbRatio: 3, // P/B of 3x
    dividendYield: 2.5 // 2.50%
  },
  momentum: {
    threeMonthReturn: 3, // 3%
    relativePerformance: 0, // 0 (market average by definition)
    rsi: 50, // RSI of 50 (neutral by definition)
    oneYearReturnAvg: 10
  }
};

// Helper to convert string dividend consistency to numeric value
export const getDividendConsistencyScore = (consistency: string): number => {
  switch (consistency.toLowerCase()) {
    case 'high':
      return 100;
    case 'good':
      return 75;
    case 'medium':
      return 50;
    case 'low':
    case 'poor':
      return 25;
    default:
      return 0; // N/A or undefined
  }
};