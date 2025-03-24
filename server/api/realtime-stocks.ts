import { Router } from 'express';
import { 
  getRealTimeQuote, 
  getIntradayData, 
  getCompanyOverview, 
  searchStocks 
} from '../services/alpha-vantage';

const router = Router();

// Get real-time quote for a stock
router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const quoteData = await getRealTimeQuote(symbol);
    res.json(quoteData);
  } catch (error: any) {
    console.error('Error in /quote endpoint:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch real-time quote' });
  }
});

// Alternative endpoint that supports query parameters
router.get('/quote', async (req, res) => {
  try {
    const { symbol } = req.query;
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
    }
    const quoteData = await getRealTimeQuote(symbol as string);
    res.json(quoteData);
  } catch (error: any) {
    console.error('Error in /quote endpoint:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch real-time quote' });
  }
});

// Get intraday time series data
router.get('/intraday/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = '5min' } = req.query;
    const intradayData = await getIntradayData(symbol, interval as string);
    
    // Convert to array format for easier consumption by charts
    const dataPoints = Object.entries(intradayData).map(([timestamp, values]: [string, any]) => ({
      timestamp,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'], 10)
    }));
    
    res.json(dataPoints);
  } catch (error: any) {
    console.error('Error in /intraday endpoint:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch intraday data' });
  }
});

// Alternative endpoint that supports query parameters
router.get('/intraday', async (req, res) => {
  try {
    const { symbol, interval = '5min' } = req.query;
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
    }
    const intradayData = await getIntradayData(symbol as string, interval as string);
    
    // Convert to array format for easier consumption by charts
    const dataPoints = Object.entries(intradayData).map(([timestamp, values]: [string, any]) => ({
      timestamp,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'], 10)
    }));
    
    res.json(dataPoints);
  } catch (error: any) {
    console.error('Error in /intraday endpoint:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch intraday data' });
  }
});

// Get company overview
router.get('/overview/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const overviewData = await getCompanyOverview(symbol);
    res.json(overviewData);
  } catch (error: any) {
    console.error('Error in /overview endpoint:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch company overview' });
  }
});

// Alternative endpoint that supports query parameters
router.get('/overview', async (req, res) => {
  try {
    const { symbol } = req.query;
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol parameter is required' });
    }
    const overviewData = await getCompanyOverview(symbol as string);
    res.json(overviewData);
  } catch (error: any) {
    console.error('Error in /overview endpoint:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch company overview' });
  }
});

// Search for stocks
router.get('/search', async (req, res) => {
  try {
    const { keywords } = req.query;
    if (!keywords) {
      return res.status(400).json({ error: 'Keywords parameter is required' });
    }
    
    const searchResults = await searchStocks(keywords as string);
    res.json(searchResults);
  } catch (error: any) {
    console.error('Error in /search endpoint:', error);
    res.status(500).json({ error: error.message || 'Failed to search stocks' });
  }
});

export default router;