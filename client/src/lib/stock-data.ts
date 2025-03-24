// Stock data utilities for generating random stock information

// Types for stock data
export interface StockData {
  name: string;
  ticker: string;
  price: number;
  change: number;
  rating: number;
  smartScore: string;
  description: string;
  metrics: {
    performance: { value: string; color: string };
    stability: { value: string; color: string };
    value: { value: string; color: string };
    momentum: { value: string; color: string };
  };
  synopsis: {
    price: string;
    company: string;
    role: string;
  };
  chartData: number[];
}

// Industry-specific company data
const companyData: Record<string, { companies: Array<{name: string, ticker: string, description: string}> }> = {
  "Tech": {
    companies: [
      { name: "Apple Inc.", ticker: "AAPL", description: "Global tech giant known for its integrated ecosystem of hardware, software, and services" },
      { name: "Microsoft Corp.", ticker: "MSFT", description: "Leading provider of cloud services and productivity software with growing AI capabilities" },
      { name: "Alphabet Inc.", ticker: "GOOGL", description: "Internet services conglomerate with dominance in search and online advertising markets" },
      { name: "Amazon.com Inc.", ticker: "AMZN", description: "E-commerce and cloud computing leader with expanding media and device offerings" },
      { name: "NVIDIA Corp.", ticker: "NVDA", description: "Specialized in AI and graphics processing chips driving key technological advances" },
      { name: "Meta Platforms Inc.", ticker: "META", description: "Social media giant advancing virtual and augmented reality technologies" },
      { name: "Tesla Inc.", ticker: "TSLA", description: "Electric vehicle manufacturer with renewable energy and autonomous driving focus" },
      { name: "Adobe Inc.", ticker: "ADBE", description: "Creative and marketing software provider expanding into digital experience solutions" },
      { name: "Salesforce Inc.", ticker: "CRM", description: "Leading customer relationship management platform with cloud-based enterprise solutions" },
      { name: "Intel Corp.", ticker: "INTC", description: "Semiconductor manufacturer working to regain technological leadership in chip production" }
    ]
  },
  "ESG": {
    companies: [
      { name: "NextEra Energy", ticker: "NEE", description: "America's largest renewable energy provider focused on wind and solar power generation" },
      { name: "First Solar Inc.", ticker: "FSLR", description: "Leading solar panel manufacturer with advanced thin film PV technology" },
      { name: "Vestas Wind Systems", ticker: "VWDRY", description: "Global leader in wind turbine manufacturing, installation and servicing" },
      { name: "Beyond Meat Inc.", ticker: "BYND", description: "Plant-based meat alternative company reducing environmental impact of food production" },
      { name: "Tesla Inc.", ticker: "TSLA", description: "Electric vehicle pioneer accelerating transition to sustainable transportation" },
      { name: "Orsted A/S", ticker: "DNNGY", description: "Offshore wind farm developer transforming from fossil fuels to renewables" },
      { name: "Waste Management", ticker: "WM", description: "Waste disposal company with significant recycling and renewable energy operations" },
      { name: "Linde PLC", ticker: "LIN", description: "Industrial gas company with hydrogen solutions for clean energy transition" },
      { name: "Enphase Energy", ticker: "ENPH", description: "Solar microinverter technology company enabling residential energy independence" },
      { name: "Brookfield Renewable", ticker: "BEPC", description: "Diversified renewable energy operator with hydro, wind and solar assets globally" }
    ]
  },
  "Healthcare": {
    companies: [
      { name: "Johnson & Johnson", ticker: "JNJ", description: "Diversified healthcare giant with pharmaceuticals, medical devices and consumer health products" },
      { name: "UnitedHealth Group", ticker: "UNH", description: "Largest U.S. health insurer with growing healthcare services operations" },
      { name: "Pfizer Inc.", ticker: "PFE", description: "Global pharmaceutical leader with breakthrough vaccine and therapeutic technologies" },
      { name: "Thermo Fisher Scientific", ticker: "TMO", description: "Scientific equipment and reagents provider enabling healthcare research and diagnostics" },
      { name: "Abbott Laboratories", ticker: "ABT", description: "Medical devices and diagnostics company with diverse healthcare product portfolio" },
      { name: "Eli Lilly & Co.", ticker: "LLY", description: "Pharmaceutical innovator leading in diabetes and obesity treatment development" },
      { name: "Medtronic PLC", ticker: "MDT", description: "Medical technology leader specializing in devices for chronic disease management" },
      { name: "Amgen Inc.", ticker: "AMGN", description: "Biotechnology pioneer focused on novel treatments for serious illnesses" },
      { name: "Danaher Corp.", ticker: "DHR", description: "Life sciences and diagnostics company enabling precision medicine advances" },
      { name: "Intuitive Surgical", ticker: "ISRG", description: "Robotic-assisted surgical systems developer revolutionizing minimally invasive procedures" }
    ]
  },
  "Financial Planning": {
    companies: [
      { name: "BlackRock Inc.", ticker: "BLK", description: "World's largest asset manager with extensive ETF and financial planning solutions" },
      { name: "Charles Schwab", ticker: "SCHW", description: "Brokerage and wealth management firm with comprehensive financial advisory services" },
      { name: "Visa Inc.", ticker: "V", description: "Global payments technology company facilitating financial transactions worldwide" },
      { name: "Vanguard Group", ticker: "N/A", description: "Client-owned investment management company known for low-cost index fund investing" },
      { name: "JPMorgan Chase", ticker: "JPM", description: "Leading financial services firm with wealth management and investment banking" },
      { name: "Fidelity Investments", ticker: "N/A", description: "Financial services corporation offering retirement planning and wealth management" },
      { name: "Intuit Inc.", ticker: "INTU", description: "Financial software company providing tax, accounting and personal finance solutions" },
      { name: "Bank of America", ticker: "BAC", description: "Major U.S. bank with extensive wealth management and financial planning services" },
      { name: "Morgan Stanley", ticker: "MS", description: "Wealth management and investment banking firm specializing in advisory services" },
      { name: "Ameriprise Financial", ticker: "AMP", description: "Financial planning and asset management company focused on retirement solutions" }
    ]
  },
  "Consumer": {
    companies: [
      { name: "Walmart Inc.", ticker: "WMT", description: "World's largest retailer with expanding e-commerce and subscription offerings" },
      { name: "Procter & Gamble", ticker: "PG", description: "Consumer goods giant with portfolio of household and personal care brands" },
      { name: "Coca-Cola Co.", ticker: "KO", description: "Beverage leader with global distribution network and iconic brand portfolio" },
      { name: "McDonald's Corp.", ticker: "MCD", description: "Fast food restaurant chain with massive global footprint and brand recognition" },
      { name: "Nike Inc.", ticker: "NKE", description: "Athletic footwear and apparel company with premium brand positioning and direct sales focus" },
      { name: "Starbucks Corp.", ticker: "SBUX", description: "Global coffee chain with loyal customer base and expanding digital capabilities" },
      { name: "Costco Wholesale", ticker: "COST", description: "Membership warehouse retailer known for bulk offerings and customer loyalty" },
      { name: "Target Corp.", ticker: "TGT", description: "Major retail chain with multicategory product assortment and omnichannel capabilities" },
      { name: "Chipotle Mexican Grill", ticker: "CMG", description: "Fast-casual restaurant chain with focus on food quality and digital ordering" },
      { name: "Estée Lauder", ticker: "EL", description: "Premium beauty and skincare company with portfolio of luxury cosmetic brands" }
    ]
  },
  "Real Estate": {
    companies: [
      { name: "Prologis Inc.", ticker: "PLD", description: "Industrial REIT specializing in logistics facilities and distribution centers" },
      { name: "American Tower", ticker: "AMT", description: "Communications infrastructure REIT operating wireless and broadcast towers globally" },
      { name: "Simon Property Group", ticker: "SPG", description: "Retail REIT operating premium shopping, dining, and entertainment destinations" },
      { name: "Equinix Inc.", ticker: "EQIX", description: "Data center REIT providing colocation space and interconnection services" },
      { name: "Public Storage", ticker: "PSA", description: "Self-storage REIT with extensive network of facilities across the United States" },
      { name: "Realty Income", ticker: "O", description: "Net lease REIT with monthly dividend payments and diversified commercial properties" },
      { name: "Digital Realty Trust", ticker: "DLR", description: "Data center REIT supporting cloud and information technology infrastructure" },
      { name: "Welltower Inc.", ticker: "WELL", description: "Healthcare REIT focusing on senior housing and medical office buildings" },
      { name: "AvalonBay Communities", ticker: "AVB", description: "Residential REIT developing and managing luxury apartment communities" },
      { name: "Crown Castle Inc.", ticker: "CCI", description: "Infrastructure REIT with cell towers and small cell networks for 5G deployment" }
    ]
  },
  "Crypto": {
    companies: [
      { name: "Coinbase Global", ticker: "COIN", description: "Leading cryptocurrency exchange platform with trading and custody services" },
      { name: "Block Inc.", ticker: "SQ", description: "Financial services company with significant Bitcoin investments and crypto initiatives" },
      { name: "MicroStrategy", ticker: "MSTR", description: "Software company with substantial Bitcoin holdings on corporate balance sheet" },
      { name: "Marathon Digital", ticker: "MARA", description: "Bitcoin mining company operating large-scale mining operations in North America" },
      { name: "Riot Platforms", ticker: "RIOT", description: "Cryptocurrency mining and blockchain technology company focused on Bitcoin" },
      { name: "Robinhood Markets", ticker: "HOOD", description: "Trading platform with significant cryptocurrency service offerings" },
      { name: "Galaxy Digital", ticker: "GLXY.TO", description: "Crypto-focused financial services and investment management company" },
      { name: "Silvergate Capital", ticker: "SI", description: "Banking provider specialized in cryptocurrency financial infrastructure" },
      { name: "Bakkt Holdings", ticker: "BKKT", description: "Digital asset marketplace enabling institutions and consumers to buy, sell and store digital assets" },
      { name: "Bitfarms Ltd.", ticker: "BITF", description: "Vertically integrated Bitcoin mining company powered by clean energy" }
    ]
  },
  "Bonds": {
    companies: [
      { name: "iShares Core US Aggregate Bond ETF", ticker: "AGG", description: "ETF tracking the total U.S. investment-grade bond market" },
      { name: "Vanguard Total Bond Market ETF", ticker: "BND", description: "ETF providing broad exposure to U.S. investment-grade bonds" },
      { name: "iShares iBoxx $ Investment Grade Corporate Bond ETF", ticker: "LQD", description: "ETF focused on investment-grade corporate bonds" },
      { name: "PIMCO Active Bond ETF", ticker: "BOND", description: "Actively managed ETF investing in high-quality debt securities" },
      { name: "Vanguard Short-Term Corporate Bond ETF", ticker: "VCSH", description: "ETF holding investment-grade corporate bonds with short maturities" },
      { name: "iShares TIPS Bond ETF", ticker: "TIP", description: "ETF providing exposure to inflation-protected U.S. Treasury securities" },
      { name: "Vanguard Long-Term Corporate Bond ETF", ticker: "VCLT", description: "ETF focused on long-term investment-grade corporate bonds" },
      { name: "iShares 20+ Year Treasury Bond ETF", ticker: "TLT", description: "ETF holding long-term U.S. Treasury bonds" },
      { name: "SPDR Bloomberg High Yield Bond ETF", ticker: "JNK", description: "ETF focused on high-yield corporate bonds with higher risk and return potential" },
      { name: "Vanguard Tax-Exempt Bond ETF", ticker: "VTEB", description: "ETF providing exposure to investment-grade municipal bonds" }
    ]
  },
  "ETFs": {
    companies: [
      { name: "SPDR S&P 500 ETF", ticker: "SPY", description: "The oldest and most traded ETF tracking the S&P 500 index of large-cap U.S. stocks" },
      { name: "Vanguard Total Stock Market ETF", ticker: "VTI", description: "Broad market ETF providing exposure to entire U.S. equity market across all capitalizations" },
      { name: "Invesco QQQ Trust", ticker: "QQQ", description: "ETF tracking the Nasdaq-100 Index with heavy technology sector weighting" },
      { name: "iShares Core MSCI EAFE ETF", ticker: "IEFA", description: "International ETF covering developed markets outside North America" },
      { name: "Vanguard FTSE Emerging Markets ETF", ticker: "VWO", description: "ETF tracking stocks in global emerging markets across various sectors" },
      { name: "ARK Innovation ETF", ticker: "ARKK", description: "Actively managed ETF focusing on disruptive innovation across multiple sectors" },
      { name: "Vanguard Real Estate ETF", ticker: "VNQ", description: "ETF providing exposure to REITs and real estate companies in the U.S." },
      { name: "Energy Select Sector SPDR Fund", ticker: "XLE", description: "Sector ETF tracking energy companies in the S&P 500" },
      { name: "Global X Lithium & Battery Tech ETF", ticker: "LIT", description: "Thematic ETF focusing on lithium mining and battery production companies" },
      { name: "iShares ESG Aware MSCI USA ETF", ticker: "ESGU", description: "ETF tracking U.S. companies with positive environmental, social, and governance characteristics" }
    ]
  },
  "Stocks": {
    companies: [
      { name: "Berkshire Hathaway", ticker: "BRK.B", description: "Diversified holding company led by legendary investor Warren Buffett" },
      { name: "Exxon Mobil Corp.", ticker: "XOM", description: "Integrated oil and gas company with global operations across the energy value chain" },
      { name: "Home Depot Inc.", ticker: "HD", description: "Largest home improvement retailer with strong contractor and DIY customer base" },
      { name: "Boeing Co.", ticker: "BA", description: "Aerospace manufacturer producing commercial jetliners, defense products, and space systems" },
      { name: "Caterpillar Inc.", ticker: "CAT", description: "Heavy equipment manufacturer serving construction, mining, and infrastructure industries" },
      { name: "Disney Walt Co.", ticker: "DIS", description: "Entertainment conglomerate with theme parks, film studios, and streaming services" },
      { name: "General Electric", ticker: "GE", description: "Industrial company focusing on aviation, healthcare, and energy sectors" },
      { name: "Chevron Corp.", ticker: "CVX", description: "Global integrated energy company with oil and gas production and refining operations" },
      { name: "3M Co.", ticker: "MMM", description: "Diversified technology company producing industrial, safety, and consumer products" },
      { name: "Lockheed Martin", ticker: "LMT", description: "Aerospace and defense company specializing in advanced military technology" }
    ]
  }
};

