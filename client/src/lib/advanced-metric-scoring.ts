// Advanced metric scoring system with industry and market normalizations
import { 
  PerformanceDetails, 
  StabilityDetails, 
  ValueDetails, 
  MomentumDetails,
  StockData
} from './stock-data';
import { getIndustryAverages } from './industry-data';
import { marketAverages, getDividendConsistencyScore } from './market-averages';

// Normalize a value to be between 0 and 1
export const normalizeValue = (value: number): number => {
  return Math.min(1, Math.max(0, value));
};

// Calculate normalized stock-to-industry ratio for metrics where higher is better
export const normalizeHigherBetter = (stockValue: number, industryValue: number): number => {
  return normalizeValue(stockValue / industryValue);
};

// Calculate normalized stock-to-industry ratio for metrics where lower is better
export const normalizeLowerBetter = (stockValue: number, industryValue: number): number => {
  if (stockValue <= 0 || industryValue <= 0) return 0;
  return normalizeValue(1 / (stockValue / industryValue));
};

// Calculate normalized stock-to-industry ratio for beta (optimal around 1)
export const normalizeBeta = (stockBeta: number): number => {
  // Best when close to 1, scale from 0 to 1
  return normalizeValue(1 - Math.min(0.5, Math.abs(1 - stockBeta)) / 0.5);
};

// Calculate normalized stock-to-industry ratio for RSI (optimal around 50)
export const normalizeRSI = (stockRSI: number, industryRSI: number): number => {
  // Best when close to industry average (or 50), score 0-1
  return normalizeValue(1 - Math.min(25, Math.abs(industryRSI - stockRSI)) / 25);
};

// Calculate performance score (revenue growth, profit margin, return on capital)
export const calculatePerformanceScore = (
  stockMetrics: PerformanceDetails,
  industry: string
): number => {
  const industryAvgs = getIndustryAverages(industry).performance;
  
  // Step 1: Normalize stock metrics against industry averages
  const revGrowthNormalized = normalizeHigherBetter(stockMetrics.revenueGrowth, industryAvgs.revenueGrowth);
  const profitMarginNormalized = normalizeHigherBetter(stockMetrics.profitMargin, industryAvgs.profitMargin);
  const rocNormalized = normalizeHigherBetter(stockMetrics.returnOnCapital, industryAvgs.returnOnCapital);
  
  // Step 2: Calculate industry-to-market weightings
  const revGrowthMarketWeight = industryAvgs.revenueGrowth / marketAverages.performance.revenueGrowth;
  const profitMarginMarketWeight = industryAvgs.profitMargin / marketAverages.performance.profitMargin;
  const rocMarketWeight = industryAvgs.returnOnCapital / marketAverages.performance.returnOnCapital;
  
  // Step 3: Apply weightings according to formula (40% rev growth, 30% profit margin, 30% ROC)
  const weightedScore = 
    0.4 * revGrowthNormalized * revGrowthMarketWeight +
    0.3 * profitMarginNormalized * profitMarginMarketWeight +
    0.3 * rocNormalized * rocMarketWeight;
  
  // Return final score on a 0-100 scale
  return Math.round(weightedScore * 100);
};

// Calculate stability score (volatility, beta, dividend consistency)
export const calculateStabilityScore = (
  stockMetrics: StabilityDetails,
  industry: string
): number => {
  const industryAvgs = getIndustryAverages(industry).stability;
  
  // Step 1: Normalize stock metrics against industry averages
  const volatilityNormalized = normalizeLowerBetter(stockMetrics.volatility, industryAvgs.volatility);
  const betaNormalized = normalizeBeta(stockMetrics.beta);
  
  // For dividend consistency, convert string ratings to numeric scores
  const stockDivConsistency = getDividendConsistencyScore(stockMetrics.dividendConsistency);
  const industryDivConsistency = getDividendConsistencyScore(industryAvgs.dividendConsistency);
  const divConsistencyNormalized = normalizeHigherBetter(stockDivConsistency, industryDivConsistency);
  
  // Step 2: Calculate industry-to-market weightings
  const volatilityMarketWeight = industryAvgs.volatility / marketAverages.stability.volatility;
  const betaMarketWeight = industryAvgs.beta / marketAverages.stability.beta;
  const divConsistencyMarketWeight = industryDivConsistency / marketAverages.stability.dividendConsistency;
  
  // Step 3: Apply weightings according to formula (55% volatility, 25% beta, 20% div consistency)
  const weightedScore = 
    0.55 * volatilityNormalized * volatilityMarketWeight +
    0.25 * betaNormalized * betaMarketWeight +
    0.20 * divConsistencyNormalized * divConsistencyMarketWeight;
  
  // Return final score on a 0-100 scale
  return Math.round(weightedScore * 100);
};

