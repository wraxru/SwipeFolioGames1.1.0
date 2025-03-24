// This file contains hardcoded overall analysis data for stocks

export const realEstateAnalysis: Record<string, string> = {
  "PLD": "A high-quality logistics REIT benefiting from e-commerce growth with strong performance and stability. Offers a balanced opportunity with above-average growth, defensive characteristics, and reliable income.",
  "AMT": "Essential wireless infrastructure provider with defensive characteristics and consistent income from long-term leases. Benefits from increasing data consumption and 5G expansion for continued stable growth.",
  "SPG": "Premium mall operator offering high income yield and value despite retail headwinds. Has shown resilience by transforming properties to maintain relevance in the evolving retail landscape.",
  "EQIX": "Growth-oriented data center REIT with strong performance and lower volatility than tech stocks. Unique interconnection business model creates defensible competitive advantages while benefiting from AI and cloud computing demand.",
  "PSA": "Exceptionally stable self-storage REIT with above-average income and minimal economic sensitivity. Low operating costs and flexible pricing power create consistent performance across market cycles.",
  "O": "Monthly dividend payer offering unmatched income reliability with triple-net leases that create highly predictable cash flows. Ideal for income-focused investors prioritizing consistent payments over maximum growth.",
  "DLR": "Technology-focused REIT providing data center exposure with better growth than traditional real estate while maintaining income characteristics. Benefits from cloud computing, AI workloads, and growing digital infrastructure demands.",
  "WELL": "Healthcare REIT with strong demographic tailwinds from an aging population. Combines defensive characteristics and recession resistance with above-average growth potential in senior housing and medical facilities.",
  "AVB": "Premium apartment REIT focused on supply-constrained coastal markets with persistent housing demand. Benefits from increasing affordability challenges that make renting necessary in high-cost metropolitan areas.",
  "CCI": "Communications infrastructure REIT with exceptional income yield despite current growth challenges. Heavy fiber network investments create near-term concerns but potential long-term value as 5G infrastructure demand increases."
};

export const healthcareAnalysis: Record<string, string> = {
  "JNJ": "Diversified healthcare giant with exceptional financial stability and consistent dividend growth spanning decades. Its broad portfolio across pharmaceuticals, medical devices, and consumer health provides defensive characteristics in volatile markets.",
  "UNH": "Market-leading health insurer with expanding healthcare services division providing diversified revenue streams. Vertical integration strategy and scale advantages create significant barriers to entry.",
  "PFE": "Global pharmaceutical innovator with broad therapeutic focus and strong pipeline potential. Offers attractive combination of value, income, and growth with proven R&D capabilities.",
  "TMO": "Premier life sciences tools provider enabling critical research and diagnostics globally. Recurring revenue model with high switching costs creates exceptional business stability and consistent performance.",
  "ABT": "Well-balanced healthcare company with leadership across multiple medical device categories and diagnostics. Geographic diversification and diabetes care focus provide multiple growth avenues.",
  "LLY": "Pharmaceutical powerhouse with breakthrough diabetes and obesity treatments generating exceptional growth. Superior R&D productivity has created a promising pipeline across multiple therapeutic areas.",
  "MDT": "Medical technology leader with extensive portfolio addressing chronic disease management. Global scale and physician relationships provide competitive advantages despite recent growth challenges.",
  "AMGN": "Established biotechnology company with strong cash flow generation and commitment to shareholder returns. Balances mature blockbuster products with promising pipeline candidates.",
  "DHR": "Life sciences and diagnostics innovator with exceptional acquisition track record. Proprietary operating system consistently improves acquired businesses while maintaining innovation focus.",
  "ISRG": "Surgical robotics pioneer with dominant market position and significant barriers to entry. Razor/razorblade business model creates recurring revenue streams beyond initial system sales."
};

// Add analysis data for any ticker not included in the specific industry data
export const getStockAnalysis = (ticker: string, industry: string): string => {
  if (industry === "Real Estate") {
    return realEstateAnalysis[ticker] || 
      "This REIT offers a combination of income and growth potential through its specialized property portfolio. Investment performance will depend on property type, geographic focus, and management quality.";
  }
  
  if (industry === "Healthcare") {
    return healthcareAnalysis[ticker] || 
      "This healthcare company operates in a sector with favorable demographic trends and innovation potential. Performance will depend on its specific therapeutic focus, pipeline strength, and competitive position.";
  }
  
  // Generic analysis for other industries
  return "This company demonstrates a mix of competitive strengths and growth potential within its industry. Long-term performance will depend on execution, market positioning, and ability to adapt to changing industry dynamics.";
};