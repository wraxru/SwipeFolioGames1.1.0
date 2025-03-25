import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { StockData } from '@/lib/stock-data';
import { useToast } from '@/hooks/use-toast';

// Define types
export interface PortfolioHolding {
  stock: StockData;
  shares: number;
  value: number;
  purchasePrice: number;
  purchaseDate: string;
}

interface PortfolioContextProps {
  cash: number;
  holdings: PortfolioHolding[];
  portfolioValue: number;
  totalValue: number;
  portfolioMetrics: {
    performance: number;
    stability: number;
    value: number;
    momentum: number;
  };
  buyStock: (stock: StockData, amount: number) => void;
  sellStock: (stockId: string, shares: number) => void;
  calculateImpact: (stock: StockData, amount: number) => {
    currentMetrics: {
      performance: number;
      stability: number;
      value: number;
      momentum: number;
    };
    newMetrics: {
      performance: number;
      stability: number;
      value: number;
      momentum: number;
    };
    impact: {
      performance: number;
      stability: number;
      value: number;
      momentum: number;
    };
    industryAllocation: Record<string, { current: number; new: number }>;
  };
  isLoading: boolean;
}

// Create context
export const PortfolioContext = createContext<PortfolioContextProps | null>(null);

// Provider component
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // State
  const [cash, setCash] = useState<number>(100);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Derived state
  const portfolioValue = holdings.reduce((total, holding) => total + holding.value, 0);
  const totalValue = cash + portfolioValue;
  
  // Portfolio metrics
  const portfolioMetrics = {
    performance: calculatePortfolioMetric('performance'),
    stability: calculatePortfolioMetric('stability'),
    value: calculatePortfolioMetric('value'),
    momentum: calculatePortfolioMetric('momentum')
  };
  
  // Calculate individual portfolio metric score
  function calculatePortfolioMetric(metricName: "performance" | "stability" | "value" | "momentum"): number {
    if (holdings.length === 0) return 5.0; // Default baseline score
    
    let weightedScore = 0;
    let totalWeight = 0;
    
    holdings.forEach(holding => {
      const metricScore = getMetricScore(holding.stock, metricName);
      const weight = holding.value; // Weight by value in portfolio
      
      weightedScore += metricScore * weight;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? parseFloat((weightedScore / totalWeight).toFixed(1)) : 5.0;
  }
  
  // Helper to get numeric score from metric
  function getMetricScore(stock: StockData, metricName: string): number {
    const metricValue = stock.metrics[metricName as keyof typeof stock.metrics].value;
    
    // Convert rating strings to numeric scores
    switch (metricValue) {
      case "Strong":
      case "High":
      case "Good":
        return 7.5;
      case "Fair":
      case "Average":
        return 5.0;
      case "Unstable":
      case "Weak":
      case "Low":
      case "Poor":
        return 2.5;
      default:
        return 5.0;
    }
  }
  
  // Buy a stock
  const buyStock = (stock: StockData, amount: number) => {
    setIsLoading(true);
    
    try {
      // Validate transaction
      if (amount <= 0) {
        throw new Error("Investment amount must be positive");
      }
      
      if (amount > cash) {
        throw new Error("Not enough cash available");
      }
      
      // Calculate shares
      const shares = amount / stock.price;
      
      // Update state
      setCash(prevCash => prevCash - amount);
      
      // Check if already holding this stock
      const existingHoldingIndex = holdings.findIndex(h => h.stock.ticker === stock.ticker);
      
      if (existingHoldingIndex >= 0) {
        // Update existing holding
        setHoldings(prevHoldings => {
          const updatedHoldings = [...prevHoldings];
          const existing = updatedHoldings[existingHoldingIndex];
          
          // Calculate new average purchase price
          const totalShares = existing.shares + shares;
          const totalCost = (existing.shares * existing.purchasePrice) + amount;
          const newAvgPrice = totalCost / totalShares;
          
          updatedHoldings[existingHoldingIndex] = {
            ...existing,
            shares: totalShares,
            value: totalShares * stock.price,
            purchasePrice: newAvgPrice
          };
          
          return updatedHoldings;
        });
      } else {
        // Add new holding
        setHoldings(prevHoldings => [
          ...prevHoldings,
          {
            stock,
            shares,
            value: amount,
            purchasePrice: stock.price,
            purchaseDate: new Date().toISOString().split('T')[0]
          }
        ]);
      }
      
      // Show success message
      toast({
        title: "Stock purchased",
        description: `You purchased ${shares.toFixed(4)} shares of ${stock.ticker} for $${amount.toFixed(2)}`,
        variant: "default",
      });
    } catch (error) {
      // Handle errors
      toast({
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sell a stock
  const sellStock = (stockId: string, sharesToSell: number) => {
    setIsLoading(true);
    
    try {
      // Find the holding
      const holdingIndex = holdings.findIndex(h => h.stock.ticker === stockId);
      
      if (holdingIndex === -1) {
        throw new Error("Stock not found in portfolio");
      }
      
      const holding = holdings[holdingIndex];
      
      // Validate shares
      if (sharesToSell <= 0) {
        throw new Error("Shares to sell must be positive");
      }
      
      if (sharesToSell > holding.shares) {
        throw new Error("Not enough shares to sell");
      }
      
      // Calculate sale amount
      const saleAmount = sharesToSell * holding.stock.price;
      
      // Update cash
      setCash(prevCash => prevCash + saleAmount);
      
      // Update holdings
      setHoldings(prevHoldings => {
        const updatedHoldings = [...prevHoldings];
        const remainingShares = holding.shares - sharesToSell;
        
        if (remainingShares > 0.0001) { // Account for floating point errors
          // Update holding
          updatedHoldings[holdingIndex] = {
            ...holding,
            shares: remainingShares,
            value: remainingShares * holding.stock.price
          };
        } else {
          // Remove holding completely
          updatedHoldings.splice(holdingIndex, 1);
        }
        
        return updatedHoldings;
      });
      
      // Show success message
      toast({
        title: "Stock sold",
        description: `You sold ${sharesToSell.toFixed(4)} shares of ${stockId} for $${saleAmount.toFixed(2)}`,
        variant: "default",
      });
    } catch (error) {
      // Handle errors
      toast({
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate impact of adding a new stock
  const calculateImpact = (stock: StockData, amount: number) => {
    // For first investment, set baseline metrics based on stock
    const hasExistingHoldings = holdings.length > 0;
    const stockMetricScore = {
      performance: getMetricScore(stock, 'performance'),
      stability: getMetricScore(stock, 'stability'),
      value: getMetricScore(stock, 'value'),
      momentum: getMetricScore(stock, 'momentum')
    };
    
    // Current metrics - ensure positive baseline values for first investment
    const currentMetrics = {
      performance: hasExistingHoldings ? portfolioMetrics.performance : 5.0,
      stability: hasExistingHoldings ? portfolioMetrics.stability : 5.0,
      value: hasExistingHoldings ? portfolioMetrics.value : 5.0,
      momentum: hasExistingHoldings ? portfolioMetrics.momentum : 5.0
    };
    
    // Create simulated portfolio with new stock
    const simulatedHoldings = [...holdings];
    const existingHoldingIndex = holdings.findIndex(h => h.stock.ticker === stock.ticker);
    
    if (existingHoldingIndex >= 0) {
      // Update existing holding in simulation
      const existing = simulatedHoldings[existingHoldingIndex];
      const shares = amount / stock.price;
      const totalShares = existing.shares + shares;
      
      simulatedHoldings[existingHoldingIndex] = {
        ...existing,
        shares: totalShares,
        value: totalShares * stock.price
      };
    } else {
      // Add new holding in simulation
      simulatedHoldings.push({
        stock,
        shares: amount / stock.price,
        value: amount,
        purchasePrice: stock.price,
        purchaseDate: new Date().toISOString().split('T')[0]
      });
    }
    
    // Calculate new metrics
    const newMetrics = {
      performance: hasExistingHoldings ? 
        calculateNewMetricScore('performance', simulatedHoldings, stock) : 
        stockMetricScore.performance,
      stability: hasExistingHoldings ? 
        calculateNewMetricScore('stability', simulatedHoldings, stock) : 
        stockMetricScore.stability,
      value: hasExistingHoldings ? 
        calculateNewMetricScore('value', simulatedHoldings, stock) : 
        stockMetricScore.value,
      momentum: hasExistingHoldings ? 
        calculateNewMetricScore('momentum', simulatedHoldings, stock) : 
        stockMetricScore.momentum
    };
    
    // Calculate industry allocation (current and new)
    const currentTotal = Math.max(portfolioValue, 0.01); // Avoid division by zero
    const newTotal = currentTotal + amount;
    
    const industries = new Set<string>();
    holdings.forEach(h => industries.add(h.stock.industry));
    industries.add(stock.industry);
    
    const industryAllocation: Record<string, {current: number, new: number}> = {};
    
    // Initialize with zeros
    Array.from(industries).forEach(industry => {
      industryAllocation[industry] = { current: 0, new: 0 };
    });
    
    // For first investment, set 100% allocation to new stock's industry
    if (!hasExistingHoldings) {
      industryAllocation[stock.industry].new = 100;
    } else {
      // Calculate current allocation
      holdings.forEach(holding => {
        const industry = holding.stock.industry;
        industryAllocation[industry].current += (holding.value / currentTotal) * 100;
      });
      
      // Calculate new allocation
      simulatedHoldings.forEach(holding => {
        const industry = holding.stock.industry;
        industryAllocation[industry].new += (holding.value / newTotal) * 100;
      });
    }
    
    // Calculate impact - ensure small changes for first investment
    const impact = {
      performance: parseFloat((newMetrics.performance - currentMetrics.performance).toFixed(1)),
      stability: parseFloat((newMetrics.stability - currentMetrics.stability).toFixed(1)),
      value: parseFloat((newMetrics.value - currentMetrics.value).toFixed(1)),
      momentum: parseFloat((newMetrics.momentum - currentMetrics.momentum).toFixed(1))
    };
    
    return {
      currentMetrics,
      newMetrics,
      impact,
      industryAllocation
    };
  };
  
  function calculateNewMetricScore(
    metricName: "performance" | "stability" | "value" | "momentum",
    simulatedHoldings: PortfolioHolding[],
    newStock: StockData
  ): number {
    if (simulatedHoldings.length === 0) return getMetricScore(newStock, metricName);
    
    let weightedScore = 0;
    let totalWeight = 0;
    
    simulatedHoldings.forEach(holding => {
      const metricScore = getMetricScore(holding.stock, metricName);
      const weight = holding.value;
      
      weightedScore += metricScore * weight;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? parseFloat((weightedScore / totalWeight).toFixed(1)) : 5.0;
  }
  
  // Context value
  const contextValue: PortfolioContextProps = {
    cash,
    holdings,
    portfolioValue,
    totalValue,
    portfolioMetrics,
    buyStock,
    sellStock,
    calculateImpact,
    isLoading
  };
  
  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
}

// Custom hook for using the context
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  
  return context;
}