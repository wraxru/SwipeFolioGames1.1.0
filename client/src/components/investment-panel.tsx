import { usePortfolio } from '@/contexts/portfolio-context';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Briefcase, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';

// Helper for number animation
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    // Don't animate on first render
    if (displayValue === value) return;
    
    let start = displayValue;
    const end = value;
    const duration = 500;
    const startTime = Date.now();
    
    const animateValue = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = Math.floor(start + (end - start) * progress);
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };
    
    requestAnimationFrame(animateValue);
  }, [value]);
  
  return displayValue.toLocaleString('en-US');
}

export default function InvestmentPanel() {
  const { cash, portfolioValue, totalValue } = usePortfolio();
  
  // Calculate ROI
  const initialInvestment = 100; // Starting cash
  const roi = totalValue > 0 ? ((totalValue - initialInvestment) / initialInvestment) * 100 : 0;
  const isPositive = roi >= 0;
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Calculate allocation percentage
  const allocatedPercentage = totalValue > 0 ? (portfolioValue / totalValue) * 100 : 0;
  
  return (
    <motion.div 
      className="bg-white rounded-xl p-5 mb-6 shadow-md border border-gray-100 overflow-hidden relative"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md mr-3">
            <Briefcase size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Portfolio Overview</h3>
            <p className="text-gray-500 text-xs">Manage your investments</p>
          </div>
        </div>
        
        <div className="flex items-center bg-gray-50 rounded-full px-3 py-1.5 border border-gray-100">
          <AnimatePresence mode="wait">
            <motion.div
              key={isPositive ? 'positive' : 'negative'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'} font-medium`}
            >
              {isPositive ? (
                <TrendingUp size={14} className="mr-1" />
              ) : (
                <TrendingDown size={14} className="mr-1" />
              )}
              <span className="text-sm">{Math.abs(roi).toFixed(2)}% ROI</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-gray-500">Available vs. Allocated</div>
        <div className="text-sm font-medium text-gray-900">{allocatedPercentage.toFixed(0)}% Invested</div>
      </div>
      
      <div className="w-full h-3 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${allocatedPercentage}%` }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-100 rounded-lg p-3 bg-gradient-to-br from-blue-50 to-white shadow-sm">
          <div className="flex items-center mb-1">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <DollarSign size={14} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-600">Available Cash</span>
          </div>
          <div className="text-lg font-bold text-gray-800">
            {formatCurrency(cash)}
          </div>
        </div>
        
        <div className="border border-gray-100 rounded-lg p-3 bg-gradient-to-br from-indigo-50 to-white shadow-sm">
          <div className="flex items-center mb-1">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
              <Briefcase size={14} className="text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-gray-600">Portfolio Value</span>
          </div>
          <motion.div 
            key={portfolioValue}
            className="text-lg font-bold text-gray-800"
            initial={{ opacity: 0.5, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {formatCurrency(portfolioValue)}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}