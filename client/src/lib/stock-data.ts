// Define the detail types for each metric category
export interface PerformanceDetails {
  revenueGrowth: number;
  profitMargin: number;
  returnOnCapital: number;
  // Individual metric 1-liners
  revenueGrowthExplanation?: string;
  profitMarginExplanation?: string;
  returnOnCapitalExplanation?: string;
}

export interface StabilityDetails {
  volatility: number;
  beta: number;
  dividendConsistency: string;
  // Individual metric 1-liners
  volatilityExplanation?: string;
  betaExplanation?: string;
  dividendConsistencyExplanation?: string;
}

export interface ValueDetails {
  peRatio: number;
  pbRatio: number;
  dividendYield: number | string;
  // Individual metric 1-liners
  peRatioExplanation?: string;
  pbRatioExplanation?: string;
  dividendYieldExplanation?: string;
}

export interface MomentumDetails {
  threeMonthReturn: number;
  relativePerformance: number;
  rsi: number;
  // Individual metric 1-liners
  threeMonthReturnExplanation?: string;
  relativePerformanceExplanation?: string;
  rsiExplanation?: string;
}

export interface StockData {
  name: string;
  ticker: string;
  price: number;
  change: number;
  rating: number;
  smartScore?: string;
  description: string;
  oneYearReturn?: string; // 1-year return percentage (e.g., "13.27%")
  predictedPrice?: string; // Predicted future price (e.g., "$128.79")
  metrics: {
    performance: {
      value: string;
      color: string;
      details: PerformanceDetails;
      explanation: string;
    };
    stability: {
      value: string;
      color: string;
      details: StabilityDetails;
      explanation: string;
    };
    value: {
      value: string;
      color: string;
      details: ValueDetails;
      explanation: string;
    };
    momentum: {
      value: string;
      color: string;
      details: MomentumDetails;
      explanation: string;
    };
  };
  synopsis: {
    price: string;
    company: string;
    role: string;
  };
  overallAnalysis: string;
  chartData: number[];
  industry: string;
}

