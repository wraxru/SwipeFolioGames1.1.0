import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

// Interface for the real-time quote data
export interface RealTimeQuote {
  "01. symbol": string;
  "02. open": string;
  "03. high": string;
  "04. low": string;
  "05. price": string;
  "06. volume": string;
  "07. latest trading day": string;
  "08. previous close": string;
  "09. change": string;
  "10. change percent": string;
}

// Interface for a single intraday data point
export interface IntradayDataPoint {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Interface for company overview data
export interface CompanyOverview {
  Symbol: string;
  AssetType: string;
  Name: string;
  Description: string;
  Exchange: string;
  Currency: string;
  Country: string;
  Sector: string;
  Industry: string;
  MarketCapitalization: string;
  PERatio: string;
  PEGRatio: string;
  BookValue: string;
  DividendPerShare: string;
  DividendYield: string;
  EPS: string;
  ProfitMargin: string;
  OperatingMarginTTM: string;
  ReturnOnAssetsTTM: string;
  ReturnOnEquityTTM: string;
  RevenueTTM: string;
  GrossProfitTTM: string;
  Beta: string;
  [key: string]: string | number; // Allow for additional properties from the API
}

/**
 * Hook to fetch real-time stock quote data
 * @param symbol Stock ticker symbol
 */
export function useStockQuote(symbol: string | null) {
  return useQuery<RealTimeQuote, Error>({
    queryKey: ['/api/stocks/quote', symbol],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!symbol,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook to fetch intraday stock data
 * @param symbol Stock ticker symbol
 * @param interval Time interval between data points
 */
export function useIntradayData(symbol: string | null, interval: string = '5min') {
  return useQuery<IntradayDataPoint[], Error>({
    queryKey: ['/api/stocks/intraday', symbol, interval],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!symbol,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook to fetch company overview data
 * @param symbol Stock ticker symbol
 */
export function useCompanyOverview(symbol: string | null) {
  return useQuery<CompanyOverview, Error>({
    queryKey: ['/api/stocks/overview', symbol],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!symbol,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - company info doesn't change frequently
  });
}

/**
 * Hook to search for stocks
 * @param keywords Search keywords
 */
export function useStockSearch(keywords: string) {
  return useQuery<any[], Error>({
    queryKey: ['/api/stocks/search', keywords],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: keywords.length > 0,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}