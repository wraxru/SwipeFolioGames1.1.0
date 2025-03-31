import axios from 'axios';
import { db } from './db';
import { stockCache } from '../shared/schema';
import { eq, sql } from 'drizzle-orm';
import { getMockStockData, formatMockStockData } from '../shared/mock-stocks';

// Configure base API settings
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const baseURL = 'https://finnhub.io/api/v1';

// Check if API key is available and log first few characters for debugging
if (!FINNHUB_API_KEY) {
  console.error('[Finnhub] API key is missing from environment variables');
} else {
  // Mask the key for security but show enough to verify it's loading correctly
  console.log(`[Finnhub] Using API key beginning with: ${FINNHUB_API_KEY.substring(0, 5)}...`);
}

// Create axios instance with configured headers
const finnhubClient = axios.create({
  baseURL,
  headers: {
    'X-Finnhub-Token': FINNHUB_API_KEY
  }
});

// Types for Finnhub API responses
interface QuoteResponse {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
  t: number; // Timestamp
}

interface CompanyProfileResponse {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
}

interface MetricsResponse {
  metric: {
    [key: string]: number | string | null;
  };
}

interface PriceTargetResponse {
  targetHigh: number;
  targetLow: number;
  targetMean: number;
  targetMedian: number;
  lastUpdated: string;
}

interface RecommendationResponse {
  buy: number;
  hold: number;
  sell: number;
  strongBuy: number;
  strongSell: number;
  period: string;
  symbol: string;
}

