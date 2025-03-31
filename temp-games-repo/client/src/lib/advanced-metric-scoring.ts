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

  // Step 1: Calculate Stock/Industry ratios (normalized between 0-1)
  // For all performance metrics, higher is better
  const revGrowthSI = stockMetrics.revenueGrowth / industryAvgs.revenueGrowth;
  const profitMarginSI = stockMetrics.profitMargin / industryAvgs.profitMargin;
  const rocSI = stockMetrics.returnOnCapital / industryAvgs.returnOnCapital;

  // Normalize values between 0-1
  const revGrowthSINorm = normalizeValue(revGrowthSI);
  const profitMarginSINorm = normalizeValue(profitMarginSI);
  const rocSINorm = normalizeValue(rocSI);

  console.log(`- Rev Growth S/I: ${revGrowthSI.toFixed(2)}, normalized: ${revGrowthSINorm.toFixed(2)}`);
  console.log(`- Profit Margin S/I: ${profitMarginSI.toFixed(2)}, normalized: ${profitMarginSINorm.toFixed(2)}`);
  console.log(`- ROC S/I: ${rocSI.toFixed(2)}, normalized: ${rocSINorm.toFixed(2)}`);

  // Step 2: Calculate Industry/Market weightings (normalized between 0-1)
  // For all metrics in performance, use Industry/Market (higher is better)
  const revGrowthIM = industryAvgs.revenueGrowth / marketAverages.performance.revenueGrowth;
  const profitMarginIM = industryAvgs.profitMargin / marketAverages.performance.profitMargin;
  const rocIM = industryAvgs.returnOnCapital / marketAverages.performance.returnOnCapital;

  // Normalize values between 0-1
  const revGrowthIMNorm = normalizeValue(revGrowthIM);
  const profitMarginIMNorm = normalizeValue(profitMarginIM);
  const rocIMNorm = normalizeValue(rocIM);

  console.log(`- Rev Growth I/M: ${revGrowthIM.toFixed(2)}, normalized: ${revGrowthIMNorm.toFixed(2)}`);
  console.log(`- Profit Margin I/M: ${profitMarginIM.toFixed(2)}, normalized: ${profitMarginIMNorm.toFixed(2)}`);
  console.log(`- ROC I/M: ${rocIM.toFixed(2)}, normalized: ${rocIMNorm.toFixed(2)}`);

  // Step 3: Apply the weighted formula exactly as specified
  // Performance = 40% * (Rev Growth S/I norm) * (Rev Growth I/M norm) + 
  //               30% * (Profit Margin S/I norm) * (Profit Margin I/M norm) + 
  //               30% * (ROC S/I norm) * (ROC I/M norm)

  const revGrowthContribution = 0.4 * revGrowthSINorm * revGrowthIMNorm;
  const profitMarginContribution = 0.3 * profitMarginSINorm * profitMarginIMNorm;
  const rocContribution = 0.3 * rocSINorm * rocIMNorm;

  console.log(`- Rev Growth contribution: ${revGrowthContribution.toFixed(4)}`);
  console.log(`- Profit Margin contribution: ${profitMarginContribution.toFixed(4)}`);
  console.log(`- ROC contribution: ${rocContribution.toFixed(4)}`);

  const weightedScore = revGrowthContribution + profitMarginContribution + rocContribution;

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

  // Step 1: Calculate Stock/Industry ratios with appropriate handling

  // For volatility, lower is better, so invert the ratio
  const volatilitySI = industryAvgs.volatility / stockMetrics.volatility;

  // For beta, closer to 1 is better - using the formula: (100 - (abs(1 - beta) * 50)) / 100
  const betaScore = (100 - (Math.abs(1 - stockMetrics.beta) * 50)) / 100;
  // No need to compare to industry - we directly use this normalized score

  // For dividend consistency, convert strings to numeric values
  const stockDivScore = getDividendConsistencyScore(stockMetrics.dividendConsistency);
  const industryDivScore = getDividendConsistencyScore(industryAvgs.dividendConsistency);
  const divConsistencySI = stockDivScore / industryDivScore;

  // Normalize all S/I ratios to 0-1
  const volatilitySINorm = normalizeValue(volatilitySI);
  const betaScoreNorm = normalizeValue(betaScore);
  const divConsistencySINorm = normalizeValue(divConsistencySI);

  console.log(`- Volatility S/I: ${volatilitySI.toFixed(2)}, normalized: ${volatilitySINorm.toFixed(2)}`);
  console.log(`- Beta Score: ${betaScore.toFixed(2)}, normalized: ${betaScoreNorm.toFixed(2)}`);
  console.log(`- Div Consistency S/I: ${divConsistencySI.toFixed(2)}, normalized: ${divConsistencySINorm.toFixed(2)}`);

  // Step 2: Calculate Industry/Market weightings
  // For volatility, lower is better, so invert the I/M ratio
  const volatilityIM = marketAverages.stability.volatility / industryAvgs.volatility;

  // For beta, use simple I/M ratio
  const betaIM = industryAvgs.beta / marketAverages.stability.beta;

  // For dividend consistency, use I/M ratio
  const divConsistencyIM = industryDivScore / marketAverages.stability.dividendConsistency;

  // Normalize all I/M ratios to 0-1
  const volatilityIMNorm = normalizeValue(volatilityIM);
  const betaIMNorm = normalizeValue(betaIM);
  const divConsistencyIMNorm = normalizeValue(divConsistencyIM);

  console.log(`- Volatility I/M: ${volatilityIM.toFixed(2)}, normalized: ${volatilityIMNorm.toFixed(2)}`);
  console.log(`- Beta I/M: ${betaIM.toFixed(2)}, normalized: ${betaIMNorm.toFixed(2)}`);
  console.log(`- Div Consistency I/M: ${divConsistencyIM.toFixed(2)}, normalized: ${divConsistencyIMNorm.toFixed(2)}`);

  // Step 3: Apply the weighted formula
  // Stability = 55% * (Volatility S/I norm) * (Volatility I/M norm) + 
  //             25% * (Beta score norm) * (Beta I/M norm) + 
  //             20% * (Div Consistency S/I norm) * (Div Consistency I/M norm)

  const volatilityContribution = 0.55 * volatilitySINorm * volatilityIMNorm;
  const betaContribution = 0.25 * betaScoreNorm * betaIMNorm;
  const divConsistencyContribution = 0.20 * divConsistencySINorm * divConsistencyIMNorm;

  console.log(`- Volatility contribution: ${volatilityContribution.toFixed(4)}`);
  console.log(`- Beta contribution: ${betaContribution.toFixed(4)}`);
  console.log(`- Div Consistency contribution: ${divConsistencyContribution.toFixed(4)}`);

  const weightedScore = volatilityContribution + betaContribution + divConsistencyContribution;

  // Return final score on a 0-100 scale
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
  console.log(`- Dividend Yield: Stock ${stockMetrics.dividendYield}%, Industry ${industryAvgs.dividendYield}%, Market ${marketAverages.value.dividendYield}%`);

  // Step 1: Calculate Stock/Industry ratios

  // For P/E and P/B, lower is better, so invert the ratio
  const peRatioSI = industryAvgs.peRatio / stockMetrics.peRatio;
  const pbRatioSI = industryAvgs.pbRatio / stockMetrics.pbRatio;

  // For dividend yield, higher is better
  // Handle string dividend yield
  let divYield = stockMetrics.dividendYield;
  if (typeof divYield === 'string') {
    divYield = parseFloat(divYield.replace('%', ''));
  }

  const divYieldSI = !isNaN(divYield as number) 
    ? (divYield as number) / industryAvgs.dividendYield
    : 0;

  // Normalize all S/I ratios to 0-1
  const peRatioSINorm = normalizeValue(peRatioSI);
  const pbRatioSINorm = normalizeValue(pbRatioSI);
  const divYieldSINorm = normalizeValue(divYieldSI);

  console.log(`- P/E S/I: ${peRatioSI.toFixed(2)}, normalized: ${peRatioSINorm.toFixed(2)}`);
  console.log(`- P/B S/I: ${pbRatioSI.toFixed(2)}, normalized: ${pbRatioSINorm.toFixed(2)}`);
  console.log(`- Div Yield S/I: ${divYieldSI.toFixed(2)}, normalized: ${divYieldSINorm.toFixed(2)}`);

  // Step 2: Calculate Industry/Market weightings
  // For P/E and P/B, lower is better, so invert the I/M ratio
  const peRatioIM = marketAverages.value.peRatio / industryAvgs.peRatio;
  const pbRatioIM = marketAverages.value.pbRatio / industryAvgs.pbRatio;

  // For dividend yield, higher is better
  const divYieldIM = industryAvgs.dividendYield / marketAverages.value.dividendYield;

  // Normalize all I/M ratios to 0-1
  const peRatioIMNorm = normalizeValue(peRatioIM);
  const pbRatioIMNorm = normalizeValue(pbRatioIM);
  const divYieldIMNorm = normalizeValue(divYieldIM);

  console.log(`- P/E I/M: ${peRatioIM.toFixed(2)}, normalized: ${peRatioIMNorm.toFixed(2)}`);
  console.log(`- P/B I/M: ${pbRatioIM.toFixed(2)}, normalized: ${pbRatioIMNorm.toFixed(2)}`);
  console.log(`- Div Yield I/M: ${divYieldIM.toFixed(2)}, normalized: ${divYieldIMNorm.toFixed(2)}`);

  // Step 3: Apply the weighted formula
  // Value = 50% * (P/E S/I norm) * (P/E I/M norm) + 
  //         30% * (P/B S/I norm) * (P/B I/M norm) + 
  //         20% * (Div Yield S/I norm) * (Div Yield I/M norm)

  const peContribution = 0.5 * peRatioSINorm * peRatioIMNorm;
  const pbContribution = 0.3 * pbRatioSINorm * pbRatioIMNorm;
  const divYieldContribution = 0.2 * divYieldSINorm * divYieldIMNorm;

  console.log(`- P/E contribution: ${peContribution.toFixed(4)}`);
  console.log(`- P/B contribution: ${pbContribution.toFixed(4)}`);
  console.log(`- Div Yield contribution: ${divYieldContribution.toFixed(4)}`);

  const weightedScore = peContribution + pbContribution + divYieldContribution;

  // Return final score on a 0-100 scale
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
  console.log(`- RSI: Stock ${stockMetrics.rsi}, Industry ${industryAvgs.rsi}, Market ${marketAverages.momentum.rsi}`);

  // Step 1: Calculate Stock/Industry ratios

  // For 3-month return, higher is better
  const threeMonthSI = stockMetrics.threeMonthReturn / industryAvgs.threeMonthReturn;

  // For RSI, using formula: (100 - (|industry RSI - Stock RSI| * 2)) / 100
  const rsiScore = (100 - (Math.abs(industryAvgs.rsi - stockMetrics.rsi) * 2)) / 100;

  // Normalize all S/I ratios to 0-1
  const threeMonthSINorm = normalizeValue(threeMonthSI);
  const rsiScoreNorm = normalizeValue(rsiScore);

  console.log(`- 3-Month S/I: ${threeMonthSI.toFixed(2)}, normalized: ${threeMonthSINorm.toFixed(2)}`);
  console.log(`- RSI Score: ${rsiScore.toFixed(2)}, normalized: ${rsiScoreNorm.toFixed(2)}`);

  // Step 2: Calculate Industry/Market weightings
  // For 3-month return, use Industry/Market
  const threeMonthIM = industryAvgs.threeMonthReturn / marketAverages.momentum.threeMonthReturn;

  // For RSI, use Industry/Market
  const rsiIM = industryAvgs.rsi / marketAverages.momentum.rsi;

  // Normalize all I/M ratios to 0-1
  const threeMonthIMNorm = normalizeValue(threeMonthIM);
  const rsiIMNorm = normalizeValue(rsiIM);

  console.log(`- 3-Month I/M: ${threeMonthIM.toFixed(2)}, normalized: ${threeMonthIMNorm.toFixed(2)}`);
  console.log(`- RSI I/M: ${rsiIM.toFixed(2)}, normalized: ${rsiIMNorm.toFixed(2)}`);

  // Step 3: Apply the weighted formula
  // Momentum = 50% * (3-Month S/I norm) * (3-Month I/M norm) + 
  //            50% * (RSI score norm) * (RSI I/M norm)

  const threeMonthContribution = 0.5 * threeMonthSINorm * threeMonthIMNorm;
  const rsiContribution = 0.5 * rsiScoreNorm * rsiIMNorm;

  console.log(`- 3-Month contribution: ${threeMonthContribution.toFixed(4)}`);
  console.log(`- RSI contribution: ${rsiContribution.toFixed(4)}`);

  const weightedScore = threeMonthContribution + rsiContribution;

  // Return final score on a 0-100 scale
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