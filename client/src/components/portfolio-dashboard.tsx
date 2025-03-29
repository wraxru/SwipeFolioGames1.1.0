import React, { useMemo } from 'react'; // Removed useState, useEffect, useCallback, useRef
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Wallet, TrendingUp, Clock, DollarSign, PieChart } from 'lucide-react';
import { Progress } from './ui/progress'; // Assuming this path is correct
import { usePortfolio, PortfolioHolding } from '@/contexts/portfolio-context'; // Assuming this path is correct

// Helper component for metrics
function MetricItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
      <p className="text-sm text-slate-500 mb-1.5">{label}</p>
      <div className="flex items-center">
        <div className={`h-3 w-3 rounded-full ${color} mr-2`}></div>
        <p className="font-bold text-lg">{value}</p>
      </div>
      <Progress value={value} className="h-2 mt-2" />
    </div>
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
    return holdings.reduce((total, h) => {
      // Parse the oneYearReturn string (remove % sign and convert to number)
      const oneYearReturnPercent = 
        typeof h.stock.oneYearReturn === 'number' ? h.stock.oneYearReturn :
        typeof h.stock.oneYearReturn === 'string' ? parseFloat(h.stock.oneYearReturn.replace('%', '')) : 
        0;
      
      // Base projection on current value or purchase price? Let's use purchase price as in original code
      const stockInvestedValue = h.shares * h.purchasePrice;
      const stockReturn = stockInvestedValue * (oneYearReturnPercent / 100);
      
      if (!isNaN(stockReturn)) {
        return total + stockReturn;
      }
      return total;
    }, 0);
  }, [holdings]); // Recalculate only if holdings array reference changes

  const projectedReturnPercent = useMemo(() => {
      console.log("Dashboard: Recalculating projectedReturnPercent");
      // Base percentage on current portfolio value
      return portfolioValue > 0.01 // Avoid division by zero or near-zero
          ? (projectedReturn / portfolioValue) * 100
          : 0;
  }, [projectedReturn, portfolioValue]);


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

      {/* Portfolio Summary Card */}
      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <div>
            <DollarSign className="w-4 h-4 text-blue-500 inline mr-1" />
            {/* Use calculated totalValue */}
            <span className="text-xl font-bold text-slate-800">{totalValue.toFixed(2)}</span>
            <span className="ml-1 text-xs text-slate-500">total value</span>
          </div>

          <div className="flex items-center">
            {holdings.length > 0 && (
              <div className={`text-sm font-semibold flex items-center mr-3 ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalReturn >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-0.5" />
                )}
                {/* Use calculated totalReturn and totalReturnPercent */}
                ${Math.abs(totalReturn).toFixed(2)} ({totalReturn >= 0 ? '+' : ''}{totalReturnPercent.toFixed(1)}%)
              </div>
            )}
            {/* Quality Score Circle */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center bg-indigo-600 text-white rounded-full h-12 w-12 shadow-md">
                <span className="text-base font-bold">{portfolioMetrics.qualityScore || 0}</span>
              </div>
              <span className="text-xs text-indigo-600 font-medium mt-1">Quality</span>
            </div>
          </div>
        </div>

        {holdings.length > 0 && (
          <div className="flex items-center text-sm">
            <Clock className="w-3 h-3 mr-1 text-blue-500" />
            <span className="text-xs text-slate-600">Projected 1-year return: </span>
            {/* Use calculated projectedReturn and projectedReturnPercent */}
            <span className={`ml-1 text-xs font-medium ${projectedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {projectedReturn >= 0 ? '+' : ''}{projectedReturn.toFixed(2)} ({projectedReturn >= 0 ? '+' : ''}{projectedReturnPercent.toFixed(1)}%)
            </span>
          </div>
        )}
      </div>

      {/* Portfolio Metrics */}
      {holdings.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Use direct performanceMetric */}
          <MetricItem
            label="Performance"
            value={performanceMetric}
            color="bg-blue-500"
          />
          {/* Use direct stabilityMetric */}
          <MetricItem
            label="Stability"
            value={stabilityMetric}
            color="bg-purple-500"
          />
        </div>
      )}

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
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-700">Top Holdings</h4>
            <PieChart className="h-3 w-3 text-slate-400" />
          </div>

          {/* Map over sortedHoldings */}
          {sortedHoldings.map(holding => {
            // Calculate return percentage for this specific holding
            const returnPercent = holding.purchasePrice > 0 // Avoid division by zero
                ? ((holding.stock.price - holding.purchasePrice) / holding.purchasePrice) * 100
                : 0;

            return (
              // Key should be stable and unique - ticker is usually good if unique per portfolio
              <div key={holding.stock.ticker} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded-md text-sm">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center mr-2 text-xs font-medium">
                    {holding.stock.ticker.substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{holding.stock.ticker}</p>
                    <p className="text-xs text-slate-500">{holding.shares.toFixed(4)} shares</p>
                  </div>
                </div>
                <div className="text-right">
                   {/* Use holding.value calculated in useMemo */}
                  <p className="font-medium">${holding.value.toFixed(2)}</p>
                  <p className={`text-xs ${returnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {returnPercent >= 0 ? '+' : ''}{returnPercent.toFixed(1)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}