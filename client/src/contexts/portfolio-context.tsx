import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { StockData, PerformanceDetails, StabilityDetails, ValueDetails, MomentumDetails } from '@/lib/stock-data';
import { useToast } from '@/hooks/use-toast';
import { getIndustryAverages } from '@/lib/industry-data';

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
  
  // Calculate individual portfolio metric score using the 0-100 scale
  function calculatePortfolioMetric(metricName: "performance" | "stability" | "value" | "momentum"): number {
    if (holdings.length === 0) return 0; // Empty portfolio starts at 0
    
    let weightedScore = 0;
    let totalWeight = 0;
    
    holdings.forEach(holding => {
      const metricScore = getMetricScore(holding.stock, metricName);
      const weight = holding.value; // Weight by value in portfolio
      
      weightedScore += metricScore * weight;
      totalWeight += weight;
    });
    
    return totalWeight > 0 ? parseFloat((weightedScore / totalWeight).toFixed(1)) : 0;
  }
  
  // Helper to get numeric score from metric on a 0-100 scale
  function getMetricScore(stock: StockData, metricName: string): number {
    console.log(`\nCalculating ${metricName} score for ${stock.ticker}:`);
    
    const metricData = stock.metrics[metricName as keyof typeof stock.metrics];
    const metricValue = metricData.value;
    const metricColor = metricData.color;
    console.log(`- Base metric value: "${metricValue}" (color: ${metricColor})`);
    
    const industryAvgs = getIndustryAverages(stock.industry);
    console.log(`- Industry: ${stock.industry}`);
    console.log(`- Industry averages for ${metricName}:`, industryAvgs[metricName as keyof typeof industryAvgs]);
    
    // Get detailed metrics data with proper typing
    let detailedMetrics: PerformanceDetails | StabilityDetails | ValueDetails | MomentumDetails;
    switch(metricName) {
      case 'performance':
        detailedMetrics = stock.metrics.performance.details as PerformanceDetails;
        console.log(`- Performance details:`, detailedMetrics);
        break;
      case 'stability':
        detailedMetrics = stock.metrics.stability.details as StabilityDetails;
        console.log(`- Stability details:`, detailedMetrics);
        break;
      case 'value':
        detailedMetrics = stock.metrics.value.details as ValueDetails;
        console.log(`- Value details:`, detailedMetrics);
        break;
      case 'momentum':
        detailedMetrics = stock.metrics.momentum.details as MomentumDetails;
        console.log(`- Momentum details:`, detailedMetrics);
        break;
      default:
        console.log(`- Unknown metric type: ${metricName}`);
        return 0; // Default to 0 score if we can't determine the metric type
    }
    
    // Calculate detailed score based on industry comparisons
    // This follows the logic from category-scoring.ts
    let subScores: number[] = [];
    let totalWeight = 0;
    let weightedScore = 0;
    
    switch(metricName) {
      case 'performance': {
        const perfMetrics = detailedMetrics as PerformanceDetails;
        
        // Revenue Growth (40% weight, higher is better)
        const revenueGrowthScore = Math.min(100, Math.max(0, 
          (perfMetrics.revenueGrowth / industryAvgs.performance.revenueGrowth) * 100));
        weightedScore += revenueGrowthScore * 0.4;
        totalWeight += 0.4;
        
        // Profit Margin (30% weight, higher is better)
        const profitMarginScore = Math.min(100, Math.max(0, 
          (perfMetrics.profitMargin / industryAvgs.performance.profitMargin) * 100));
        weightedScore += profitMarginScore * 0.3;
        totalWeight += 0.3;
        
        // Return on Capital (30% weight, higher is better)
        const rocScore = Math.min(100, Math.max(0, 
          (perfMetrics.returnOnCapital / industryAvgs.performance.returnOnCapital) * 100));
        weightedScore += rocScore * 0.3;
        totalWeight += 0.3;
        break;
      }
      
      case 'value': {
        const valueMetrics = detailedMetrics as ValueDetails;
        
        // P/E Ratio (50% weight, lower is better)
        const peScore = Math.min(100, Math.max(0, 
          100 - ((valueMetrics.peRatio / industryAvgs.value.peRatio) * 50)));
        weightedScore += peScore * 0.5;
        totalWeight += 0.5;
        
        // P/B Ratio (30% weight, lower is better)
        const pbScore = Math.min(100, Math.max(0, 
          100 - ((valueMetrics.pbRatio / industryAvgs.value.pbRatio) * 50)));
        weightedScore += pbScore * 0.3;
        totalWeight += 0.3;
        
        // Dividend Yield (20% weight, higher is better)
        let dividendYield = valueMetrics.dividendYield;
        if (typeof dividendYield === 'string') {
          dividendYield = parseFloat(dividendYield.replace('%', ''));
        }
        
        if (!isNaN(dividendYield)) {
          const divYieldScore = Math.min(100, Math.max(0, 
            (dividendYield / industryAvgs.value.dividendYield) * 100));
          weightedScore += divYieldScore * 0.2;
          totalWeight += 0.2;
        }
        break;
      }
      
      case 'stability': {
        const stabilityMetrics = detailedMetrics as StabilityDetails;
        
        // Volatility (50% weight, lower is better)
        const volatilityScore = Math.min(100, Math.max(0, 
          100 - ((stabilityMetrics.volatility / industryAvgs.stability.volatility) * 50)));
        weightedScore += volatilityScore * 0.5;
        totalWeight += 0.5;
        
        // Beta (30% weight, best when close to 1)
        const betaScore = Math.min(100, Math.max(0, 
          100 - (Math.abs(1 - stabilityMetrics.beta) * 50)));
        weightedScore += betaScore * 0.3;
        totalWeight += 0.3;
        
        // Dividend Consistency (20% weight)
        let divConsistencyScore = 0;
        switch(stabilityMetrics.dividendConsistency) {
          case "High":
          case "Good":
            divConsistencyScore = 90;
            break;
          case "Medium":
            divConsistencyScore = 60;
            break;
          case "Low":
          case "Poor":
            divConsistencyScore = 30;
            break;
          default:
            divConsistencyScore = 0;
        }
        weightedScore += divConsistencyScore * 0.2;
        totalWeight += 0.2;
        break;
      }
      
      case 'momentum': {
        const momentumMetrics = detailedMetrics as MomentumDetails;
        
        // 3-Month Return (50% weight, higher is better)
        const threeMonthScore = Math.min(100, Math.max(0, 
          (momentumMetrics.threeMonthReturn / industryAvgs.momentum.threeMonthReturn) * 100));
        weightedScore += threeMonthScore * 0.5;
        totalWeight += 0.5;
        
        // Relative Performance (30% weight, higher is better)
        const relPerfScore = Math.min(100, Math.max(0, 
          50 + (momentumMetrics.relativePerformance * 5)));
        weightedScore += relPerfScore * 0.3;
        totalWeight += 0.3;
        
        // RSI (20% weight, where a value closer to 50 is best)
        const rsiScore = Math.min(100, Math.max(0, 
          100 - (Math.abs(50 - momentumMetrics.rsi) * 2)));
        weightedScore += rsiScore * 0.2;
        totalWeight += 0.2;
        break;
      }
      
      default: {
        // Convert string rating to numeric score as fallback
        let stringScore = 0;
        switch (metricValue) {
          case "Strong":
          case "High":
            stringScore = 90;
            break;
          case "Good":
            stringScore = 70;
            break;
          case "Fair":
          case "Average":
            stringScore = 50;
            break;
          case "Weak":
          case "Poor":
          case "Unstable":
            stringScore = 30;
            break;
          default:
            stringScore = 0;
        }
        
        return stringScore;
      }
    }
    
    // Normalize the score if we have weights
    const finalScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
    console.log(`- Final ${metricName} score (0-100 scale): ${finalScore}`);
    
    // Log individual sub-scores for this metric
    console.log(`- ${metricName} calculation summary:`);
    console.log(`  Total weighted score: ${weightedScore.toFixed(1)}`);
    console.log(`  Total weight: ${totalWeight}`);
    console.log(`  Final normalized score: ${finalScore.toFixed(1)}`);
    
    return finalScore;
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
      momentum: hasExistingHoldings ? portfolioMetrics.momentum : 0
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
    
    let newPerformance, newStability, newValue, newMomentum;
    
    if (hasExistingHoldings) {
      console.log('Adding to existing portfolio - calculating weighted averages');
      newPerformance = calculateNewMetricScore('performance', simulatedHoldings, stock);
      newStability = calculateNewMetricScore('stability', simulatedHoldings, stock);
      newValue = calculateNewMetricScore('value', simulatedHoldings, stock);
      newMomentum = calculateNewMetricScore('momentum', simulatedHoldings, stock);
    } else {
      console.log('First investment - using stock metrics directly');
      newPerformance = stockMetricScore.performance;
      newStability = stockMetricScore.stability;
      newValue = stockMetricScore.value;
      newMomentum = stockMetricScore.momentum;
    }
    
    console.log('New portfolio metrics calculated:');
    console.log(`- Performance: ${newPerformance}`);
    console.log(`- Stability: ${newStability}`);
    console.log(`- Value: ${newValue}`);
    console.log(`- Momentum: ${newMomentum}`);
    
    const newMetrics = {
      performance: newPerformance,
      stability: newStability,
      value: newValue,
      momentum: newMomentum
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
    
    console.log('Impact on metrics:');
    console.log(`- Performance: ${currentMetrics.performance} → ${newMetrics.performance} (${performanceImpact > 0 ? '+' : ''}${performanceImpact})`);
    console.log(`- Stability: ${currentMetrics.stability} → ${newMetrics.stability} (${stabilityImpact > 0 ? '+' : ''}${stabilityImpact})`);
    console.log(`- Value: ${currentMetrics.value} → ${newMetrics.value} (${valueImpact > 0 ? '+' : ''}${valueImpact})`);
    console.log(`- Momentum: ${currentMetrics.momentum} → ${newMetrics.momentum} (${momentumImpact > 0 ? '+' : ''}${momentumImpact})`);
    
    const impact = {
      performance: performanceImpact,
      stability: stabilityImpact,
      value: valueImpact,
      momentum: momentumImpact
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
    
    if (simulatedHoldings.length === 0) {
      const directScore = getMetricScore(newStock, metricName);
      console.log(`Empty portfolio - returning direct score for ${newStock.ticker}: ${directScore}`);
      return directScore;
    }
    
    let weightedScore = 0;
    let totalWeight = 0;
    
    console.log(`${metricName.charAt(0).toUpperCase() + metricName.slice(1)} calculation:`);
    simulatedHoldings.forEach(holding => {
      const metricScore = getMetricScore(holding.stock, metricName);
      const weight = holding.value;
      
      const contributionToTotal = metricScore * weight;
      weightedScore += contributionToTotal;
      totalWeight += weight;
      
      console.log(`- ${holding.stock.ticker}: score ${metricScore} × weight $${weight.toFixed(2)} = ${contributionToTotal.toFixed(1)}`);
    });
    
    const finalScore = totalWeight > 0 ? parseFloat((weightedScore / totalWeight).toFixed(1)) : 0;
    console.log(`Total weighted score: ${weightedScore.toFixed(1)} / total weight $${totalWeight.toFixed(2)} = ${finalScore}`);
    
    return finalScore;
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