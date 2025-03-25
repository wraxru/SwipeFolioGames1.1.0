// Define the detail types for each metric category
export interface PerformanceDetails {
  revenueGrowth: number;
  profitMargin: number;
  returnOnCapital: number;
}

export interface StabilityDetails {
  volatility: number;
  beta: number;
  dividendConsistency: string;
}

export interface ValueDetails {
  peRatio: number;
  pbRatio: number;
  dividendYield: number | string;
}

export interface MomentumDetails {
  threeMonthReturn: number;
  relativePerformance: number;
  rsi: number;
}

export interface StockData {
  name: string;
  ticker: string;
  price: number;
  change: number;
  rating: number;
  smartScore?: string;
  description: string;
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
      smartScore: "Average",
      description: "Prologis is a leading global industrial REIT specializing in logistics real estate, including distribution centers and warehouses.",
      metrics: {
        performance: { 
          value: "Average", 
          color: "yellow",
          details: {
            revenueGrowth: 2.2,
            profitMargin: 45.4,
            returnOnCapital: 4.3
          },
          explanation: "Prologis shows moderate performance with 2.2% revenue growth, below the real estate industry average of 5.0%. However, its strong profit margin of 45.4% is significantly above the industry benchmark of 25%, while its solid 4.3% return on capital is close to the 4.5% industry standard."
        },
        stability: { 
          value: "Poor", 
          color: "red",
          details: {
            volatility: 2.5,
            beta: 1.24,
            dividendConsistency: "Medium"
          },
          explanation: "Prologis exhibits higher volatility (2.5%) compared to the real estate sector average of 2.5%. Its beta of 1.24 indicates increased market sensitivity. Medium dividend consistency suggests periodic adjustments to dividend policies which may concern income-focused investors."
        },
        value: { 
          value: "Average", 
          color: "yellow",
          details: {
            peRatio: 28.0,
            pbRatio: 1.9,
            dividendYield: 3.7
          },
          explanation: "Prologis trades at a PE ratio of 28.0, below the real estate industry average of 36.0. Its price-to-book ratio of 1.9 is better than the industry's 2.5, offering good value. Its dividend yield of 3.7% is slightly below the sector's 4.0% average, offering moderate income potential."
        },
        momentum: { 
          value: "Average", 
          color: "yellow",
          details: {
            threeMonthReturn: 6.1,
            relativePerformance: -2.0,
            rsi: 37.4
          },
          explanation: "Prologis shows mixed momentum with a positive three-month return of 6.1%, outperforming the real estate industry average of 2.0%. Its relative performance of -2.0% versus the index indicates slight underperformance. With an RSI of 37.4, the stock is approaching oversold territory, suggesting potential for a technical rebound."
        }
      },
      synopsis: {
        price: "Trading at a discount to historical multiples despite strong operational performance",
        company: "Prologis benefits from e-commerce growth driving demand for logistics facilities",
        role: "Core real estate holding with exposure to global logistics and supply chain trends"
      },
      overallAnalysis: "A high-quality logistics REIT benefiting from e-commerce growth and supply chain reconfiguration. Strong operational metrics and strategic global positioning provide resilience and long-term growth potential despite near-term interest rate pressures.",
      chartData: [107.5, 108.2, 108.9, 109.3, 109.8, 110.0, 110.1, 110.3, 110.2, 110.1, 110.2, 110.26],
      industry: "Real Estate"
    },
    {
      name: "Realty Income Corp",
      ticker: "O",
      price: 56.28,
      change: 0.65,
      rating: 3.8,
      smartScore: "Average",
      description: "Realty Income is a triple-net lease REIT focusing on high-quality, freestanding commercial properties with long-term leases.",
      metrics: {
        performance: { 
          value: "Average", 
          color: "yellow",
          details: {
            revenueGrowth: 29.5,
            profitMargin: 16.0,
            returnOnCapital: 1.3
          },
          explanation: "Realty Income shows strong revenue growth at 29.5%, well above the real estate industry average of 5.0%. However, its profit margin of 16.0% is below the industry benchmark of 25%, and its return on capital of 1.3% is significantly below the 4.5% industry standard, reflecting the triple-net lease business model's lower but more predictable returns."
        },
        stability: { 
          value: "Average", 
          color: "yellow",
          details: {
            volatility: 2.0,
            beta: 0.82,
            dividendConsistency: "Good"
          },
          explanation: "Realty Income exhibits excellent stability with lower volatility (2.0%) compared to the real estate sector average of 2.5%. Its beta of 0.82 indicates reduced market sensitivity. The company maintains excellent dividend consistency, providing reliable monthly income for investors."
        },
        value: { 
          value: "Average", 
          color: "yellow",
          details: {
            peRatio: 57.6,
            pbRatio: 1.29,
            dividendYield: 5.7
          },
          explanation: "Realty Income trades at a premium with a PE ratio of 57.6, well above the real estate industry average of 36.0. However, its price-to-book ratio of 1.29 is significantly below the industry's 2.5, suggesting good value. Its generous 5.7% dividend yield significantly exceeds the sector's 4.0% average, offering substantial income potential."
        },
        momentum: { 
          value: "Average", 
          color: "yellow",
          details: {
            threeMonthReturn: 6.6,
            relativePerformance: -1.5,
            rsi: 49.3
          },
          explanation: "Realty Income shows moderate momentum with a three-month return of 6.6%, outperforming the real estate industry average of 2.0%. Its relative performance of -1.5% indicates slight underperformance versus the broader index. With an RSI of 49.3, the stock is in balanced territory, suggesting stable trading patterns."
        }
      },
      synopsis: {
        price: "Trading steadily as investors value its reliable monthly dividend",
        company: "Realty Income continues to expand its portfolio with high-quality tenants and long-term leases",
        role: "Core income holding for real estate portfolio with consistent monthly dividends"
      },
      overallAnalysis: "A high-quality net lease REIT known as the 'Monthly Dividend Company'. Strong tenant quality, long-term lease structure, and consistent dividend growth make it an excellent choice for income-focused investors seeking stability.",
      chartData: [54.85, 55.10, 55.42, 55.65, 55.92, 56.15, 55.98, 56.05, 56.12, 56.20, 56.25, 56.28],
      industry: "Real Estate"
    },
    {
      name: "Simon Property Group",
      ticker: "SPG",
      price: 166.12,
      change: 0.55,
      rating: 3.0,
      smartScore: "Average",
      description: "Simon Property Group is a retail REIT specializing in premium shopping, dining, and entertainment destinations.",
      metrics: {
        performance: { 
          value: "Good", 
          color: "green",
          details: {
            revenueGrowth: 5.4,
            profitMargin: 41.9,
            returnOnCapital: 9.97
          },
          explanation: "Simon Property Group shows solid revenue growth at 5.4%, slightly above the real estate industry average of 5.0%. Its profit margin of 41.9% significantly exceeds the industry benchmark of 25%, while its excellent 9.97% return on capital is more than double the 4.5% industry standard, reflecting the company's premium positioning in the retail sector."
        },
        stability: { 
          value: "Poor", 
          color: "red",
          details: {
            volatility: 2.6,
            beta: 1.49,
            dividendConsistency: "Poor"
          },
          explanation: "Simon Property Group exhibits higher volatility (2.6%) than the real estate industry average of 2.5%. Its beta of 1.49 indicates significantly higher market sensitivity. Poor dividend consistency reflects historical dividend adjustments during retail sector disruptions, a concern for income-focused investors."
        },
        value: { 
          value: "Average", 
          color: "yellow",
          details: {
            peRatio: 22.0,
            pbRatio: 18.68,
            dividendYield: 5.1
          },
          explanation: "Simon Property Group trades at a favorable PE ratio of 22.0, below the real estate industry average of 36.0. However, its price-to-book ratio of 18.68 is significantly above the industry's 2.5. Its attractive 5.1% dividend yield exceeds the sector's 4.0% average, offering substantial income potential."
        },
        momentum: { 
          value: "Poor", 
          color: "red",
          details: {
            threeMonthReturn: -3.1,
            relativePerformance: -11.0,
            rsi: 41.9
          },
          explanation: "Simon Property Group shows weak momentum with a negative three-month return of -3.1%, significantly underperforming the real estate industry average of 2.0%. Its relative performance of -11.0% indicates substantial underperformance versus the index. With an RSI of 41.9, the stock is approaching oversold territory."
        }
      },
      synopsis: {
        price: "Under pressure as retail sector faces ongoing challenges",
        company: "Simon Property Group continues transforming its premium mall portfolio to adapt to changing consumer behavior",
        role: "Higher-risk opportunity in retail real estate with attractive dividend yield"
      },
      overallAnalysis: "A major retail REIT facing challenges in an evolving retail landscape. While offering strong operational metrics and an attractive dividend yield, investment comes with higher volatility and uncertainty as the company navigates the continuing transformation of physical retail.",
      chartData: [169.5, 168.8, 168.2, 167.6, 166.9, 166.5, 166.2, 166.0, 165.8, 166.0, 166.08, 166.12],
      industry: "Real Estate"
    },
    {
      name: "AvalonBay Communities",
      ticker: "AVB",
      price: 214.36,
      change: 0.82,
      rating: 3.5,
      smartScore: "Average",
      description: "AvalonBay Communities is a residential REIT specializing in high-quality apartment communities in leading metropolitan areas.",
      metrics: {
        performance: { 
          value: "Good", 
          color: "green",
          details: {
            revenueGrowth: 4.9,
            profitMargin: 36.5,
            returnOnCapital: 5.6
          },
          explanation: "AvalonBay shows solid performance with 4.9% revenue growth, in line with the real estate industry average of 5.0%. Its strong profit margin of 36.5% is well above the industry benchmark of 25%, while its excellent 5.6% return on capital exceeds the 4.5% industry standard, reflecting efficient management of its apartment portfolio."
        },
        stability: { 
          value: "Average", 
          color: "yellow",
          details: {
            volatility: 2.0,
            beta: 0.89,
            dividendConsistency: "Good"
          },
          explanation: "AvalonBay exhibits good stability with lower volatility (2.0%) than the real estate industry average of 2.5%. Its beta of 0.89 indicates slightly reduced market sensitivity. The company maintains good dividend consistency, with a strong history of reliable distributions."
        },
        value: { 
          value: "Average", 
          color: "yellow",
          details: {
            peRatio: 28.2,
            pbRatio: 2.55,
            dividendYield: 3.3
          },
          explanation: "AvalonBay trades at a PE ratio of 28.2, below the real estate industry average of 36.0. Its price-to-book ratio of 2.55 is slightly higher than the industry's 2.5. Its dividend yield of 3.3% is below the sector's 4.0% average, offering moderate income potential."
        },
        momentum: { 
          value: "Poor", 
          color: "red",
          details: {
            threeMonthReturn: -2.4,
            relativePerformance: -10.0,
            rsi: 47.8
          },
          explanation: "AvalonBay shows weak momentum with a negative three-month return of -2.4%, underperforming the real estate industry average of 2.0%. Its relative performance of -10.0% indicates significant underperformance versus the index. With an RSI of 47.8, the stock is in neutral territory."
        }
      },
      synopsis: {
        price: "Stable with moderate growth as rental demand remains strong in key markets",
        company: "AvalonBay benefits from urban migration trends and limited housing supply in coastal markets",
        role: "Quality holding for residential real estate exposure with consistent dividend growth"
      },
      overallAnalysis: "A high-quality apartment REIT with properties in premium markets. Strong operational metrics and favorable demographics in its target markets provide resilience and long-term growth potential despite near-term interest rate pressures.",
      chartData: [210.5, 211.2, 212.0, 212.5, 213.1, 213.5, 213.8, 214.0, 214.2, 214.25, 214.3, 214.36],
      industry: "Real Estate"
    },
    {
      name: "Public Storage",
      ticker: "PSA",
      price: 294.93,
      change: 1.25,
      rating: 3.3,
      smartScore: "Average",
      description: "Public Storage is the largest self-storage REIT in the United States with over 2,800 facilities nationwide.",
      metrics: {
        performance: { 
          value: "Good", 
          color: "green",
          details: {
            revenueGrowth: 3.9,
            profitMargin: 39.9,
            returnOnCapital: 10.2
          },
          explanation: "Public Storage shows moderate performance with 3.9% revenue growth, below the real estate industry average of 5.0%. However, its strong profit margin of 39.9% significantly exceeds the industry benchmark of 25%, while its excellent 10.2% return on capital is more than double the 4.5% industry standard, reflecting the operational efficiency of its self-storage portfolio."
        },
        stability: { 
          value: "Average", 
          color: "yellow",
          details: {
            volatility: 2.6,
            beta: 0.8,
            dividendConsistency: "Good"
          },
          explanation: "Public Storage exhibits slightly higher volatility (2.6%) than the real estate industry average of 2.5%. Its beta of 0.8 indicates reduced market sensitivity, which is positive. The company maintains high dividend consistency with a long track record of reliable distributions."
        },
        value: { 
          value: "Poor", 
          color: "red",
          details: {
            peRatio: 27.7,
            pbRatio: 9.65,
            dividendYield: 4.2
          },
          explanation: "Public Storage trades at a PE ratio of 27.7, below the real estate industry average of 36.0, which is positive. However, its price-to-book ratio of 9.65 is significantly above the industry's 2.5. Its dividend yield of 4.2% slightly exceeds the sector's 4.0% average, offering good income potential."
        },
        momentum: { 
          value: "Poor", 
          color: "red",
          details: {
            threeMonthReturn: -1.7,
            relativePerformance: -9.7,
            rsi: 43.5
          },
          explanation: "Public Storage shows weak momentum with a negative three-month return of -1.7%, underperforming the real estate industry average of 2.0%. Its relative performance of -9.7% indicates significant underperformance versus the index. With an RSI of 43.5, the stock is approaching oversold territory."
        }
      },
      synopsis: {
        price: "Trading steadily with strong fundamentals despite recent industry slowdown",
        company: "Public Storage's dominant market position and scale provide competitive advantages in the self-storage space",
        role: "Core holding for real estate portfolio with defensive characteristics and reliable income"
      },
      overallAnalysis: "A blue-chip storage REIT with industry-leading scale and operational efficiency. Strong balance sheet, brand recognition, and technological investments position it well for long-term growth despite near-term normalization in the storage market.",
      chartData: [290.2, 291.5, 292.3, 293.1, 293.5, 293.8, 294.0, 294.3, 294.5, 294.7, 294.85, 294.93],
      industry: "Real Estate"
    },
    {
      name: "Digital Realty Trust",
      ticker: "DLR",
      price: 155.49,
      change: 0.88,
      rating: 2.5,
      smartScore: "Poor",
      description: "Digital Realty Trust is a global provider of data center and colocation solutions for technology companies and enterprises.",
      metrics: {
        performance: { 
          value: "Poor", 
          color: "red",
          details: {
            revenueGrowth: 1.4,
            profitMargin: 10.1,
            returnOnCapital: 1.43
          },
          explanation: "Digital Realty shows weak performance with 1.4% revenue growth, well below the real estate industry average of 5.0%. Its profit margin of 10.1% is significantly below the industry benchmark of 25%, while its return on capital of 1.43% is far below the 4.5% industry standard, reflecting ongoing heavy investments in expansion that have yet to yield proportionate returns."
        },
        stability: { 
          value: "Poor", 
          color: "red",
          details: {
            volatility: 3.1,
            beta: 0.92,
            dividendConsistency: "Good"
          },
          explanation: "Digital Realty exhibits higher volatility (3.1%) than the real estate industry average of 2.5%. However, its beta of 0.92 indicates slightly reduced market sensitivity, which is positive. The company maintains high dividend consistency with a solid history of dividend increases."
        },
        value: { 
          value: "Poor", 
          color: "red",
          details: {
            peRatio: 95.6,
            pbRatio: 2.54,
            dividendYield: 3.2
          },
          explanation: "Digital Realty trades at a very high PE ratio of 95.6, significantly above the real estate industry average of 36.0, reflecting significant premium valuation. Its price-to-book ratio of 2.54 is slightly above the industry's 2.5. Its dividend yield of 3.2% is below the sector's 4.0% average, offering moderate income potential."
        },
        momentum: { 
          value: "Poor", 
          color: "red",
          details: {
            threeMonthReturn: -12.1,
            relativePerformance: -20.0,
            rsi: 50.1
          },
          explanation: "Digital Realty shows very weak momentum with a significant negative three-month return of -12.1%, substantially underperforming the real estate industry average of 2.0%. Its relative performance of -20.0% indicates major underperformance versus the index. With an RSI of 50.1, the stock is in neutral territory despite recent weakness."
        }
      },
      synopsis: {
        price: "Under pressure as AI demand balances against higher interest rate concerns",
        company: "Digital Realty's global data center footprint positions it well for cloud computing and AI growth",
        role: "Strategic holding for technology exposure through real estate with dividend income"
      },
      overallAnalysis: "A leading global data center REIT with mixed investment characteristics. Despite near-term pressures and high valuation, long-term secular trends in digital transformation, cloud computing, and AI infrastructure support future demand for data center facilities.",
      chartData: [161.5, 160.2, 159.0, 157.8, 156.5, 155.8, 155.3, 155.0, 154.8, 155.1, 155.3, 155.49],
      industry: "Real Estate"
    },
    {
      name: "American Tower Corp",
      ticker: "AMT",
      price: 212.80,
      change: 1.45,
      rating: 3.9,
      smartScore: "Good",
      description: "American Tower Corp is a global REIT that owns, operates, and develops communications real estate with a portfolio of over 220,000 sites worldwide.",
      metrics: {
        performance: { 
          value: "Average", 
          color: "yellow",
          details: {
            revenueGrowth: -3.0,
            profitMargin: 20.9,
            returnOnCapital: 5.24
          },
          explanation: "American Tower shows concerning revenue growth at -3.0%, well below the real estate industry average of 5.0%. Its profit margin of 20.9% is slightly below the industry benchmark of 25%, though its return on capital of 5.24% exceeds the 4.5% industry standard, reflecting the efficiency of its asset-light business model."
        },
        stability: { 
          value: "Average", 
          color: "yellow",
          details: {
            volatility: 2.6,
            beta: 0.89,
            dividendConsistency: "Good"
          },
          explanation: "American Tower exhibits slightly higher volatility (2.6%) than the real estate industry average of 2.5%. Its beta of 0.89 indicates reduced market sensitivity, which is positive. The company maintains high dividend consistency with a strong history of regular increases."
        },
        value: { 
          value: "Poor", 
          color: "red",
          details: {
            peRatio: 44.2,
            pbRatio: 29.41,
            dividendYield: 3.2
          },
          explanation: "American Tower trades at a high PE ratio of 44.2, above the real estate industry average of 36.0. Its price-to-book ratio of 29.41 is extremely high compared to the industry's 2.5, reflecting its asset-light business model and intangible value. Its dividend yield of 3.2% is below the sector's 4.0% average, offering moderate income potential."
        },
        momentum: { 
          value: "Good", 
          color: "green",
          details: {
            threeMonthReturn: 15.1,
            relativePerformance: 7.1,
            rsi: 61.1
          },
          explanation: "American Tower shows strong momentum with an exceptional three-month return of 15.1%, significantly outperforming the real estate industry average of 2.0%. Its relative performance of 7.1% indicates substantial outperformance versus the index. With an RSI of 61.1, the stock is showing strong buying interest while not yet reaching overbought levels."
        }
      },
      synopsis: {
        price: "Breaking out to new highs as 5G buildout accelerates globally",
        company: "American Tower's global infrastructure portfolio benefits from increasing mobile data usage and network densification",
        role: "Growth-oriented real estate holding with exposure to global telecommunications trends"
      },
      overallAnalysis: "A leading global communications REIT benefiting from 5G deployment and data consumption growth. Despite high valuation multiples, the company's essential infrastructure assets and global diversification provide resilience and long-term growth potential.",
      chartData: [207.5, 208.3, 209.2, 210.1, 210.8, 211.5, 211.9, 212.2, 212.4, 212.6, 212.7, 212.8],
      industry: "Real Estate"
    },
    {
      name: "Welltower Inc",
      ticker: "WELL",
      price: 149.84,
      change: 0.75,
      rating: 3.2,
      smartScore: "Average",
      description: "Welltower is a healthcare REIT specializing in senior housing, post-acute care, and outpatient medical properties.",
      metrics: {
        performance: { 
          value: "Poor", 
          color: "red",
          details: {
            revenueGrowth: 20.4,
            profitMargin: 6.3,
            returnOnCapital: 1.06
          },
          explanation: "Welltower shows excellent revenue growth at 20.4%, significantly exceeding the real estate industry average of 5.0%. However, its profit margin of 6.3% is far below the industry benchmark of 25%, while its return on capital of 1.06% is substantially below the 4.5% industry standard, reflecting challenges in the senior housing sector that are only beginning to improve."
        },
        stability: { 
          value: "Average", 
          color: "yellow",
          details: {
            volatility: 2.2,
            beta: 0.94,
            dividendConsistency: "Poor"
          },
          explanation: "Welltower exhibits slightly lower volatility (2.2%) than the real estate industry average of 2.5%. Its beta of 0.94 indicates slightly reduced market sensitivity. However, poor dividend consistency reflects historical cuts during pandemic disruptions to its senior housing portfolio."
        },
        value: { 
          value: "Poor", 
          color: "red",
          details: {
            peRatio: 182.2,
            pbRatio: 2.98,
            dividendYield: 1.9
          },
          explanation: "Welltower trades at an extremely high PE ratio of 182.2, far above the real estate industry average of 36.0, reflecting expected earnings recovery. Its price-to-book ratio of 2.98 is slightly above the industry's 2.5. Its dividend yield of 1.9% is less than half the sector's 4.0% average, offering limited income potential."
        },
        momentum: { 
          value: "Good", 
          color: "green",
          details: {
            threeMonthReturn: 19.3,
            relativePerformance: 11.3,
            rsi: 54.7
          },
          explanation: "Welltower shows exceptional momentum with a three-month return of 19.3%, dramatically outperforming the real estate industry average of 2.0%. Its relative performance of 11.3% indicates substantial outperformance versus the index. With an RSI of 54.7, the stock shows moderate buying interest without reaching overbought levels."
        }
      },
      synopsis: {
        price: "Breaking out to new highs as senior housing sector recovery accelerates",
        company: "Welltower's demographic tailwinds provide long-term growth as aging population drives healthcare demand",
        role: "Thematic play on aging demographics with recovery potential from pandemic disruptions"
      },
      overallAnalysis: "A leading healthcare REIT benefiting from demographic tailwinds with a focus on senior housing. Despite operational challenges during the pandemic, the company's portfolio is well-positioned for recovery and long-term growth as population aging trends accelerate.",
      chartData: [146.5, 147.2, 147.8, 148.3, 148.7, 149.1, 149.3, 149.5, 149.6, 149.7, 149.8, 149.84],
      industry: "Real Estate"
    },
    {
      name: "Boston Properties",
      ticker: "BXP",
      price: 69.48,
      change: -0.35,
      rating: 2.8,
      smartScore: "Poor",
      description: "Boston Properties is an office REIT that owns, manages, and develops Class A office properties in major U.S. markets.",
      metrics: {
        performance: { 
          value: "Poor", 
          color: "red",
          details: {
            revenueGrowth: 4.1,
            profitMargin: 0.4,
            returnOnCapital: 0.06
          },
          explanation: "Boston Properties shows modest revenue growth at 4.1%, slightly below the real estate industry average of 5.0%. Its profit margin of 0.4% is extremely low compared to the industry benchmark of 25%, while its return on capital of 0.06% is negligible compared to the 4.5% industry standard, reflecting severe challenges in the office property sector."
        },
        stability: { 
          value: "Average", 
          color: "yellow",
          details: {
            volatility: 3.0,
            beta: 1.08,
            dividendConsistency: "Poor"
          },
          explanation: "Boston Properties exhibits higher volatility (3.0%) than the real estate industry average of 2.5%. Its beta of 1.08 indicates slightly higher market sensitivity. Poor dividend consistency reflects concerns about the sustainability of its distribution given office sector challenges."
        },
        value: { 
          value: "Average", 
          color: "yellow",
          details: {
            peRatio: 785.0,
            pbRatio: 2.03,
            dividendYield: 5.7
          },
          explanation: "Boston Properties trades at an extremely high PE ratio of 785.0, far above the real estate industry average of 36.0, reflecting severely depressed earnings. However, its price-to-book ratio of 2.03 is below the industry's 2.5, suggesting some value based on assets. Its generous 5.7% dividend yield significantly exceeds the sector's 4.0% average, though sustainability may be a concern."
        },
        momentum: { 
          value: "Poor", 
          color: "red",
          details: {
            threeMonthReturn: -6.4,
            relativePerformance: -14.4,
            rsi: 52.5
          },
          explanation: "Boston Properties shows negative momentum with a three-month return of -6.4%, significantly underperforming the real estate industry average of 2.0%. Its relative performance of -14.4% indicates substantial underperformance versus the index. With an RSI of 52.5, the stock is in neutral territory despite recent weakness."
        }
      },
      synopsis: {
        price: "Under significant pressure as return-to-office trends remain uncertain",
        company: "Boston Properties focusing on upgrading office spaces to attract tenants in competitive environment",
        role: "High-risk contrarian play on the future of urban office space with high income potential"
      },
      overallAnalysis: "A major office REIT facing significant challenges in the post-pandemic work environment. Despite quality assets in premium locations, ongoing shifts in work patterns create substantial uncertainty regarding long-term demand for traditional office space.",
      chartData: [71.5, 71.1, 70.7, 70.3, 70.1, 69.9, 69.7, 69.6, 69.5, 69.45, 69.4, 69.48],
      industry: "Real Estate"
    },
    {
      name: "Equity Residential",
      ticker: "EQR",
      price: 71.36,
      change: 0.42,
      rating: 3.5,
      smartScore: "Average",
      description: "Equity Residential is a multifamily REIT focused on owning and operating apartment properties in urban and high-density suburban areas.",
      metrics: {
        performance: { 
          value: "Good", 
          color: "green",
          details: {
            revenueGrowth: 3.8,
            profitMargin: 34.9,
            returnOnCapital: 5.59
          },
          explanation: "Equity Residential shows moderate revenue growth at 3.8%, slightly below the real estate industry average of 5.0%. However, its profit margin of 34.9% significantly exceeds the industry benchmark of 25%, while its return on capital of 5.59% is well above the 4.5% industry standard, reflecting efficient management of its apartment portfolio in high-barrier-to-entry markets."
        },
        stability: { 
          value: "Average", 
          color: "yellow",
          details: {
            volatility: 2.3,
            beta: 0.88,
            dividendConsistency: "Medium"
          },
          explanation: "Equity Residential exhibits slightly lower volatility (2.3%) than the real estate industry average of 2.5%. Its beta of 0.88 indicates reduced market sensitivity. Medium dividend consistency reflects a generally reliable distribution history with occasional adjustments."
        },
        value: { 
          value: "Average", 
          color: "yellow",
          details: {
            peRatio: 26.8,
            pbRatio: 2.46,
            dividendYield: 3.9
          },
          explanation: "Equity Residential trades at a PE ratio of 26.8, below the real estate industry average of 36.0. Its price-to-book ratio of 2.46 is in line with the industry's 2.5. Its dividend yield of 3.9% is slightly below the sector's 4.0% average, offering moderate income potential."
        },
        momentum: { 
          value: "Poor", 
          color: "red",
          details: {
            threeMonthReturn: 1.7,
            relativePerformance: -6.3,
            rsi: 52.8
          },
          explanation: "Equity Residential shows weak momentum with a modest three-month return of 1.7%, slightly underperforming the real estate industry average of 2.0%. Its relative performance of -6.3% indicates underperformance versus the index. With an RSI of 52.8, the stock is in neutral territory."
        }
      },
      synopsis: {
        price: "Trading steadily as stable rental demand balances against higher interest rates",
        company: "Equity Residential's focus on affluent renters in coastal markets provides resilience",
        role: "Quality holding for residential real estate exposure with good dividend security"
      },
      overallAnalysis: "A high-quality apartment REIT with properties targeting affluent renters in coastal markets. Strong operational metrics and demographic tailwinds provide resilience, though the company faces near-term challenges from interest rate pressures and economic uncertainty.",
      chartData: [70.8, 70.9, 71.0, 71.1, 71.2, 71.25, 71.3, 71.32, 71.34, 71.35, 71.35, 71.36],
      industry: "Real Estate"
    },
    {
      name: "AvalonBay Communities",
      ticker: "AVB",
      price: 214.36,
      change: 0.82,
      rating: 4.1,
      smartScore: "Good",
      description: "AvalonBay Communities is a residential REIT specializing in high-quality apartment communities in leading metropolitan areas.",
      metrics: {
        performance: { 
          value: "Fair", 
          color: "yellow",
          details: {
            revenueGrowth: 4.9,
            profitMargin: 36.5,
            returnOnCapital: 5.6
          },
          explanation: "AvalonBay shows solid performance with 4.9% revenue growth, in line with residential REIT averages. Its profit margin of 36.5% and return on capital of 5.6% reflect efficient management of its apartment portfolio across premium markets."
        },
        stability: { 
          value: "Fair", 
          color: "yellow",
          details: {
            volatility: 0.89,
            beta: 0.89,
            dividendConsistency: "High"
          },
          explanation: "AvalonBay exhibits moderate stability with volatility (0.89) close to the residential REIT average. Its beta of 0.89 indicates slightly reduced market sensitivity. The company maintains high dividend consistency, with a strong history of dividend growth."
        },
        value: { 
          value: "Fair", 
          color: "yellow",
          details: {
            peRatio: 28.2,
            pbRatio: 2.55,
            dividendYield: 3.3
          },
          explanation: "AvalonBay trades at a PE ratio of 28.2, slightly above the residential REIT average. Its price-to-book ratio of 2.55 is typical for high-quality apartment REITs, while its 3.3% dividend yield provides moderate income potential."
        },
        momentum: { 
          value: "Weak", 
          color: "red",
          details: {
            threeMonthReturn: -2.4,
            relativePerformance: -10.0,
            rsi: 47.8
          },
          explanation: "AvalonBay shows weak momentum with a negative three-month return of -2.4%, underperforming the broader market. Its relative performance of -10.0% indicates significant underperformance versus peers. With an RSI of 47.8, the stock is in neutral territory."
        }
      },
      synopsis: {
        price: "Stable with moderate growth as rental demand remains strong in key markets",
        company: "AvalonBay benefits from urban migration trends and limited housing supply in coastal markets",
        role: "Quality holding for residential real estate exposure with consistent dividend growth"
      },
      overallAnalysis: "A high-quality apartment REIT with properties in premium coastal markets. Strong operational metrics and favorable demographics in its target markets provide resilience and long-term growth potential despite near-term interest rate pressures.",
      chartData: [210.5, 211.2, 212.0, 212.5, 213.1, 213.5, 213.8, 214.0, 214.2, 214.25, 214.3, 214.36],
      industry: "Real Estate"
    },
    {
      name: "Public Storage",
      ticker: "PSA",
      price: 294.93,
      change: 1.25,
      rating: 4.2,
      smartScore: "Good",
      description: "Public Storage is the largest self-storage REIT in the United States with over 2,800 facilities nationwide.",
      metrics: {
        performance: { 
          value: "Fair", 
          color: "yellow",
          details: {
            revenueGrowth: 3.9,
            profitMargin: 39.9,
            returnOnCapital: 10.2
          },
          explanation: "Public Storage shows solid performance with 3.9% revenue growth, slightly below the self-storage REIT average. Its strong profit margin of 39.9% and excellent return on capital of 10.2% reflect the operational efficiency of its vast self-storage portfolio."
        },
        stability: { 
          value: "High", 
          color: "green",
          details: {
            volatility: 0.8,
            beta: 0.8,
            dividendConsistency: "High"
          },
          explanation: "Public Storage exhibits excellent stability with low volatility (0.8) compared to the broader REIT sector. Its beta of 0.8 indicates reduced market sensitivity. The company maintains high dividend consistency with a long track record of reliable distributions."
        },
        value: { 
          value: "Fair", 
          color: "yellow",
          details: {
            peRatio: 27.7,
            pbRatio: 9.65,
            dividendYield: 4.2
          },
          explanation: "Public Storage trades at a PE ratio of 27.7, typical for premium self-storage REITs. Its price-to-book ratio of 9.65 reflects the high-quality nature of its assets and dominant market position. The 4.2% dividend yield offers attractive income potential."
        },
        momentum: { 
          value: "Weak", 
          color: "red",
          details: {
            threeMonthReturn: -1.7,
            relativePerformance: -9.7,
            rsi: 43.5
          },
          explanation: "Public Storage shows weak momentum with a negative three-month return of -1.7%, underperforming the broader market. Its relative performance of -9.7% indicates significant underperformance versus peers. With an RSI of 43.5, the stock is approaching oversold territory."
        }
      },
      synopsis: {
        price: "Trading steadily with strong fundamentals despite recent industry slowdown",
        company: "Public Storage's dominant market position and scale provide competitive advantages in the self-storage space",
        role: "Core holding for real estate portfolio with defensive characteristics and reliable income"
      },
      overallAnalysis: "A blue-chip storage REIT with industry-leading scale and operational efficiency. Strong balance sheet, brand recognition, and technological investments position it well for long-term growth despite near-term normalization in the storage market.",
      chartData: [290.2, 291.5, 292.3, 293.1, 293.5, 293.8, 294.0, 294.3, 294.5, 294.7, 294.85, 294.93],
      industry: "Real Estate"
    },
    {
      name: "Digital Realty Trust",
      ticker: "DLR",
      price: 155.49,
      change: 0.88,
      rating: 4.0,
      smartScore: "Good",
      description: "Digital Realty Trust is a global provider of data center and colocation solutions for technology companies and enterprises.",
      metrics: {
        performance: { 
          value: "Low", 
          color: "red",
          details: {
            revenueGrowth: 1.4,
            profitMargin: 10.1,
            returnOnCapital: 1.43
          },
          explanation: "Digital Realty shows moderate performance with 1.4% revenue growth, below the data center REIT average. Its profit margin of 10.1% and return on capital of 1.43% reflect ongoing investments in expansion and development of new facilities."
        },
        stability: { 
          value: "Fair", 
          color: "yellow",
          details: {
            volatility: 0.92,
            beta: 0.92,
            dividendConsistency: "High"
          },
          explanation: "Digital Realty exhibits good stability with volatility (0.92) near the data center REIT average. Its beta of 0.92 indicates slightly reduced market sensitivity. The company maintains high dividend consistency with a strong history of dividend increases."
        },
        value: { 
          value: "Fair", 
          color: "yellow",
          details: {
            peRatio: 95.6,
            pbRatio: 2.54,
            dividendYield: 3.2
          },
          explanation: "Digital Realty trades at a high PE ratio of 95.6, reflecting significant investment in future growth. Its price-to-book ratio of 2.54 is reasonable for data center REITs, while its 3.2% dividend yield provides moderate income potential."
        },
        momentum: { 
          value: "Weak", 
          color: "red",
          details: {
            threeMonthReturn: -12.1,
            relativePerformance: -20.0,
            rsi: 50.1
          },
          explanation: "Digital Realty shows weak momentum with a significant negative three-month return of -12.1%, substantially underperforming the broader market. Its relative performance of -20.0% indicates major underperformance versus peers. With an RSI of 50.1, the stock is in neutral territory despite recent weakness."
        }
      },
      synopsis: {
        price: "Under pressure as AI demand balances against higher interest rate concerns",
        company: "Digital Realty's global data center footprint positions it well for cloud computing and AI growth",
        role: "Strategic holding for technology exposure through real estate with dividend income"
      },
      overallAnalysis: "A leading global data center REIT well-positioned for cloud computing and AI infrastructure growth. Despite near-term interest rate pressures, long-term secular trends in digital transformation and data consumption support future demand for its facilities.",
      chartData: [161.5, 160.2, 159.0, 157.8, 156.5, 155.8, 155.3, 155.0, 154.8, 155.1, 155.3, 155.49],
      industry: "Real Estate"
    },
    {
      name: "American Tower Corp",
      ticker: "AMT",
      price: 212.80,
      change: 1.45,
      rating: 4.1,
      smartScore: "Good",
      description: "American Tower Corp is a global REIT that owns, operates, and develops communications real estate with a portfolio of over 220,000 sites worldwide.",
      metrics: {
        performance: { 
          value: "Low", 
          color: "red",
          details: {
            revenueGrowth: -3.0,
            profitMargin: 20.9,
            returnOnCapital: 5.24
          },
          explanation: "American Tower shows challenging performance with -3.0% revenue decline, below the communications REIT average. Despite this, its profit margin of 20.9% and return on capital of 5.24% remain solid, reflecting the stability of its tower leasing business model."
        },
        stability: { 
          value: "High", 
          color: "green",
          details: {
            volatility: 0.89,
            beta: 0.89,
            dividendConsistency: "High"
          },
          explanation: "American Tower exhibits good stability with volatility (0.89) lower than the broader REIT sector. Its beta of 0.89 indicates slightly reduced market sensitivity. The company maintains high dividend consistency with a strong history of dividend growth."
        },
        value: { 
          value: "Poor", 
          color: "red",
          details: {
            peRatio: 44.2,
            pbRatio: 29.41,
            dividendYield: 3.2
          },
          explanation: "American Tower trades at a high PE ratio of 44.2 and a very high price-to-book ratio of 29.41, reflecting premium valuations for communications infrastructure REITs. Its 3.2% dividend yield provides moderate income potential despite the premium valuation."
        },
        momentum: { 
          value: "Fair", 
          color: "yellow",
          details: {
            threeMonthReturn: 15.1,
            relativePerformance: 7.1,
            rsi: 61.1
          },
          explanation: "American Tower shows solid momentum with a strong three-month return of 15.1%, outperforming the broader market. Its relative performance of 7.1% indicates significant outperformance versus peers. With an RSI of 61.1, the stock shows positive momentum without being overbought."
        }
      },
      synopsis: {
        price: "Rebounding as interest rate concerns ease and 5G deployment continues",
        company: "American Tower's global tower portfolio benefits from increasing data consumption and network densification",
        role: "Core holding for communications infrastructure exposure with growing dividends"
      },
      overallAnalysis: "A premier global communications infrastructure REIT with a resilient business model supported by long-term leases. Despite near-term carrier consolidation challenges, increasing global mobile data usage and network technology evolution provide sustainable growth catalysts.",
      chartData: [200.5, 202.8, 205.3, 207.5, 209.2, 210.5, 211.2, 211.8, 212.2, 212.5, 212.7, 212.8],
      industry: "Real Estate"
    },
    {
      name: "Welltower Inc",
      ticker: "WELL",
      price: 149.84,
      change: 0.65,
      rating: 3.5,
      smartScore: "Poor",
      description: "Welltower Inc is a healthcare REIT that focuses on senior housing, post-acute care, and outpatient medical properties.",
      metrics: {
        performance: { 
          value: "Strong", 
          color: "green",
          details: {
            revenueGrowth: 20.4,
            profitMargin: 6.3,
            returnOnCapital: 1.06
          },
          explanation: "Welltower shows excellent performance with 20.4% revenue growth, significantly above the healthcare REIT average. However, its profit margin of 6.3% and return on capital of 1.06% are relatively low, reflecting the capital-intensive nature of healthcare real estate and ongoing portfolio repositioning."
        },
        stability: { 
          value: "Fair", 
          color: "yellow",
          details: {
            volatility: 0.94,
            beta: 0.94,
            dividendConsistency: "Medium"
          },
          explanation: "Welltower exhibits moderate stability with volatility (0.94) near the healthcare REIT average. Its beta of 0.94 indicates slightly reduced market sensitivity. The company's dividend consistency is medium, with a history of dividend adjustments during portfolio restructuring."
        },
        value: { 
          value: "Poor", 
          color: "red",
          details: {
            peRatio: 182.2,
            pbRatio: 2.98,
            dividendYield: 1.9
          },
          explanation: "Welltower trades at a very high PE ratio of 182.2, reflecting significant recent investments and portfolio transformation. Its price-to-book ratio of 2.98 is reasonable for healthcare REITs, while its 1.9% dividend yield is below the REIT sector average."
        },
        momentum: { 
          value: "Strong", 
          color: "green",
          details: {
            threeMonthReturn: 19.3,
            relativePerformance: 11.3,
            rsi: 54.7
          },
          explanation: "Welltower shows strong momentum with an excellent three-month return of 19.3%, significantly outperforming the broader market. Its relative performance of 11.3% indicates substantial outperformance versus peers. With an RSI of 54.7, the stock maintains positive momentum while remaining in balanced territory."
        }
      },
      synopsis: {
        price: "Trending higher as senior housing demand accelerates post-pandemic",
        company: "Welltower benefits from demographic tailwinds and strategic portfolio repositioning toward premium senior housing",
        role: "Growth-oriented healthcare real estate exposure with demographic tailwinds"
      },
      overallAnalysis: "A leading healthcare REIT experiencing strong recovery in senior housing fundamentals. Demographic trends, strategic portfolio repositioning, and favorable supply-demand dynamics support long-term growth despite near-term valuation concerns.",
      chartData: [141.3, 143.5, 145.2, 146.8, 147.5, 148.2, 148.8, 149.2, 149.5, 149.65, 149.75, 149.84],
      industry: "Real Estate"
    },
    {
      name: "Boston Properties",
      ticker: "BXP",
      price: 69.48,
      change: -0.72,
      rating: 2.8,
      smartScore: "Poor",
      description: "Boston Properties is an office REIT that owns and manages premier workplaces in major U.S. gateway cities.",
      metrics: {
        performance: { 
          value: "Low", 
          color: "red",
          details: {
            revenueGrowth: 4.1,
            profitMargin: 0.4,
            returnOnCapital: 0.06
          },
          explanation: "Boston Properties shows modest performance with 4.1% revenue growth, below the office REIT average. Its extremely low profit margin of 0.4% and return on capital of 0.06% reflect significant challenges in the office sector post-pandemic and the impact of higher interest rates."
        },
        stability: { 
          value: "Unstable", 
          color: "red",
          details: {
            volatility: 1.08,
            beta: 1.08,
            dividendConsistency: "Medium"
          },
          explanation: "Boston Properties exhibits higher volatility (1.08) than the REIT sector average. Its beta of 1.08 indicates slightly higher market sensitivity. The company's dividend consistency is medium, with recent concerns about potential dividend adjustments amid office sector challenges."
        },
        value: { 
          value: "Fair", 
          color: "yellow",
          details: {
            peRatio: 785.0,
            pbRatio: 2.03,
            dividendYield: 5.7
          },
          explanation: "Boston Properties trades at an extremely high PE ratio of 785.0 due to compressed earnings in the challenging office environment. Its price-to-book ratio of 2.03 is reasonable, while its high 5.7% dividend yield reflects investor concerns about the office sector's future."
        },
        momentum: { 
          value: "Weak", 
          color: "red",
          details: {
            threeMonthReturn: -6.4,
            relativePerformance: -14.4,
            rsi: 52.5
          },
          explanation: "Boston Properties shows weak momentum with a negative three-month return of -6.4%, underperforming the broader market. Its relative performance of -14.4% indicates significant underperformance versus peers. With an RSI of 52.5, the stock is in neutral territory despite recent weakness."
        }
      },
      synopsis: {
        price: "Under pressure as remote work trends challenge the office sector",
        company: "Boston Properties focuses on premium Class A office properties in innovation-driven markets",
        role: "Higher-risk opportunity in the office sector with attractive dividend yield"
      },
      overallAnalysis: "A blue-chip office REIT facing structural challenges from evolving work patterns. Premium portfolio in innovation-driven markets provides some insulation, but significant uncertainty remains about long-term office demand and occupancy trends post-pandemic.",
      chartData: [72.8, 72.0, 71.3, 70.7, 70.2, 69.8, 69.5, 69.3, 69.2, 69.3, 69.4, 69.48],
      industry: "Real Estate"
    },
    {
      name: "Equity Residential",
      ticker: "EQR",
      price: 71.36,
      change: 0.55,
      rating: 3.6,
      smartScore: "Medium",
      description: "Equity Residential is a multifamily residential REIT focused on urban and high-density suburban markets in gateway cities.",
      metrics: {
        performance: { 
          value: "Fair", 
          color: "yellow",
          details: {
            revenueGrowth: 3.8,
            profitMargin: 34.9,
            returnOnCapital: 5.59
          },
          explanation: "Equity Residential shows solid performance with 3.8% revenue growth, slightly below the residential REIT average. Its profit margin of 34.9% and return on capital of 5.59% reflect efficient operations in its portfolio of premium apartment communities."
        },
        stability: { 
          value: "Fair", 
          color: "yellow",
          details: {
            volatility: 0.88,
            beta: 0.88,
            dividendConsistency: "High"
          },
          explanation: "Equity Residential exhibits good stability with volatility (0.88) lower than the broader REIT sector. Its beta of 0.88 indicates slightly reduced market sensitivity. The company maintains high dividend consistency with a strong history of reliable distributions."
        },
        value: { 
          value: "Fair", 
          color: "yellow",
          details: {
            peRatio: 26.8,
            pbRatio: 2.46,
            dividendYield: 3.9
          },
          explanation: "Equity Residential trades at a PE ratio of 26.8, typical for quality apartment REITs. Its price-to-book ratio of 2.46 reflects the premium quality of its portfolio, while its 3.9% dividend yield provides solid income potential."
        },
        momentum: { 
          value: "Fair", 
          color: "yellow",
          details: {
            threeMonthReturn: 1.7,
            relativePerformance: -6.3,
            rsi: 52.8
          },
          explanation: "Equity Residential shows moderate momentum with a positive three-month return of 1.7%, but still underperforming the broader market. Its relative performance of -6.3% indicates modest underperformance versus peers. With an RSI of 52.8, the stock is in balanced territory."
        }
      },
      synopsis: {
        price: "Trading steadily as rental growth normalizes in coastal markets",
        company: "Equity Residential focuses on affluent renters in supply-constrained coastal locations",
        role: "Quality holding for residential real estate exposure with consistent income"
      },
      overallAnalysis: "A premier multifamily REIT with high-quality apartments in supply-constrained coastal markets. Well-positioned to benefit from homeownership affordability challenges and demographic trends despite near-term normalization in rental growth.",
      chartData: [69.8, 70.2, 70.5, 70.8, 71.0, 71.2, 71.3, 71.4, 71.35, 71.3, 71.32, 71.36],
      industry: "Real Estate"
    },
    {
      name: "Prologis Inc.",
      ticker: "PLD",
      price: 128.15,
      change: 2.15,
      rating: 4.2,
      smartScore: "Good",
      description: "Prologis is a leading provider of logistics real estate, focusing on high-barrier, high-growth markets.",
      metrics: {
        performance: { 
          value: "High", 
          color: "green",
          details: {
            revenueGrowth: 8.5,
            profitMargin: 65.5,
            returnOnCapital: 5.2
          },
          explanation: "Prologis demonstrates excellent performance with 8.5% revenue growth, exceeding real estate industry averages. Its exceptional 65.5% profit margin (vs. 61% industry standard) and solid 5.2% return on capital reflect strong demand for logistics properties and efficient operations across its extensive global portfolio."
        },
        stability: { 
          value: "High", 
          color: "green",
          details: {
            volatility: 0.85,
            beta: 0.8,
            dividendConsistency: "High"
          },
          explanation: "Prologis exhibits strong stability with below-average volatility (0.85) compared to the real estate sector (1.0). Its beta of 0.8 indicates reduced market sensitivity. The company maintains high dividend consistency, having increased its dividend annually for multiple years, providing reliable income for investors."
        },
        value: { 
          value: "Fair", 
          color: "yellow",
          details: {
            peRatio: 24.2,
            pbRatio: 2.1,
            dividendYield: 2.8
          },
          explanation: "Prologis trades at fair valuation with a PE ratio of 24.2, slightly above the real estate industry average. Its price-to-book ratio of 2.1 is in line with logistics REIT peers, while its 2.8% dividend yield provides moderate income. This balanced valuation reflects the premium quality of its portfolio and strong growth prospects."
        },
        momentum: { 
          value: "Strong", 
          color: "green",
          details: {
            threeMonthReturn: 9.8,
            relativePerformance: 4.5,
            rsi: 62
          },
          explanation: "Prologis shows strong momentum with a three-month return of 9.8%, significantly outperforming the real estate sector average of 2.5%. Its relative performance of 4.5 indicates substantial outperformance versus peers. With an RSI of 62, the stock shows solid upward momentum without being overbought."
        }
      },
      synopsis: {
        price: "Trending upward as e-commerce and logistics demand drives occupancy",
        company: "Prologis benefits from continued e-commerce growth and strategic positioning in key logistics corridors",
        role: "Core holding for real estate portfolio with global logistics exposure and inflation protection"
      },
      overallAnalysis: "A high-quality logistics REIT benefiting from e-commerce growth trends and global supply chain restructuring. Strong operational metrics and strategic property locations provide resilience during economic uncertainty.",
      chartData: [125.15, 124.85, 125.35, 125.95, 126.35, 126.75, 127.05, 127.15, 127.45, 127.85, 128.45, 128.15],
      industry: "Real Estate"
    }
  ]};

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