const hardcodedStocks: Record<string, StockData[]> = {
  "Healthcare": [
    {
      name: "Stryker Corporation",
      ticker: "SYK",
      price: 345.68,
      change: 1.85,
      rating: 4.5,
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
      overallAnalysis: "A high-quality medical device company benefiting from technological advancements and strong market positioning. Offers a balanced opportunity with above-average growth, defensive characteristics, and reliable income.",
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
      overallAnalysis: "A leading medical device company focused on respiratory care with strong growth prospects. Offers a balanced opportunity with above-average growth, moderate stability, and reasonable income potential.",
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
      overallAnalysis: "A high-growth medical device company leading in clear aligner technology. Offers significant upside potential driven by innovation and global expansion, but comes with higher volatility.",
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
      overallAnalysis: "A genomics technology leader facing challenges in commercialization and margin pressure. Offers a speculative opportunity for investors willing to bet on a turnaround.",
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
      overallAnalysis: "A high-growth medical device company specializing in diabetes management. Offers significant upside potential driven by innovation and market expansion, but also carries high volatility.",
      chartData: [187.2, 188.1, 187.9, 187.6, 188.2, 188.7, 189.0, 189.3, 189.1, 189.4, 189.7, 189.65],
      industry: "Healthcare"
    }
  ],
  "Real Estate": [
    {
      name: "Prologis",
      ticker: "PLD",
      price: 110.26,
      change: 0.8,
      rating: 3.6,
      oneYearReturn: "-13.27%",
      predictedPrice: "$128.79",
      metrics: {
        performance: {
          value: "Average",
          color: "yellow",
          details: {
            revenueGrowth: 2.2,
            profitMargin: 45.4,
            returnOnCapital: 4.3,
            revenueGrowthExplanation: "Prologis isn't making much more money than last year (2.2% growth is sluggish).",
            profitMarginExplanation: "Prologis keeps $45 of every $100 it makes - very profitable for real estate.",
            returnOnCapitalExplanation: "Average return on investment - getting $4.30 for every $100 invested."
          },
          explanation: "Prologis isn't making much more money than last year (growth is OK, not great)."
        },
        stability: {
          value: "Poor",
          color: "red",
          details: {
            volatility: 8.6,
            beta: 1.24,
            dividendConsistency: "Medium",
            volatilityExplanation: "Price moves are moderate - not too wild but not super steady either.",
            betaExplanation: "When the market drops 10%, Prologis often falls a bit more (about 12%).",
            dividendConsistencyExplanation: "Prologis reliably pays dividends but sometimes changes the amount."
          },
          explanation: "Prologis is one of the steadier REITs with consistent payouts. It doesn't swing wildly."
        },
        value: {
          value: "Average",
          color: "yellow",
          details: {
            peRatio: 28.0,
            pbRatio: 1.9,
            dividendYield: 3.7,
            peRatioExplanation: "You pay $28 for every $1 of yearly earnings - slightly expensive.",
            pbRatioExplanation: "The stock costs less than twice the value of the company's assets.",
            dividendYieldExplanation: "Prologis pays you $3.70 per year for every $100 invested."
          },
          explanation: "Prologis is fairly priced for what you get - a solid company with decent income."
        },
        momentum: {
          value: "Average",
          color: "yellow",
          details: {
            threeMonthReturn: 6.1,
            relativePerformance: -2.0,
            rsi: 37.4,
            threeMonthReturnExplanation: "Prologis has grown 6.1% over the last three months - better than most REITs.",
            relativePerformanceExplanation: "It's falling slightly behind the wider market by about 2%.",
            rsiExplanation: "Buying interest is a bit weak right now - could be ready for a comeback."
          },
          explanation: "Prologis isn't making big moves either way lately. It's just coasting."
        }
      },
      description: "A leading global owner, operator and developer of logistics real estate.",
      synopsis: {
        price: "Trading at 110.26, reflecting modest recent gains despite market volatility.",
        company: "Global leader in logistics real estate with significant e-commerce exposure.",
        role: "Core holding for real estate allocation with balance of growth and income."
      },
      overallAnalysis: "Prologis brings in reliable income and holds its value over time. It's a strong option for people who prefer stability and are okay with slower movement.",
      chartData: [96, 101, 97, 104, 108, 96, 98, 103, 107, 109, 110.26],
      industry: "Real Estate"
    },
    {
      name: "Realty Income Corp",
      ticker: "O",
      price: 56.28,
      change: 1.29,
      rating: 4.0,
      oneYearReturn: "7.88%",
      predictedPrice: "$62.04",
      description: "A monthly dividend paying REIT focused on single-tenant commercial properties.",
      metrics: {
        performance: {
          value: "Average",
          color: "yellow",
          details: {
            revenueGrowth: 29.5,
            profitMargin: 16.0,
            returnOnCapital: 1.30,
            revenueGrowthExplanation: "Sales grew nearly 30% - much faster than most REITs due to acquisitions.",
            profitMarginExplanation: "Keeps $16 of every $100 it makes - decent but not stellar for real estate.",
            returnOnCapitalExplanation: "Gets only $1.30 back for every $100 invested - below average efficiency."
          },
          explanation: "Realty Income is expanding and profitable, but not very efficient with its money."
        },
        stability: {
          value: "Average",
          color: "yellow",
          details: {
            volatility: 6.93,
            beta: 0.82,
            dividendConsistency: "Good",
            volatilityExplanation: "Price moves are mild - this stock doesn't jump around much day-to-day.",
            betaExplanation: "When markets fall 10%, Realty Income typically falls only about 8%.",
            dividendConsistencyExplanation: "Famous for monthly dividends that have grown for 25+ consecutive years."
          },
          explanation: "Realty Income doesn't move around much and pays consistently. It's a safe pick for steady hands."
        },
        value: {
          value: "Average",
          color: "yellow",
          details: {
            peRatio: 57.6,
            pbRatio: 1.29,
            dividendYield: 5.7,
            peRatioExplanation: "You pay nearly $58 for every $1 of yearly earnings - expensive by normal standards.",
            pbRatioExplanation: "Trading at only 1.3x its book value - a reasonable price for its physical assets.",
            dividendYieldExplanation: "Pays you $5.70 per year for every $100 invested - that's excellent income."
          },
          explanation: "Realty Income is all about slow, steady income. It won't skyrocket, but it'll keep delivering."
        },
        momentum: {
          value: "Average",
          color: "yellow",
          details: {
            threeMonthReturn: 6.6,
            relativePerformance: -1.5,
            rsi: 49.3,
            threeMonthReturnExplanation: "Gained 6.6% in the last three months - decent but not spectacular.",
            relativePerformanceExplanation: "Performing slightly worse than the broader market by about 1.5%.",
            rsiExplanation: "Buying and selling pressure are balanced - the stock isn't overbought or oversold."
          },
          explanation: "Realty Income hasn't made big moves lately and isn't drawing much investor attention."
        }
      },
      synopsis: {
        price: "Trading at 56.28 with slight recent weakness despite attractive yield.",
        company: "Premier monthly dividend REIT with diverse commercial property portfolio.",
        role: "Income cornerstone for dividend-focused investors seeking reliability."
      },
      overallAnalysis: "Realty Income is a slow-moving stock that focuses on steady, reliable income. It won't deliver fast gains, but it's great for investors who want monthly dividends and long-term stability.",
      chartData: [52, 54, 51, 54, 58, 56, 55, 57, 58, 56, 56.28],
      industry: "Real Estate"
    },
    {
      name: "Simon Property Group",
      ticker: "SPG",
      price: 166.12,
      change: 0.55,
      rating: 3.2,
      oneYearReturn: "9.97%",
      predictedPrice: "$180.33",
      description: "The largest owner and operator of shopping malls and premium outlets in the US.",
      metrics: {
        performance: {
          value: "Good",
          color: "green",
          details: {
            revenueGrowth: 5.4,
            profitMargin: 41.9,
            returnOnCapital: 9.97
          },
          explanation: "Simon Property Group is profitable and efficient, even if growth is a bit slow."
        },
        stability: {
          value: "Poor",
          color: "red",
          details: {
            volatility: 9.01,
            beta: 1.49,
            dividendConsistency: "Poor"
          },
          explanation: "Simon Property Group moves around a lot and doesn't always pay on time. It's not the safest option."
        },
        value: {
          value: "Average",
          color: "yellow",
          details: {
            peRatio: 22,
            pbRatio: 18.68,
            dividendYield: 5.1
          },
          explanation: "Simon Property Group may look pricey on paper, but its dividend helps justify the value."
        },
        momentum: {
          value: "Poor",
          color: "red",
          details: {
            threeMonthReturn: -3.1,
            relativePerformance: -11,
            rsi: 41.9
          },
          explanation: "Simon Property Group hasn't had much recent action and is underperforming."
        }
      },
      synopsis: {
        price: "Trading at 166.12 with some recent strength despite longer-term underperformance.",
        company: "Dominant mall operator with premium locations and evolving business model.",
        role: "Value opportunity in retail real estate with above-average income potential."
      },
      overallAnalysis: "Simon Property Group owns top-tier malls and shopping centers. While retail has challenges, their premium locations give them staying power and a solid income stream.",
      chartData: [158, 162, 155, 159, 163, 155, 157, 162, 167, 164, 166.12],
      industry: "Real Estate"
    },
    {
      name: "AvalonBay Communities",
      ticker: "AVB",
      price: 214.36,
      change: 0.82,
      rating: 4.1,
      oneYearReturn: "17.77%",
      predictedPrice: "$238.64",
      description: "A leading apartment REIT focused on high-quality properties in premium coastal markets.",
      metrics: {
        performance: {
          value: "Good",
          color: "green",
          details: {
            revenueGrowth: 4.9,
            profitMargin: 36.5,
            returnOnCapital: 5.6
          },
          explanation: "AvalonBay is making good money from the high rents in its luxury apartments."
        },
        stability: {
          value: "Average",
          color: "yellow",
          details: {
            volatility: 6.93,
            beta: 0.89,
            dividendConsistency: "Good"
          },
          explanation: "AvalonBay moves at its own pace and not by market swings too much. Its dividend is reliable."
        },
        value: {
          value: "Average",
          color: "yellow",
          details: {
            peRatio: 28.2,
            pbRatio: 2.55,
            dividendYield: 3.3
          },
          explanation: "AvalonBay has a modest price tag and pays a fair dividend."
        },
        momentum: {
          value: "Poor",
          color: "red",
          details: {
            threeMonthReturn: -2.4,
            relativePerformance: -10,
            rsi: 47.8
          },
          explanation: "AvalonBay has been lagging behind other stocks lately."
        }
      },
      synopsis: {
        price: "Trading at 214.36 with modest recent gains despite quarter-to-date weakness.",
        company: "Premium apartment owner/operator in supply-constrained coastal markets.",
        role: "Quality residential real estate exposure with inflation protection features."
      },
      overallAnalysis: "AvalonBay owns luxury apartments in places where it's expensive to buy a home. They do well when housing prices are high because more people need to rent instead of buy.",
      chartData: [205, 210, 202, 208, 215, 204, 207, 211, 219, 213, 214.36],
      industry: "Real Estate"
    },
    {
      name: "Public Storage",
      ticker: "PSA",
      price: 294.93,
      change: -0.3,
      rating: 6.9,
      oneYearReturn: "6.94%",
      predictedPrice: "$338",
      description: "The world's largest owner and operator of self-storage facilities.",
      metrics: {
        performance: {
          value: "Good",
          color: "green",
          details: {
            revenueGrowth: 3.9,
            profitMargin: 39.9,
            returnOnCapital: 10.2
          },
          explanation: "Public Storage makes good money with little effort - their business basically runs itself."
        },
        stability: {
          value: "Average",
          color: "yellow",
          details: {
            volatility: 9.01,
            beta: 0.8,
            dividendConsistency: "Good"
          },
          explanation: "Public Storage isn't too worried about what the market does - it follows its own path and pays steady dividends."
        },
        value: {
          value: "Poor",
          color: "red",
          details: {
            peRatio: 27.7,
            pbRatio: 9.65,
            dividendYield: "4.2%"
          },
          explanation: "Public Storage is expensive compared to what it owns, but the 4.2% dividend helps make up for that."
        },
        momentum: {
          value: "Poor",
          color: "red",
          details: {
            threeMonthReturn: -1.7,
            relativePerformance: -9.7,
            rsi: 43.5
          },
          explanation: "Public Storage isn't attracting much attention lately and has slipped a bit compared to similar stocks."
        }
      },
      synopsis: {
        price: "Trading at 294.93 with slight recent weakness following longer downtrend.",
        company: "Dominant self-storage operator with recession-resistant business model.",
        role: "Defensive real estate holding with steady income and inflation protection."
      },
      overallAnalysis: "Public Storage runs a simple business renting storage units, which keeps making money in good times and bad. It's a boring but reliable stock with good income.",
      chartData: [285, 290, 283, 288, 296, 287, 290, 295, 301, 296, 294.93],
      industry: "Real Estate"
    },
    {
      name: "Digital Realty Trust",
      ticker: "DLR",
      price: 155.49,
      change: 0.88,
      rating: 5.8,
      oneYearReturn: "12.81%",
      predictedPrice: "$179.95",
      description: "A leading global provider of data center, colocation and interconnection solutions.",
      metrics: {
        performance: {
          value: "Poor",
          color: "red",
          details: {
            revenueGrowth: 1.4,
            profitMargin: 10.1,
            returnOnCapital: 1.43
          },
          explanation: "Below-average revenue growth with significantly lower profit margins and returns on capital than REIT peers. High capital intensity of data center development creates financial performance challenges."
        },
        stability: {
          value: "Poor",
          color: "red",
          details: {
            volatility: 10.74,
            beta: 0.92,
            dividendConsistency: "Good"
          },
          explanation: "Higher volatility despite moderate beta indicates price instability regardless of market direction. Strong dividend growth history is a positive counterbalance to price volatility."
        },
        value: {
          value: "Poor",
          color: "red",
          details: {
            peRatio: 95.6,
            pbRatio: 2.54,
            dividendYield: 3.2
          },
          explanation: "Very high P/E ratio and moderate price-to-book suggests premium valuation with growth expectations. Below-average dividend yield for a REIT reflects the market's focus on future growth over current income."
        },
        momentum: {
          value: "Poor",
          color: "red",
          details: {
            threeMonthReturn: -12.1,
            relativePerformance: -20,
            rsi: 50.1
          },
          explanation: "Significant price weakness both on absolute basis and relative to peers. Neutral RSI despite underperformance suggests selling pressure may be stabilizing."
        }
      },
      synopsis: {
        price: "Trading at 155.49 with recent strength following notable prior weakness.",
        company: "Global data center provider with both colocation and hyperscale offerings.",
        role: "Technology-oriented real estate exposure with growth and income potential."
      },
      overallAnalysis: "Technology-focused REIT providing data center exposure with better growth than traditional real estate while maintaining income characteristics. Benefits from cloud computing, AI workloads, and growing digital infrastructure demands.",
      chartData: [168, 172, 165, 160, 158, 149, 146, 151, 157, 152, 155.49],
      industry: "Real Estate"
    },
    {
      name: "American Tower Corp",
      ticker: "AMT",
      price: 212.8,
      change: 1.5,
      rating: 7.3,
      oneYearReturn: "15.42%",
      predictedPrice: "$245.35",
      description: "The largest global owner and operator of wireless communications infrastructure.",
      metrics: {
        performance: {
          value: "Average",
          color: "yellow",
          details: {
            revenueGrowth: -3.0,
            profitMargin: 20.9,
            returnOnCapital: 5.24
          },
          explanation: "Revenue contraction is a concern, partially offset by decent profit margins and return on capital. Recent financial performance reflects temporary integration challenges with acquisitions."
        },
        stability: {
          value: "Average",
          color: "yellow",
          details: {
            volatility: 9.01,
            beta: 0.89,
            dividendConsistency: "Good"
          },
          explanation: "Slightly higher volatility but below-average beta indicates less correlation with broader market movements. Consistent dividend growth history demonstrates financial stability."
        },
        value: {
          value: "Poor",
          color: "red",
          details: {
            peRatio: 44.2,
            pbRatio: 29.41,
            dividendYield: 3.2
          },
          explanation: "High P/E ratio and extremely high price-to-book value indicate significant premium to asset value. Below-average dividend yield for a REIT suggests investors are paying for expected future growth."
        },
        momentum: {
          value: "Good",
          color: "green",
          details: {
            threeMonthReturn: 15.1,
            relativePerformance: 7.1,
            rsi: 61.1
          },
          explanation: "Strong recent price performance both on absolute basis and compared to peers. Moderately high RSI indicates positive momentum without reaching extreme overbought levels."
        }
      },
      synopsis: {
        price: "Trading at 212.80 with solid momentum after extended period of weakness.",
        company: "Global leader in wireless tower infrastructure essential for mobile networks.",
        role: "Technology-adjacent real estate with combination of growth and income."
      },
      overallAnalysis: "Essential wireless infrastructure provider with defensive characteristics and consistent income from long-term leases. Benefits from increasing data consumption and 5G expansion for continued stable growth.",
      chartData: [185, 190, 182, 195, 200, 189, 196, 204, 208, 210, 212.8],
      industry: "Real Estate"
    },
    {
      name: "Welltower Inc",
      ticker: "WELL",
      price: 149.84,
      change: 1.8,
      rating: 6.4,
      oneYearReturn: "19.65%",
      predictedPrice: "$167.30",
      description: "A healthcare REIT specializing in senior housing, post-acute care, and outpatient medical properties.",
      metrics: {
        performance: {
          value: "Poor",
          color: "red",
          details: {
            revenueGrowth: 20.4,
            profitMargin: 6.3,
            returnOnCapital: 1.06
          },
          explanation: "Exceptional revenue growth but significantly below-average profit margins and return on capital. Growth-focused strategy currently prioritizes scale over operational efficiency."
        },
        stability: {
          value: "Average",
          color: "yellow",
          details: {
            volatility: 7.62,
            beta: 0.94,
            dividendConsistency: "Poor"
          },
          explanation: "Moderate volatility and beta indicate average price stability. Historic dividend cuts during pandemic reflect vulnerability of healthcare properties to certain crisis scenarios."
        },
        value: {
          value: "Poor",
          color: "red",
          details: {
            peRatio: 182.2,
            pbRatio: 2.98,
            dividendYield: 1.9
          },
          explanation: "Extremely high P/E ratio and average price-to-book value indicate significant premium valuation. Very low dividend yield for a REIT reflects both valuation and lower payout ratio focused on growth."
        },
        momentum: {
          value: "Good",
          color: "green",
          details: {
            threeMonthReturn: 19.3,
            relativePerformance: 11.3,
            rsi: 54.7
          },
          explanation: "Exceptional recent price performance both on absolute basis and relative to peers. Moderate RSI suggests strong buying interest without reaching extreme levels."
        }
      },
      synopsis: {
        price: "Trading at 149.84 with strong recent momentum reflecting sector recovery.",
        company: "Leading senior housing and healthcare property owner with demographic tailwinds.",
        role: "Growth-oriented healthcare real estate exposure with aging population thesis."
      },
      overallAnalysis: "Healthcare REIT with strong demographic tailwinds from an aging population. Combines defensive characteristics and recession resistance with above-average growth potential in senior housing and medical facilities.",
      chartData: [125, 130, 127, 132, 138, 128, 135, 140, 145, 147, 149.84],
      industry: "Real Estate"
    },
    {
      name: "Boston Properties",
      ticker: "BXP",
      price: 69.48,
      change: -1.2,
      rating: 5.5,
      oneYearReturn: "-5.32%",
      predictedPrice: "$74.90",
      description: "The largest publicly-traded developer, owner and manager of Class A office properties.",
      metrics: {
        performance: {
          value: "Poor",
          color: "red",
          details: {
            revenueGrowth: 4.1,
            profitMargin: 0.4,
            returnOnCapital: 0.06
          },
          explanation: "Modest revenue growth but extremely poor profit margins and negligible return on capital. Office property challenges have severely impacted financial performance metrics."
        },
        stability: {
          value: "Average",
          color: "yellow",
          details: {
            volatility: 10.39,
            beta: 1.08,
            dividendConsistency: "Poor"
          },
          explanation: "Higher volatility and above-average beta indicate more price instability and market correlation. Past dividend cuts reflect vulnerability to office sector challenges."
        },
        value: {
          value: "Average",
          color: "yellow",
          details: {
            peRatio: 785,
            pbRatio: 2.03,
            dividendYield: 5.7
          },
          explanation: "Extremely high P/E ratio due to depressed earnings, but reasonable price-to-book value suggests potential value. Very attractive dividend yield offers compelling income if sustainable."
        },
        momentum: {
          value: "Poor",
          color: "red",
          details: {
            threeMonthReturn: -6.4,
            relativePerformance: -14.4,
            rsi: 52.5
          },
          explanation: "Significant price weakness both on absolute basis and compared to peers. Neutral RSI suggests balanced buying and selling despite underperformance."
        }
      },
      synopsis: {
        price: "Trading at 69.48 with recent weakness indicating ongoing sector concerns.",
        company: "Premium office property owner facing work-from-home and oversupply challenges.",
        role: "Deep value opportunity in office real estate with significant income yield."
      },
      overallAnalysis: "Premium office REIT trading at historical discount due to work-from-home trends and financing concerns. Offers exceptional value for contrarian investors willing to accept higher risk for potential recovery upside.",
      chartData: [75, 78, 72, 74, 76, 71, 73, 75, 70, 70.5, 69.48],
      industry: "Real Estate"
    },
    {
      name: "Equity Residential",
      ticker: "EQR",
      price: 71.36,
      change: 0.4,
      rating: 6.7,
      oneYearReturn: "4.25%",
      predictedPrice: "$77.50",
      description: "A leading multifamily residential REIT focused on urban and high-density suburban communities.",
      metrics: {
        performance: {
          value: "Good",
          color: "green",
          details: {
            revenueGrowth: 3.8,
            profitMargin: 34.9,
            returnOnCapital: 5.59
          },
          explanation: "Moderate revenue growth with strong profit margins and solid return on capital. Effective property management and operational efficiency support financial performance."
        },
        stability: {
          value: "Average",
          color: "yellow",
          details: {
            volatility: 7.97,
            beta: 0.88,
            dividendConsistency: "Medium"
          },
          explanation: "Moderate volatility with below-average beta indicates reasonable price stability. Mixed dividend history with some variability but general upward trend over time."
        },
        value: {
          value: "Average",
          color: "yellow",
          details: {
            peRatio: 26.8,
            pbRatio: 2.46,
            dividendYield: 3.9
          },
          explanation: "Trades at a reasonable P/E multiple with typical price-to-book value for apartment REITs. Slightly below-average dividend yield is balanced by superior property quality and locations."
        },
        momentum: {
          value: "Poor",
          color: "red",
          details: {
            threeMonthReturn: 1.7,
            relativePerformance: -6.3,
            rsi: 52.8
          },
          explanation: "Modest absolute price gains but underperformance compared to broader real estate sector. Neutral RSI suggests balanced market sentiment currently."
        }
      },
      synopsis: {
        price: "Trading at 71.36 with modest recent gains despite sector rotation headwinds.",
        company: "Premier apartment owner focusing on urban and transit-oriented communities.",
        role: "Quality residential real estate exposure with focus on millennial renters."
      },
      overallAnalysis: "High-quality apartment REIT with superior property locations and demographic advantages. Well-positioned for urban rental recovery as return-to-office trends increase demand for convenient housing in employment centers.",
      chartData: [69, 72, 68, 71, 73, 68, 70, 72, 74, 71, 71.36],
      industry: "Real Estate"
    }
  ]
};

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
  return hardcodedStocks[industry] || [];
};