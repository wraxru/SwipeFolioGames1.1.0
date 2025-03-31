// Mock stock data for development/fallback when API is unavailable
// Real Estate stocks data
export const realEstateStocks = {
  "AVB": {
    symbol: "AVB",
    name: "AvalonBay Communities",
    price: 173.45,
    change: 0.85,
    changePercent: 0.5,
    industry: "Residential REITs",
    metrics: {
      performance: 72,
      stability: 68,
      value: 58,
      momentum: 65,
      potential: 70,
      // Detailed metrics
      revenueGrowth: 8.5,
      profitMargin: 42.3,
      peRatio: 28.2,
      pbRatio: 2.55,
      dividendYield: 3.3,
      debtToEquity: 0.69,
      returnOnEquity: 9.8,
      beta: 0.78,
      analystRating: 2.2 // 1-5 scale, lower is better
    },
    description: "AvalonBay Communities is a real estate investment trust focused on developing, redeveloping, acquiring, and managing apartment homes across the United States, primarily in New England, the New York/New Jersey metro area, the Washington DC metro area, Seattle, and California.",
    predictedPrice: 185.22,
    returnYear: 6.78,
    quality: "High"
  },
  "O": {
    symbol: "O",
    name: "Realty Income Corp",
    price: 55.67,
    change: -0.23,
    changePercent: -0.41,
    industry: "Retail REITs",
    metrics: {
      performance: 69,
      stability: 75,
      value: 62,
      momentum: 54,
      potential: 63,
      // Detailed metrics
      revenueGrowth: 5.2,
      profitMargin: 39.5,
      peRatio: 42.1,
      pbRatio: 1.37,
      dividendYield: 5.6,
      debtToEquity: 0.81,
      returnOnEquity: 4.2,
      beta: 0.93,
      analystRating: 2.0
    },
    description: "Realty Income Corporation is a real estate investment trust that invests in free-standing, single-tenant commercial properties in the United States, Puerto Rico, and the United Kingdom that are subject to triple-net leases.",
    predictedPrice: 62.0,
    returnYear: 7.88,
    quality: "Medium-High"
  },
  "PLD": {
    symbol: "PLD",
    name: "Prologis Inc",
    price: 130.22,
    change: 2.14,
    changePercent: 1.67,
    industry: "Industrial REITs",
    metrics: {
      performance: 74,
      stability: 72,
      value: 54,
      momentum: 68,
      potential: 77,
      // Detailed metrics
      revenueGrowth: 8.5,
      profitMargin: 50.4,
      peRatio: 41.3,
      pbRatio: 2.33,
      dividendYield: 2.8,
      debtToEquity: 0.53,
      returnOnEquity: 5.3,
      beta: 1.05,
      analystRating: 1.8
    },
    description: "Prologis is a real estate investment trust headquartered in San Francisco, California that invests in logistics facilities, with a focus on warehouse and distribution centers. It is one of the largest industrial REITs globally.",
    predictedPrice: 128.79,
    returnYear: 13.27,
    quality: "High"
  },
  "SPG": {
    symbol: "SPG",
    name: "Simon Property Group",
    price: 142.76,
    change: 1.33,
    changePercent: 0.94,
    industry: "Retail REITs",
    metrics: {
      performance: 65,
      stability: 60,
      value: 72,
      momentum: 63,
      potential: 64,
      // Detailed metrics
      revenueGrowth: 4.8,
      profitMargin: 38.1,
      peRatio: 21.2,
      pbRatio: 12.45,
      dividendYield: 5.9,
      debtToEquity: 7.38,
      returnOnEquity: 58.2,
      beta: 1.54,
      analystRating: 2.3
    },
    description: "Simon Property Group is an American commercial real estate company, the largest retail REIT in the U.S., and the largest shopping mall operator in America. Its properties include malls, premium outlets, and lifestyle centers.",
    predictedPrice: 148.12,
    returnYear: 11.34,
    quality: "Medium-High"
  },
  "AMT": {
    symbol: "AMT",
    name: "American Tower Corp",
    price: 189.33,
    change: -1.77,
    changePercent: -0.93,
    industry: "Infrastructure REITs",
    metrics: {
      performance: 71,
      stability: 80,
      value: 52,
      momentum: 60,
      potential: 75,
      // Detailed metrics
      revenueGrowth: 3.6,
      profitMargin: 22.1,
      peRatio: 58.2,
      pbRatio: 17.84,
      dividendYield: 3.4,
      debtToEquity: 6.99,
      returnOnEquity: 29.9,
      beta: 0.81,
      analystRating: 1.9
    },
    description: "American Tower Corporation is a real estate investment trust and an owner and operator of wireless and broadcast communications infrastructure in several countries worldwide, including the United States, Australia, Brazil, Canada, Chile, Colombia, Costa Rica, Germany, Ghana, and many others.",
    predictedPrice: 205.45,
    returnYear: 8.46,
    quality: "High"
  }
};

