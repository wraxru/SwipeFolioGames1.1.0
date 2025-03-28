import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the types for our portfolio data
interface PortfolioContextType {
  cash: number;
  setCash: (cash: number) => void;
  portfolioValue: number;
  setPortfolioValue: (value: number) => void;
  totalValue: number;
  holdings: Record<string, StockHolding>;
  addStock: (stock: StockInfo, quantity: number) => void;
  removeStock: (stockId: string, quantity: number) => void;
  getStockQuantity: (stockId: string) => number;
}

interface StockInfo {
  id: string;
  name: string;
  ticker: string;
  price: number;
}

interface StockHolding {
  id: string;
  name: string;
  ticker: string;
  quantity: number;
  avgPrice: number;
}

// Create the context with default values
const PortfolioContext = createContext<PortfolioContextType>({
  cash: 100,
  setCash: () => {},
  portfolioValue: 0,
  setPortfolioValue: () => {},
  totalValue: 100,
  holdings: {},
  addStock: () => {},
  removeStock: () => {},
  getStockQuantity: () => 0,
});

// Create a provider component
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [cash, setCash] = useState(100); // Starting with $100
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [holdings, setHoldings] = useState<Record<string, StockHolding>>({});
  
  // Calculate total value (cash + portfolio)
  const totalValue = cash + portfolioValue;
  
  // Load portfolio data from localStorage on initial load
  useEffect(() => {
    const savedCash = localStorage.getItem('portfolio-cash');
    const savedHoldings = localStorage.getItem('portfolio-holdings');
    
    if (savedCash) {
      setCash(parseFloat(savedCash));
    }
    
    if (savedHoldings) {
      try {
        const parsedHoldings = JSON.parse(savedHoldings) as Record<string, StockHolding>;
        setHoldings(parsedHoldings);
        
        // Calculate portfolio value from holdings
        const value = Object.values(parsedHoldings).reduce(
          (total: number, holding: StockHolding) => total + (holding.quantity * holding.avgPrice), 
          0
        );
        setPortfolioValue(value);
      } catch (error) {
        console.error('Failed to parse portfolio holdings', error);
      }
    }
  }, []);
  
  // Save portfolio data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('portfolio-cash', cash.toString());
    localStorage.setItem('portfolio-holdings', JSON.stringify(holdings));
  }, [cash, holdings]);
  
  // Add a stock to the portfolio
  const addStock = (stock: StockInfo, quantity: number) => {
    if (quantity <= 0) return;
    
    const totalCost = stock.price * quantity;
    
    // Check if user has enough cash
    if (totalCost > cash) {
      alert('Not enough cash to make this purchase.');
      return;
    }
    
    setHoldings(prev => {
      const updatedHoldings = { ...prev };
      
      if (updatedHoldings[stock.id]) {
        // If already holding this stock, update the average price and quantity
        const currentHolding = updatedHoldings[stock.id];
        const currentTotalValue = currentHolding.avgPrice * currentHolding.quantity;
        const newTotalValue = currentTotalValue + (stock.price * quantity);
        const newTotalQuantity = currentHolding.quantity + quantity;
        
        updatedHoldings[stock.id] = {
          ...currentHolding,
          quantity: newTotalQuantity,
          avgPrice: newTotalValue / newTotalQuantity,
        };
      } else {
        // If new stock, add it to holdings
        updatedHoldings[stock.id] = {
          id: stock.id,
          name: stock.name,
          ticker: stock.ticker,
          quantity,
          avgPrice: stock.price,
        };
      }
      
      return updatedHoldings;
    });
    
    // Deduct cash and update portfolio value
    setCash(prev => prev - totalCost);
    setPortfolioValue(prev => prev + totalCost);
  };
  
  // Remove a stock from the portfolio
  const removeStock = (stockId: string, quantity: number) => {
    if (quantity <= 0) return;
    
    setHoldings(prev => {
      const updatedHoldings = { ...prev };
      
      if (!updatedHoldings[stockId]) {
        return prev; // No holdings for this stock
      }
      
      const currentHolding = updatedHoldings[stockId];
      
      if (quantity >= currentHolding.quantity) {
        // Selling all shares
        const saleValue = currentHolding.avgPrice * currentHolding.quantity;
        setCash(prev => prev + saleValue);
        setPortfolioValue(prev => prev - saleValue);
        delete updatedHoldings[stockId];
      } else {
        // Selling some shares
        const saleValue = currentHolding.avgPrice * quantity;
        setCash(prev => prev + saleValue);
        setPortfolioValue(prev => prev - saleValue);
        updatedHoldings[stockId] = {
          ...currentHolding,
          quantity: currentHolding.quantity - quantity,
        };
      }
      
      return updatedHoldings;
    });
  };
  
  // Get the quantity of a specific stock in the portfolio
  const getStockQuantity = (stockId: string): number => {
    return holdings[stockId]?.quantity || 0;
  };
  
  return (
    <PortfolioContext.Provider
      value={{
        cash,
        setCash,
        portfolioValue,
        setPortfolioValue,
        totalValue,
        holdings,
        addStock,
        removeStock,
        getStockQuantity,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

// Custom hook to use the portfolio context
export function usePortfolio() {
  return useContext(PortfolioContext);
}