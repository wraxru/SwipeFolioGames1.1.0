// This file contains hardcoded overall analysis data for stocks

const realEstateAnalysis: Record<string, string> = {
  "PLD": "Prologis is well-positioned in the logistics real estate sector, benefiting from e-commerce growth and supply chain modernization. Their high-quality portfolio in key markets provides stable income and growth potential.",
};

const healthcareAnalysis: Record<string, string> = {
};

export const getStockAnalysis = (ticker: string, industry: string): string => {
  if (industry === "Real Estate") {
    return realEstateAnalysis[ticker] || "";
  }

  if (industry === "Healthcare") {
    return healthcareAnalysis[ticker] || "";
  }

  return "";
};