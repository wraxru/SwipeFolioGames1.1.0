import {
  PerformanceDetails,
  StabilityDetails,
  ValueDetails,
  MomentumDetails,
  StockData
} from './stock-data';
import { getIndustryAverages } from './industry-data'; // Needs oneYearReturnAvg added
import { marketAverages, getDividendConsistencyScore } from './market-averages'; // Needs oneYearReturnAvg added

// --- Configuration ---
const SCORE_CAP_MIN = 0;
const SCORE_CAP_MAX = 100;
const NEUTRAL_SCORE = 50;
const SCALE_FACTORS = {
  revenueGrowth: 2.0,
  profitMargin: 1.5,
  returnOnCapital: 2.0,
  volatility: 2.0,
  peRatio: 1.0,
  pbRatio: 10.0,
  dividendYield: 10.0,
  predictedUpside: 2.0,
  oneYearReturn: 2.0, // +/- 25% diff = +/- 50 score
  threeMonthReturn: 2.5,
  relativePerformance: 2.5,
};
const INDUSTRY_STRENGTH_MODIFIER_WEIGHT = 0.2;

// --- Helper Functions (capScore, safeRatio, normalizeDifference, calculateIndustryStrengthFactor - same as v4) ---
const capScore = (score: number): number => {
  if (!Number.isFinite(score)) return NEUTRAL_SCORE;
  return Math.min(SCORE_CAP_MAX, Math.max(SCORE_CAP_MIN, Math.round(score)));
};

const safeRatio = (numerator?: number, denominator?: number, fallback: number = 1): number => {
  if (denominator === undefined || denominator === null || denominator === 0 ||
      numerator === undefined || numerator === null) {
    return fallback;
  }
  return numerator / denominator;
};

const normalizeDifference = (
  value: number | undefined | null,
  average: number | undefined | null,
  scaleFactor: number,
  lowerIsBetter: boolean = false
): number => {
  if (value === undefined || value === null || !Number.isFinite(value) ||
      average === undefined || average === null || !Number.isFinite(average)) {
    return NEUTRAL_SCORE;
  }
  const difference = value - average;
  let score = NEUTRAL_SCORE + (lowerIsBetter ? -difference : difference) * scaleFactor;
  return capScore(score);
};

const calculateIndustryStrengthFactor = (
    industryValue: number | undefined | null,
    marketValue: number | undefined | null,
    scaleFactor: number,
    lowerIsBetter: boolean = false
): number => {
    const score = normalizeDifference(industryValue, marketValue, scaleFactor, lowerIsBetter);
    return score / 100; // Simple 0-1 factor, centered at 0.5
};

// --- Score Calculation Functions (v5) ---

// Performance calculation remains the same as v4
export const calculatePerformanceScore = (
  stockMetrics: PerformanceDetails,
  industry: string
): number => {
  const industryAvgs = getIndustryAverages(industry).performance;
  const marketAvgs = marketAverages.performance;
  const weights = { revenueGrowth: 0.5, profitMargin: 0.25, returnOnCapital: 0.25 };

  const revGrowthScore = normalizeDifference(stockMetrics.revenueGrowth, industryAvgs.revenueGrowth, SCALE_FACTORS.revenueGrowth);
  const profitMarginScore = normalizeDifference(stockMetrics.profitMargin, industryAvgs.profitMargin, SCALE_FACTORS.profitMargin);
  const rocScore = normalizeDifference(stockMetrics.returnOnCapital, industryAvgs.returnOnCapital, SCALE_FACTORS.returnOnCapital);

  const revGrowthIndustryStrength = calculateIndustryStrengthFactor(industryAvgs.revenueGrowth, marketAvgs.revenueGrowth, SCALE_FACTORS.revenueGrowth);
  const profitMarginIndustryStrength = calculateIndustryStrengthFactor(industryAvgs.profitMargin, marketAvgs.profitMargin, SCALE_FACTORS.profitMargin);
  const rocIndustryStrength = calculateIndustryStrengthFactor(industryAvgs.returnOnCapital, marketAvgs.returnOnCapital, SCALE_FACTORS.returnOnCapital);

  const finalScore =
      weights.revenueGrowth * (revGrowthScore * (1 + (revGrowthIndustryStrength - 0.5) * INDUSTRY_STRENGTH_MODIFIER_WEIGHT)) +
      weights.profitMargin * (profitMarginScore * (1 + (profitMarginIndustryStrength - 0.5) * INDUSTRY_STRENGTH_MODIFIER_WEIGHT)) +
      weights.returnOnCapital * (rocScore * (1 + (rocIndustryStrength - 0.5) * INDUSTRY_STRENGTH_MODIFIER_WEIGHT));

  console.log(`Performance (v5) (${stockMetrics.revenueGrowth}%, ${stockMetrics.profitMargin}%, ${stockMetrics.returnOnCapital}%): Scores(Rg:${revGrowthScore}, Pm:${profitMarginScore}, Roc:${rocScore}) -> Final ${capScore(finalScore)}`);
  return capScore(finalScore);
};