// Metric value generators with corresponding colors
const performanceOptions = [
  { value: "Strong", color: "green" },
  { value: "Good", color: "green" },
  { value: "Average", color: "yellow" },
  { value: "Weak", color: "red" },
  { value: "Poor", color: "red" }
];

const stabilityOptions = [
  { value: "High", color: "green" },
  { value: "Stable", color: "green" },
  { value: "Moderate", color: "yellow" },
  { value: "Volatile", color: "red" },
  { value: "Unstable", color: "red" }
];

const valueOptions = [
  { value: "Excellent", color: "green" },
  { value: "Good", color: "green" },
  { value: "Fair", color: "yellow" },
  { value: "Overvalued", color: "red" },
  { value: "Poor", color: "red" }
];

const momentumOptions = [
  { value: "Strong", color: "green" },
  { value: "Rising", color: "green" },
  { value: "Neutral", color: "yellow" },
  { value: "Slowing", color: "red" },
  { value: "Negative", color: "red" }
];

const smartScoreOptions = ["High", "Above Average", "Average", "Below Average", "Low"];

// Function to get a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Function to generate random chart data
const generateChartData = (trend: 'up' | 'down' | 'mixed' = 'mixed'): number[] => {
  const points = [];
  let value = 100 + Math.random() * 50;
  const volatility = Math.random() * 5 + 2;
  
  // If trend is specified, make the chart have a general trend
  const trendFactor = trend === 'up' ? 0.8 : trend === 'down' ? -0.8 : 0.1;
  
  for (let i = 0; i < 20; i++) {
    // Add random movement + slight trend bias
    value += (Math.random() - 0.5 + trendFactor * 0.25) * volatility;
    
    // Ensure value stays positive
    value = Math.max(value, 5);
    
    points.push(value);
  }
  
  return points;
};

