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
  
  // For debugging - log raw values
  console.log(`Performance calculation for stock in ${industry} industry:`);
  console.log(`- Revenue Growth: Stock ${stockMetrics.revenueGrowth}%, Industry ${industryAvgs.revenueGrowth}%, Market ${marketAverages.performance.revenueGrowth}%`);
  console.log(`- Profit Margin: Stock ${stockMetrics.profitMargin}%, Industry ${industryAvgs.profitMargin}%, Market ${marketAverages.performance.profitMargin}%`);
  console.log(`- Return on Capital: Stock ${stockMetrics.returnOnCapital}%, Industry ${industryAvgs.returnOnCapital}%, Market ${marketAverages.performance.returnOnCapital}%`);
  
  // Step 1: Normalize stock metrics against industry averages (0-1 scale)
  const revGrowthNormalized = stockMetrics.revenueGrowth / industryAvgs.revenueGrowth;
  const profitMarginNormalized = stockMetrics.profitMargin / industryAvgs.profitMargin;
  const rocNormalized = stockMetrics.returnOnCapital / industryAvgs.returnOnCapital;
  
  // Cap normalized values at 0-1 for calculation
  const revGrowthCapped = normalizeValue(revGrowthNormalized);
  const profitMarginCapped = normalizeValue(profitMarginNormalized);
  const rocCapped = normalizeValue(rocNormalized);
  
  console.log(`- Rev Growth normalized: ${revGrowthNormalized.toFixed(2)}, capped: ${revGrowthCapped.toFixed(2)}`);
  console.log(`- Profit Margin normalized: ${profitMarginNormalized.toFixed(2)}, capped: ${profitMarginCapped.toFixed(2)}`);
  console.log(`- ROC normalized: ${rocNormalized.toFixed(2)}, capped: ${rocCapped.toFixed(2)}`);
  
  // Step 2: Calculate industry-to-market weightings (0-1 scale)
  const revGrowthMarketWeight = normalizeValue(industryAvgs.revenueGrowth / marketAverages.performance.revenueGrowth);
  const profitMarginMarketWeight = normalizeValue(industryAvgs.profitMargin / marketAverages.performance.profitMargin);
  const rocMarketWeight = normalizeValue(industryAvgs.returnOnCapital / marketAverages.performance.returnOnCapital);
  
  console.log(`- Rev Growth market weight: ${revGrowthMarketWeight.toFixed(2)}`);
  console.log(`- Profit Margin market weight: ${profitMarginMarketWeight.toFixed(2)}`);
  console.log(`- ROC market weight: ${rocMarketWeight.toFixed(2)}`);
  
  // Step 3: Apply weightings according to formula (40% rev growth, 30% profit margin, 30% ROC)
  const revContribution = 0.4 * revGrowthCapped * revGrowthMarketWeight;
  const profitContribution = 0.3 * profitMarginCapped * profitMarginMarketWeight;
  const rocContribution = 0.3 * rocCapped * rocMarketWeight;
  
  console.log(`- Rev Growth contribution: ${revContribution.toFixed(2)}`);
  console.log(`- Profit Margin contribution: ${profitContribution.toFixed(2)}`);
  console.log(`- ROC contribution: ${rocContribution.toFixed(2)}`);
  
  const weightedScore = revContribution + profitContribution + rocContribution;
  
  // Return final score on a 0-100 scale
  const finalScore = Math.min(100, Math.round(weightedScore * 100));
  console.log(`- Final performance score: ${finalScore}`);
  
  return finalScore;
};