// Stability calculation remains the same as v4
export const calculateStabilityScore = (
  stockMetrics: StabilityDetails,
  industry: string
): number => {
  const industryAvgs = getIndustryAverages(industry).stability;
  const marketAvgs = marketAverages.stability;
  const weights = { volatility: 0.50, beta: 0.30, dividendConsistency: 0.20 };

  const volatilityScore = normalizeDifference(stockMetrics.volatility, industryAvgs.volatility, SCALE_FACTORS.volatility, true);
  const betaScore = Math.max(0, 100 - (Math.abs(1 - stockMetrics.beta) * 50));
  const divConsistencyScore = getDividendConsistencyScore(stockMetrics.dividendConsistency);

  const volatilityIndustryStrength = calculateIndustryStrengthFactor(industryAvgs.volatility, marketAvgs.volatility, SCALE_FACTORS.volatility, true);

  const finalScore =
      weights.volatility * (volatilityScore * (1 + (volatilityIndustryStrength - 0.5) * INDUSTRY_STRENGTH_MODIFIER_WEIGHT)) +
      weights.beta * betaScore +
      weights.dividendConsistency * divConsistencyScore;

  console.log(`Stability (v5) (${stockMetrics.volatility}%, ${stockMetrics.beta}, ${stockMetrics.dividendConsistency}): Scores(Vol:${volatilityScore}, Beta:${betaScore}, Div:${divConsistencyScore}) -> Final ${capScore(finalScore)}`);
  return capScore(finalScore);
};

