
import { generateStockAnalysis as openRouterGenerateStockAnalysis } from './openrouter-service';

interface StockAnalysis {
  price: string;
  company: string;
  role: 'anchor' | 'driver' | 'grower' | 'speculative';
  targetPrice: number;
  metrics: {
    performance: { value: string; explanation: string; industryComparison: string; };
    stability: { value: string; explanation: string; industryComparison: string; };
    value: { value: string; explanation: string; industryComparison: string; };
    momentum: { value: string; explanation: string; industryComparison: string; };
  };
}

export async function generateStockAnalysis(
  companyName: string,
  industry: string,
  currentPrice: number,
  metrics: any
): Promise<StockAnalysis> {
  // Use the OpenRouter implementation
  return openRouterGenerateStockAnalysis(companyName, industry, currentPrice, metrics);
}
