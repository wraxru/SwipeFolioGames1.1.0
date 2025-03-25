import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { StockData } from "@/lib/stock-data";

// Define portfolio holding structure
export interface PortfolioHolding {
  stock: StockData;
  shares: number;
  value: number;
  purchasePrice: number;
  purchaseDate: string;
}

// Define portfolio context type
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

// Create the context
export const PortfolioContext = createContext<PortfolioContextProps | null>(null);

// Calculate numeric score from string rating
const getRatingScore = (rating: string): number => {
  switch (rating) {
    case "Strong":
    case "High":
    case "Good":
      return 90;
    case "Average":
    case "Fair":
      return 50;
    case "Poor":
    case "Weak":
    case "Low":
    case "Unstable":
      return 30;
    default:
      return 50;
  }
};

// Helper function to convert metric values to normalized scores
const calculateMetricScore = (metric: any): number => {
  // If metric value is a string (like "Strong", "Good", etc)
  if (typeof metric.value === "string") {
    return getRatingScore(metric.value);
  }
  
  // For numeric metrics, we'll use a score of 50 as the default
  return 50;
};

export function PortfolioProvider({ children }: { children: ReactNode }) {
  // Initialize state for cash, holdings, and portfolio metrics
  const [cash, setCash] = useState<number>(100); // Start with $100
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Calculate portfolio value
  const portfolioValue = holdings.reduce((total, holding) => total + holding.value, 0);
  const totalValue = portfolioValue + cash;
  
  // Calculate portfolio metrics based on holdings
  const portfolioMetrics = {
    performance: calculatePortfolioMetric("performance"),
    stability: calculatePortfolioMetric("stability"),
    value: calculatePortfolioMetric("value"),
    momentum: calculatePortfolioMetric("momentum"),
  };
  
  // Function to calculate weighted metric for the portfolio
  function calculatePortfolioMetric(metricName: "performance" | "stability" | "value" | "momentum"): number {
    if (holdings.length === 0) return 50; // Default value for empty portfolio
    
    let weightedSum = 0;
    let totalWeight = 0;
    
    for (const holding of holdings) {
      const weight = holding.value / portfolioValue;
      const metricScore = calculateMetricScore(holding.stock.metrics[metricName]);
      weightedSum += weight * metricScore;
      totalWeight += weight;
    }
    
    return totalWeight > 0 ? weightedSum / totalWeight : 50;
  }
  
  // Function to buy a stock
  const buyStock = (stock: StockData, amount: number) => {
    if (amount <= 0 || amount > cash) return;
    
    setIsLoading(true);
    
    try {
      // Calculate shares based on amount and stock price
      const shares = amount / stock.price;
      
      // Check if stock already exists in portfolio
      const existingHoldingIndex = holdings.findIndex(
        holding => holding.stock.ticker === stock.ticker
      );
      
      const newHoldings = [...holdings];
      
      if (existingHoldingIndex >= 0) {
        // Update existing holding
        const existingHolding = newHoldings[existingHoldingIndex];
        const newShares = existingHolding.shares + shares;
        const newValue = newShares * stock.price;
        
        // Calculate new average purchase price
        const totalCost = 
          existingHolding.shares * existingHolding.purchasePrice + amount;
        const newPurchasePrice = totalCost / newShares;
        
        newHoldings[existingHoldingIndex] = {
          ...existingHolding,
          shares: newShares,
          value: newValue,
          purchasePrice: newPurchasePrice,
        };
      } else {
        // Add new holding
        const todayDate = new Date().toISOString().split("T")[0];
        
        newHoldings.push({
          stock,
          shares,
          value: amount,
          purchasePrice: stock.price,
          purchaseDate: todayDate,
        });
      }
      
      // Update state
      setHoldings(newHoldings);
      setCash(prev => prev - amount);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to sell a stock
  const sellStock = (stockId: string, sharesToSell: number) => {
    if (sharesToSell <= 0) return;
    
    setIsLoading(true);
    
    try {
      // Find the holding
      const holdingIndex = holdings.findIndex(
        holding => holding.stock.ticker === stockId
      );
      
      if (holdingIndex === -1) return;
      
      const holding = holdings[holdingIndex];
      
      // Check if selling all shares
      if (sharesToSell >= holding.shares) {
        // Remove the holding entirely
        const newHoldings = holdings.filter((_, i) => i !== holdingIndex);
        setHoldings(newHoldings);
        
        // Return cash
        setCash(prev => prev + holding.value);
      } else {
        // Sell partial position
        const newShares = holding.shares - sharesToSell;
        const soldValue = sharesToSell * holding.stock.price;
        const newValue = newShares * holding.stock.price;
        
        const newHoldings = [...holdings];
        newHoldings[holdingIndex] = {
          ...holding,
          shares: newShares,
          value: newValue,
        };
        
        setHoldings(newHoldings);
        setCash(prev => prev + soldValue);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate impact of adding a new stock to portfolio
  const calculateImpact = (stock: StockData, amount: number) => {
    // Current metrics
    const currentMetrics = {
      performance: portfolioMetrics.performance,
      stability: portfolioMetrics.stability,
      value: portfolioMetrics.value,
      momentum: portfolioMetrics.momentum,
    };
    
    // Current industry allocation
    const currentIndustryAllocation: Record<string, number> = {};
    let currentTotalValue = portfolioValue;
    
    // Calculate current industry allocation
    holdings.forEach(holding => {
      const industry = holding.stock.industry;
      if (!currentIndustryAllocation[industry]) {
        currentIndustryAllocation[industry] = 0;
      }
      currentIndustryAllocation[industry] += holding.value;
    });
    
    // Convert to percentages
    const industryAllocation: Record<string, { current: number; new: number }> = {};
    
    for (const [industry, value] of Object.entries(currentIndustryAllocation)) {
      industryAllocation[industry] = {
        current: (value / currentTotalValue) * 100,
        new: 0, // Will be calculated below
      };
    }
    
    // Add new stock's industry if it doesn't exist
    if (!industryAllocation[stock.industry]) {
      industryAllocation[stock.industry] = {
        current: 0,
        new: 0,
      };
    }
    
    // Calculate new metrics with the potential investment
    const newTotalValue = currentTotalValue + amount;
    
    // Calculate new metrics considering the new stock
    const newPerformanceScore = calculateNewMetricScore("performance", stock, amount, newTotalValue);
    const newStabilityScore = calculateNewMetricScore("stability", stock, amount, newTotalValue);
    const newValueScore = calculateNewMetricScore("value", stock, amount, newTotalValue);
    const newMomentumScore = calculateNewMetricScore("momentum", stock, amount, newTotalValue);
    
    // Calculate new industry allocation
    for (const [industry, values] of Object.entries(industryAllocation)) {
      let newIndustryValue = currentIndustryAllocation[industry] || 0;
      
      // Add the new investment to its industry
      if (industry === stock.industry) {
        newIndustryValue += amount;
      }
      
      // Calculate new percentage
      industryAllocation[industry].new = (newIndustryValue / newTotalValue) * 100;
    }
    
    const newMetrics = {
      performance: newPerformanceScore,
      stability: newStabilityScore,
      value: newValueScore,
      momentum: newMomentumScore,
    };
    
    const impact = {
      performance: newPerformanceScore - currentMetrics.performance,
      stability: newStabilityScore - currentMetrics.stability,
      value: newValueScore - currentMetrics.value,
      momentum: newMomentumScore - currentMetrics.momentum,
    };
    
    return {
      currentMetrics,
      newMetrics,
      impact,
      industryAllocation,
    };
  };
  
  // Helper function to calculate new metric score after adding a stock
  function calculateNewMetricScore(
    metricName: "performance" | "stability" | "value" | "momentum",
    newStock: StockData,
    investmentAmount: number,
    newTotalValue: number
  ) {
    // If portfolio is empty, just return the new stock's metric
    if (holdings.length === 0) {
      return calculateMetricScore(newStock.metrics[metricName]);
    }
    
    // Calculate current portfolio's contribution
    const currentValue = portfolioValue;
    const newStockWeight = investmentAmount / newTotalValue;
    const currentPortfolioWeight = currentValue / newTotalValue;
    
    // Calculate weighted score
    const currentScore = portfolioMetrics[metricName];
    const newStockScore = calculateMetricScore(newStock.metrics[metricName]);
    
    // Weighted average
    return (currentScore * currentPortfolioWeight) + 
           (newStockScore * newStockWeight);
  }
  
  // Load portfolio data from localStorage on initial render
  useEffect(() => {
    const loadPortfolio = () => {
      try {
        const savedCash = localStorage.getItem("portfolio_cash");
        const savedHoldings = localStorage.getItem("portfolio_holdings");
        
        if (savedCash) {
          setCash(parseFloat(savedCash));
        }
        
        if (savedHoldings) {
          setHoldings(JSON.parse(savedHoldings));
        }
      } catch (error) {
        console.error("Error loading portfolio data:", error);
      }
    };
    
    loadPortfolio();
  }, []);
  
  // Save portfolio data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("portfolio_cash", cash.toString());
      localStorage.setItem("portfolio_holdings", JSON.stringify(holdings));
    } catch (error) {
      console.error("Error saving portfolio data:", error);
    }
  }, [cash, holdings]);
  
  return (
    <PortfolioContext.Provider
      value={{
        cash,
        holdings,
        portfolioValue,
        totalValue,
        portfolioMetrics,
        buyStock,
        sellStock,
        calculateImpact,
        isLoading,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}