// Generate random price synopsis based on chart trend
const generatePriceSynopsis = (change: number, industry: string): string => {
  if (change > 3) {
    return getRandomItem([
      `Rising on strong earnings and positive sector outlook`,
      `Surging after exceeding quarterly projections`,
      `Climbing on unexpected revenue growth`,
      `Up sharply following analyst upgrades`
    ]);
  } else if (change > 0) {
    return getRandomItem([
      `Steady gains amid positive industry trends`,
      `Edging higher on improved market sentiment`,
      `Showing resilience despite sector challenges`,
      `Modest gains following recent product launches`
    ]);
  } else if (change > -3) {
    return getRandomItem([
      `Slight dip following record highs last week`,
      `Minor pullback after recent rally`,
      `Trading lower on profit-taking`,
      `Small decline amid broader market adjustment`
    ]);
  } else {
    return getRandomItem([
      `Dropping on disappointing quarterly results`,
      `Down sharply following reduced guidance`,
      `Falling amid industry-wide regulatory concerns`,
      `Declining after missing analyst expectations`
    ]);
  }
};

// Generate random company news
const generateCompanyNews = (company: string, industry: string): string => {
  const newsItems = [
    `New partnership to expand market reach`,
    `Launch of innovative product line`,
    `Restructuring to improve operational efficiency`,
    `Expanding into international markets`,
    `Investment in sustainable technologies`,
    `New CEO appointment announced`,
    `Cost-cutting measures implemented`,
    `Strategic acquisition to boost growth`,
    `Increased R&D spending on innovation`,
    `Dividend increase announced for shareholders`
  ];
  
  return getRandomItem(newsItems);
};