// Healthcare stocks data
export const healthcareStocks = {
  "JNJ": {
    symbol: "JNJ",
    name: "Johnson & Johnson",
    price: 153.42,
    change: -1.23,
    changePercent: -0.80,
    industry: "Pharmaceuticals",
    metrics: {
      performance: 68,
      stability: 85,
      value: 65,
      momentum: 50,
      potential: 70,
      // Detailed metrics
      revenueGrowth: 2.3,
      profitMargin: 18.9,
      peRatio: 26.2,
      pbRatio: 5.23,
      dividendYield: 3.0,
      debtToEquity: 0.45,
      returnOnEquity: 21.5,
      beta: 0.65,
      analystRating: 2.1
    },
    description: "Johnson & Johnson is an American multinational corporation that develops medical devices, pharmaceuticals, and consumer packaged goods. Its common stock is a component of the Dow Jones Industrial Average.",
    predictedPrice: 165.88,
    returnYear: 9.15,
    quality: "Very High"
  },
  "PFE": {
    symbol: "PFE",
    name: "Pfizer Inc",
    price: 28.71,
    change: 0.53,
    changePercent: 1.88,
    industry: "Pharmaceuticals",
    metrics: {
      performance: 58,
      stability: 68,
      value: 75,
      momentum: 47,
      potential: 62,
      // Detailed metrics
      revenueGrowth: -40.5, // Post-covid decline
      profitMargin: 15.8,
      peRatio: 9.8,
      pbRatio: 1.97,
      dividendYield: 5.3,
      debtToEquity: 0.51,
      returnOnEquity: 11.8,
      beta: 0.72,
      analystRating: 2.5
    },
    description: "Pfizer Inc. is an American multinational pharmaceutical and biotechnology corporation headquartered in Manhattan, New York City. The company develops and produces medicines and vaccines for a wide range of medical disciplines.",
    predictedPrice: 32.25,
    returnYear: 12.33,
    quality: "Medium-High"
  },
  "UNH": {
    symbol: "UNH",
    name: "UnitedHealth Group",
    price: 490.35,
    change: 3.77,
    changePercent: 0.77,
    industry: "Healthcare Plans",
    metrics: {
      performance: 78,
      stability: 82,
      value: 62,
      momentum: 70,
      potential: 74,
      // Detailed metrics
      revenueGrowth: 14.2,
      profitMargin: 6.2,
      peRatio: 22.7,
      pbRatio: 5.42,
      dividendYield: 1.5,
      debtToEquity: 0.88,
      returnOnEquity: 26.7,
      beta: 0.91,
      analystRating: 1.7
    },
    description: "UnitedHealth Group Incorporated is an American multinational managed healthcare and insurance company. It offers health care products and insurance services and is the largest healthcare company in the world by revenue.",
    predictedPrice: 515.86,
    returnYear: 7.23,
    quality: "Very High"
  },
  "ABBV": {
    symbol: "ABBV",
    name: "AbbVie Inc",
    price: 162.48,
    change: -0.33,
    changePercent: -0.2,
    industry: "Pharmaceuticals",
    metrics: {
      performance: 71,
      stability: 73,
      value: 68,
      momentum: 65,
      potential: 67,
      // Detailed metrics
      revenueGrowth: 0.3,
      profitMargin: 11.5,
      peRatio: 44.6,
      pbRatio: 22.01,
      dividendYield: 3.9,
      debtToEquity: 5.95,
      returnOnEquity: 64.9,
      beta: 0.69,
      analystRating: 2.1
    },
    description: "AbbVie Inc. is an American publicly traded biopharmaceutical company founded in 2013 as a spin-off of Abbott Laboratories. AbbVie is focused on developing treatments in immunology, oncology, virology, neuroscience, and women's health.",
    predictedPrice: 172.82,
    returnYear: 8.86,
    quality: "High"
  },
  "SYK": {
    symbol: "SYK",
    name: "Stryker Corporation",
    price: 345.68,
    change: 1.85,
    changePercent: 0.54,
    industry: "Medical Devices",
    metrics: {
      performance: 76,
      stability: 77,
      value: 56,
      momentum: 72,
      potential: 76,
      // Detailed metrics
      revenueGrowth: 11.2,
      profitMargin: 15.4,
      peRatio: 41.9,
      pbRatio: 7.15,
      dividendYield: 1.0,
      debtToEquity: 0.86,
      returnOnEquity: 16.8,
      beta: 0.95,
      analystRating: 1.9
    },
    description: "Stryker Corporation is an American multinational medical technologies corporation. Stryker's products include implants used in joint replacement and trauma surgeries; surgical equipment and surgical navigation systems; endoscopic and communications systems; patient handling and emergency medical equipment.",
    predictedPrice: 365.24,
    returnYear: 6.13,
    quality: "High"
  }
};

