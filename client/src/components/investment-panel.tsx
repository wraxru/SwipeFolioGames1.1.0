import { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { Progress } from './ui/progress';
import { PortfolioContext } from '@/contexts/portfolio-context';

export default function InvestmentPanel() {
  // Force component to update on any portfolio change
  const [_, forceUpdate] = useState({});
  const portfolio = useContext(PortfolioContext);
  
  // Update component whenever portfolio changes
  useEffect(() => {
    if (portfolio) {
      // Force re-render when portfolio updates
      forceUpdate({});
      console.log("Portfolio updated in InvestmentPanel:", portfolio.holdings.length);
    }
  }, [portfolio, portfolio?.holdings.length, portfolio?.cash, portfolio?.portfolioValue]);
  
  if (!portfolio) {
    return (
      <div className="investment-panel rounded-xl bg-white border border-slate-200 shadow-md animate-pulse p-4 mb-6">
        <div className="h-6 bg-slate-200 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
        <div className="h-3 bg-slate-200 rounded-full w-full mb-3"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }
  
  const { cash, portfolioValue, totalValue, holdings } = portfolio;
  const allocationPercentage = Math.round((portfolioValue / totalValue) * 100);
  
  // Calculate projected 1-year return based on holdings
  let projectedReturn = 0;
  let projectedPercent = 0;

  if (holdings.length > 0) {
    const totalInvested = holdings.reduce((total, h) => total + (h.shares * h.purchasePrice), 0);
    const oneYearReturns = holdings.reduce((total, h) => {
      // Convert to number or use 0 if undefined
      const oneYearReturnPercent = typeof h.stock.oneYearReturn === 'number' ? h.stock.oneYearReturn : 0;
      const stockValue = h.shares * h.purchasePrice;
      const stockReturn = stockValue * (oneYearReturnPercent / 100);
      return total + stockReturn;
    }, 0);
    
    projectedReturn = oneYearReturns;
    projectedPercent = totalInvested > 0 ? (oneYearReturns / totalInvested) * 100 : 0;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="investment-panel rounded-xl p-4 mb-6 border border-slate-200 shadow-md bg-gradient-to-br from-white to-slate-50"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="flex items-center text-slate-800 font-semibold">
          <Wallet className="w-4 h-4 mr-1.5 text-blue-500" />
          Your Portfolio
        </h3>
        <div className="flex items-center text-sm text-slate-500">
          <TrendingUp className={`w-3.5 h-3.5 mr-1 ${portfolioValue > 0 ? 'text-green-500' : 'text-red-500'}`} />
          <span>Updated now</span>
        </div>
      </div>
      
      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-3">
        <div className="flex items-baseline mb-1">
          <DollarSign className="w-4 h-4 text-blue-500" />
          <span className="text-xl font-bold text-slate-800">{totalValue.toFixed(2)}</span>
          <span className="ml-1 text-xs text-slate-500">total value</span>
        </div>
        {holdings.length > 0 && (
          <div className="flex items-center text-sm">
            <Calendar className="w-3 h-3 mr-1 text-blue-500" />
            <span className="text-xs text-slate-600">Projected 1-year return: </span>
            <span className={`ml-1 text-xs font-medium ${projectedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {projectedReturn >= 0 ? '+' : ''}{projectedReturn.toFixed(2)} ({projectedReturn >= 0 ? '+' : ''}{projectedPercent.toFixed(1)}%)
            </span>
          </div>
        )}
      </div>
      
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
    </motion.div>
  );
}