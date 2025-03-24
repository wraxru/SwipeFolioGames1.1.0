// Stock data utilities for generating random stock information

// Types for stock data
export interface PerformanceDetails {
  revenueGrowth: number;
  profitMargin: number;
  returnOnCapital: number;
}

export interface StabilityDetails {
  volatility: number;
  beta: number;
  dividendConsistency: "High" | "Medium" | "Low" | "N/A";
}

export interface ValueDetails {
  peRatio: number;
  pbRatio: number;
  dividendYield: number | "N/A";
}

export interface MomentumDetails {
  threeMonthReturn: number;
  relativePerformance: number;
  rsi: number;
}

export interface MetricDetails {
  performance: { 
    value: string; 
    color: string;
    details: PerformanceDetails;
    explanation?: string;
  };
  stability: { 
    value: string; 
    color: string;
    details: StabilityDetails;
    explanation?: string;
  };
  value: { 
    value: string; 
    color: string;
    details: ValueDetails;
    explanation?: string;
  };
  momentum: { 
    value: string; 
    color: string;
    details: MomentumDetails;
    explanation?: string;
  };
}

export interface StockData {
  name: string;
  ticker: string;
  price: number;
  change: number;
  rating: number;
  smartScore: string;
  description: string;
  metrics: MetricDetails;
  synopsis: {
    price: string;
    company: string;
    role: string;
  };
  overallAnalysis?: string;
  chartData: number[];
  industry: string;
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

// Advanced AI-like synopsis generator for stock price trends
const generatePriceSynopsis = (change: number, industry: string): string => {
  // More detailed and AI-like descriptions for price movement
  if (change > 2.5) {
    return getRandomItem([
      "Surging on exceptional earnings and raised guidance for next quarter",
      "Making significant gains after multiple analyst upgrades and positive sector catalysts",
      "Breaking out to new highs with institutional accumulation and heightened options activity",
      "Rallying sharply on news of expanding profit margins and market share gains",
      "Experiencing strong momentum after exceeding revenue forecasts by double digits"
    ]);
  } else if (change > 0.5) {
    return getRandomItem([
      "Showing steady appreciation amid positive market sentiment and sector rotation",
      "Gradually climbing on improved forward guidance and analyst revisions",
      "Moving upward as new product adoption exceeds initial expectations",
      "Trading higher after successful product launch generating positive media coverage",
      "Gaining traction with investors as operational efficiency improvements materialize"
    ]);
  } else if (change > -0.5) {
    return getRandomItem([
      "Trading near equilibrium despite broader market volatility",
      "Consolidating recent gains while building technical support at current levels",
      "Showing resilience at current price points despite sector-wide pressures",
      "Holding steady as investors digest recent financial disclosures and guidance",
      "Maintaining price stability amid mixed signals from recent earnings calls"
    ]);
  } else if (change > -2.5) {
    return getRandomItem([
      "Experiencing mild pressure from profit-taking after recent outperformance",
      "Seeing modest declines amid broader market rotation to defensive sectors",
      "Pulling back slightly on light volume suggesting limited conviction from sellers",
      "Drifting lower after reaching technical resistance levels on previous session",
      "Undergoing minor correction within ongoing uptrend pattern"
    ]);
  } else {
    return getRandomItem([
      "Facing significant selling pressure after disappointing quarterly results",
      "Declining sharply on unexpected guidance reduction and margin compression",
      "Dropping on concerns about increased competition in core market segments",
      "Selling off after key product delays and development setbacks were announced",
      "Under pressure from institutional selling following regulatory challenges"
    ]);
  }
};

// More specific company news generator that uses company name and industry
const generateCompanyNews = (company: string, industry: string): string => {
  const companyFirstWord = company.split(' ')[0]; // Get first word of company name
  
  // Industry-specific news items
  const industryNews: Record<string, string[]> = {
    "Tech": [
      `${companyFirstWord}'s new AI initiative aims to revolutionize cloud computing`,
      `Strategic acquisition strengthens ${companyFirstWord}'s position in semiconductor market`,
      `Partnership with leading cloud providers expands ${companyFirstWord}'s platform reach`,
      `Recent software development accelerates ${companyFirstWord}'s digital transformation offerings`,
      `${companyFirstWord} unveils next-generation chip architecture at developer conference`
    ],
    "Healthcare": [
      `${companyFirstWord}'s breakthrough treatment receives fast-track FDA consideration`,
      `Clinical trial results exceed expectations for ${companyFirstWord}'s flagship therapy`,
      `Strategic restructuring allows ${companyFirstWord} to focus on higher-margin medical devices`,
      `${companyFirstWord} expands research partnership with leading medical institutions`,
      `Recent acquisition enhances ${companyFirstWord}'s diagnostic technology portfolio`
    ],
    "Consumer": [
      `${companyFirstWord}'s direct-to-consumer strategy showing strong initial adoption`,
      `New product line expansion helps ${companyFirstWord} reach younger demographic`,
      `${companyFirstWord}'s loyalty program achieving higher-than-expected customer retention`,
      `Supply chain improvements reducing ${companyFirstWord}'s operational costs significantly`,
      `${companyFirstWord} implementing sustainability initiatives across product manufacturing`
    ],
    "ESG": [
      `${companyFirstWord}'s carbon-neutral commitment accelerated by five years`,
      `Renewable energy installations exceed ${companyFirstWord}'s annual targets`,
      `${companyFirstWord}'s sustainability practices earn top industry certification`,
      `New green technology patent strengthens ${companyFirstWord}'s competitive advantage`,
      `${companyFirstWord} partners with environmental nonprofits for conservation efforts`
    ],
    "Real Estate": [
      `${companyFirstWord} expands portfolio with strategic acquisitions in high-growth markets`,
      `Occupancy rates exceeding expectations across ${companyFirstWord}'s commercial properties`,
      `${companyFirstWord}'s shift to mixed-use developments attracting premium tenants`,
      `Digital infrastructure investments position ${companyFirstWord} ahead of industry trends`,
      `${companyFirstWord} refinancing debt at favorable rates, improving quarterly outlook`
    ]
  };
  
  // Get industry-specific news or fallback to general news
  const newsOptions = industryNews[industry] || [
    `${companyFirstWord} announces strategic restructuring to improve operational efficiency`,
    `New leadership team at ${companyFirstWord} signals shift in corporate strategy`,
    `${companyFirstWord}'s expansion into emerging markets shows promising early results`,
    `Recent investments in automation helping ${companyFirstWord} reduce operational costs`,
    `${companyFirstWord} commits to ambitious ESG goals following stakeholder pressure`
  ];
  
  return getRandomItem(newsOptions);
};

// More sophisticated role description generator
const generateRoleDescription = (metrics: any, industry: string): string => {
  // Create industry-specific role descriptions
  const industryRoles: Record<string, Record<string, string[]>> = {
    "Tech": {
      "growth": [
        "High-growth opportunity in rapidly expanding tech segment",
        "Innovation leader with disruptive product potential",
        "Momentum play with secular tailwinds in digital transformation",
        "Market share gainer in evolving technology landscape",
        "Aggressive growth position with significant upside potential"
      ],
      "value": [
        "Established tech leader with strong cash flow generation",
        "Mature technology player with reliable dividend history",
        "Value opportunity in otherwise premium-priced tech sector",
        "Defensive tech position with recession-resistant services",
        "Undervalued tech infrastructure provider with stable business model"
      ],
      "balanced": [
        "Core technology holding with balanced risk-reward profile",
        "Hybrid growth-value technology position with diversified revenue",
        "All-weather tech exposure with both defensive and growth elements",
        "Innovation-focused company with established market position",
        "Moderate-risk technology investment with competitive moat"
      ]
    },
    "Healthcare": {
      "growth": [
        "Breakthrough biotechnology opportunity with significant market potential",
        "Innovative medical technology with rapid adoption trajectory",
        "High-growth therapeutic franchise addressing unmet medical needs",
        "Emerging healthcare leader with disruptive care delivery model",
        "Speculative opportunity in novel treatment paradigm"
      ],
      "value": [
        "Established pharmaceutical with strong patent portfolio and dividend",
        "Defensive healthcare position providing essential medical services",
        "Steady compounder in healthcare distribution and logistics",
        "Undervalued medical device manufacturer with recurring revenue",
        "Stable healthcare infrastructure provider with regulatory advantages"
      ],
      "balanced": [
        "Diversified healthcare exposure across multiple therapeutic areas",
        "Balanced pharmaceutical with both mature products and pipeline potential",
        "Moderate-risk position in essential healthcare services",
        "Healthcare innovator with established commercial products",
        "Core healthcare holding with both defensive and growth characteristics"
      ]
    }
  };
  
  // Determine role category based on metrics
  let roleCategory: string;
  if (metrics.performance.value === "Strong" || metrics.performance.value === "Good" || 
      metrics.momentum.value === "Strong" || metrics.momentum.value === "Rising") {
    roleCategory = "growth";
  } else if (metrics.value.value === "Excellent" || metrics.value.value === "Good" || 
             metrics.stability.value === "High" || metrics.stability.value === "Stable") {
    roleCategory = "value";
  } else {
    roleCategory = "balanced";
  }
  
  // Get industry and category specific roles or fallback to general
  const industryCategory = industryRoles[industry]?.[roleCategory];
  
  if (industryCategory) {
    return getRandomItem(industryCategory);
  }
  
  // Fallback general descriptions
  const generalRoles: Record<string, string[]> = {
    "growth": [
      "Growth opportunity with above-market return potential",
      "Momentum position in expanding sector",
      "Aggressive growth allocation with higher volatility",
      "High-beta exposure for bull market participation",
      "Innovative disruptor with substantial upside potential"
    ],
    "value": [
      "Anchor position for portfolio stability and income",
      "Core defensive holding with reliable cash flows",
      "Blue-chip component with consistent performance history",
      "Value opportunity at current valuation metrics",
      "Income-generating position with dividend growth potential"
    ],
    "balanced": [
      "Balanced exposure with favorable risk-reward profile",
      "Moderate-risk position with sector-average volatility",
      "Core holding with hybrid value and growth characteristics",
      "All-weather investment for various market environments",
      "Strategic allocation with favorable competitive positioning"
    ]
  };
  
  // Type assertion to make TypeScript happy - we know roleCategory will be one of the keys
  return getRandomItem(generalRoles[roleCategory as keyof typeof generalRoles] || generalRoles["balanced"]);
};

// Generate complete random stock data for a specific industry
// Industry average metrics for specific industries
const industryAverages: Record<string, {
  revenueGrowth: number;
  profitMargin: number;
  returnOnCapital: number;
  peRatio: number;
  beta: number;
  dividendYield: number;
}> = {
  "Tech": {
    revenueGrowth: 12,
    profitMargin: 18,
    returnOnCapital: 16,
    peRatio: 22,
    beta: 1.1,
    dividendYield: 1.2
  },
  "Healthcare": {
    revenueGrowth: 8,
    profitMargin: 15,
    returnOnCapital: 12,
    peRatio: 18,
    beta: 0.9,
    dividendYield: 1.8
  },
  "Consumer": {
    revenueGrowth: 5,
    profitMargin: 10,
    returnOnCapital: 11,
    peRatio: 20,
    beta: 0.85,
    dividendYield: 2.0
  },
  "Real Estate": {
    revenueGrowth: 4,
    profitMargin: 20,
    returnOnCapital: 8,
    peRatio: 16,
    beta: 0.8,
    dividendYield: 3.5
  },
  "ESG": {
    revenueGrowth: 8,
    profitMargin: 12,
    returnOnCapital: 10,
    peRatio: 18,
    beta: 0.9,
    dividendYield: 1.5
  }
};

// Generate detailed metrics based on the rating
const generateDetailedMetrics = (metricType: string, rating: string, industry: string) => {
  // Get industry averages or use defaults
  const industryAvg = industryAverages[industry] || {
    revenueGrowth: 7,
    profitMargin: 12,
    returnOnCapital: 10,
    peRatio: 18,
    beta: 1.0,
    dividendYield: 2.0
  };
  
  // Define base ranges for metrics
  const ranges = {
    performance: {
      High: {
        revenueGrowth: [industryAvg.revenueGrowth * 1.2, industryAvg.revenueGrowth * 2],
        profitMargin: [Math.max(20, industryAvg.profitMargin * 1.2), 35],
        returnOnCapital: [Math.max(15, industryAvg.returnOnCapital * 1.2), 30]
      },
      Fair: {
        revenueGrowth: [3, industryAvg.revenueGrowth * 1.1],
        profitMargin: [10, industryAvg.profitMargin],
        returnOnCapital: [8, industryAvg.returnOnCapital]
      },
      Low: {
        revenueGrowth: [-2, 3],
        profitMargin: [1, 10],
        returnOnCapital: [1, 8]
      }
    },
    stability: {
      High: {
        volatility: [0.5, 0.8],
        beta: [0.7, 1.1],
        dividendConsistency: ["High"]
      },
      Fair: {
        volatility: [0.8, 1.2],
        beta: [0.5, 1.3],
        dividendConsistency: ["Medium"]
      },
      Unstable: {
        volatility: [1.2, 2.0],
        beta: [0.2, 0.5, 1.3, 1.8], // Either low or high beta
        dividendConsistency: ["Low", "N/A"]
      }
    },
    value: {
      High: {
        peRatio: [8, Math.min(15, industryAvg.peRatio * 0.8)],
        pbRatio: [0.8, 2.5],
        dividendYield: [Math.max(2, industryAvg.dividendYield * 1.2), 5]
      },
      Fair: {
        peRatio: [15, 25],
        pbRatio: [2.5, 4],
        dividendYield: [0.5, 2]
      },
      Low: {
        peRatio: [25, 50],
        pbRatio: [4, 8],
        dividendYield: [0, 0.5, "N/A"]
      }
    },
    momentum: {
      Strong: {
        threeMonthReturn: [5, 20],
        relativePerformance: [3, 15],
        rsi: [55, 70]
      },
      Fair: {
        threeMonthReturn: [-2, 5],
        relativePerformance: [-2, 3],
        rsi: [45, 55]
      },
      Weak: {
        threeMonthReturn: [-15, -2],
        relativePerformance: [-10, -2],
        rsi: [30, 45]
      }
    }
  };
  
  // Function to get random number in range
  const getRandomInRange = (min: number, max: number) => {
    return Math.round((min + Math.random() * (max - min)) * 100) / 100;
  };
  
  // Function to get random item from array
  const getRandomFromArray = (arr: any[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };
  
  // Generate details based on metric type and rating
  switch (metricType) {
    case 'performance':
      const perfRange = ranges.performance[rating as keyof typeof ranges.performance] || ranges.performance.Fair;
      return {
        revenueGrowth: getRandomInRange(perfRange.revenueGrowth[0], perfRange.revenueGrowth[1]),
        profitMargin: getRandomInRange(perfRange.profitMargin[0], perfRange.profitMargin[1]),
        returnOnCapital: getRandomInRange(perfRange.returnOnCapital[0], perfRange.returnOnCapital[1])
      };
      
    case 'stability':
      const stabRange = ranges.stability[rating as keyof typeof ranges.stability] || ranges.stability.Fair;
      const betaOptions = Array.isArray(stabRange.beta) 
        ? [getRandomFromArray(stabRange.beta)] 
        : [stabRange.beta[0], stabRange.beta[1]];
      return {
        volatility: getRandomInRange(stabRange.volatility[0], stabRange.volatility[1]),
        beta: getRandomInRange(betaOptions[0], betaOptions.length > 1 ? betaOptions[1] : betaOptions[0] + 0.1),
        dividendConsistency: getRandomFromArray(stabRange.dividendConsistency)
      };
      
    case 'value':
      const valRange = ranges.value[rating as keyof typeof ranges.value] || ranges.value.Fair;
      const yieldOptions = Array.isArray(valRange.dividendYield) 
        ? valRange.dividendYield 
        : [valRange.dividendYield[0], valRange.dividendYield[1]];
      return {
        peRatio: getRandomInRange(valRange.peRatio[0], valRange.peRatio[1]),
        pbRatio: getRandomInRange(valRange.pbRatio[0], valRange.pbRatio[1]),
        dividendYield: typeof yieldOptions[yieldOptions.length - 1] === "string" 
          ? (Math.random() > 0.3 ? getRandomInRange(0, 0.5) : "N/A" as "N/A") 
          : getRandomInRange(Number(yieldOptions[0]), Number(yieldOptions[1]))
      };
      
    case 'momentum':
      const momRange = ranges.momentum[rating as keyof typeof ranges.momentum] || ranges.momentum.Fair;
      return {
        threeMonthReturn: getRandomInRange(momRange.threeMonthReturn[0], momRange.threeMonthReturn[1]),
        relativePerformance: getRandomInRange(momRange.relativePerformance[0], momRange.relativePerformance[1]),
        rsi: getRandomInRange(momRange.rsi[0], momRange.rsi[1])
      };
      
    default:
      return {};
  }
};

import { getStockAnalysis } from "./stock-analysis-data";

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
    
    // Get basic metrics with rating only
    const basicMetrics = {
      performance: getRandomItem(performanceOptions),
      stability: getRandomItem(stabilityOptions),
      value: getRandomItem(valueOptions),
      momentum: getRandomItem(momentumOptions)
    };
    
    // Generate detailed metrics based on ratings
    const detailedMetrics = {
      performance: {
        ...basicMetrics.performance,
        details: generateDetailedMetrics('performance', basicMetrics.performance.value, industry) as any
      },
      stability: {
        ...basicMetrics.stability,
        details: generateDetailedMetrics('stability', basicMetrics.stability.value, industry) as any
      },
      value: {
        ...basicMetrics.value,
        details: generateDetailedMetrics('value', basicMetrics.value.value, industry) as any
      },
      momentum: {
        ...basicMetrics.momentum,
        details: generateDetailedMetrics('momentum', basicMetrics.momentum.value, industry) as any
      }
    };
    
    // Generate synopsis
    const priceSynopsis = generatePriceSynopsis(change, industry);
    const companyNews = generateCompanyNews(company.name, industry);
    const role = generateRoleDescription(basicMetrics, industry);
    
    // Generate a rating between 2.5 and 9.5
    const rating = Math.round((2.5 + Math.random() * 7) * 10) / 10;
    
    // Get overall analysis from our data or generate one
    const overallAnalysis = getStockAnalysis(company.ticker, industry);
    
    return {
      name: company.name,
      ticker: company.ticker,
      price: price,
      change: change,
      rating: rating,
      smartScore: getRandomItem(smartScoreOptions),
      description: company.description,
      metrics: detailedMetrics,
      synopsis: {
        price: priceSynopsis,
        company: companyNews,
        role: role
      },
      overallAnalysis,
      chartData,
      industry
    };
  });
};

