import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { StockData, PerformanceDetails, StabilityDetails, ValueDetails, MomentumDetails } from '@/lib/stock-data';
import { useToast } from '@/hooks/use-toast';
import { getIndustryAverages } from '@/lib/industry-data';
import { getAdvancedMetricScore, calculatePortfolioScore } from '@/lib/advanced-metric-scoring';
import { calculatePortfolioQuality, getQualityScoreColor, getQualityScoreBgColor } from '@/data/leaderboard-data';

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
  version: number; // Add version property to trigger updates
  lastUpdated: number; // Timestamp for tracking updates
  portfolioMetrics: {
    performance: number;
    stability: number;
    value: number;
    momentum: number;
    qualityScore: number;
  };
  buyStock: (stock: StockData, amount: number) => void;
  sellStock: (stockId: string, shares: number) => void;
  calculateImpact: (stock: StockData, amount: number) => {
    currentMetrics: {
      performance: number;
      stability: number;
      value: number;
      momentum: number;
      qualityScore: number;
    };
    newMetrics: {
      performance: number;
      stability: number;
      value: number;
      momentum: number;
      qualityScore: number;
    };
    impact: {
      performance: number;
      stability: number;
      value: number;
      momentum: number;
      qualityScore: number;
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
  const [version, setVersion] = useState<number>(1); // Add version counter for triggering updates
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now()); // Timestamp for tracking updates
  
  // Derived state
  const portfolioValue = holdings.reduce((total, holding) => total + holding.value, 0);
  const totalValue = cash + portfolioValue;
  
  // Portfolio metrics
  const portfolioMetrics = {
    performance: calculatePortfolioMetric('performance'),
    stability: calculatePortfolioMetric('stability'),
    value: calculatePortfolioMetric('value'),
    momentum: calculatePortfolioMetric('momentum'),
    qualityScore: calculateQualityScore()
  };
  
  // Calculate quality score using equal weighting of all metrics
  function calculateQualityScore(): number {
    if (holdings.length === 0) return 0; // Empty portfolio starts at 0
    
    // Use the imported calculation function
    return calculatePortfolioQuality(holdings);
  }
  
  // Calculate individual portfolio metric score using the advanced 0-100 scale
  function calculatePortfolioMetric(metricName: "performance" | "stability" | "value" | "momentum"): number {
    if (holdings.length === 0) return 0; // Empty portfolio starts at 0
    
    // Use the new advanced scoring system from the imported function
    return calculatePortfolioScore(holdings, metricName);
  }
  
  // Helper to get numeric score from metric on a 0-100 scale
  function getMetricScore(stock: StockData, metricName: string): number {
    console.log(`\nCalculating ${metricName} score for ${stock.ticker} using advanced scoring system:`);
    
    if (metricName === 'performance' || metricName === 'stability' || 
        metricName === 'value' || metricName === 'momentum') {
      // Use the advanced scoring system for the main metric categories
      const score = getAdvancedMetricScore(stock, metricName as any);
      
      console.log(`- Final ${metricName} score (0-100 scale): ${score}`);
      
      return score;
    } else {
      // Fallback for any other metrics - convert string ratings to scores
      const metricData = stock.metrics[metricName as keyof typeof stock.metrics];
      const metricValue = metricData?.value || "";
      
      // Convert string rating to numeric score
      switch (metricValue) {
        case "Strong":
        case "High":
          return 90;
        case "Good":
          return 70;
        case "Fair":
        case "Average":
          return 50;
        case "Weak":
        case "Poor":
        case "Unstable":
          return 30;
        default:
          return 50; // Default middle score
      }
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
      
      // Purchase success toast notification has been removed per request
      // to avoid duplicate notifications, as we're using PurchaseSuccessModal
      
      
      // Update version and timestamp to trigger updates
      setVersion(prev => prev + 1);
      setLastUpdated(Date.now());
      console.log("Portfolio updated: version and timestamp updated after purchase");
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
      
      // Update version and timestamp to trigger updates
      setVersion(prev => prev + 1);
      setLastUpdated(Date.now());
      console.log("Portfolio updated: version and timestamp updated after sale");
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
    // Debug information
    console.log('---- PORTFOLIO IMPACT CALCULATION ----');
    console.log(`Adding ${stock.ticker} (${stock.industry}) with $${amount}`);
    
    // For first investment, set baseline metrics based on stock
    const hasExistingHoldings = holdings.length > 0;
    console.log('Has existing holdings:', hasExistingHoldings);
    
    // Calculate and log individual metric scores for this stock
    console.log(`Calculating raw scores for ${stock.ticker}:`);
    const performanceScore = getMetricScore(stock, 'performance');
    console.log(`- Performance score: ${performanceScore} (Raw data:`, stock.metrics.performance.details, ')');
    
    const stabilityScore = getMetricScore(stock, 'stability');
    console.log(`- Stability score: ${stabilityScore} (Raw data:`, stock.metrics.stability.details, ')');
    
    const valueScore = getMetricScore(stock, 'value');
    console.log(`- Value score: ${valueScore} (Raw data:`, stock.metrics.value.details, ')');
    
    const momentumScore = getMetricScore(stock, 'momentum');
    console.log(`- Momentum score: ${momentumScore} (Raw data:`, stock.metrics.momentum.details, ')');
    
    const stockMetricScore = {
      performance: performanceScore,
      stability: stabilityScore,
      value: valueScore,
      momentum: momentumScore
    };
    console.log(`Stock ${stock.ticker} overall scores:`, stockMetricScore);
    
    // Current metrics - use 0 for empty portfolio (0-100 scale)
    const currentMetrics = {
      performance: hasExistingHoldings ? portfolioMetrics.performance : 0,
      stability: hasExistingHoldings ? portfolioMetrics.stability : 0,
      value: hasExistingHoldings ? portfolioMetrics.value : 0,
      momentum: hasExistingHoldings ? portfolioMetrics.momentum : 0,
      qualityScore: hasExistingHoldings ? portfolioMetrics.qualityScore : 0
    };
    console.log('Current portfolio metrics:', currentMetrics);
    
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
    
    // Calculate new metrics with debugging
    console.log('Calculating new portfolio metrics with this stock added:');
    
    let newPerformance, newStability, newValue, newMomentum, newQualityScore;
    
    if (hasExistingHoldings) {
      console.log('Adding to existing portfolio - calculating weighted averages');
      newPerformance = calculateNewMetricScore('performance', simulatedHoldings, stock);
      newStability = calculateNewMetricScore('stability', simulatedHoldings, stock);
      newValue = calculateNewMetricScore('value', simulatedHoldings, stock);
      newMomentum = calculateNewMetricScore('momentum', simulatedHoldings, stock);
      
      // Calculate new quality score for simulated portfolio
      newQualityScore = calculatePortfolioQuality(simulatedHoldings);
    } else {
      console.log('First investment - using stock metrics directly');
      newPerformance = stockMetricScore.performance;
      newStability = stockMetricScore.stability;
      newValue = stockMetricScore.value;
      newMomentum = stockMetricScore.momentum;
      // For first investment, calculate quality score from stock metrics
      newQualityScore = Math.round((performanceScore + stabilityScore + valueScore + momentumScore) / 4);
    }
    
    console.log('New portfolio metrics calculated:');
    console.log(`- Performance: ${newPerformance}`);
    console.log(`- Stability: ${newStability}`);
    console.log(`- Value: ${newValue}`);
    console.log(`- Momentum: ${newMomentum}`);
    console.log(`- Quality Score: ${newQualityScore}`);
    
    const newMetrics = {
      performance: newPerformance,
      stability: newStability,
      value: newValue,
      momentum: newMomentum,
      qualityScore: newQualityScore
    };
    
    // Calculate industry allocation (current and new)
    const currentTotal = Math.max(portfolioValue, 0.01); // Avoid division by zero
    const newTotal = currentTotal + amount;
    
    console.log(`Portfolio value: Current $${currentTotal} → New $${newTotal}`);
    
    const industries = new Set<string>();
    holdings.forEach(h => industries.add(h.stock.industry));
    industries.add(stock.industry);
    
    console.log('Industries in portfolio:', Array.from(industries));
    
    const industryAllocation: Record<string, {current: number, new: number}> = {};
    
    // Initialize with zeros
    Array.from(industries).forEach(industry => {
      industryAllocation[industry] = { current: 0, new: 0 };
    });
    
    // For first investment, set 100% allocation to new stock's industry
    if (!hasExistingHoldings) {
      console.log(`First investment: Setting 100% allocation to ${stock.industry}`);
      industryAllocation[stock.industry].new = 100;
    } else {
      console.log('Calculating industry allocations:');
      
      // Calculate current allocation
      holdings.forEach(holding => {
        const industry = holding.stock.industry;
        const allocation = (holding.value / currentTotal) * 100;
        industryAllocation[industry].current += allocation;
        console.log(`Current: ${industry} = $${holding.value.toFixed(2)} (${allocation.toFixed(1)}%)`);
      });
      
      // Calculate new allocation
      simulatedHoldings.forEach(holding => {
        const industry = holding.stock.industry;
        const allocation = (holding.value / newTotal) * 100;
        industryAllocation[industry].new += allocation;
        console.log(`New: ${industry} = $${holding.value.toFixed(2)} (${allocation.toFixed(1)}%)`);
      });
    }
    
    // Calculate impact - ensure small changes for first investment
    const performanceImpact = parseFloat((newMetrics.performance - currentMetrics.performance).toFixed(1));
    const stabilityImpact = parseFloat((newMetrics.stability - currentMetrics.stability).toFixed(1));
    const valueImpact = parseFloat((newMetrics.value - currentMetrics.value).toFixed(1));
    const momentumImpact = parseFloat((newMetrics.momentum - currentMetrics.momentum).toFixed(1));
    const qualityScoreImpact = parseFloat((newMetrics.qualityScore - currentMetrics.qualityScore).toFixed(1));
    
    console.log('Impact on metrics:');
    console.log(`- Performance: ${currentMetrics.performance} → ${newMetrics.performance} (${performanceImpact > 0 ? '+' : ''}${performanceImpact})`);
    console.log(`- Stability: ${currentMetrics.stability} → ${newMetrics.stability} (${stabilityImpact > 0 ? '+' : ''}${stabilityImpact})`);
    console.log(`- Value: ${currentMetrics.value} → ${newMetrics.value} (${valueImpact > 0 ? '+' : ''}${valueImpact})`);
    console.log(`- Momentum: ${currentMetrics.momentum} → ${newMetrics.momentum} (${momentumImpact > 0 ? '+' : ''}${momentumImpact})`);
    console.log(`- Quality Score: ${currentMetrics.qualityScore} → ${newMetrics.qualityScore} (${qualityScoreImpact > 0 ? '+' : ''}${qualityScoreImpact})`);
    
    const impact = {
      performance: performanceImpact,
      stability: stabilityImpact,
      value: valueImpact,
      momentum: momentumImpact,
      qualityScore: qualityScoreImpact
    };
    
    console.log('Final industry allocation:', industryAllocation);
    console.log('---- END CALCULATION ----');
    
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
    console.log(`\nCalculating weighted ${metricName} score for portfolio with ${simulatedHoldings.length} holdings:`);
    
    // Use the advanced scoring system for combined portfolio scores
    const score = calculatePortfolioScore(simulatedHoldings, metricName);
    
    console.log(`Advanced portfolio ${metricName} score: ${score}`);
    
    return score;
  }
  
  // Context value
  const contextValue: PortfolioContextProps = {
    cash,
    holdings,
    portfolioValue,
    totalValue,
    version, // Include version counter in context
    lastUpdated, // Include timestamp
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