// Calculate stability score (volatility, beta, dividend consistency)
export const calculateStabilityScore = (
  stockMetrics: StabilityDetails,
  industry: string
): number => {
  const industryAvgs = getIndustryAverages(industry).stability;
  
  // For debugging - log raw values
  console.log(`Stability calculation for stock in ${industry} industry:`);
  console.log(`- Volatility: Stock ${stockMetrics.volatility}%, Industry ${industryAvgs.volatility}%, Market ${marketAverages.stability.volatility}%`);
  console.log(`- Beta: Stock ${stockMetrics.beta}, Industry ${industryAvgs.beta}, Market ${marketAverages.stability.beta}`);
  console.log(`- Dividend Consistency: Stock ${stockMetrics.dividendConsistency}, Industry ${industryAvgs.dividendConsistency}`);
  
  // Step 1: Normalize stock metrics against industry averages
  // For volatility, lower is better, so we invert the comparison
  const volatilityRelative = industryAvgs.volatility / stockMetrics.volatility;
  const volatilityNormalized = normalizeValue(volatilityRelative);
  
  // For beta, closest to 1 is best
  const betaScore = 1 - Math.min(0.5, Math.abs(1 - stockMetrics.beta)) / 0.5;
  const betaNormalized = normalizeValue(betaScore);
  
  // For dividend consistency, convert string ratings to numeric scores
  const stockDivConsistency = getDividendConsistencyScore(stockMetrics.dividendConsistency);
  const industryDivConsistency = getDividendConsistencyScore(industryAvgs.dividendConsistency);
  const divConsistencyRelative = stockDivConsistency / industryDivConsistency;
  const divConsistencyNormalized = normalizeValue(divConsistencyRelative);
  
  console.log(`- Volatility normalized: ${volatilityNormalized.toFixed(2)}`);
  console.log(`- Beta normalized: ${betaNormalized.toFixed(2)}`);
  console.log(`- Div Consistency normalized: ${divConsistencyNormalized.toFixed(2)}`);
  
  // Step 2: Calculate industry-to-market weightings (normalized to 0-1)
  const volatilityMarketWeight = normalizeValue(marketAverages.stability.volatility / industryAvgs.volatility);
  const betaMarketWeight = normalizeValue(industryAvgs.beta);
  const divConsistencyMarketWeight = normalizeValue(industryDivConsistency / marketAverages.stability.dividendConsistency);
  
  console.log(`- Volatility market weight: ${volatilityMarketWeight.toFixed(2)}`);
  console.log(`- Beta market weight: ${betaMarketWeight.toFixed(2)}`);
  console.log(`- Div Consistency market weight: ${divConsistencyMarketWeight.toFixed(2)}`);
  
  // Step 3: Apply weightings: 55% volatility, 25% beta, 20% dividend consistency
  const volatilityContribution = 0.55 * volatilityNormalized * (marketAverages.stability.volatility / industryAvgs.volatility);
  const betaContribution = 0.25 * betaNormalized * (industryAvgs.beta / marketAverages.stability.beta);
  const divConsistencyContribution = 0.20 * divConsistencyNormalized * (industryDivConsistency / marketAverages.stability.dividendConsistency);
  
  console.log(`- Volatility contribution: ${volatilityContribution.toFixed(2)}`);
  console.log(`- Beta contribution: ${betaContribution.toFixed(2)}`);
  console.log(`- Div Consistency contribution: ${divConsistencyContribution.toFixed(2)}`);
  
  const weightedScore = volatilityContribution + betaContribution + divConsistencyContribution;
  
  // Return final score on a 0-100 scale, capped at 100
  const finalScore = Math.min(100, Math.round(weightedScore * 100));
  console.log(`- Final stability score: ${finalScore}`);
  
  return finalScore;
};

// Calculate value score (P/E ratio, P/B ratio, dividend yield)
export const calculateValueScore = (
  stockMetrics: ValueDetails,
  industry: string
): number => {
  const industryAvgs = getIndustryAverages(industry).value;
  
  // For debugging - log raw values
  console.log(`Value calculation for stock in ${industry} industry:`);
  console.log(`- P/E Ratio: Stock ${stockMetrics.peRatio}, Industry ${industryAvgs.peRatio}, Market ${marketAverages.value.peRatio}`);
  console.log(`- P/B Ratio: Stock ${stockMetrics.pbRatio}, Industry ${industryAvgs.pbRatio}, Market ${marketAverages.value.pbRatio}`);
  
  // Step 1: Calculate normalized values for P/E and P/B (lower is better)
  // For P/E and P/B ratios, lower values are better, so we invert the comparison
  let peRatio = stockMetrics.peRatio;
  let peIndustry = industryAvgs.peRatio;
  const peRatioRelative = peIndustry / peRatio; // Value > 1 means better than industry
  const peRatioNormalized = normalizeValue(peRatioRelative);
  
  let pbRatio = stockMetrics.pbRatio;
  let pbIndustry = industryAvgs.pbRatio;
  const pbRatioRelative = pbIndustry / pbRatio; // Value > 1 means better than industry
  const pbRatioNormalized = normalizeValue(pbRatioRelative);
  
  // Handle dividend yield which might be a string with %
  let divYield = stockMetrics.dividendYield;
  if (typeof divYield === 'string') {
    divYield = parseFloat(divYield.replace('%', ''));
  }
  
  console.log(`- Dividend Yield: Stock ${divYield}%, Industry ${industryAvgs.dividendYield}%, Market ${marketAverages.value.dividendYield}%`);
  
  const divYieldRelative = !isNaN(divYield as number) 
    ? (divYield as number) / industryAvgs.dividendYield
    : 0;
  const divYieldNormalized = normalizeValue(divYieldRelative);
  
  console.log(`- P/E relative to industry: ${peRatioRelative.toFixed(2)}, normalized: ${peRatioNormalized.toFixed(2)}`);
  console.log(`- P/B relative to industry: ${pbRatioRelative.toFixed(2)}, normalized: ${pbRatioNormalized.toFixed(2)}`);
  console.log(`- Div Yield relative to industry: ${divYieldRelative.toFixed(2)}, normalized: ${divYieldNormalized.toFixed(2)}`);
  
  // Step 2: Calculate industry-to-market weightings (normalized to 0-1)
  const peRatioMarketWeight = normalizeValue(marketAverages.value.peRatio / industryAvgs.peRatio);
  const pbRatioMarketWeight = normalizeValue(marketAverages.value.pbRatio / industryAvgs.pbRatio);
  const divYieldMarketWeight = normalizeValue(industryAvgs.dividendYield / marketAverages.value.dividendYield);
  
  console.log(`- P/E market weight: ${peRatioMarketWeight.toFixed(2)}`);
  console.log(`- P/B market weight: ${pbRatioMarketWeight.toFixed(2)}`);
  console.log(`- Div Yield market weight: ${divYieldMarketWeight.toFixed(2)}`);
  
  // Step 3: Apply weightings: 50% P/E, 30% P/B, 20% dividend yield
  const peContribution = 0.5 * peRatioNormalized * (marketAverages.value.peRatio / industryAvgs.peRatio);
  const pbContribution = 0.3 * pbRatioNormalized * (marketAverages.value.pbRatio / industryAvgs.pbRatio);
  const divYieldContribution = 0.2 * divYieldNormalized * (industryAvgs.dividendYield / marketAverages.value.dividendYield);
  
  console.log(`- P/E contribution: ${peContribution.toFixed(2)}`);
  console.log(`- P/B contribution: ${pbContribution.toFixed(2)}`);
  console.log(`- Div Yield contribution: ${divYieldContribution.toFixed(2)}`);
  
  const weightedScore = peContribution + pbContribution + divYieldContribution;
  
  // Return final score on a 0-100 scale, capped at 100
  const finalScore = Math.min(100, Math.round(weightedScore * 100));
  console.log(`- Final value score: ${finalScore}`);
  
  return finalScore;
};

