import axios from 'axios';

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

/**
 * Fetches real-time quote data for a specific stock symbol
 * @param symbol Stock ticker symbol (e.g., 'AAPL', 'MSFT')
 * @returns Promise with quote data
 */
export async function getRealTimeQuote(symbol: string) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: API_KEY
      }
    });
    
    // Check if response contains valid data
    if (response.data && response.data['Global Quote']) {
      return response.data['Global Quote'];
    } else if (response.data && response.data.Note) {
      // API limit reached
      console.warn('Alpha Vantage API limit reached:', response.data.Note);
      throw new Error('API call frequency limit reached');
    } else {
      throw new Error('Invalid response from Alpha Vantage');
    }
  } catch (error) {
    console.error('Error fetching real-time quote:', error);
    throw error;
  }
}

/**
 * Fetches intraday price data for a specific stock symbol
 * @param symbol Stock ticker symbol (e.g., 'AAPL', 'MSFT')
 * @param interval Time interval between data points (e.g., '5min', '15min', '30min', '60min')
 * @returns Promise with intraday time series data
 */
export async function getIntradayData(symbol: string, interval = '5min') {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_INTRADAY',
        symbol,
        interval,
        apikey: API_KEY
      }
    });
    
    // Check if response contains valid data
    const timeSeriesKey = `Time Series (${interval})`;
    if (response.data && response.data[timeSeriesKey]) {
      return response.data[timeSeriesKey];
    } else if (response.data && response.data.Note) {
      // API limit reached
      console.warn('Alpha Vantage API limit reached:', response.data.Note);
      throw new Error('API call frequency limit reached');
    } else {
      throw new Error('Invalid response from Alpha Vantage');
    }
  } catch (error) {
    console.error('Error fetching intraday data:', error);
    throw error;
  }
}

/**
 * Fetches company overview data for a specific stock symbol
 * @param symbol Stock ticker symbol (e.g., 'AAPL', 'MSFT')
 * @returns Promise with company overview data
 */
export async function getCompanyOverview(symbol: string) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'OVERVIEW',
        symbol,
        apikey: API_KEY
      }
    });
    
    // Check if response contains valid data
    if (response.data && response.data.Symbol) {
      return response.data;
    } else if (response.data && response.data.Note) {
      // API limit reached
      console.warn('Alpha Vantage API limit reached:', response.data.Note);
      throw new Error('API call frequency limit reached');
    } else {
      throw new Error('Invalid response from Alpha Vantage');
    }
  } catch (error) {
    console.error('Error fetching company overview:', error);
    throw error;
  }
}

/**
 * Searches for stocks by keywords or company name
 * @param keywords Search keywords or company name
 * @returns Promise with search results
 */
export async function searchStocks(keywords: string) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords,
        apikey: API_KEY
      }
    });
    
    // Check if response contains valid data
    if (response.data && response.data.bestMatches) {
      return response.data.bestMatches;
    } else if (response.data && response.data.Note) {
      // API limit reached
      console.warn('Alpha Vantage API limit reached:', response.data.Note);
      throw new Error('API call frequency limit reached');
    } else {
      throw new Error('Invalid response from Alpha Vantage');
    }
  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error;
  }
}