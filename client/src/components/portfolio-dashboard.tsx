import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Wallet, TrendingUp, Clock, DollarSign, PieChart } from 'lucide-react';
import { Progress } from './ui/progress';
import { usePortfolio } from '@/contexts/portfolio-context';

export default function PortfolioDashboard() {
  // Force component to update on any portfolio changes
  const [forceUpdateTime, setForceUpdateTime] = useState(Date.now());
  const [lastValues, setLastValues] = useState({ invested: 0, available: 0 });
  const portfolio = usePortfolio();
  
  // Create stringified portfolio state to detect ALL changes
  const portfolioState = JSON.stringify({
    holdings: portfolio.holdings,
    cash: portfolio.cash,
    portfolioValue: portfolio.portfolioValue,
    totalValue: portfolio.totalValue,
    version: portfolio.version,
    lastUpdated: portfolio.lastUpdated
  });
  
  // Update component whenever portfolio changes
  useEffect(() => {
    console.log("Portfolio dashboard - detected portfolio change:", {
      holdings: portfolio.holdings.length,
      portfolioValue: portfolio.portfolioValue,
      cash: portfolio.cash,
      version: portfolio.version
    });
    
    // Add delayed force update to ensure state propagation
    const timer = setTimeout(() => {
      setForceUpdateTime(Date.now());
      setLastValues({
        invested: portfolio.portfolioValue,
        available: portfolio.cash
      });
      console.log("Portfolio dashboard updated after delay:", {
        timestamp: new Date().toISOString(),
        holdings: portfolio.holdings.length,
        portfolioValue: portfolio.portfolioValue,
        totalValue: portfolio.totalValue,
        cash: portfolio.cash,
        version: portfolio.version,
        lastUpdated: new Date(portfolio.lastUpdated).toISOString()
      });
    }, 200); // Increased delay to ensure context is fully updated
    
    return () => clearTimeout(timer);
  }, [portfolioState]); // Using stringified state to detect ANY changes
  
  // Calculate performance values exactly like portfolio page
  const totalReturn = portfolio.holdings.reduce((total, h) => {
    const currentValue = h.shares * h.stock.price;
    const investedValue = h.shares * h.purchasePrice;
    return total + (currentValue - investedValue);
  }, 0);
  
  const totalReturnPercent = portfolio.holdings.length > 0 
    ? (totalReturn / (portfolio.portfolioValue - totalReturn)) * 100 
    : 0;
    
  // Calculate projected 1-year return based on holdings
  const projectedReturn = portfolio.holdings.reduce((total, h) => {
    // Convert to number or use 0 if undefined
    const oneYearReturnPercent = typeof h.stock.oneYearReturn === 'number' ? h.stock.oneYearReturn : 0;
    const stockValue = h.shares * h.purchasePrice;
    const stockReturn = stockValue * (oneYearReturnPercent / 100);
    return total + stockReturn;
  }, 0);
  
  const projectedReturnPercent = portfolio.holdings.length > 0 && portfolio.portfolioValue > 0
    ? (projectedReturn / portfolio.portfolioValue) * 100
    : 0;
  
  const { cash, portfolioValue, totalValue } = portfolio;
  const allocationPercentage = Math.round((portfolioValue / totalValue) * 100);
  
  return (
    <motion.div 
      key={forceUpdateTime} // Add key with timestamp to force complete re-render
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
          <span>Updated {new Date(portfolio.lastUpdated).toLocaleTimeString()}</span>
        </div>
      </div>
      
      {/* Portfolio Summary Card - Styled like portfolio page */}
      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <div>
            <DollarSign className="w-4 h-4 text-blue-500 inline mr-1" />
            <span className="text-xl font-bold text-slate-800">{totalValue.toFixed(2)}</span>
            <span className="ml-1 text-xs text-slate-500">total value</span>
          </div>
          
          {portfolio.holdings.length > 0 && (
            <div className={`text-sm font-semibold flex items-center ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalReturn >= 0 ? (
                <ArrowUp className="h-3 w-3 mr-0.5" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-0.5" />
              )}
              ${Math.abs(totalReturn).toFixed(2)} ({totalReturn >= 0 ? '+' : ''}{totalReturnPercent.toFixed(1)}%)
            </div>
          )}
        </div>
        
        {portfolio.holdings.length > 0 && (
          <div className="flex items-center text-sm">
            <Clock className="w-3 h-3 mr-1 text-blue-500" />
            <span className="text-xs text-slate-600">Projected 1-year return: </span>
            <span className={`ml-1 text-xs font-medium ${projectedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {projectedReturn >= 0 ? '+' : ''}{projectedReturn.toFixed(2)} ({projectedReturn >= 0 ? '+' : ''}{projectedReturnPercent.toFixed(1)}%)
            </span>
          </div>
        )}
      </div>
      
      {/* Portfolio Metrics - Matching the portfolio page styling */}
      {portfolio.holdings.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <MetricItem 
            label="Performance" 
            value={portfolio.portfolioMetrics.performance} 
            color="bg-blue-500" 
          />
          <MetricItem 
            label="Stability" 
            value={portfolio.portfolioMetrics.stability} 
            color="bg-purple-500" 
          />
        </div>
      )}
      
      <div className="mb-1 flex justify-between items-center">
        <span className="text-sm text-slate-600 font-medium">Portfolio allocation</span>
        <span className="text-sm font-medium text-slate-700">{allocationPercentage}%</span>
      </div>
      
      <Progress 
        value={allocationPercentage} 
        className="h-2 mb-3"
      />
      
      <div className="flex justify-between text-sm">
        <div className="flex flex-col items-start">
          <span className="text-xs text-slate-500">Invested</span>
          <span className="font-semibold text-slate-700">${portfolioValue.toFixed(2)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-500">Available</span>
          <span className="font-semibold text-emerald-600">${cash.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Top Holdings - Quick summary */}
      {portfolio.holdings.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-700">Top Holdings</h4>
            <PieChart className="h-3 w-3 text-slate-400" />
          </div>
          
          {[...portfolio.holdings]
            .sort((a, b) => b.value - a.value)
            .slice(0, 2)
            .map(holding => {
              const returnPercent = ((holding.stock.price - holding.purchasePrice) / holding.purchasePrice) * 100;
              
              return (
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

// Helper component for metrics
function MetricItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-2 border border-slate-100">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <div className="flex items-center">
        <div className={`h-2 w-2 rounded-full ${color} mr-2`}></div>
        <p className="font-bold text-base">{value}</p>
      </div>
      <Progress value={value} className="h-1 mt-1" />
    </div>
  );
}