// Calculate momentum score (3-month return, RSI)
export const calculateMomentumScore = (
  stockMetrics: MomentumDetails,
  industry: string
): number => {
  const industryAvgs = getIndustryAverages(industry).momentum;
  
  // For debugging - log raw values
  console.log(`Momentum calculation for stock in ${industry} industry:`);
  console.log(`- 3-Month Return: Stock ${stockMetrics.threeMonthReturn}%, Industry ${industryAvgs.threeMonthReturn}%, Market ${marketAverages.momentum.threeMonthReturn}%`);
  console.log(`- Relative Performance: Stock ${stockMetrics.relativePerformance}`);
  console.log(`- RSI: Stock ${stockMetrics.rsi}, Industry ${industryAvgs.rsi}, Market ${marketAverages.momentum.rsi}`);
  
  // Step 1: Normalize stock metrics against industry averages
  // For 3-month return, higher is better
  const threeMonthReturnRelative = stockMetrics.threeMonthReturn / industryAvgs.threeMonthReturn;
  const threeMonthReturnNormalized = normalizeValue(threeMonthReturnRelative);
  
  // For RSI, best when close to 50
  const rsiIdeal = 50;
  const rsiDeviation = Math.abs(stockMetrics.rsi - rsiIdeal) / 25; // Scale by 25, so 25 point deviation = 1.0
  const rsiNormalized = normalizeValue(1 - rsiDeviation); 
  
  // For relative performance, this is already relative to industry
  const relPerfNormalized = normalizeValue(0.5 + (stockMetrics.relativePerformance / 5));
  
  console.log(`- 3-Month Return normalized: ${threeMonthReturnNormalized.toFixed(2)}`);
  console.log(`- RSI normalized: ${rsiNormalized.toFixed(2)}`);
  console.log(`- Relative Performance normalized: ${relPerfNormalized.toFixed(2)}`);
  
  // Step 2: Calculate industry-to-market weightings (normalized to 0-1)
  const threeMonthReturnMarketWeight = normalizeValue(industryAvgs.threeMonthReturn / marketAverages.momentum.threeMonthReturn);
  const rsiMarketWeight = normalizeValue(0.5); // Market weight for RSI is set at 0.5 as a neutral value
  
  console.log(`- 3-Month Return market weight: ${threeMonthReturnMarketWeight.toFixed(2)}`);
  console.log(`- RSI market weight: ${rsiMarketWeight.toFixed(2)}`);
  
  // Step 3: Apply weightings: 50% 3-month return, 50% RSI
  const threeMonthContribution = 0.5 * threeMonthReturnNormalized * (industryAvgs.threeMonthReturn / marketAverages.momentum.threeMonthReturn);
  const rsiContribution = 0.5 * rsiNormalized * (industryAvgs.rsi / marketAverages.momentum.rsi);
  
  console.log(`- 3-Month Return contribution: ${threeMonthContribution.toFixed(2)}`);
  console.log(`- RSI contribution: ${rsiContribution.toFixed(2)}`);
  
  const weightedScore = threeMonthContribution + rsiContribution;bution + rsiContribution + relPerfContribution;
  
  // Return final score on a 0-100 scale, capped at 100
  const finalScore = Math.min(100, Math.round(weightedScore * 100));
  console.log(`- Final momentum score: ${finalScore}`);
  
  return finalScore;
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