// Technology stocks data
export const techStocks = {
  "AAPL": {
    symbol: "AAPL",
    name: "Apple Inc",
    price: 184.40,
    change: 0.95,
    changePercent: 0.52,
    industry: "Consumer Electronics",
    metrics: {
      performance: 82,
      stability: 80,
      value: 58,
      momentum: 75,
      potential: 79,
      // Detailed metrics
      revenueGrowth: 2.1,
      profitMargin: 25.3,
      peRatio: 30.2,
      pbRatio: 45.23,
      dividendYield: 0.5,
      debtToEquity: 1.73,
      returnOnEquity: 160.1,
      beta: 1.28,
      analystRating: 1.8
    },
    description: "Apple Inc. is an American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services. Apple is one of the Big Five American information technology companies, alongside Alphabet, Amazon, Meta, and Microsoft.",
    predictedPrice: 195.75,
    returnYear: 7.22,
    quality: "Very High"
  },
  "MSFT": {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 425.22,
    change: 2.15,
    changePercent: 0.51,
    industry: "Software—Infrastructure",
    metrics: {
      performance: 86,
      stability: 84,
      value: 52,
      momentum: 82,
      potential: 85,
      // Detailed metrics
      revenueGrowth: 15.4,
      profitMargin: 34.1,
      peRatio: 37.4,
      pbRatio: 13.95,
      dividendYield: 0.7,
      debtToEquity: 0.42,
      returnOnEquity: 43.2,
      beta: 0.93,
      analystRating: 1.4
    },
    description: "Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services. Its best-known software products are the Windows line of operating systems, the Microsoft Office suite, and the Internet Explorer and Edge web browsers.",
    predictedPrice: 455.88,
    returnYear: 10.21,
    quality: "Very High"
  },
  "GOOGL": {
    symbol: "GOOGL",
    name: "Alphabet Inc",
    price: 153.94,
    change: 1.32,
    changePercent: 0.87,
    industry: "Internet Content & Information",
    metrics: {
      performance: 81,
      stability: 78,
      value: 64,
      momentum: 79,
      potential: 80,
      // Detailed metrics
      revenueGrowth: 13.5,
      profitMargin: 24.0,
      peRatio: 25.8,
      pbRatio: 6.11,
      dividendYield: 0.5,
      debtToEquity: 0.11,
      returnOnEquity: 27.2,
      beta: 1.06,
      analystRating: 1.6
    },
    description: "Alphabet Inc. is an American multinational technology conglomerate holding company headquartered in Mountain View, California. It was created through a restructuring of Google on October 2, 2015, and became the parent company of Google and several former Google subsidiaries.",
    predictedPrice: 165.18,
    returnYear: 8.31,
    quality: "Very High"
  },
  "AMZN": {
    symbol: "AMZN",
    name: "Amazon.com Inc",
    price: 181.28,
    change: -1.45,
    changePercent: -0.80,
    industry: "Internet Retail",
    metrics: {
      performance: 78,
      stability: 72,
      value: 55,
      momentum: 75,
      potential: 83,
      // Detailed metrics
      revenueGrowth: 12.6,
      profitMargin: 5.7,
      peRatio: 59.4,
      pbRatio: 9.21,
      dividendYield: 0.0,
      debtToEquity: 0.53,
      returnOnEquity: 17.9,
      beta: 1.22,
      analystRating: 1.5
    },
    description: "Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence. It has been referred to as one of the most influential economic and cultural forces in the world.",
    predictedPrice: 199.45,
    returnYear: 11.76,
    quality: "Very High"
  },
  "META": {
    symbol: "META",
    name: "Meta Platforms Inc",
    price: 476.85,
    change: 3.65,
    changePercent: 0.77,
    industry: "Internet Content & Information",
    metrics: {
      performance: 80,
      stability: 68,
      value: 69,
      momentum: 85,
      potential: 82,
      // Detailed metrics
      revenueGrowth: 24.7,
      profitMargin: 34.5,
      peRatio: 27.8,
      pbRatio: 7.34,
      dividendYield: 0.4,
      debtToEquity: 0.17,
      returnOnEquity: 28.6,
      beta: 1.33,
      analystRating: 1.7
    },
    description: "Meta Platforms, Inc., doing business as Meta, and formerly named Facebook, Inc., is an American multinational technology conglomerate based in Menlo Park, California. The company owns Facebook, Instagram, and WhatsApp, among other products and services.",
    predictedPrice: 510.32,
    returnYear: 9.54,
    quality: "High"
  }
};