// Main service class
export class FinnhubService {
  // Get data from cache or API
  async getStockData(symbol: string): Promise<any> {
    try {
      // Check if we have cached data and it's fresh (less than 24 hours old)
      const cachedData = await db.select().from(stockCache).where(eq(stockCache.symbol, symbol)).limit(1);
      
      if (cachedData.length > 0) {
        const lastUpdated = new Date(cachedData[0].updatedAt).getTime();
        const now = Date.now();
        const hoursSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60);
        
        // If data is fresh enough, return it
        if (hoursSinceUpdate < 24) {
          console.log(`[Finnhub] Serving cached data for ${symbol} (${hoursSinceUpdate.toFixed(2)} hours old)`);
          return JSON.parse(cachedData[0].data);
        }
      }
      
      // Otherwise fetch from API and update cache
      console.log(`[Finnhub] Fetching fresh data for ${symbol}`);
      const stockData = await this.fetchStockData(symbol);
      await this.saveToCache(symbol, stockData);
      
      return stockData;
    } catch (error) {
      console.error(`[Finnhub] Error getting stock data for ${symbol}:`, error);
      throw error;
    }
  }
  
  // Fetch stock data from Finnhub
  async fetchStockData(symbol: string): Promise<any> {
    try {
      // Check if API key is available
      if (!FINNHUB_API_KEY) {
        throw new Error('Finnhub API key is missing from environment variables');
      }
      
      // Make individual requests with error handling for each endpoint
      const quotePromise = this.getQuote(symbol).catch(err => {
        console.warn(`[Finnhub] Error fetching quote for ${symbol}:`, err.message);
        return null;
      });
      
      const profilePromise = this.getCompanyProfile(symbol).catch(err => {
        console.warn(`[Finnhub] Error fetching company profile for ${symbol}:`, err.message);
        return null;
      });
      
      const metricsPromise = this.getMetrics(symbol).catch(err => {
        console.warn(`[Finnhub] Error fetching metrics for ${symbol}:`, err.message);
        return null;
      });
      
      const priceTargetPromise = this.getPriceTarget(symbol).catch(err => {
        console.warn(`[Finnhub] Error fetching price target for ${symbol}:`, err.message);
        return null;
      });
      
      const recommendationsPromise = this.getRecommendations(symbol).catch(err => {
        console.warn(`[Finnhub] Error fetching recommendations for ${symbol}:`, err.message);
        return null;
      });
      
      // Wait for all requests to complete
      const [quote, profile, metrics, priceTarget, recommendations] = await Promise.all([
        quotePromise,
        profilePromise,
        metricsPromise,
        priceTargetPromise,
        recommendationsPromise
      ]);
      
      // If all API calls failed, throw an error
      if (!quote && !profile && !metrics && !priceTarget && !recommendations) {
        throw new Error(`Failed to fetch any data for ${symbol}`);
      }
      
      // Combine into a single response
      return {
        symbol,
        quote: quote || {},
        profile: profile || {},
        metrics: metrics?.metric || {},
        priceTarget: priceTarget || {},
        recommendations: recommendations || [],
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error(`[Finnhub] Error fetching data for ${symbol}:`, error);
      throw error;
    }
  }
  
  // Save data to cache
  async saveToCache(symbol: string, data: any): Promise<void> {
    try {
      // Insert or update cache
      await db.insert(stockCache)
        .values({
          symbol,
          data: JSON.stringify(data),
          updatedAt: new Date()
        })
        .onConflictDoUpdate({
          target: stockCache.symbol,
          set: {
            data: JSON.stringify(data),
            updatedAt: new Date()
          }
        });
      
      console.log(`[Finnhub] Cached data updated for ${symbol}`);
    } catch (error) {
      console.error(`[Finnhub] Error saving to cache for ${symbol}:`, error);
    }
  }
  
  // Helper methods for different API endpoints
  
  async getQuote(symbol: string): Promise<QuoteResponse> {
    try {
      const response = await finnhubClient.get('/quote', {
        params: { symbol }
      });
      return response.data;
    } catch (error) {
      console.error(`[Finnhub] Error fetching quote for ${symbol}:`, error);
      throw error;
    }
  }
  
  async getCompanyProfile(symbol: string): Promise<CompanyProfileResponse> {
    try {
      const response = await finnhubClient.get('/stock/profile2', {
        params: { symbol }
      });
      return response.data;
    } catch (error) {
      console.error(`[Finnhub] Error fetching company profile for ${symbol}:`, error);
      throw error;
    }
  }
  
  async getMetrics(symbol: string): Promise<MetricsResponse> {
    try {
      const response = await finnhubClient.get('/stock/metric', {
        params: {
          symbol,
          metric: 'all'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`[Finnhub] Error fetching metrics for ${symbol}:`, error);
      throw error;
    }
  }
  
  async getPriceTarget(symbol: string): Promise<PriceTargetResponse> {
    try {
      const response = await finnhubClient.get('/stock/price-target', {
        params: { symbol }
      });
      return response.data;
    } catch (error) {
      console.error(`[Finnhub] Error fetching price target for ${symbol}:`, error);
      throw error;
    }
  }
  
  async getRecommendations(symbol: string): Promise<RecommendationResponse[]> {
    try {
      const response = await finnhubClient.get('/stock/recommendation', {
        params: { symbol }
      });
      return response.data;
    } catch (error) {
      console.error(`[Finnhub] Error fetching recommendations for ${symbol}:`, error);
      throw error;
    }
  }
  
  // Refresh cache for a list of symbols
  async refreshCache(symbols: string[]): Promise<{ success: string[], failures: string[] }> {
    const results = {
      success: [] as string[],
      failures: [] as string[]
    };
    
    // Process symbols one at a time to avoid API rate limits
    for (const symbol of symbols) {
      try {
        console.log(`[Finnhub] Refreshing cache for ${symbol}`);
        const data = await this.fetchStockData(symbol);
        await this.saveToCache(symbol, data);
        results.success.push(symbol);
      } catch (error) {
        console.error(`[Finnhub] Failed to refresh cache for ${symbol}:`, error);
        results.failures.push(symbol);
      }
      
      // Sleep for 250ms between requests to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    
    return results;
  }
  
  // Clear cache
  async clearCache(): Promise<void> {
    try {
      await db.delete(stockCache);
      console.log('[Finnhub] Cache cleared');
    } catch (error) {
      console.error('[Finnhub] Error clearing cache:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const finnhubService = new FinnhubService();