// Calculate value score (P/E ratio, P/B ratio, dividend yield)
export const calculateValueScore = (
  stockMetrics: ValueDetails,
  industry: string
): number => {
  const industryAvgs = getIndustryAverages(industry).value;
  
  // Step 1: Normalize stock metrics against industry averages
  const peRatioNormalized = normalizeLowerBetter(stockMetrics.peRatio, industryAvgs.peRatio);
  const pbRatioNormalized = normalizeLowerBetter(stockMetrics.pbRatio, industryAvgs.pbRatio);
  
  // Handle dividend yield which might be a string with %
  let divYield = stockMetrics.dividendYield;
  if (typeof divYield === 'string') {
    divYield = parseFloat(divYield.replace('%', ''));
  }
  
  const divYieldNormalized = !isNaN(divYield as number) 
    ? normalizeHigherBetter(divYield as number, industryAvgs.dividendYield)
    : 0;
  
  // Step 2: Calculate industry-to-market weightings
  const peRatioMarketWeight = industryAvgs.peRatio / marketAverages.value.peRatio;
  const pbRatioMarketWeight = industryAvgs.pbRatio / marketAverages.value.pbRatio;
  const divYieldMarketWeight = industryAvgs.dividendYield / marketAverages.value.dividendYield;
  
  // Step 3: Apply weightings according to formula (50% P/E, 30% P/B, 20% dividend yield)
  const weightedScore = 
    0.5 * peRatioNormalized * peRatioMarketWeight +
    0.3 * pbRatioNormalized * pbRatioMarketWeight +
    0.2 * divYieldNormalized * divYieldMarketWeight;
  
  // Return final score on a 0-100 scale
  return Math.round(weightedScore * 100);
};

// Calculate momentum score (3-month return, RSI)
export const calculateMomentumScore = (
  stockMetrics: MomentumDetails,
  industry: string
): number => {
  const industryAvgs = getIndustryAverages(industry).momentum;
  
  // Step 1: Normalize stock metrics against industry averages
  const threeMonthReturnNormalized = normalizeHigherBetter(
    stockMetrics.threeMonthReturn, 
    industryAvgs.threeMonthReturn
  );
  
  const rsiNormalized = normalizeRSI(stockMetrics.rsi, industryAvgs.rsi);
  
  // Step 2: Calculate industry-to-market weightings
  const threeMonthReturnMarketWeight = 
    industryAvgs.threeMonthReturn / marketAverages.momentum.threeMonthReturn;
  
  const rsiMarketWeight = industryAvgs.rsi / marketAverages.momentum.rsi;
  
  // Step 3: Apply weightings according to formula (50% 3-month return, 50% RSI)
  const weightedScore = 
    0.5 * threeMonthReturnNormalized * threeMonthReturnMarketWeight +
    0.5 * rsiNormalized * rsiMarketWeight;
  
  // Return final score on a 0-100 scale
  return Math.round(weightedScore * 100);
};

// Main function to get a metric score from a stock on a 0-100 scale
export const getAdvancedMetricScore = (
  stock: StockData,
  metricName: "performance" | "stability" | "value" | "momentum"
): number => {
  // Get detailed metrics for the specific category
  const metricDetails = stock.metrics[metricName].details;
  
  // Calculate score based on metric type
  switch (metricName) {
    case 'performance':
      return calculatePerformanceScore(metricDetails as PerformanceDetails, stock.industry);
    case 'stability':
      return calculateStabilityScore(metricDetails as StabilityDetails, stock.industry);
    case 'value':
      return calculateValueScore(metricDetails as ValueDetails, stock.industry);
    case 'momentum':
      return calculateMomentumScore(metricDetails as MomentumDetails, stock.industry);
    default:
      return 50; // Default score if unknown metric type
  }
};

// Calculate portfolio scores using weighted average based on holdings value
export const calculatePortfolioScore = (
  holdings: Array<{ stock: StockData, value: number }>,
  metricName: "performance" | "stability" | "value" | "momentum"
): number => {
  if (holdings.length === 0) return 0;
  
  let weightedScore = 0;
  let totalWeight = 0;
  
  holdings.forEach(holding => {
    const score = getAdvancedMetricScore(holding.stock, metricName);
    const weight = holding.value;
    
    weightedScore += score * weight;
    totalWeight += weight;
  });
  
  return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
};