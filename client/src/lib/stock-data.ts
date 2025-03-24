export interface StockData {
  name: string;
  ticker: string;
  price: number;
  change: number;
  rating: number;
  smartScore: string;
  description: string;
  metrics: {
    performance: {
      value: string;
      color: string;
      details: {
        revenueGrowth: number;
        profitMargin: number;
        returnOnCapital: number;
      };
      explanation: string;
    };
    stability: {
      value: string;
      color: string;
      details: {
        volatility: number;
        beta: number;
        dividendConsistency: string;
      };
      explanation: string;
    };
    value: {
      value: string;
      color: string;
      details: {
        peRatio: number;
        pbRatio: number;
        dividendYield: number;
      };
      explanation: string;
    };
    momentum: {
      value: string;
      color: string;
      details: {
        threeMonthReturn: number;
        relativePerformance: number;
        rsi: number;
      };
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
  return hardcodedStocks[industry] || [];
};