// Value calculation remains the same as v4
export const calculateValueScore = (
  stock: StockData,
  industry: string
): number => {
  const stockMetrics = stock.metrics.value.details;
  const industryAvgs = getIndustryAverages(industry).value;
  const marketAvgs = marketAverages.value;
  const weights = { peRatio: 0.30, pbRatio: 0.20, dividendYield: 0.15, predictedUpside: 0.35 };
  let score = 0;

  // P/E
  let peScore = NEUTRAL_SCORE;
  if (stockMetrics.peRatio > 0 && industryAvgs.peRatio > 0) {
    peScore = normalizeDifference(stockMetrics.peRatio, industryAvgs.peRatio, SCALE_FACTORS.peRatio, true);
  } else if (stockMetrics.peRatio > 0 && industryAvgs.peRatio <= 0) {
    peScore = 85;
  } else if (stockMetrics.peRatio <= 0) {
    peScore = 10;
  }
  const peIndustryStrength = calculateIndustryStrengthFactor(industryAvgs.peRatio, marketAvgs.peRatio, SCALE_FACTORS.peRatio, true);
  score += weights.peRatio * (peScore * (1 + (peIndustryStrength - 0.5) * INDUSTRY_STRENGTH_MODIFIER_WEIGHT));

  // P/B
  let pbScore = NEUTRAL_SCORE;
  if (stockMetrics.pbRatio > 0 && industryAvgs.pbRatio > 0) {
    pbScore = normalizeDifference(stockMetrics.pbRatio, industryAvgs.pbRatio, SCALE_FACTORS.pbRatio, true);
  } else if (stockMetrics.pbRatio <= 0) {
    pbScore = 10;
  }
  const pbIndustryStrength = calculateIndustryStrengthFactor(industryAvgs.pbRatio, marketAvgs.pbRatio, SCALE_FACTORS.pbRatio, true);
  score += weights.pbRatio * (pbScore * (1 + (pbIndustryStrength - 0.5) * INDUSTRY_STRENGTH_MODIFIER_WEIGHT));

  // Dividend Yield
  let divYieldScore = 0;
  const stockYield = typeof stockMetrics.dividendYield === 'number' ? stockMetrics.dividendYield : 0;
  if (stockYield > 0) {
      divYieldScore = normalizeDifference(stockYield, industryAvgs.dividendYield, SCALE_FACTORS.dividendYield);
  }
  const divYieldIndustryStrength = calculateIndustryStrengthFactor(industryAvgs.dividendYield, marketAvgs.dividendYield, SCALE_FACTORS.dividendYield);
  score += weights.dividendYield * (divYieldScore * (1 + (divYieldIndustryStrength - 0.5) * INDUSTRY_STRENGTH_MODIFIER_WEIGHT));

  // Predicted Upside
  let predictedUpsideScore = NEUTRAL_SCORE;
  let stockPredictedUpside = 0;
  if (stock.predictedPrice && stock.price > 0) {
      // Ensure predictedPrice is treated as a string before replacing '$'
      const predictedPriceStr = String(stock.predictedPrice);
      const predictedPriceNum = parseFloat(predictedPriceStr.replace('$', ''));
      if (!isNaN(predictedPriceNum)) {
          stockPredictedUpside = ((predictedPriceNum - stock.price) / stock.price) * 100;
          predictedUpsideScore = normalizeDifference(stockPredictedUpside, industryAvgs.predictedUpside, SCALE_FACTORS.predictedUpside);
      }
  }
  const upsideIndustryStrength = calculateIndustryStrengthFactor(industryAvgs.predictedUpside, marketAvgs.predictedUpside, SCALE_FACTORS.predictedUpside);
  score += weights.predictedUpside * (predictedUpsideScore * (1 + (upsideIndustryStrength - 0.5) * INDUSTRY_STRENGTH_MODIFIER_WEIGHT));

  console.log(`Value (v5) (${stockMetrics.peRatio}, ${stockMetrics.pbRatio}, ${stockMetrics.dividendYield}%, Upside:${stockPredictedUpside.toFixed(1)}%): Scores(PE:${peScore}, PB:${pbScore}, Div:${divYieldScore}, Upside:${predictedUpsideScore}) -> Final ${capScore(score)}`);
  return capScore(score);
};