// Generate investment role description
const generateRoleDescription = (metrics: any, industry: string): string => {
  if (metrics.stability.value === "High" || metrics.stability.value === "Stable") {
    if (metrics.performance.value === "Strong" || metrics.performance.value === "Good") {
      return "Core holding for stability and consistent growth";
    } else {
      return "Defensive position for portfolio stability";
    }
  } else if (metrics.momentum.value === "Strong" || metrics.momentum.value === "Rising") {
    return "Growth opportunity with positive momentum";
  } else if (metrics.value.value === "Excellent" || metrics.value.value === "Good") {
    return "Value play with potential for revaluation";
  } else {
    return "Speculative position with high risk/reward ratio";
  }
};

// Generate complete random stock data for a specific industry
export const generateRandomStocks = (industry: string, count: number = 10): StockData[] => {
  const industryCompanies = companyData[industry]?.companies || [];
  const stocksToGenerate = Math.min(count, industryCompanies.length);
  
  // Shuffle companies to get random selection
  const shuffled = [...industryCompanies].sort(() => 0.5 - Math.random());
  const selectedCompanies = shuffled.slice(0, stocksToGenerate);
  
  return selectedCompanies.map(company => {
    const trend = getRandomItem(['up', 'down', 'mixed']) as 'up' | 'down' | 'mixed';
    const chartData = generateChartData(trend);
    
    // Generate random price and change
    const price = Math.round((40 + Math.random() * 160) * 100) / 100;
    const change = Math.round((Math.random() * 8 - 4) * 100) / 100;
    
    // Generate metrics
    const metrics = {
      performance: getRandomItem(performanceOptions),
      stability: getRandomItem(stabilityOptions),
      value: getRandomItem(valueOptions),
      momentum: getRandomItem(momentumOptions)
    };
    
    // Generate synopsis
    const priceSynopsis = generatePriceSynopsis(change, industry);
    const companyNews = generateCompanyNews(company.name, industry);
    const role = generateRoleDescription(metrics, industry);
    
    return {
      name: company.name,
      ticker: company.ticker,
      price: price,
      change: change,
      rating: Math.round((2.5 + Math.random() * 2.5) * 10) / 10, // 2.5-5.0 rating
      smartScore: getRandomItem(smartScoreOptions),
      description: company.description,
      metrics,
      synopsis: {
        price: priceSynopsis,
        company: companyNews,
        role: role
      },
      chartData
    };
  });
};

// Get a set of random stocks for the given industry
export const getIndustryStocks = (industry: string): StockData[] => {
  return generateRandomStocks(industry);
};