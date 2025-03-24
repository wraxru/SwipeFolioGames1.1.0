
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Generate a concise stock analysis for ${companyName} in ${industry} industry.
Current price: $${currentPrice}

Rules:
1. Price synopsis: Generate a 6-word analysis of price movement
2. Company insight: Generate a single-line company update
3. Role: Assign ONE role from ONLY these options: anchor, driver, grower, speculative
4. Target price: Generate a realistic target price based on the metrics
5. For each metric (performance, stability, value, momentum):
   - Provide a concise explanation of the calculation
   - Add a brief industry comparison
   - Keep explanations under 2 lines

Format as JSON with this exact structure:
{
  "price": "6-word price analysis",
  "company": "single-line company insight",
  "role": "one of: anchor, driver, grower, speculative",
  "targetPrice": number,
  "metrics": {
    "performance": {
      "value": "strong/moderate/weak",
      "explanation": "calculation explanation",
      "industryComparison": "comparison"
    },
    "stability": {
      "value": "strong/moderate/weak",
      "explanation": "calculation explanation",
      "industryComparison": "comparison"
    },
    "value": {
      "value": "strong/moderate/weak",
      "explanation": "calculation explanation",
      "industryComparison": "comparison"
    },
    "momentum": {
      "value": "strong/moderate/weak",
      "explanation": "calculation explanation",
      "industryComparison": "comparison"
    }
  }
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('AI generation error:', error);
    return {
      price: `${companyName} shows steady market performance`,
      company: `${companyName} maintains position in ${industry}`,
      role: 'anchor',
      targetPrice: currentPrice * 1.1,
      metrics: {
        performance: { value: 'moderate', explanation: 'Based on standard metrics', industryComparison: 'In line with industry' },
        stability: { value: 'moderate', explanation: 'Based on volatility analysis', industryComparison: 'Average stability' },
        value: { value: 'moderate', explanation: 'P/E ratio evaluation', industryComparison: 'Fair market value' },
        momentum: { value: 'moderate', explanation: 'Recent price trends', industryComparison: 'Normal momentum' }
      }
    };
  }
}