// Momentum calculation UPDATED to include 1-Year Return
export const calculateMomentumScore = (
  stock: StockData, // Pass full stock data to get oneYearReturn
  industry: string
): number => {
  const stockMetrics = stock.metrics.momentum.details;
  const industryAvgs = getIndustryAverages(industry).momentum;
  const marketAvgs = marketAverages.momentum;
  // Adjusted Weights: 1Y Return 40%, Relative Perf 30%, 3M Return 15%, RSI 15%
  const weights = { oneYearReturn: 0.40, relativePerformance: 0.30, threeMonthReturn: 0.15, rsi: 0.15 };
  let score = 0;

  // --- 1-Year Return --- (Higher is Better)
  let oneYearReturnScore = NEUTRAL_SCORE;
  let stockOneYearReturn = 0;
  if (stock.oneYearReturn) {
      const returnNum = parseFloat(String(stock.oneYearReturn).replace('%', ''));
      if (!isNaN(returnNum)) {
          stockOneYearReturn = returnNum;
          oneYearReturnScore = normalizeDifference(stockOneYearReturn, industryAvgs.oneYearReturn, SCALE_FACTORS.oneYearReturn);
      }
  }
  const oneYearIndustryStrength = calculateIndustryStrengthFactor(industryAvgs.oneYearReturn, marketAvgs.oneYearReturn, SCALE_FACTORS.oneYearReturn);
  score += weights.oneYearReturn * (oneYearReturnScore * (1 + (oneYearIndustryStrength - 0.5) * INDUSTRY_STRENGTH_MODIFIER_WEIGHT));

  // --- Relative Performance vs Index --- (Higher is Better)
  const relativePerfScore = normalizeDifference(stockMetrics.relativePerformance, industryAvgs.relativePerformance, SCALE_FACTORS.relativePerformance);
  const relativePerfIndustryStrength = calculateIndustryStrengthFactor(industryAvgs.relativePerformance, marketAvgs.relativePerformance, SCALE_FACTORS.relativePerformance);
  score += weights.relativePerformance * (relativePerfScore * (1 + (relativePerfIndustryStrength - 0.5) * INDUSTRY_STRENGTH_MODIFIER_WEIGHT));

  // --- 3-Month Return --- (Higher is Better)
  const threeMonthScore = normalizeDifference(stockMetrics.threeMonthReturn, industryAvgs.threeMonthReturn, SCALE_FACTORS.threeMonthReturn);
  const threeMonthIndustryStrength = calculateIndustryStrengthFactor(industryAvgs.threeMonthReturn, marketAvgs.threeMonthReturn, SCALE_FACTORS.threeMonthReturn);
  score += weights.threeMonthReturn * (threeMonthScore * (1 + (threeMonthIndustryStrength - 0.5) * INDUSTRY_STRENGTH_MODIFIER_WEIGHT));

  // --- RSI --- (Closer to 50 is Better)
  const rsiScore = Math.max(0, 100 - (Math.abs(50 - stockMetrics.rsi) * 2));
  // RSI is absolute, no industry strength modifier applied here
  score += weights.rsi * rsiScore;

  console.log(`Momentum (v5) (1Y:${stockOneYearReturn}%, 3M:${stockMetrics.threeMonthReturn}%, Rel:${stockMetrics.relativePerformance}%, RSI:${stockMetrics.rsi}): Scores(1Y:${oneYearReturnScore}, Rel:${relativePerfScore}, 3M:${threeMonthScore}, RSI:${rsiScore}) -> Final ${capScore(score)}`);
  return capScore(score);
};


// --- Main Exported Functions ---

export const getAdvancedMetricScore = (
  stock: StockData,
  metricName: "performance" | "stability" | "value" | "momentum"
): number => {
  if (!stock || !stock.metrics || !stock.metrics[metricName]?.details) {
      console.warn(`Missing metric details for ${stock?.ticker} in category ${metricName}`);
      return 0;
  }
  const metricDetails = stock.metrics[metricName].details;

  try {
      switch (metricName) {
          case 'performance':
              return calculatePerformanceScore(metricDetails as PerformanceDetails, stock.industry);
          case 'stability':
              return calculateStabilityScore(metricDetails as StabilityDetails, stock.industry);
          case 'value':
              return calculateValueScore(stock, stock.industry); // Pass full stock
          case 'momentum':
              return calculateMomentumScore(stock, stock.industry); // Pass full stock
          default:
              console.warn(`Unknown metric category: ${metricName}`);
              return 0;
      }
  } catch (error) {
      console.error(`Error calculating ${metricName} score for ${stock.ticker}:`, error);
      return 0;
  }
};

// Portfolio score calculation remains the same, using the updated getAdvancedMetricScore
export const calculatePortfolioScore = (
  holdings: Array<{ stock: StockData, value: number }>,
  metricName: "performance" | "stability" | "value" | "momentum"
): number => {
  if (!holdings || holdings.length === 0) return 0;
  let weightedScoreSum = 0;
  let totalValue = 0;

  holdings.forEach(holding => {
    const holdingValue = (holding && typeof holding.value === 'number' && Number.isFinite(holding.value)) ? holding.value : 0;
    if (holdingValue > 0 && holding.stock) {
        const score = getAdvancedMetricScore(holding.stock, metricName);
        weightedScoreSum += score * holdingValue;
        totalValue += holdingValue;
    }
  });

  if (totalValue === 0) return 0;
  const finalScore = weightedScoreSum / totalValue;
  return capScore(finalScore);
};
