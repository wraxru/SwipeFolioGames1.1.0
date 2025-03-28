import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StockData } from "@/lib/stock-data";

// Define impact calculation types
interface PortfolioImpact {
  metrics: {
    performance: number;
    stability: number;
    value: number;
    momentum: number;
  };
  industryAllocation: Record<string, {
    previous: number;
    new: number;
    change: number;
  }>;
  diversification: {
    previous: number;
    new: number;
    change: number;
  };
  risk: {
    previous: number;
    new: number;
    change: number;
  };
}

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
  calculateImpact: (stock: StockData, amount: number) => PortfolioImpact;
  buyStock: (stock: StockData, amount: number) => void;
  isLoading: boolean;
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
  calculateImpact: () => ({
    metrics: {
      performance: 0,
      stability: 0,
      value: 0,
      momentum: 0
    },
    industryAllocation: {},
    diversification: {
      previous: 0,
      new: 0,
      change: 0
    },
    risk: {
      previous: 0,
      new: 0,
      change: 0
    }
  }),
  buyStock: () => {},
  isLoading: false,
});

// Create a provider component
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [cash, setCash] = useState(100); // Starting with $100
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [holdings, setHoldings] = useState<Record<string, StockHolding>>({});
  const [isLoading, setIsLoading] = useState(false);
  
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

  // Calculate the impact of adding a stock to the portfolio
  const calculateImpact = (stock: StockData, amount: number): PortfolioImpact => {
    // Create default impact data
    const impact: PortfolioImpact = {
      metrics: {
        performance: 1.2, // Small positive impact by default
        stability: 0.8,   // Small positive impact by default
        value: 0.5,       // Small positive impact by default
        momentum: 1.5,    // Small positive impact by default
      },
      industryAllocation: {},
      diversification: {
        previous: 45,
        new: 52,
        change: 7
      },
      risk: {
        previous: 65,
        new: 62,
        change: -3
      }
    };

    // Determine the industry for this stock
    const industry = stock.industry || stock.sector || "Other";
    
    // Calculate current industry allocations
    const totalPortfolioValue = portfolioValue || 0.01; // Avoid division by zero
    const currentIndustryValues: Record<string, number> = {};
    
    // Calculate the current industry allocations based on holdings
    Object.values(holdings).forEach(holding => {
      // Get the industry from the holding or use a default
      const holdingIndustry = "Real Estate"; // Default to Real Estate for now
      
      // Add the value to the appropriate industry
      const holdingValue = holding.quantity * holding.avgPrice;
      currentIndustryValues[holdingIndustry] = (currentIndustryValues[holdingIndustry] || 0) + holdingValue;
    });
    
    // Convert values to percentages
    const currentIndustryPercentages: Record<string, number> = {};
    Object.entries(currentIndustryValues).forEach(([ind, value]) => {
      currentIndustryPercentages[ind] = (value / totalPortfolioValue) * 100;
    });
    
    // Calculate new portfolio value with this investment
    const newTotalValue = totalPortfolioValue + amount;
    
    // Update the industry allocation with the new investment
    const newIndustryValues = { ...currentIndustryValues };
    newIndustryValues[industry] = (newIndustryValues[industry] || 0) + amount;
    
    // Calculate new percentages
    const newIndustryPercentages: Record<string, number> = {};
    Object.entries(newIndustryValues).forEach(([ind, value]) => {
      newIndustryPercentages[ind] = (value / newTotalValue) * 100;
    });
    
    // Set the industry allocations in the impact object
    Object.keys({ ...currentIndustryPercentages, ...newIndustryPercentages }).forEach(ind => {
      const previous = currentIndustryPercentages[ind] || 0;
      const newPercentage = newIndustryPercentages[ind] || 0;
      
      impact.industryAllocation[ind] = {
        previous,
        new: newPercentage,
        change: newPercentage - previous
      };
    });
    
    // If no current holdings, set an initial industry allocation
    if (Object.keys(holdings).length === 0) {
      impact.industryAllocation[industry] = {
        previous: 0,
        new: 100,
        change: 100
      };
    }
    
    return impact;
  };

  // Function to buy a stock (used by the portfolio impact calculator)
  const buyStock = (stock: StockData, amount: number) => {
    if (amount <= 0 || !stock) return;
    
    // Begin loading state
    setIsLoading(true);
    
    try {
      // Calculate how many shares we can buy with this amount
      const shares = amount / stock.price;
      
      // Create a StockInfo object from the StockData
      const stockInfo: StockInfo = {
        id: stock.id || stock.ticker,
        name: stock.name,
        ticker: stock.ticker,
        price: stock.price
      };
      
      // Add the stock to the portfolio
      addStock(stockInfo, shares);
      
      // Success feedback could be added here
    } catch (error) {
      console.error("Error buying stock:", error);
      // Error feedback could be added here
    } finally {
      // End loading state
      setIsLoading(false);
    }
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
        calculateImpact,
        buyStock,
        isLoading
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