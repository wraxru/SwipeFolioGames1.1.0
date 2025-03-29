import React, { useMemo } from 'react'; // Removed useState, useEffect, useCallback, useRef
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Wallet, TrendingUp, Clock, DollarSign, PieChart } from 'lucide-react';
import { Progress } from './ui/progress'; // Assuming this path is correct
import { usePortfolio, PortfolioHolding } from '@/contexts/portfolio-context'; // Assuming this path is correct

// Helper component for metrics with animated progress
function MetricItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <motion.div 
      className="bg-white rounded-lg p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <div className={`h-2.5 w-2.5 rounded-full ${color}`}></div>
      </div>
      <div className="flex items-baseline">
        <p className="font-bold text-2xl text-slate-800">{value}</p>
        <span className="ml-1 text-xs text-slate-500">/100</span>
      </div>
      <Progress 
        value={value} 
        className={`h-2.5 mt-2.5 ${
          color === 'bg-blue-500' ? 'bg-blue-100' : 'bg-purple-100'
        }`} 
      />
    </motion.div>
  );
}


export default function PortfolioDashboard() {
  // 1. Get LIVE data directly from the context
  const portfolio = usePortfolio();
  const {
    cash,
    holdings,
    portfolioMetrics,
    lastUpdated, // Use the context's lastUpdated
    // version // You might not need version directly here anymore
  } = portfolio;

  // 2. Calculate ALL derived values directly within the component body.
  // Use useMemo for potentially expensive calculations if needed, though often not necessary
  // unless profiling shows performance issues.

  const portfolioValue = useMemo(() => {
    console.log("Dashboard: Recalculating portfolioValue");
    return holdings.reduce((total, h) => total + (h.shares * h.stock.price), 0);
  }, [holdings]); // Recalculate only if holdings array reference changes

  const totalValue = useMemo(() => {
    console.log("Dashboard: Recalculating totalValue");
    return cash + portfolioValue;
  }, [cash, portfolioValue]); // Recalculate if cash or portfolioValue changes

  const totalReturn = useMemo(() => {
    console.log("Dashboard: Recalculating totalReturn");
    return holdings.reduce((total, h) => {
      const currentValue = h.shares * h.stock.price;
      const investedValue = h.shares * h.purchasePrice;
      // Add a check for valid numbers if necessary
      if (!isNaN(currentValue) && !isNaN(investedValue)) {
          return total + (currentValue - investedValue);
      }
      return total;
    }, 0);
  }, [holdings]); // Recalculate only if holdings array reference changes

  const totalInvested = useMemo(() => {
    console.log("Dashboard: Recalculating totalInvested");
    // Calculate the total amount initially invested
     return holdings.reduce((total, h) => total + (h.shares * h.purchasePrice), 0);
  }, [holdings]);

  const totalReturnPercent = useMemo(() => {
    console.log("Dashboard: Recalculating totalReturnPercent");
    // Base the percentage on the total amount invested for a clearer picture
    return totalInvested > 0.01 // Avoid division by zero or near-zero
      ? (totalReturn / totalInvested) * 100
      : 0;
  }, [totalReturn, totalInvested]);


  const projectedReturn = useMemo(() => {
    console.log("Dashboard: Recalculating projectedReturn");
    
    // Calculate the weighted 1-year return based on the amount invested in each stock
    let totalWeightedReturnDollars = 0;
    let totalInvestedValue = 0;
    
    holdings.forEach(h => {
      // Parse the oneYearReturn string (remove % sign and convert to number)
      const oneYearReturnPercent = 
        typeof h.stock.oneYearReturn === 'number' ? h.stock.oneYearReturn :
        typeof h.stock.oneYearReturn === 'string' ? parseFloat(h.stock.oneYearReturn.replace('%', '')) : 
        0;
      
      // For each holding, use the original invested amount (not current value)
      const investedAmount = h.shares * h.purchasePrice;
      totalInvestedValue += investedAmount;
      
      // Calculate the projected return for this holding in dollars
      const holdingProjectedReturn = investedAmount * (oneYearReturnPercent / 100);
      totalWeightedReturnDollars += holdingProjectedReturn;
    });
    
    // Return the total projected return in dollars
    return totalWeightedReturnDollars;
  }, [holdings]); // Recalculate only when holdings change

  const projectedReturnPercent = useMemo(() => {
    console.log("Dashboard: Recalculating projectedReturnPercent");
    
    // Calculate the percentage based on total invested amount
    // This provides the true aggregate ROI percentage on invested money
    const totalInvested = holdings.reduce((sum, h) => sum + (h.shares * h.purchasePrice), 0);
    
    return totalInvested > 0.01 // Avoid division by zero or near-zero
      ? (projectedReturn / totalInvested) * 100
      : 0;
  }, [projectedReturn, holdings]);


  const allocationPercentage = useMemo(() => {
    console.log("Dashboard: Recalculating allocationPercentage");
    return Math.round((portfolioValue / Math.max(0.01, totalValue)) * 100);
  }, [portfolioValue, totalValue]); // Recalculate if these change

  // Get metrics directly
  const performanceMetric = portfolioMetrics.performance;
  const stabilityMetric = portfolioMetrics.stability;

  // Prepare sorted holdings for the "Top Holdings" section
  const sortedHoldings = useMemo(() => {
      console.log("Dashboard: Recalculating sortedHoldings");
      // Ensure holding.value is calculated correctly if not already present
      const holdingsWithValue = holdings.map(h => ({
        ...h,
        value: h.shares * h.stock.price // Calculate current value here
      }));
      return [...holdingsWithValue] // Create a new array reference for sorting
          .sort((a, b) => b.value - a.value)
          .slice(0, 2);
  }, [holdings]); // Recalculate only if holdings array reference changes


  // 3. Render using the direct context data and calculated values
  // Removed the `key={renderKey}` - not needed anymore.
  // React will re-render when the `portfolio` context value changes.

  console.log("PortfolioDashboard rendering. Total Value:", totalValue.toFixed(2), "Holdings Count:", holdings.length);


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="portfolio-dashboard rounded-xl p-4 mb-6 border border-slate-200 shadow-md bg-white"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="flex items-center text-slate-800 font-semibold">
          <Wallet className="w-4 h-4 mr-1.5 text-blue-500" />
          Your Portfolio
        </h3>
        <div className="flex items-center text-sm text-slate-500">
          <TrendingUp className={`w-3.5 h-3.5 mr-1 ${portfolioValue > 0 ? 'text-green-500' : 'text-slate-400'}`} />
          {/* Use lastUpdated from context */}
          <span>Updated {new Date(lastUpdated).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Portfolio Summary Card - Updated Format with Projected Value */}
      <div className="bg-white rounded-xl shadow-md border border-slate-100 mb-4 overflow-hidden">
        {/* Top Metrics Row - Clear Icon-Text Pairing */}
        <div className="grid grid-cols-2 gap-0">
          {/* Left Side - Projected 1-Year Value */}
          <div className="p-4 border-r border-slate-100 flex flex-col justify-center items-center">
            <div className="flex items-center mb-1">
              <TrendingUp className="w-4 h-4 text-blue-500 mr-1.5" />
              <span className="text-sm font-medium text-slate-500">Projected Value</span>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* Calculate projected future value: currentValue + projectedReturn */}
              <span className="text-2xl font-bold text-slate-800">
                ${(totalValue + projectedReturn).toFixed(2)}
              </span>
              
              <div className={`flex items-center justify-center text-xs mt-1 ${projectedReturn >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {projectedReturn >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-0.5" />
                )}
                <span>{projectedReturn >= 0 ? '+' : ''}{projectedReturnPercent.toFixed(1)}%</span>
              </div>
            </motion.div>
          </div>
          
          {/* Right Side - Quality Score Circle */}
          <div className="p-4 flex justify-center items-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.3
              }}
              className="flex flex-col items-center justify-center"
            >
              <div className="relative flex items-center justify-center">
                <svg className="w-16 h-16">
                  <circle
                    className="text-gray-200"
                    strokeWidth="5"
                    stroke="currentColor"
                    fill="transparent"
                    r="25"
                    cx="32"
                    cy="32"
                  />
                  <circle
                    className="text-blue-600"
                    strokeWidth="5"
                    strokeDasharray={2 * Math.PI * 25}
                    strokeDashoffset={2 * Math.PI * 25 * (1 - (portfolioMetrics.qualityScore || 0) / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="25"
                    cx="32"
                    cy="32"
                  />
                </svg>
                <span className="absolute font-bold text-lg text-slate-800">{portfolioMetrics.qualityScore || 0}</span>
              </div>
              <span className="text-xs font-medium text-blue-600 mt-1">Quality Score</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Allocation */}
      <div className="mb-1 flex justify-between items-center">
        <span className="text-sm text-slate-600 font-medium">Portfolio allocation</span>
        {/* Use calculated allocationPercentage */}
        <span className="text-sm font-medium text-slate-700">{allocationPercentage}%</span>
      </div>

      {/* Use calculated allocationPercentage */}
      <Progress
        value={allocationPercentage}
        className="h-2 mb-3"
      />

      <div className="flex justify-between text-sm">
        <div className="flex flex-col items-start">
          <span className="text-xs text-slate-500">Invested</span>
           {/* Use calculated portfolioValue */}
          <span className="font-semibold text-slate-700">${portfolioValue.toFixed(2)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-500">Available</span>
           {/* Use direct cash from context */}
          <span className="font-semibold text-emerald-600">${cash.toFixed(2)}</span>
        </div>
      </div>

      {/* Top Holdings */}
      {/* Use the pre-calculated sortedHoldings */}
      {sortedHoldings.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center">
              <PieChart className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
              Top Holdings
            </h4>
          </div>

          <div className="space-y-2">
            {/* Map over sortedHoldings */}
            {sortedHoldings.map((holding, index) => {
              // Calculate return percentage for this specific holding
              const returnPercent = holding.purchasePrice > 0 // Avoid division by zero
                  ? ((holding.stock.price - holding.purchasePrice) / holding.purchasePrice) * 100
                  : 0;

              return (
                // Key should be stable and unique - ticker is usually good if unique per portfolio
                <motion.div 
                  key={holding.stock.ticker} 
                  className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                >
                  <div className="flex items-center">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center mr-3 text-xs font-bold text-white shadow-sm">
                      {holding.stock.ticker.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{holding.stock.name || holding.stock.ticker}</p>
                      <div className="flex items-center text-xs text-slate-500">
                        <span>{holding.shares.toFixed(2)} shares</span>
                        <span className="mx-1">•</span>
                        <span>${holding.purchasePrice.toFixed(2)}/share</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">${holding.value.toFixed(2)}</p>
                    <div className={`flex items-center text-xs justify-end ${returnPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {returnPercent >= 0 ? (
                        <ArrowUp className="h-3 w-3 mr-0.5" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-0.5" />
                      )}
                      <span>{returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(1)}%</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}