// Get a set of random stocks for the given industry
// Hardcoded stock data for specific industries
const hardcodedStocks: Record<string, StockData[]> = {
  "Real Estate": [
    {
      name: "Prologis Inc.",
      ticker: "PLD",
      price: 127.85,
      change: 0.65,
      rating: 4.2,
      smartScore: "High",
      description: "Global leader in logistics real estate with a focus on high-barrier, high-growth markets.",
      metrics: {
        performance: { 
          value: "Good", 
          color: "green",
          details: {
            revenueGrowth: 8.5,
            profitMargin: 39.7,
            returnOnCapital: 10.2
          },
          explanation: "Prologis demonstrates strong operational performance with above-average revenue growth (8.5% vs industry 6%) and excellent profit margins (39.7% vs industry 35%). Their return on capital is exceptional at 10.2%, indicating efficient use of investments to generate profits. This performance is driven by strategic positioning in high-demand logistics markets and e-commerce growth."
        },
        stability: { 
          value: "High", 
          color: "green",
          details: {
            volatility: 0.75,
            beta: 0.85,
            dividendConsistency: "High"
          },
          explanation: "With lower volatility (0.75) than the real estate sector average (0.8) and a beta of 0.85, Prologis offers more price stability than typical real estate investments. Their high dividend consistency indicates reliable income potential, making this a relatively stable holding even during market turbulence."
        },
        value: { 
          value: "Fair", 
          color: "yellow",
          details: {
            peRatio: 17.8,
            pbRatio: 2.0,
            dividendYield: 3.2
          },
          explanation: "Prologis trades at a modest premium to the real estate sector (PE ratio of 17.8 vs industry 16.0) reflecting its quality positioning. The dividend yield of 3.2% is slightly above the industry average of 3.0%, offering reasonable income. Overall, the valuation is fair considering its growth profile and market leadership."
        },
        momentum: { 
          value: "Fair", 
          color: "yellow",
          details: {
            threeMonthReturn: 2.8,
            relativePerformance: 0.3,
            rsi: 52
          },
          explanation: "Prologis shows moderate price momentum with a three-month return of 2.8% (vs industry 2.5%) and relative performance slightly above the sector. With an RSI of 52, the stock is neither overbought nor oversold, indicating balanced trading conditions with modest upward movement."
        }
      },
      synopsis: {
        price: "Showing resilience at current price points despite sector-wide pressures",
        company: "Prologis expands portfolio with strategic acquisitions in high-growth logistics markets",
        role: "Core real estate holding with solid dividend and e-commerce driven growth tailwinds"
      },
      overallAnalysis: "A high-quality logistics REIT benefiting from e-commerce growth with strong performance and stability. Offers a balanced opportunity with above-average growth, defensive characteristics, and reliable income.",
      chartData: [126.2, 127.1, 126.8, 126.5, 126.9, 127.3, 127.8, 127.4, 127.7, 128.2, 127.9, 127.85],
      industry: "Real Estate"
    },
    {
      name: "American Tower Corp.",
      ticker: "AMT",
      price: 186.45,
      change: -0.32,
      rating: 4.1,
      smartScore: "High",
      description: "Leading owner and operator of wireless and broadcast communications infrastructure globally.",
      metrics: {
        performance: { 
          value: "Good", 
          color: "green",
          details: {
            revenueGrowth: 7.2,
            profitMargin: 40.3,
            returnOnCapital: 10.8
          },
          explanation: "American Tower shows strong financial performance with revenue growth of 7.2% exceeding the industry average of 6%. Its profit margin of 40.3% is significantly higher than the industry's 35%, demonstrating excellent cost management. The company's 10.8% return on capital indicates efficient deployment of investments across its infrastructure assets."
        },
        stability: { 
          value: "High", 
          color: "green",
          details: {
            volatility: 0.72,
            beta: 0.75,
            dividendConsistency: "High"
          },
          explanation: "American Tower offers exceptional stability with low volatility (0.72) compared to the industry average (0.8). Its beta of 0.75 indicates less susceptibility to market swings, while its high dividend consistency provides reliable income. This stability stems from long-term contracts with major telecommunications providers."
        },
        value: { 
          value: "Fair", 
          color: "yellow",
          details: {
            peRatio: 18.2,
            pbRatio: 2.1,
            dividendYield: 3.4
          },
          explanation: "Trading at a slight premium to the real estate sector with a PE ratio of 18.2 versus the industry's 16.0, American Tower's valuation reflects its quality assets and growth prospects. The dividend yield of 3.4% exceeds the industry average of 3.0%, offering attractive income potential despite the premium valuation."
        },
        momentum: { 
          value: "Fair", 
          color: "yellow",
          details: {
            threeMonthReturn: 1.8,
            relativePerformance: -0.2,
            rsi: 49
          },
          explanation: "American Tower shows modest momentum with a three-month return of 1.8%, slightly below the industry average of 2.5%. With an RSI of 49, the stock is near equilibrium, neither overbought nor oversold. Recent underperformance reflects temporary sector rotation rather than fundamental concerns."
        }
      },
      synopsis: {
        price: "Experiencing mild pressure from profit-taking after recent outperformance",
        company: "American Tower's acquisition of data center assets enhances digital infrastructure positioning",
        role: "Anchor position for portfolio stability with 5G and data growth as long-term catalysts"
      },
      overallAnalysis: "Essential wireless infrastructure provider with defensive characteristics and consistent income from long-term leases. Benefits from increasing data consumption and 5G expansion for continued stable growth.",
      chartData: [187.2, 188.1, 187.8, 187.3, 186.9, 186.7, 186.4, 186.2, 186.7, 186.9, 186.6, 186.45],
      industry: "Real Estate"
    },
    {
      name: "Simon Property Group",
      ticker: "SPG",
      price: 148.65,
      change: 1.25,
      rating: 3.8,
      smartScore: "Above Average",
      description: "Largest shopping mall and retail REIT with premium properties across North America, Europe and Asia.",
      metrics: {
        performance: { 
          value: "Fair", 
          color: "yellow",
          details: {
            revenueGrowth: 4.8,
            profitMargin: 32.6,
            returnOnCapital: 8.2
          },
          explanation: "Simon Property Group shows adequate performance with 4.8% revenue growth, below the real estate sector average of 6%. Its profit margin of 32.6% trails the industry's 35%, reflecting challenges in the retail property space. However, the 8.2% return on capital remains solid and approaches industry standards of 9%."
        },
        stability: { 
          value: "Fair", 
          color: "yellow",
          details: {
            volatility: 0.95,
            beta: 0.9,
            dividendConsistency: "Medium"
          },
          explanation: "With higher volatility (0.95) than the real estate average (0.8), Simon Property Group experiences more significant price swings. Its beta of 0.9 indicates slightly elevated market sensitivity, while medium dividend consistency reflects past adjustments during retail sector challenges. Overall stability is adequate but not exceptional."
        },
        value: { 
          value: "Good", 
          color: "green",
          details: {
            peRatio: 13.2,
            pbRatio: 1.4,
            dividendYield: 5.2
          },
          explanation: "Simon Property Group offers attractive valuation with a PE ratio of 13.2, significantly below the industry average of 16.0. Its price-to-book ratio of 1.4 versus the industry's 1.8 indicates a discount to asset value. The standout 5.2% dividend yield (industry: 3.0%) provides substantial income potential for investors."
        },
        momentum: { 
          value: "Fair", 
          color: "yellow",
          details: {
            threeMonthReturn: 3.5,
            relativePerformance: 1.0,
            rsi: 54
          },
          explanation: "Simon Property Group demonstrates solid momentum with a three-month return of 3.5%, outperforming the real estate sector average of 2.5%. Its relative performance is positive at 1.0, and the RSI of 54 indicates balanced buying interest without being overbought. This momentum reflects improving sentiment toward quality retail assets."
        }
      },
      synopsis: {
        price: "Gradually climbing on improved forward guidance and analyst revisions",
        company: "Simon Property Group's premium mall traffic exceeds pre-pandemic levels in key markets",
        role: "Value opportunity in retail real estate with attractive dividend yield and recovery potential"
      },
      overallAnalysis: "Leading retail mall REIT offering superior dividend yield with improving post-pandemic fundamentals. Strong value proposition despite moderate performance metrics and some retail sector volatility.",
      chartData: [146.8, 147.2, 147.5, 147.1, 147.4, 147.9, 148.1, 148.3, 148.0, 148.4, 148.5, 148.65],
      industry: "Real Estate"
    },
    {
      name: "Equinix Inc.",
      ticker: "EQIX",
      price: 764.32,
      change: 2.45,
      rating: 4.5,
      smartScore: "High",
      description: "Global leader in data center colocation, interconnection services, and cloud exchange solutions.",
      metrics: {
        performance: { 
          value: "Strong", 
          color: "green",
          details: {
            revenueGrowth: 10.2,
            profitMargin: 38.5,
            returnOnCapital: 11.5
          },
          explanation: "Equinix demonstrates exceptional performance with 10.2% revenue growth, far exceeding the real estate sector average of 6%. Its profit margin of 38.5% surpasses the industry benchmark of 35%, while its 11.5% return on capital significantly outperforms the 9% industry standard, reflecting its dominance in the high-growth digital infrastructure segment."
        },
        stability: { 
          value: "High", 
          color: "green",
          details: {
            volatility: 0.7,
            beta: 0.78,
            dividendConsistency: "High"
          },
          explanation: "Equinix offers excellent stability with lower volatility (0.7) than the real estate industry average (0.8). Its beta of 0.78 indicates reduced market sensitivity, while high dividend consistency provides reliable income. This stability stems from long-term contracts with major technology companies and recurring revenue streams."
        },
        value: { 
          value: "Fair", 
          color: "yellow",
          details: {
            peRatio: 19.8,
            pbRatio: 2.2,
            dividendYield: 2.3
          },
          explanation: "Equinix trades at a premium valuation with a PE ratio of 19.8 versus the industry average of 16.0, reflecting its superior growth profile. The price-to-book ratio of 2.2 exceeds the industry's 1.8, while the dividend yield of 2.3% falls below the sector's 3.0%. This valuation is justified by its technological leadership and growth prospects."
        },
        momentum: { 
          value: "Strong", 
          color: "green",
          details: {
            threeMonthReturn: 5.8,
            relativePerformance: 3.3,
            rsi: 58
          },
          explanation: "Equinix shows strong price momentum with a three-month return of 5.8%, more than double the real estate sector average of 2.5%. Its relative performance of 3.3 indicates significant outperformance, while the RSI of 58 reflects strong buying interest without reaching overbought territory. This momentum is driven by increasing demand for digital infrastructure."
        }
      },
      synopsis: {
        price: "Showing steady appreciation amid positive market sentiment and sector rotation",
        company: "Equinix's expansion into emerging markets shows promising early results",
        role: "Growth-oriented REIT with digital infrastructure focus and AI data center tailwinds"
      },
      overallAnalysis: "Premier data center REIT with exceptional growth and strong business fundamentals. Strategic positioning in AI and cloud infrastructure provides sustainable competitive advantages and long-term growth potential.",
      chartData: [758.4, 759.2, 760.1, 759.8, 760.5, 761.3, 762.2, 762.8, 763.3, 763.7, 764.0, 764.32],
      industry: "Real Estate"
    },
    {
      name: "Public Storage",
      ticker: "PSA",
      price: 289.75,
      change: 0.85,
      rating: 4.0,
      smartScore: "Above Average",
      description: "Leading self-storage REIT with extensive facilities across the United States.",
      metrics: {
        performance: { 
          value: "Good", 
          color: "green",
          details: {
            revenueGrowth: 6.8,
            profitMargin: 41.2,
            returnOnCapital: 9.8
          },
          explanation: "Public Storage shows strong performance with 6.8% revenue growth, exceeding the real estate sector average of 6%. Its outstanding profit margin of 41.2% significantly surpasses the industry benchmark of 35%, reflecting efficient operations. The 9.8% return on capital approaches excellence and exceeds the industry standard of 9%."
        },
        stability: { 
          value: "High", 
          color: "green",
          details: {
            volatility: 0.68,
            beta: 0.72,
            dividendConsistency: "High"
          },
          explanation: "Public Storage offers exceptional stability with low volatility (0.68) compared to the industry average (0.8). Its beta of 0.72 indicates reduced market sensitivity, while high dividend consistency provides reliable income. This stability results from the recession-resistant nature of self-storage and diversified customer base."
        },
        value: { 
          value: "Fair", 
          color: "yellow",
          details: {
            peRatio: 16.8,
            pbRatio: 1.9,
            dividendYield: 4.2
          },
          explanation: "Public Storage trades at a slight premium with a PE ratio of 16.8 versus the industry average of 16.0, reflecting its quality operations. The price-to-book ratio of 1.9 is slightly above the industry's 1.8. Its attractive 4.2% dividend yield exceeds the sector's 3.0%, offering compelling income potential despite the modest valuation premium."
        },
        momentum: { 
          value: "Fair", 
          color: "yellow",
          details: {
            threeMonthReturn: 3.2,
            relativePerformance: 0.7,
            rsi: 53
          },
          explanation: "Public Storage shows solid momentum with a three-month return of 3.2%, outperforming the real estate sector average of 2.5%. Its relative performance of 0.7 indicates positive momentum compared to peers. With an RSI of 53, the stock is trading in a balanced range, showing steady accumulation without excessive enthusiasm."
        }
      },
      synopsis: {
        price: "Gradually climbing on improved forward guidance and analyst revisions",
        company: "Public Storage's occupancy rates exceeding expectations with pricing power intact",
        role: "Defensive REIT with steady cash flows and consistent dividend growth history"
      },
      overallAnalysis: "Market-leading self-storage REIT with exceptional stability and strong profit margins. Offers defensive investment characteristics with inflation protection and consistent dividend income.",
      chartData: [287.8, 288.2, 288.5, 288.1, 288.4, 288.9, 289.1, 289.3, 289.0, 289.4, 289.6, 289.75],
      industry: "Real Estate"
    }
  ],
  "Healthcare": [
    {
      name: "Stryker Corporation",
      ticker: "SYK",
      price: 345.68,
      change: 1.85,
      rating: 4.4,
      smartScore: "High",
      description: "Leading manufacturer of medical technologies including orthopaedic implants, surgical equipment, and neurotechnology products.",
      metrics: {
        performance: { 
          value: "Strong", 
          color: "green",
          details: {
            revenueGrowth: 13.5,
            profitMargin: 21.2,
            returnOnCapital: 14.8
          },
          explanation: "Stryker shows exceptional performance with 13.5% revenue growth, nearly matching the healthcare sector average of 15%. Its profit margin of 21.2% slightly exceeds the industry benchmark of 20%, while its outstanding 14.8% return on capital surpasses the 13% industry standard, demonstrating efficient capital deployment in high-value medical technology."
        },
        stability: { 
          value: "High", 
          color: "green",
          details: {
            volatility: 0.95,
            beta: 1.0,
            dividendConsistency: "High"
          },
          explanation: "Stryker offers strong stability with lower volatility (0.95) than the healthcare industry average (1.2). Its beta of 1.0 indicates market-neutral sensitivity, while high dividend consistency provides reliable income. This stability stems from diversified product lines and recurring revenue from consumables and service contracts."
        },
        value: { 
          value: "Fair", 
          color: "yellow",
          details: {
            peRatio: 24.2,
            pbRatio: 3.8,
            dividendYield: 0.8
          },
          explanation: "Stryker trades at a slight discount with a PE ratio of 24.2 versus the healthcare industry average of 25.0, offering reasonable value. The price-to-book ratio of 3.8 is slightly below the industry's 4.0. Its dividend yield of 0.8% exceeds the sector's 0.6%, providing a small income advantage while still prioritizing growth reinvestment."
        },
        momentum: { 
          value: "Strong", 
          color: "green",
          details: {
            threeMonthReturn: 7.2,
            relativePerformance: 2.2,
            rsi: 60
          },
          explanation: "Stryker shows strong price momentum with a three-month return of 7.2%, significantly outperforming the healthcare sector average of 5.0%. Its relative performance of 2.2 indicates substantial outperformance versus peers. With an RSI of 60, the stock shows solid buying interest while maintaining room for continued appreciation."
        }
      },
      synopsis: {
        price: "Showing steady appreciation amid positive market sentiment and sector rotation",
        company: "Stryker's surgical robotics platform gaining market share in orthopedic procedures",
        role: "Core medical technology holding with balanced growth and stability characteristics"
      },
      chartData: [340.2, 341.5, 342.3, 341.8, 342.5, 343.2, 343.8, 344.2, 344.7, 345.1, 345.4, 345.68],
      industry: "Healthcare"
    },
    {
      name: "ResMed Inc.",
      ticker: "RMD",
      price: 194.25,
      change: -0.75,
      rating: 3.9,
      smartScore: "Above Average",
      description: "Global leader in cloud-connected medical devices for sleep apnea, COPD, and other chronic respiratory conditions.",
      metrics: {
        performance: { 
          value: "Good", 
          color: "green",
          details: {
            revenueGrowth: 12.8,
            profitMargin: 23.5,
            returnOnCapital: 15.5
          },
          explanation: "ResMed demonstrates strong performance with 12.8% revenue growth, approaching the healthcare sector average of 15%. Its excellent profit margin of 23.5% exceeds the industry benchmark of 20%, while its outstanding 15.5% return on capital surpasses the 13% industry standard, reflecting efficiency in its specialized respiratory care business."
        },
        stability: { 
          value: "Fair", 
          color: "yellow",
          details: {
            volatility: 1.1,
            beta: 1.05,
            dividendConsistency: "Medium"
          },
          explanation: "ResMed offers moderate stability with slightly lower volatility (1.1) than the healthcare industry average (1.2). Its beta of 1.05 indicates near-market-neutral sensitivity. Medium dividend consistency reflects a balanced approach to shareholder returns while maintaining investment in growth initiatives."
        },
        value: { 
          value: "Fair", 
          color: "yellow",
          details: {
            peRatio: 23.5,
            pbRatio: 3.6,
            dividendYield: 0.9
          },
          explanation: "ResMed trades at a modest discount with a PE ratio of 23.5 versus the healthcare industry average of 25.0. The price-to-book ratio of 3.6 is below the industry's 4.0, suggesting good value. Its dividend yield of 0.9% exceeds the sector's 0.6%, providing slightly better income while still prioritizing growth initiatives."
        },
        momentum: { 
          value: "Fair", 
          color: "yellow",
          details: {
            threeMonthReturn: 2.8,
            relativePerformance: -2.2,
            rsi: 49
          },
          explanation: "ResMed shows moderate momentum with a three-month return of 2.8%, underperforming the healthcare sector average of 5.0%. Its relative performance of -2.2 indicates recent underperformance versus peers. With an RSI of 49, the stock is in neutral territory, neither overbought nor oversold, suggesting potential stabilization after recent pressure."
        }
      },
      synopsis: {
        price: "Experiencing mild pressure from profit-taking after recent outperformance",
        company: "ResMed's connected care platform showing strong subscription revenue growth",
        role: "Growth opportunity in sleep and respiratory care with recurring revenue model"
      },
      chartData: [195.8, 195.4, 195.1, 194.8, 194.5, 194.2, 194.6, 194.9, 194.5, 194.3, 194.1, 194.25],
      industry: "Healthcare"
    },
    {
      name: "Align Technology",
      ticker: "ALGN",
      price: 307.85,
      change: 2.45,
      rating: 4.2,
      smartScore: "High",
      description: "Global medical device company with industry-leading clear aligner and intraoral scanner technologies.",
      metrics: {
        performance: { 
          value: "Strong", 
          color: "green",
          details: {
            revenueGrowth: 17.5,
            profitMargin: 19.8,
            returnOnCapital: 15.2
          },
          explanation: "Align Technology demonstrates exceptional performance with 17.5% revenue growth, exceeding the healthcare sector average of 15%. While its profit margin of 19.8% is slightly below the industry benchmark of 20%, its outstanding 15.2% return on capital surpasses the 13% industry standard, reflecting its innovation-driven business model."
        },
        stability: { 
          value: "Unstable", 
          color: "red",
          details: {
            volatility: 1.35,
            beta: 1.4,
            dividendConsistency: "N/A"
          },
          explanation: "Align Technology shows elevated volatility (1.35) compared to the healthcare industry average (1.2). Its beta of 1.4 indicates significant market sensitivity, amplifying both upside and downside movements. The company does not pay dividends, focusing instead on growth reinvestment, which may not suit income-focused investors."
        },
        value: { 
          value: "Fair", 
          color: "yellow",
          details: {
            peRatio: 28.2,
            pbRatio: 4.2,
            dividendYield: 0
          },
          explanation: "Align Technology trades at a premium with a PE ratio of 28.2 versus the healthcare industry average of 25.0, reflecting growth expectations. The price-to-book ratio of 4.2 slightly exceeds the industry's 4.0. The company pays no dividend, prioritizing reinvestment for growth, which aligns with its innovation-focused business model."
        },
        momentum: { 
          value: "Strong", 
          color: "green",
          details: {
            threeMonthReturn: 9.5,
            relativePerformance: 4.5,
            rsi: 65
          },
          explanation: "Align Technology shows exceptional momentum with a three-month return of 9.5%, nearly double the healthcare sector average of 5.0%. Its relative performance of 4.5 indicates substantial outperformance versus peers. The RSI of 65 approaches but has not reached overbought territory, reflecting strong investor interest and positive sentiment."
        }
      },
      synopsis: {
        price: "Breaking out to new highs with institutional accumulation and heightened options activity",
        company: "Align Technology's international expansion showing stronger-than-expected case growth",
        role: "High-growth opportunity in dental clear aligners with strong brand recognition"
      },
      chartData: [301.2, 302.5, 303.1, 302.8, 303.6, 304.5, 305.2, 305.8, 306.3, 307.0, 307.4, 307.85],
      industry: "Healthcare"
    },
    {
      name: "Illumina Inc.",
      ticker: "ILMN",
      price: 124.85,
      change: -1.25,
      rating: 3.4,
      smartScore: "Average",
      description: "Global leader in DNA sequencing and array-based technologies for genetic analysis.",
      metrics: {
        performance: { 
          value: "Fair", 
          color: "yellow",
          details: {
            revenueGrowth: 7.5,
            profitMargin: 16.2,
            returnOnCapital: 10.5
          },
          explanation: "Illumina shows moderate performance with 7.5% revenue growth, trailing the healthcare sector average of 15%. Its profit margin of 16.2% falls below the industry benchmark of 20%, while its 10.5% return on capital is also below the 13% industry standard. These metrics reflect ongoing challenges in commercialization and margin pressure."
        },
        stability: { 
          value: "Unstable", 
          color: "red",
          details: {
            volatility: 1.45,
            beta: 1.5,
            dividendConsistency: "N/A"
          },
          explanation: "Illumina exhibits high volatility (1.45) compared to the healthcare industry average (1.2). Its beta of 1.5 indicates significant market sensitivity with amplified price swings. The company does not pay dividends, and its price action is frequently driven by clinical developments, regulatory announcements, and shifting competitive dynamics."
        },
        value: { 
          value: "Fair", 
          color: "yellow",
          details: {
            peRatio: 24.5,
            pbRatio: 3.8,
            dividendYield: 0
          },
          explanation: "Illumina trades at a slight discount with a PE ratio of 24.5 versus the healthcare industry average of 25.0. The price-to-book ratio of 3.8 is below the industry's 4.0, reflecting valuation concerns after recent challenges. The company pays no dividend, focusing investments on R&D and strategic initiatives to maintain technological leadership."
        },
        momentum: { 
          value: "Weak", 
          color: "red",
          details: {
            threeMonthReturn: -3.8,
            relativePerformance: -8.8,
            rsi: 41
          },
          explanation: "Illumina shows negative momentum with a three-month return of -3.8%, significantly underperforming the healthcare sector average of 5.0%. Its relative performance of -8.8 indicates substantial underperformance versus peers. With an RSI of 41, the stock is approaching but has not reached oversold territory, reflecting continued selling pressure."
        }
      },
      synopsis: {
        price: "Facing significant selling pressure after disappointing quarterly results",
        company: "Illumina's new leadership team signals shift in corporate strategy",
        role: "Speculative opportunity in genomics technology with turnaround potential"
      },
      chartData: [127.8, 126.9, 126.4, 125.8, 125.3, 124.7, 124.3, 125.0, 125.4, 124.9, 125.2, 124.85],
      industry: "Healthcare"
    },
    {
      name: "Insulet Corporation",
      ticker: "PODD",
      price: 189.65,
      change: 1.35,
      rating: 3.8,
      smartScore: "Above Average",
      description: "Medical device company specializing in tubeless insulin pump technology for diabetes management.",
      metrics: {
        performance: { 
          value: "Strong", 
          color: "green",
          details: {
            revenueGrowth: 20.5,
            profitMargin: 18.5,
            returnOnCapital: 13.8
          },
          explanation: "Insulet demonstrates exceptional performance with 20.5% revenue growth, significantly exceeding the healthcare sector average of 15%. While its profit margin of 18.5% is slightly below the industry benchmark of 20%, its strong 13.8% return on capital exceeds the 13% industry standard, reflecting successful commercialization of innovative diabetes management technology."
        },
        stability: { 
          value: "Unstable", 
          color: "red",
          details: {
            volatility: 1.4,
            beta: 1.35,
            dividendConsistency: "N/A"
          },
          explanation: "Insulet exhibits elevated volatility (1.4) compared to the healthcare industry average (1.2). Its beta of 1.35 indicates significant market sensitivity, with more amplified price swings than the broader market. The company does not pay dividends, focusing instead on growth reinvestment and market expansion opportunities."
        },
        value: { 
          value: "Poor", 
          color: "red",
          details: {
            peRatio: 32.5,
            pbRatio: 4.8,
            dividendYield: 0
          },
          explanation: "Insulet trades at a significant premium with a PE ratio of 32.5 versus the healthcare industry average of 25.0, reflecting high growth expectations. The price-to-book ratio of 4.8 exceeds the industry's 4.0, indicating investors are paying up for innovation. The company pays no dividend, prioritizing reinvestment in its rapid-growth business model."
        },
        momentum: { 
          value: "Fair", 
          color: "yellow",
          details: {
            threeMonthReturn: 5.5,
            relativePerformance: 0.5,
            rsi: 55
          },
          explanation: "Insulet shows solid momentum with a three-month return of 5.5%, slightly outperforming the healthcare sector average of 5.0%. Its relative performance of 0.5 indicates modest outperformance versus peers. With an RSI of 55, the stock is in balanced territory, showing steady buying interest without excessive enthusiasm."
        }
      },
      synopsis: {
        price: "Moving upward as new product adoption exceeds initial expectations",
        company: "Insulet's automated insulin delivery system gaining significant market share",
        role: "Growth opportunity in diabetes technology with innovative product offerings"
      },
      chartData: [187.2, 188.1, 187.9, 187.6, 188.2, 188.7, 189.0, 189.3, 189.1, 189.4, 189.7, 189.65],
      industry: "Healthcare"
    }
  ]
};

// Generate chart data for all hardcoded stocks that don't have it
Object.keys(hardcodedStocks).forEach(industry => {
  hardcodedStocks[industry].forEach(stock => {
    if (!stock.chartData) {
      // Generate random chart data if not present
      const basePrice = stock.price * 0.99;
      stock.chartData = Array(12).fill(0).map((_, i) => {
        return +(basePrice + (Math.random() * stock.price * 0.03)).toFixed(2);
      });
      // Make the last data point match the current price
      stock.chartData[stock.chartData.length - 1] = stock.price;
    }
  });
});

export const getIndustryStocks = (industry: string): StockData[] => {
  // Return hardcoded stocks if available for the industry
  if (hardcodedStocks[industry]) {
    return hardcodedStocks[industry];
  }
  
  // Fallback to generated stocks for industries without hardcoded data
  return generateRandomStocks(industry);
};