// Function to get mock data for a stock symbol
export function getMockStockData(symbol: string) {
  const allStocks = {
    ...realEstateStocks,
    ...healthcareStocks,
    ...techStocks
  };
  
  return allStocks[symbol] || null;
}

// Function to format mock data to match API response format
export function formatMockStockData(stock: any) {
  if (!stock) return null;
  
  return {
    symbol: stock.symbol,
    quote: {
      c: stock.price,
      d: stock.change,
      dp: stock.changePercent,
      h: stock.price + (stock.price * 0.01), // Mock high price
      l: stock.price - (stock.price * 0.01), // Mock low price
      o: stock.price - (stock.change / 2), // Mock open price
      pc: stock.price - stock.change, // Mock previous close
      t: Date.now()
    },
    profile: {
      country: "US",
      currency: "USD",
      exchange: "NASDAQ",
      name: stock.name,
      ticker: stock.symbol,
      weburl: `https://example.com/${stock.symbol}`,
      logo: "",
      finnhubIndustry: stock.industry
    },
    metrics: {
      '10DayAverageTradingVolume': 25.35,
      '3MonthAverageTradingVolume': 691.86,
      '52WeekHigh': stock.price * 1.2,
      '52WeekLow': stock.price * 0.8,
      '52WeekLowDate': '2023-10-27',
      '52WeekPriceReturnDaily': stock.returnYear,
      'beta': stock.metrics.beta,
      'marketCapitalization': Math.round(stock.price * 1000000000 / 100),
      'peNormalizedAnnual': stock.metrics.peRatio,
      'pfcfShareAnnual': 19.41,
      'priceRelativeToS&P50013Week': 1.21,
      'priceRelativeToS&P50026Week': 1.35,
      'priceRelativeToS&P5004Week': 1.05,
      'priceRelativeToS&P50052Week': 1.22,
      'revenueGrowth': stock.metrics.revenueGrowth,
      'roaRfy': 8.42,
      'roeTTM': stock.metrics.returnOnEquity,
      'currentDividendYieldTTM': stock.metrics.dividendYield,
      'dividendYield5Y': stock.metrics.dividendYield - 0.2,
      'dividendGrowthRate5Y': 6.76,
      'payoutRatioTTM': 40.23,
      'debtEquityQuarterly': stock.metrics.debtToEquity,
      'enterpriseValueEbit': 23.43
    },
    priceTarget: {
      targetHigh: stock.price * 1.3,
      targetLow: stock.price * 0.85,
      targetMean: stock.predictedPrice,
      targetMedian: stock.predictedPrice * 0.98,
      lastUpdated: new Date().toISOString()
    },
    recommendations: [
      {
        buy: 15,
        hold: 10,
        sell: 3,
        strongBuy: 8,
        strongSell: 2,
        period: new Date().toISOString().substring(0, 10),
        symbol: stock.symbol
      }
    ],
    lastUpdated: new Date().toISOString()
  };
}