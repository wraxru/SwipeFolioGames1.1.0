import type { MetricQuestion } from '@/types/game';

export const METRIC_STORIES: Record<string, string> = {
  "P/E Ratio": `You're analyzing TechGiant Inc., a company that's been making headlines. Their P/E ratio of 35.2 is significantly higher than the industry average of 22.4. This reminds you of the dot-com bubble when companies with sky-high P/E ratios eventually crashed. The market seems to be pricing in a lot of future growth - but is it too optimistic?`,

  "Revenue Growth": `You're reviewing GrowthWave Corp's latest quarterly report. Their revenue growth of 12.5% is outpacing the industry average of 8.2%. This reminds you of Amazon's early days when they consistently grew faster than traditional retailers. The company is clearly gaining market share, but can they maintain this momentum?`,

  "Profit Margin": `You're examining ValueTech Ltd's financial statements. Their profit margin of 8.3% is below the industry average of 11.5%. This situation reminds you of Tesla's early years when they sacrificed margins for market share. The company might be investing heavily in growth, but are investors being patient enough?`,

  "Dividend Yield": `You're looking at StableIncome Corp's dividend policy. Their 4.2% yield is attractive compared to the industry average of 2.8%. This reminds you of companies like Johnson & Johnson that have maintained and grown their dividends for decades. The yield suggests a stable business, but is the payout sustainable?`,

  "Debt to Equity": `You're analyzing LeverageTech Inc.'s balance sheet. Their debt-to-equity ratio of 2.1 is higher than the industry average of 1.4. This reminds you of companies that took on too much debt before the 2008 financial crisis. The company is using leverage to grow, but are they taking on too much risk?`,

  "Return on Equity": `You're studying EfficientCorp's performance metrics. Their ROE of 18.5% is above the industry average of 14.2%. This reminds you of companies like Apple that consistently generate high returns on shareholder equity. The company is clearly efficient, but can they maintain this level of performance?`,

  "Current Ratio": `You're reviewing QuickCash Inc.'s liquidity position. Their current ratio of 0.8 is below the industry average of 1.2. This reminds you of companies that struggled during the COVID-19 pandemic when cash was king. The company might be efficient with working capital, but are they prepared for unexpected challenges?`,

  "Price to Book": `You're evaluating ValueFind Corp's valuation. Their P/B ratio of 3.2 is below the industry average of 4.5. This reminds you of Warren Buffett's value investing strategy, looking for companies trading below their intrinsic value. The stock might be undervalued, but is there a reason the market is skeptical?`,

  "Customer Satisfaction Score": `You're analyzing ServiceStar Inc.'s customer feedback. Their satisfaction score of 92 is well above the industry average of 85. This reminds you of companies like Zappos that built their success on exceptional customer service. The high score suggests loyal customers, but is it translating to financial success?`,

  "Inventory Turnover": `You're examining RetailPro Corp's inventory management. Their turnover ratio of 8.7 is higher than the industry average of 6.2. This reminds you of companies like Walmart that revolutionized retail with efficient inventory systems. The high turnover suggests good management, but are they maintaining quality?`,

  "Net Promoter Score": `You're reviewing BrandLoyal Inc.'s customer metrics. Their NPS of 65 is significantly above the industry average of 45. This reminds you of companies like Apple that have built cult-like brand loyalty. The high score suggests strong word-of-mouth marketing, but is it sustainable?`,

  "Accounts Receivable Turnover": `You're studying CreditMaster Corp's collection efficiency. Their turnover ratio of 12.5 is better than the industry average of 9.8. This reminds you of companies that maintain strict credit policies to ensure healthy cash flow. The high turnover suggests good credit management, but are they being too strict with customers?`,

  "Cash Conversion Cycle": `You're analyzing CashFlow Inc.'s working capital efficiency. Their cycle of 85 days is longer than the industry average of 65 days. This reminds you of companies that struggled during the 2008 crisis due to poor cash management. The longer cycle suggests potential cash flow issues, but are they investing for growth?`
};

// Helper function to get a story for a metric
export function getMetricStory(metric: string): string {
  return METRIC_STORIES[metric] || "Analyzing this company's performance metrics...";
} 